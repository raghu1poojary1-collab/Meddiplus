import { 
  HospitalResourceItem, 
  HospitalResourceInventory, 
  MedicalProcedureRequirement, 
  ResourceStatus 
} from '../types/hospitalResource';

// Known Procedure Mappings
export const MEDICAL_PROCEDURES: MedicalProcedureRequirement[] = [
  {
    id: 'proc-kidney-stone',
    name: 'Kidney Stone Surgery',
    keywords: ['kidney', 'stone', 'urology', 'urologist', 'lithotripsy', 'kidney stone operation'],
    requiredResourceNames: ['Urologist', 'Operation Theatre', 'ICU Bed', 'O- Blood', 'Dialysis Machine'],
  },
  {
    id: 'proc-cardiac-angioplasty',
    name: 'Cardiac Surgery & Angioplasty',
    keywords: ['cardiac', 'heart', 'cardiologist', 'angioplasty', 'bypass', 'chest pain'],
    requiredResourceNames: ['Cardiologist', 'Operation Theatre', 'ICU Bed', 'O+ Blood', 'Ventilator'],
  },
  {
    id: 'proc-emergency-trauma',
    name: 'Emergency Trauma & Resuscitation',
    keywords: ['emergency', 'trauma', 'accident', 'resuscitation', 'icu', 'critical'],
    requiredResourceNames: ['Emergency Physician', 'ICU Bed', 'Ventilator', 'Operation Theatre', 'O- Blood', 'Epinephrine (1:1000)'],
  },
  {
    id: 'proc-dialysis',
    name: 'Renal Dialysis Treatment',
    keywords: ['dialysis', 'renal', 'kidney failure', 'nephrology', 'dialysis machine'],
    requiredResourceNames: ['Dialysis Machine', 'General Bed', 'Nephrologist'],
  },
];

// Helper to determine status based on available vs total vs limited threshold
export function computeResourceStatus(available: number, total: number, limitedThreshold: number = 2): ResourceStatus {
  if (total === 0 || available === 0) return 'NOT_AVAILABLE';
  if (available <= limitedThreshold) return 'LIMITED';
  return 'AVAILABLE';
}

