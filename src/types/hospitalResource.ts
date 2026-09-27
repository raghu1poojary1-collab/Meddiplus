export type ResourceCategory = 'BED' | 'OT' | 'BLOOD' | 'MEDICINE' | 'EQUIPMENT' | 'DOCTOR' | 'PROCEDURE';
export type ResourceStatus = 'AVAILABLE' | 'LIMITED' | 'NOT_AVAILABLE' | 'UNKNOWN';

export interface HospitalResourceItem {
  id: string;
  name: string;
  category: ResourceCategory;
  total: number;
  available: number;
  unit?: string;
  status: ResourceStatus;
  lastUpdated: string; // ISO string
  limitedThreshold?: number;
}

export interface MedicalProcedureRequirement {
  id: string;
  name: string; // e.g. "Kidney Stone Surgery", "Cardiac Angioplasty", "Emergency Trauma"
  keywords: string[];
  requiredResourceNames: string[]; // names of required resources
}

export interface HospitalResourceInventory {
  hospitalId: string;
  hospitalName: string;
  lastUpdated: string; // ISO string
  resources: HospitalResourceItem[];
}

export interface ResourceSearchResult {
  hospitalId: string;
  hospitalName: string;
  query: string;
  queryType: 'PROCEDURE' | 'RESOURCE' | 'GENERAL';
  matchedProcedureName?: string;
  overallStatus: ResourceStatus;
  availableResources: HospitalResourceItem[];
  limitedResources: HospitalResourceItem[];
  unavailableResources: HospitalResourceItem[];
  unknownResources: string[];
  lastUpdated: string;
  isOutdated: boolean;
  timeAgoFormatted: string;
}
