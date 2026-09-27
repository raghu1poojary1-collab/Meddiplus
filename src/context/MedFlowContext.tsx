import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  Facility, 
  FacilityInventoryItem, 
  TransferRecommendation, 
  AlertItem, 
  ActivePage,
  SystemKPIs 
} from '../types/medflow';
import { INITIAL_FACILITIES, INITIAL_INVENTORY } from '../data/mockData';
import { calculateInventoryMetrics } from '../services/predictionEngine';
import { generateRedistributionRecommendations } from '../services/redistributionEngine';

interface MedFlowContextType {
  facilities: Facility[];
  inventory: FacilityInventoryItem[];
  recommendations: TransferRecommendation[];
  alerts: AlertItem[];
  activePage: ActivePage;
  selectedFacilityId: string | null;
  selectedMedicineId: string | null;
  activeScenarioStep: number;
  isScenarioRunning: boolean;
  searchQuery: string;
  filterStatus: string;
  systemKPIs: SystemKPIs;
  
  setActivePage: (page: ActivePage) => void;
  setSelectedFacilityId: (id: string | null) => void;
  setSelectedMedicineId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setFilterStatus: (status: string) => void;
  
  approveTransfer: (transferId: string) => void;
  applySupplierDelay: (supplierName: string, delayDays: number) => void;
  applyDemandSpike: (facilityId: string, medicineId: string, percentage: number) => void;
  reduceStock: (facilityId: string, medicineId: string, percentage: number) => void;
  
  startLiveScenario: () => void;
  resetScenario: () => void;
  resetSystem: () => void;
  markAlertAsRead: (alertId: string) => void;
}

const MedFlowContext = createContext<MedFlowContextType | undefined>(undefined);

