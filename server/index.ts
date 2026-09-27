import express from 'express';
import cors from 'cors';
import { INITIAL_FACILITIES, INITIAL_INVENTORY, MEDICINE_CATALOG } from '../src/data/mockData.js';
import { calculateInventoryMetrics } from '../src/services/predictionEngine.js';
import { generateRedistributionRecommendations } from '../src/services/redistributionEngine.js';
import { Facility, FacilityInventoryItem, TransferRecommendation, AlertItem } from '../src/types/medflow.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-Memory state store
let facilities: Facility[] = [...INITIAL_FACILITIES];
let inventory: FacilityInventoryItem[] = INITIAL_INVENTORY.map(calculateInventoryMetrics);
let recommendations: TransferRecommendation[] = [];
let alerts: AlertItem[] = [
  {
    id: 'alert-1',
    type: 'info',
    title: 'MedFlow System Active',
    message: 'Continuous regional inventory monitoring initialized. 6 facilities online.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false
  }
];

function recalculateState() {
  // Re-run metrics for all items
  inventory = inventory.map(item => calculateInventoryMetrics(item));

  // Recalculate each facility's overall status & risk score
  facilities = facilities.map(fac => {
    const facItems = inventory.filter(i => i.facilityId === fac.id);
    if (facItems.length === 0) return fac;

    const maxRisk = Math.max(...facItems.map(i => i.riskScore));
    const criticalCount = facItems.filter(i => i.status === 'critical').length;
    const warningCount = facItems.filter(i => i.status === 'warning').length;

    let status: Facility['status'] = 'healthy';
    if (criticalCount > 0 || maxRisk >= 71) {
      status = 'critical';
    } else if (warningCount > 0 || maxRisk >= 31) {
      status = 'warning';
    }

    return {
      ...fac,
      riskScore: maxRisk,
      status,
      stockoutCount: criticalCount
    };
  });

  // Re-generate recommendations
  recommendations = generateRedistributionRecommendations(facilities, inventory);
}

// Initial calculation
recalculateState();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/facilities', (req, res) => {
  res.json(facilities);
});

app.get('/api/inventory', (req, res) => {
  res.json(inventory);
});

app.get('/api/catalog', (req, res) => {
  res.json(MEDICINE_CATALOG);
});

app.get('/api/recommendations', (req, res) => {
  res.json(recommendations);
});

app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

app.get('/api/nearby-hospitals', async (req, res) => {
  const { lat, lng, radius = 10000 } = req.query;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng query parameters are required' });
  }

  if (!apiKey) {
    return res.json([]);
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=hospital&key=${apiKey}`;
    const fetchRes = await fetch(url);
    const data = await fetchRes.json();
    return res.json(data.results || []);
  } catch (error) {
    console.error('Failed to proxy Google Places request:', error);
    return res.status(500).json({ error: 'Failed to fetch nearby hospitals from Places API' });
  }
});

app.post('/api/transfers/approve', (req, res) => {
  const { transferId } = req.body;
  const recIndex = recommendations.findIndex(r => r.id === transferId);

  if (recIndex === -1) {
    return res.status(404).json({ error: 'Transfer recommendation not found' });
  }

  const rec = recommendations[recIndex];

  // 1. Deduct stock from Donor
  inventory = inventory.map(item => {
    if (item.facilityId === rec.donorFacilityId && item.medicineId === rec.medicineId) {
      return {
        ...item,
        currentStock: Math.max(0, item.currentStock - rec.recommendedTransferUnits)
      };
    }
    // 2. Add stock to Recipient
    if (item.facilityId === rec.recipientFacilityId && item.medicineId === rec.medicineId) {
      return {
        ...item,
        currentStock: item.currentStock + rec.recommendedTransferUnits
      };
    }
    return item;
  });

  // 3. Mark transfer as approved/completed
  recommendations[recIndex].status = 'completed';

  // 4. Create notification
  const newAlert: AlertItem = {
    id: `alert-${Date.now()}`,
    type: 'success',
    title: 'Transfer Successfully Approved',
    message: `${rec.recommendedTransferUnits} units of ${rec.medicineName} transferred from ${rec.donorFacilityName} to ${rec.recipientFacilityName}. Risk reduced from ${rec.recipientPreTransferRisk}% to ${rec.recipientPostTransferRisk}%.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    transferId: rec.id,
    read: false
  };

  alerts.unshift(newAlert);

  // 5. Recalculate system
  recalculateState();

  res.json({
    success: true,
    message: 'Transfer executed',
    transfer: rec,
    alert: newAlert
  });
});

app.post('/api/simulate', (req, res) => {
  const { type, payload } = req.body;

  if (type === 'supplier_delay') {
    const { supplierName, delayDays } = payload;
    inventory = inventory.map(item => {
      if (!supplierName || item.supplierName.toLowerCase().includes(supplierName.toLowerCase())) {
        return {
          ...item,
          supplierDelayDays: delayDays
        };
      }
      return item;
    });

    alerts.unshift({
      id: `alert-delay-${Date.now()}`,
      type: 'warning',
      title: 'Supplier Delay Reported',
      message: `${supplierName || 'Primary Supplier'} reported a ${delayDays}-day delivery delay across logistics routes.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    });
  } else if (type === 'demand_spike') {
    const { facilityId, medicineId, percentageIncrease } = payload;
    inventory = inventory.map(item => {
      if (
        (!facilityId || item.facilityId === facilityId) &&
        (!medicineId || item.medicineId === medicineId)
      ) {
        const multiplier = 1 + (percentageIncrease / 100);
        return {
          ...item,
          dailyConsumption: Math.round(item.dailyConsumption * multiplier)
        };
      }
      return item;
    });

    alerts.unshift({
      id: `alert-spike-${Date.now()}`,
      type: 'warning',
      title: 'Surge Demand Detected',
      message: `Consumption rate spiked by +${percentageIncrease}% for affected facilities.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    });
  } else if (type === 'stock_reduction') {
    const { facilityId, medicineId, reductionPercentage } = payload;
    inventory = inventory.map(item => {
      if (
        (!facilityId || item.facilityId === facilityId) &&
        (!medicineId || item.medicineId === medicineId)
      ) {
        const multiplier = 1 - (reductionPercentage / 100);
        return {
          ...item,
          currentStock: Math.round(item.currentStock * multiplier)
        };
      }
      return item;
    });

    alerts.unshift({
      id: `alert-reduce-${Date.now()}`,
      type: 'critical',
      title: 'Stock Reduction Triggered',
      message: `Inventory artificially reduced by ${reductionPercentage}%.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    });
  }

  recalculateState();
  res.json({ success: true, facilities, inventory, recommendations, alerts });
});

app.post('/api/reset', (req, res) => {
  facilities = [...INITIAL_FACILITIES];
  inventory = INITIAL_INVENTORY.map(calculateInventoryMetrics);
  alerts = [
    {
      id: `alert-reset-${Date.now()}`,
      type: 'info',
      title: 'System State Reset',
      message: 'Baseline facility inventory and metrics restored.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    }
  ];
  recalculateState();
  res.json({ success: true, message: 'System reset complete' });
});

app.listen(PORT, () => {
  console.log(`MedFlow AI Server running on http://localhost:${PORT}`);
});