// Generate realistic resource inventory for a given hospital ID and name
export function getHospitalResourceInventory(hospitalId: string, hospitalName: string): HospitalResourceInventory {
  // Use simple hash of ID to create deterministic realistic data per hospital
  const charSum = hospitalId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  
  // Custom variations based on hospital ID
  const isCityHospital = hospitalName.toLowerCase().includes('city') || charSum % 3 === 0;
  const isStJude = hospitalName.toLowerCase().includes('st. jude') || charSum % 5 === 0;
  const isMetropolitan = hospitalName.toLowerCase().includes('metropolitan') || charSum % 2 === 0;

  // Timestamps: some fresh (12 mins ago), some stale (7 hrs ago) to demonstrate data freshness detection
  const now = Date.now();
  const freshTimestamp = new Date(now - (12 * 60 * 1000)).toISOString(); // 12 mins ago
  const staleTimestamp = new Date(now - (7 * 60 * 60 * 1000)).toISOString(); // 7 hours ago
  
  const lastUpdated = (charSum % 4 === 0) ? staleTimestamp : freshTimestamp;

  const resources: HospitalResourceItem[] = [
    // BEDS & OT
    {
      id: `${hospitalId}-icu-bed`,
      name: 'ICU Bed',
      category: 'BED',
      total: 20,
      available: isCityHospital ? 4 : isStJude ? 0 : 2,
      unit: 'beds',
      status: computeResourceStatus(isCityHospital ? 4 : isStJude ? 0 : 2, 20, 2),
      lastUpdated,
    },
    {
      id: `${hospitalId}-gen-bed`,
      name: 'General Bed',
      category: 'BED',
      total: 100,
      available: isCityHospital ? 27 : isStJude ? 14 : 5,
      unit: 'beds',
      status: computeResourceStatus(isCityHospital ? 27 : isStJude ? 14 : 5, 100, 10),
      lastUpdated,
    },
    {
      id: `${hospitalId}-ot`,
      name: 'Operation Theatre',
      category: 'OT',
      total: 5,
      available: isCityHospital ? 0 : isMetropolitan ? 2 : 1,
      unit: 'theatres',
      status: computeResourceStatus(isCityHospital ? 0 : isMetropolitan ? 2 : 1, 5, 1),
      lastUpdated,
    },

    // EQUIPMENT
    {
      id: `${hospitalId}-ventilator`,
      name: 'Ventilator',
      category: 'EQUIPMENT',
      total: 10,
      available: isCityHospital ? 2 : isStJude ? 1 : 0,
      unit: 'machines',
      status: computeResourceStatus(isCityHospital ? 2 : isStJude ? 1 : 0, 10, 1),
      lastUpdated,
    },
    {
      id: `${hospitalId}-dialysis`,
      name: 'Dialysis Machine',
      category: 'EQUIPMENT',
      total: 8,
      available: isCityHospital ? 1 : 4,
      unit: 'machines',
      status: computeResourceStatus(isCityHospital ? 1 : 4, 8, 2),
      lastUpdated,
    },
    {
      id: `${hospitalId}-mri`,
      name: 'MRI',
      category: 'EQUIPMENT',
      total: 1,
      available: isCityHospital ? 0 : 1,
      unit: 'scanner',
      status: computeResourceStatus(isCityHospital ? 0 : 1, 1, 1),
      lastUpdated,
    },
    {
      id: `${hospitalId}-ct-scan`,
      name: 'CT Scanner',
      category: 'EQUIPMENT',
      total: 2,
      available: 1,
      unit: 'scanners',
      status: computeResourceStatus(1, 2, 1),
      lastUpdated,
    },

    // BLOOD BANK
    {
      id: `${hospitalId}-blood-o-plus`,
      name: 'O+ Blood',
      category: 'BLOOD',
      total: 30,
      available: isCityHospital ? 0 : isStJude ? 12 : 0,
      unit: 'units',
      status: computeResourceStatus(isCityHospital ? 0 : isStJude ? 12 : 0, 30, 3),
      lastUpdated,
    },
    {
      id: `${hospitalId}-blood-o-minus`,
      name: 'O- Blood',
      category: 'BLOOD',
      total: 15,
      available: 4,
      unit: 'units',
      status: computeResourceStatus(4, 15, 2),
      lastUpdated,
    },
    {
      id: `${hospitalId}-blood-a-plus`,
      name: 'A+ Blood',
      category: 'BLOOD',
      total: 25,
      available: isCityHospital ? 0 : 8,
      unit: 'units',
      status: computeResourceStatus(isCityHospital ? 0 : 8, 25, 3),
      lastUpdated,
    },
    {
      id: `${hospitalId}-blood-a-minus`,
      name: 'A- Blood',
      category: 'BLOOD',
      total: 10,
      available: 0,
      unit: 'units',
      status: 'NOT_AVAILABLE',
      lastUpdated,
    },
    {
      id: `${hospitalId}-blood-b-plus`,
      name: 'B+ Blood',
      category: 'BLOOD',
      total: 25,
      available: 12,
      unit: 'units',
      status: computeResourceStatus(12, 25, 3),
      lastUpdated,
    },
    {
      id: `${hospitalId}-blood-b-minus`,
      name: 'B- Blood',
      category: 'BLOOD',
      total: 8,
      available: 1,
      unit: 'units',
      status: computeResourceStatus(1, 8, 2),
      lastUpdated,
    },
    {
      id: `${hospitalId}-blood-ab-plus`,
      name: 'AB+ Blood',
      category: 'BLOOD',
      total: 10,
      available: 3,
      unit: 'units',
      status: computeResourceStatus(3, 10, 2),
      lastUpdated,
    },
    {
      id: `${hospitalId}-blood-ab-minus`,
      name: 'AB- Blood',
      category: 'BLOOD',
      total: 5,
      available: 0,
      unit: 'units',
      status: 'NOT_AVAILABLE',
      lastUpdated,
    },

    // DOCTORS & SPECIALISTS
    {
      id: `${hospitalId}-doc-urologist`,
      name: 'Urologist',
      category: 'DOCTOR',
      total: 3,
      available: isCityHospital ? 2 : isStJude ? 0 : 1,
      unit: 'on-duty',
      status: computeResourceStatus(isCityHospital ? 2 : isStJude ? 0 : 1, 3, 1),
      lastUpdated,
    },
    {
      id: `${hospitalId}-doc-cardiologist`,
      name: 'Cardiologist',
      category: 'DOCTOR',
      total: 4,
      available: isMetropolitan ? 3 : 1,
      unit: 'on-duty',
      status: computeResourceStatus(isMetropolitan ? 3 : 1, 4, 1),
      lastUpdated,
    },
    {
      id: `${hospitalId}-doc-ortho`,
      name: 'Orthopedic Surgeon',
      category: 'DOCTOR',
      total: 2,
      available: 1,
      unit: 'on-duty',
      status: computeResourceStatus(1, 2, 1),
      lastUpdated,
    },
    {
      id: `${hospitalId}-doc-er`,
      name: 'Emergency Physician',
      category: 'DOCTOR',
      total: 5,
      available: 4,
      unit: 'on-duty',
      status: computeResourceStatus(4, 5, 1),
      lastUpdated,
    },

    // MEDICINES
    {
      id: `${hospitalId}-med-paracetamol`,
      name: 'Paracetamol (500mg)',
      category: 'MEDICINE',
      total: 500,
      available: isCityHospital ? 125 : isStJude ? 0 : 450,
      unit: 'tablets',
      status: computeResourceStatus(isCityHospital ? 125 : isStJude ? 0 : 450, 500, 50),
      lastUpdated,
    },
    {
      id: `${hospitalId}-med-insulin`,
      name: 'Insulin (Rapid-acting)',
      category: 'MEDICINE',
      total: 150,
      available: isStJude ? 85 : 12,
      unit: 'vials',
      status: computeResourceStatus(isStJude ? 85 : 12, 150, 20),
      lastUpdated,
    },
    {
      id: `${hospitalId}-med-epinephrine`,
      name: 'Epinephrine (1:1000)',
      category: 'MEDICINE',
      total: 40,
      available: 15,
      unit: 'auto-injectors',
      status: computeResourceStatus(15, 40, 5),
      lastUpdated,
    },
  ];

  return {
    hospitalId,
    hospitalName,
    lastUpdated,
    resources,
  };
}

// Utility to format ISO timestamp into human-readable string (e.g., "12 minutes ago" or "7 hours ago")
export function formatDataFreshness(isoString: string): { text: string; isOutdated: boolean } {
  const timestamp = new Date(isoString).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - timestamp);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // If > 2 hours old, flag as potentially outdated
  const isOutdated = diffHours >= 2;

  if (diffMinutes < 1) {
    return { text: 'Updated just now', isOutdated: false };
  } else if (diffMinutes < 60) {
    return { text: `Updated ${diffMinutes} minutes ago`, isOutdated };
  } else if (diffHours < 24) {
    return { text: `Last updated ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`, isOutdated };
  } else {
    return { text: `Last updated ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`, isOutdated: true };
  }
}