export const MedFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [inventory, setInventory] = useState<FacilityInventoryItem[]>(() =>
    INITIAL_INVENTORY.map(calculateInventoryMetrics)
  );
  const [recommendations, setRecommendations] = useState<TransferRecommendation[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 'alert-init',
      type: 'info',
      title: 'MedFlow System Initialized',
      message: 'Monitoring active across 6 regional facilities and 7 vital medicines.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    },
  ]);
  
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(null);
  const [activeScenarioStep, setActiveScenarioStep] = useState<number>(0);
  const [isScenarioRunning, setIsScenarioRunning] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Recalculate whole state metrics
  const recalculateSystem = (currentInv: FacilityInventoryItem[], currentFacs: Facility[]) => {
    const updatedInv = currentInv.map(calculateInventoryMetrics);

    const updatedFacs = currentFacs.map(fac => {
      const facItems = updatedInv.filter(i => i.facilityId === fac.id);
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
        stockoutCount: criticalCount,
      };
    });

    const newRecs = generateRedistributionRecommendations(updatedFacs, updatedInv);

    setInventory(updatedInv);
    setFacilities(updatedFacs);
    setRecommendations(newRecs);
  };

  useEffect(() => {
    recalculateSystem(inventory, facilities);
  }, []);

  // Calculate high-level KPIs
  const totalFacilities = facilities.length;
  const healthyFacilities = facilities.filter(f => f.status === 'healthy').length;
  const atRiskFacilities = facilities.filter(f => f.status === 'warning').length;
  const criticalFacilities = facilities.filter(f => f.status === 'critical').length;
  const medicinesMonitored = inventory.length;
  
  const avgRisk = inventory.length > 0
    ? Math.round(inventory.reduce((acc, curr) => acc + curr.riskScore, 0) / inventory.length)
    : 0;

  const activeSupplierDelays = inventory.filter(i => i.supplierDelayDays > 0).length;
  const recommendedTransfersCount = recommendations.filter(r => r.status === 'pending').length;

  const systemKPIs: SystemKPIs = {
    totalFacilities,
    healthyFacilities,
    atRiskFacilities,
    criticalFacilities,
    medicinesMonitored,
    regionalShortageRisk: avgRisk,
    activeSupplierDelays,
    recommendedTransfersCount,
  };

  const approveTransfer = (transferId: string) => {
    const recIndex = recommendations.findIndex(r => r.id === transferId);
    if (recIndex === -1) return;

    const rec = recommendations[recIndex];

    const updatedInv = inventory.map(item => {
      // Deduct from donor
      if (item.facilityId === rec.donorFacilityId && item.medicineId === rec.medicineId) {
        return {
          ...item,
          currentStock: Math.max(0, item.currentStock - rec.recommendedTransferUnits),
        };
      }
      // Add to recipient
      if (item.facilityId === rec.recipientFacilityId && item.medicineId === rec.medicineId) {
        return {
          ...item,
          currentStock: item.currentStock + rec.recommendedTransferUnits,
        };
      }
      return item;
    });

    const newAlert: AlertItem = {
      id: `alert-${Date.now()}`,
      type: 'success',
      title: 'Transfer Approved & Dispatched',
      message: `${rec.recommendedTransferUnits} units of ${rec.medicineName} transferred from ${rec.donorFacilityName} to ${rec.recipientFacilityName}. Risk reduced: ${rec.recipientPreTransferRisk}% → ${rec.recipientPostTransferRisk}%.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      transferId: rec.id,
      read: false,
    };

    setAlerts(prev => [newAlert, ...prev]);

    // Trigger visual celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    recalculateSystem(updatedInv, facilities);
  };

  const applySupplierDelay = (supplierName: string, delayDays: number) => {
    const updatedInv = inventory.map(item => {
      if (!supplierName || item.supplierName.toLowerCase().includes(supplierName.toLowerCase())) {
        return {
          ...item,
          supplierDelayDays: delayDays,
        };
      }
      return item;
    });

    const newAlert: AlertItem = {
      id: `alert-delay-${Date.now()}`,
      type: 'warning',
      title: 'Supplier Delay Applied',
      message: `${supplierName || 'Primary Supplier'} route delayed by ${delayDays} days. Recalculating stockout predictions...`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setAlerts(prev => [newAlert, ...prev]);
    recalculateSystem(updatedInv, facilities);
  };

  const applyDemandSpike = (facilityId: string, medicineId: string, percentage: number) => {
    const updatedInv = inventory.map(item => {
      if (
        (!facilityId || item.facilityId === facilityId) &&
        (!medicineId || item.medicineId === medicineId)
      ) {
        const factor = 1 + percentage / 100;
        return {
          ...item,
          dailyConsumption: Math.round(item.dailyConsumption * factor),
        };
      }
      return item;
    });

    const newAlert: AlertItem = {
      id: `alert-spike-${Date.now()}`,
      type: 'warning',
      title: 'Demand Spike Simulated',
      message: `Daily consumption increased by +${percentage}%.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setAlerts(prev => [newAlert, ...prev]);
    recalculateSystem(updatedInv, facilities);
  };

  const reduceStock = (facilityId: string, medicineId: string, percentage: number) => {
    const updatedInv = inventory.map(item => {
      if (
        (!facilityId || item.facilityId === facilityId) &&
        (!medicineId || item.medicineId === medicineId)
      ) {
        const factor = 1 - percentage / 100;
        return {
          ...item,
          currentStock: Math.max(0, Math.round(item.currentStock * factor)),
        };
      }
      return item;
    });

    const newAlert: AlertItem = {
      id: `alert-reduce-${Date.now()}`,
      type: 'critical',
      title: 'Inventory Reduction Applied',
      message: `Stock artificially reduced by ${percentage}%.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setAlerts(prev => [newAlert, ...prev]);
    recalculateSystem(updatedInv, facilities);
  };

  // Prebuilt Live Scenario Walkthrough (+1 min delay -> +2 min AI alert -> transfer recommendation)
  const startLiveScenario = () => {
    setIsScenarioRunning(true);
    setActiveScenarioStep(1);

    // Step 1: 10:00 AM Baseline Normal (Reset first)
    let inv = INITIAL_INVENTORY.map(calculateInventoryMetrics);
    let facs = [...INITIAL_FACILITIES];

    // Artificially configure baseline for Hospital C & A
    inv = inv.map(item => {
      if (item.facilityId === 'fac-1' && item.medicineId === 'med-1') {
        return { ...item, currentStock: 420, dailyConsumption: 72 };
      }
      if (item.facilityId === 'fac-3' && item.medicineId === 'med-1') {
        return { ...item, currentStock: 390, dailyConsumption: 65 };
      }
      return item;
    });

    recalculateSystem(inv, facs);

    // Step 2: +1 Minute -> Supplier X reports 5-day delay
    setTimeout(() => {
      setActiveScenarioStep(2);
      inv = inv.map(item => {
        if (item.supplierName.includes('PharmaCore')) {
          return { ...item, supplierDelayDays: 5 };
        }
        return item;
      });

      setAlerts(prev => [
        {
          id: `scenario-delay-${Date.now()}`,
          type: 'warning',
          title: '⚠️ Supplier PharmaCore 5-Day Delay Reported',
          message: 'PharmaCore Logistics reported 5-day shipment bottleneck. Facilities A & B set to Amber, Hospital C set to Critical!',
          timestamp: '10:01 AM',
          read: false,
        },
        ...prev,
      ]);

      recalculateSystem(inv, facs);
    }, 2500);

    // Step 3: +2 Minutes -> AI Alert 78% risk, detects Hospital D surplus 1400 units, recommends transfer 600 units
    setTimeout(() => {
      setActiveScenarioStep(3);

      setAlerts(prev => [
        {
          id: `scenario-ai-${Date.now()}`,
          type: 'critical',
          title: '🚨 AI Alert: Regional Shortage Risk 78%',
          message: 'AI Redistribution Engine identified 1,400 surplus units at Hospital D (Eastside Memorial). Recommending 600 units transfer Hospital D → Hospital C.',
          timestamp: '10:02 AM',
          read: false,
        },
        ...prev,
      ]);
      setIsScenarioRunning(false);
    }, 5500);
  };

  const resetScenario = () => {
    setActiveScenarioStep(0);
    setIsScenarioRunning(false);
    resetSystem();
  };

  const resetSystem = () => {
    const defaultInv = INITIAL_INVENTORY.map(calculateInventoryMetrics);
    const defaultFacs = [...INITIAL_FACILITIES];
    setInventory(defaultInv);
    setFacilities(defaultFacs);
    setAlerts([
      {
        id: `reset-${Date.now()}`,
        type: 'info',
        title: 'System Reset Complete',
        message: 'All inventory levels, supplier delays, and facility metrics restored to default.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      },
    ]);
    setActiveScenarioStep(0);
    setIsScenarioRunning(false);
    recalculateSystem(defaultInv, defaultFacs);
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => (a.id === alertId ? { ...a, read: true } : a)));
  };

  return (
    <MedFlowContext.Provider
      value={{
        facilities,
        inventory,
        recommendations,
        alerts,
        activePage,
        selectedFacilityId,
        selectedMedicineId,
        activeScenarioStep,
        isScenarioRunning,
        searchQuery,
        filterStatus,
        systemKPIs,
        setActivePage,
        setSelectedFacilityId,
        setSelectedMedicineId,
        setSearchQuery,
        setFilterStatus,
        approveTransfer,
        applySupplierDelay,
        applyDemandSpike,
        reduceStock,
        startLiveScenario,
        resetScenario,
        resetSystem,
        markAlertAsRead,
      }}
    >
      {children}
    </MedFlowContext.Provider>
  );
};

export const useMedFlow = () => {
  const context = useContext(MedFlowContext);
  if (!context) {
    throw new Error('useMedFlow must be used within a MedFlowProvider');
  }
  return context;
};
