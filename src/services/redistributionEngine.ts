import { Facility, FacilityInventoryItem, TransferRecommendation } from '../types/medflow';
import { calculateInventoryMetrics } from './predictionEngine';

// Haversine distance in KM between 2 lat/lng pairs
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Scans all inventory items across all facilities and generates intelligent redistribution proposals.
 */
export function generateRedistributionRecommendations(
  facilities: Facility[],
  inventory: FacilityInventoryItem[]
): TransferRecommendation[] {
  const recommendations: TransferRecommendation[] = [];

  // Group inventory by medicine
  const criticalItems = inventory.filter(item => item.riskScore >= 45 || item.daysUntilStockout <= 10);

  for (const recipientItem of criticalItems) {
    const recipientFacility = facilities.find(f => f.id === recipientItem.facilityId);
    if (!recipientFacility) continue;

    // Search potential donor facilities stocking the exact same medicine
    const donorCandidates = inventory.filter(item => 
      item.medicineId === recipientItem.medicineId &&
      item.facilityId !== recipientItem.facilityId
    );

    const validDonors = [];

    for (const donorItem of donorCandidates) {
      const donorFacility = facilities.find(f => f.id === donorItem.facilityId);
      if (!donorFacility) continue;

      // Calculate donor safety buffer requirement (e.g. 14 days of consumption)
      const requiredDonorSafetyStock = donorItem.dailyConsumption * donorItem.safetyThresholdDays;
      const donorSurplus = donorItem.currentStock - requiredDonorSafetyStock;

      if (donorSurplus > 50) {
        const distKm = calculateDistanceKm(
          recipientFacility.lat, recipientFacility.lng,
          donorFacility.lat, donorFacility.lng
        );
        // Estimate transit speed ~ 40 km/h + 0.5h dispatch handling
        const travelTimeHours = Number(((distKm / 40) + 0.5).toFixed(1));

        validDonors.push({
          donorFacility,
          donorItem,
          donorSurplus,
          distKm,
          travelTimeHours
        });
      }
    }

    if (validDonors.length === 0) continue;

    // Sort donors by distance & surplus size
    validDonors.sort((a, b) => b.donorSurplus - a.donorSurplus || a.distKm - b.distKm);

    const bestDonor = validDonors[0];

    // Determine optimal transfer amount:
    // Amount needed to boost recipient up to 15-20 days of stock, capped by donor surplus
    const neededForRecipient = Math.round((18 - recipientItem.daysUntilStockout) * recipientItem.dailyConsumption);
    const recommendedUnits = Math.min(bestDonor.donorSurplus, Math.max(100, neededForRecipient));

    if (recommendedUnits <= 0) continue;

    // Simulate Post-Transfer Metrics for Recipient
    const postRecipientStock = recipientItem.currentStock + recommendedUnits;
    const postRecipientMetrics = calculateInventoryMetrics({
      ...recipientItem,
      currentStock: postRecipientStock
    });

    const preRisk = recipientItem.riskScore;
    const postRisk = postRecipientMetrics.riskScore;

    recommendations.push({
      id: `tr-${recipientItem.facilityId}-${bestDonor.donorFacility.id}-${recipientItem.medicineId}`,
      medicineId: recipientItem.medicineId,
      medicineName: recipientItem.medicineName,
      recipientFacilityId: recipientFacility.id,
      recipientFacilityName: recipientFacility.name,
      recipientPreTransferRisk: preRisk,
      recipientPostTransferRisk: postRisk,
      recipientPreTransferDays: recipientItem.daysUntilStockout,
      recipientPostTransferDays: postRecipientMetrics.daysUntilStockout,
      donorFacilityId: bestDonor.donorFacility.id,
      donorFacilityName: bestDonor.donorFacility.name,
      donorAvailableSurplus: Math.round(bestDonor.donorSurplus),
      donorDistanceKm: bestDonor.distKm,
      donorTravelTimeHours: bestDonor.travelTimeHours,
      recommendedTransferUnits: recommendedUnits,
      regionalRiskPre: preRisk,
      regionalRiskPost: postRisk,
      urgency: preRisk >= 75 ? 'critical' : preRisk >= 50 ? 'high' : 'medium',
      status: 'pending',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }

  return recommendations;
}
