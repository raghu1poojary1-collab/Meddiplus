export type RiskStatus = 'healthy' | 'warning' | 'critical';

export interface Facility {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic' | 'Regional Hub';
  location: string;
  lat: number;
  lng: number;
  contactPhone: string;
  totalBeds?: number;
  status: RiskStatus;
  riskScore: number; // 0 - 100%
  stockoutCount: number; // number of critical items
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  unit: string;
  unitCost: number;
}

export interface FacilityInventoryItem {
  facilityId: string;
  medicineId: string;
  medicineName: string;
  category: string;
  currentStock: number;
  dailyConsumption: number;
  historicalConsumption: number[]; // Last 7 days
  supplierName: string;
  supplierEtaDays: number;
  supplierDelayDays: number;
  safetyThresholdDays: number; // minimum buffer required (e.g. 14 days)
  
  // Computed prediction fields
  daysUntilStockout: number;
  riskScore: number; // 0 - 100%
  status: RiskStatus;
  confidenceScore: number; // e.g., 94%
}

export interface TransferRecommendation {
  id: string;
  medicineId: string;
  medicineName: string;
  recipientFacilityId: string;
  recipientFacilityName: string;
  recipientPreTransferRisk: number;
  recipientPostTransferRisk: number;
  recipientPreTransferDays: number;
  recipientPostTransferDays: number;
  
  donorFacilityId: string;
  donorFacilityName: string;
  donorAvailableSurplus: number;
  donorDistanceKm: number;
  donorTravelTimeHours: number;
  
  recommendedTransferUnits: number;
  regionalRiskPre: number;
  regionalRiskPost: number;
  urgency: 'high' | 'critical' | 'medium';
  status: 'pending' | 'approved' | 'completed';
  createdAt: string;
}

export interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  facilityId?: string;
  medicineId?: string;
  transferId?: string;
  read: boolean;
}

export interface SystemKPIs {
  totalFacilities: number;
  healthyFacilities: number;
  atRiskFacilities: number;
  criticalFacilities: number;
  medicinesMonitored: number;
  regionalShortageRisk: number; // 0 - 100%
  activeSupplierDelays: number;
  recommendedTransfersCount: number;
}

export type ActivePage = 
  | 'dashboard'
  | 'map'
  | 'facilities'
  | 'inventory'
  | 'analytics'
  | 'recommendations'
  | 'simulation'
  | 'alerts'
  | 'settings'
  | 'presentation';
