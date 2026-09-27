import { FacilityInventoryItem, RiskStatus } from '../types/medflow';

/**
 * Calculates stockout days, risk score percentage (0-100), status, and AI confidence level
 */
export function calculateInventoryMetrics(
  item: Omit<FacilityInventoryItem, 'daysUntilStockout' | 'riskScore' | 'status' | 'confidenceScore'>
): FacilityInventoryItem {
  const dailyCons = Math.max(0.1, item.dailyConsumption);
  const daysUntilStockout = Number((item.currentStock / dailyCons).toFixed(1));
  const effectiveReplenishmentEta = item.supplierEtaDays + item.supplierDelayDays;
  
  // Risk calculation logic:
  // Buffer ratio = daysUntilStockout / (effectiveReplenishmentEta + safetyThresholdDays)
  // Lower buffer ratio means higher risk of running out before replenishment arrives!
  
  let riskScore = 0;
  
  if (daysUntilStockout <= 0) {
    riskScore = 100;
  } else if (daysUntilStockout <= effectiveReplenishmentEta) {
    // Critical danger zone: stockout will happen before supplier arrives!
    const deficitFactor = (effectiveReplenishmentEta - daysUntilStockout) / effectiveReplenishmentEta;
    riskScore = Math.min(99, Math.max(75, Math.round(75 + deficitFactor * 24)));
  } else {
    // Standard stock level evaluation relative to safety threshold
    const targetBuffer = effectiveReplenishmentEta + item.safetyThresholdDays;
    const ratio = daysUntilStockout / targetBuffer;
    if (ratio >= 1.0) {
      // Very safe stock level
      riskScore = Math.max(5, Math.round(25 * (1 - Math.min(1, (ratio - 1)))));
    } else {
      // Moderate to high risk range
      riskScore = Math.round(25 + (1 - ratio) * 50);
    }
  }

  // Bound risk score between 0 and 100
  riskScore = Math.max(0, Math.min(100, riskScore));

  let status: RiskStatus = 'healthy';
  if (riskScore >= 71) {
    status = 'critical';
  } else if (riskScore >= 31) {
    status = 'warning';
  } else {
    status = 'healthy';
  }

  // Calculate AI prediction confidence based on std deviation of historical consumption
  const hist = item.historicalConsumption && item.historicalConsumption.length > 0 
    ? item.historicalConsumption 
    : [dailyCons];
  const mean = hist.reduce((a, b) => a + b, 0) / hist.length;
  const variance = hist.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / hist.length;
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? stdDev / mean : 0;
  
  // High stability = high confidence (90% - 98%), high volatility = moderate confidence (80% - 90%)
  const confidenceScore = Math.max(82, Math.min(98, Math.round(96 - cv * 30)));

  return {
    ...item,
    daysUntilStockout,
    riskScore,
    status,
    confidenceScore,
  };
}
