/**
 * MediPulse — Realistic Mock Data Store
 * Facilities centered around Moodbidri & Mangaluru rural taluks, Karnataka (13.0733° N, 74.9958° E).
 * Provides full state mutations with live sync to UI and persistence in localStorage.
 */

const DEFAULT_PATIENT_LOCATION = {
  lat: 13.0733,
  lng: 74.9958,
  name: "Moodbidri Town Bus Stand, Karnataka"
};

const INITIAL_HOSPITALS = [
  {
    id: "hosp-alvas",
    name: "Alva's Health Centre & Multi-Specialty Hospital",
    type: "Private Charitable Trust",
    address: "Alva's Campus, Moodbidri Main Road",
    lat: 13.0755,
    lng: 74.9982,
    distanceKm: 0.8,
    isNearest: true,
    emergency24x7: true,
    phone: "+91 8258 238104",
    lastUpdatedMins: 2,
    doctors: [
      {
        id: "doc-1",
        name: "Dr. Ramesh Bhat",
        qualification: "MBBS, MD (General Medicine)",
        specialty: "General Medicine",
        onDuty: true,
        shift: "08:00 - 16:00",
        queueCount: 4,
        room: "OPD Room 102"
      },
      {
        id: "doc-2",
        name: "Dr. Sunitha Shetty",
        qualification: "MBBS, DCH (Pediatrics)",
        specialty: "Pediatrics",
        onDuty: true,
        shift: "09:00 - 15:00",
        queueCount: 2,
        room: "Child Care Cabin 4"
      },
      {
        id: "doc-3",
        name: "Dr. Anand Nayak",
        qualification: "MBBS, MS (Orthopedics)",
        specialty: "Orthopedics",
        onDuty: false,
        shift: "16:00 - 20:00 (Evening)",
        queueCount: 0,
        room: "Ortho OPD 2"
      }
    ],
    medicines: [
      { id: "med-1", name: "Paracetamol 650mg", category: "Analgesic & Antipyretic", stock: 185, unit: "strips", threshold: 30, price: "Subsidized (₹15/strip)" },
      { id: "med-2", name: "Amoxicillin 500mg", category: "Antibiotic", stock: 64, unit: "strips", threshold: 20, price: "Subsidized (₹45/strip)" },
      { id: "med-3", name: "Metformin 500mg", category: "Diabetes Care", stock: 12, unit: "strips", threshold: 25, price: "Subsidized (₹22/strip)" },
      { id: "med-4", name: "Insulin Glargine 100IU", category: "Injectable Insulin", stock: 25, unit: "vials", threshold: 8, price: "₹280/vial" },
      { id: "med-5", name: "Cetirizine 10mg", category: "Anti-Allergy", stock: 95, unit: "strips", threshold: 20, price: "Subsidized (₹12/strip)" }
    ],
    vaccines: [
      { id: "vac-1", name: "Covaxin (Adult & Adolescent)", batch: "BB-2024-CV8", doses: 48, expiry: "12/2026", coldChainStatus: "Normal (3.2°C)" },
      { id: "vac-2", name: "Pentavalent Vaccine", batch: "SER-PV09", doses: 22, expiry: "08/2026", coldChainStatus: "Normal (4.0°C)" }
    ]
  },
  {
    id: "hosp-chc",
    name: "Government Community Health Centre (CHC)",
    type: "Public Health Facility (National Health Mission)",
    address: "Near KSRTC Bus Depot, Moodbidri",
    lat: 13.0698,
    lng: 74.9921,
    distanceKm: 1.4,
    isNearest: false,
    emergency24x7: true,
    phone: "+91 8258 236222",
    lastUpdatedMins: 5,
    doctors: [
      {
        id: "doc-4",
        name: "Dr. Preetha Rao",
        qualification: "MBBS",
        specialty: "General Medicine",
        onDuty: true,
        shift: "08:00 - 14:00",
        queueCount: 8,
        room: "Govt OPD Cabin 1"
      },
      {
        id: "doc-5",
        name: "Dr. Vignesh Kamath",
        qualification: "MBBS, MEM (Emergency)",
        specialty: "Casualty Medical Officer",
        onDuty: true,
        shift: "24-Hour Casualty",
        queueCount: 1,
        room: "Emergency Ward"
      },
      {
        id: "doc-6",
        name: "Dr. Malathi Shenoy",
        qualification: "MBBS, DGO",
        specialty: "Obstetrics & Gynecology",
        onDuty: false,
        shift: "14:00 - 20:00 (Afternoon)",
        queueCount: 0,
        room: "Maternity Ward 2"
      }
    ],
    medicines: [
      { id: "med-6", name: "Paracetamol 650mg", category: "Antipyretic", stock: 340, unit: "strips", threshold: 50, price: "Free (Govt Supply)" },
      { id: "med-7", name: "Amoxicillin 500mg", category: "Antibiotic", stock: 16, unit: "strips", threshold: 25, price: "Free (Govt Supply)" },
      { id: "med-8", name: "ORS Electrolyte Sachets", category: "Rehydration", stock: 210, unit: "packets", threshold: 40, price: "Free (Govt Supply)" },
      { id: "med-9", name: "Metformin 500mg", category: "Diabetes", stock: 0, unit: "strips", threshold: 20, price: "Free (Govt Supply)" },
      { id: "med-10", name: "Cetirizine 10mg", category: "Anti-Allergy", stock: 80, unit: "strips", threshold: 20, price: "Free (Govt Supply)" }
    ],
    vaccines: [
      { id: "vac-3", name: "BCG Vaccine (Newborn)", batch: "BCG-IND-44", doses: 34, expiry: "10/2026", coldChainStatus: "Normal (3.6°C)" },
      { id: "vac-4", name: "Tetanus Toxoid (TT)", batch: "TT-2024-11", doses: 60, expiry: "05/2027", coldChainStatus: "Normal (4.2°C)" }
    ]
  },
  {
    id: "hosp-prasad",
    name: "Prasad Hospital & Trauma Care",
    type: "Private Multi-Specialty Hospital",
    address: "Kaikamba Highway Road, Moodbidri Taluk",
    lat: 13.0585,
    lng: 74.9810,
    distanceKm: 3.2,
    isNearest: false,
    emergency24x7: true,
    phone: "+91 8258 239870",
    lastUpdatedMins: 11,
    doctors: [
      {
        id: "doc-7",
        name: "Dr. Harish Poojary",
        qualification: "MBBS, MD, DM (Cardiology)",
        specialty: "Cardiology",
        onDuty: true,
        shift: "10:00 - 18:00",
        queueCount: 3,
        room: "Cardiac Suite 1"
      },
      {
        id: "doc-8",
        name: "Dr. Divya Hegde",
        qualification: "MBBS, MD (Internal Medicine)",
        specialty: "General Medicine",
        onDuty: true,
        shift: "09:00 - 17:00",
        queueCount: 5,
        room: "Consultation 3"
      },
      {
        id: "doc-9",
        name: "Dr. Sudheer Alva",
        qualification: "MBBS, MD (Pediatrics)",
        specialty: "Pediatrics",
        onDuty: false,
        shift: "18:00 - 22:00 (Night)",
        queueCount: 0,
        room: "Pediatric Wing"
      }
    ],
    medicines: [
      { id: "med-11", name: "Paracetamol 650mg", category: "Antipyretic", stock: 120, unit: "strips", threshold: 25, price: "₹20/strip" },
      { id: "med-12", name: "Insulin Glargine 100IU", category: "Diabetes", stock: 6, unit: "vials", threshold: 10, price: "₹310/vial" },
      { id: "med-13", name: "Amoxicillin 500mg", category: "Antibiotic", stock: 0, unit: "strips", threshold: 15, price: "₹50/strip" },
      { id: "med-14", name: "Metformin 500mg", category: "Diabetes", stock: 85, unit: "strips", threshold: 20, price: "₹25/strip" },
      { id: "med-15", name: "Cetirizine 10mg", category: "Anti-Allergy", stock: 50, unit: "strips", threshold: 15, price: "₹15/strip" }
    ],
    vaccines: [
      { id: "vac-5", name: "Covishield (COVID-19)", batch: "SII-CS-881", doses: 15, expiry: "11/2026", coldChainStatus: "Normal (3.9°C)" },
      { id: "vac-6", name: "Hepatitis B Pediatric", batch: "HB-2024-03", doses: 28, expiry: "09/2026", coldChainStatus: "Normal (3.1°C)" }
    ]
  },
  {
    id: "hosp-yenepoya",
    name: "Yenepoya Rural Health & Training Centre",
    type: "Medical College Rural Outreach Clinic",
    address: "Belvai Road, Belvai Village, Moodbidri",
    lat: 13.0920,
    lng: 75.0125,
    distanceKm: 5.6,
    isNearest: false,
    emergency24x7: false,
    phone: "+91 8258 244510",
    lastUpdatedMins: 17,
    doctors: [
      {
        id: "doc-10",
        name: "Dr. Farhan Ahmed",
        qualification: "MBBS, MD (Community Medicine)",
        specialty: "General Medicine",
        onDuty: true,
        shift: "09:00 - 16:00",
        queueCount: 6,
        room: "Rural Clinic Room A"
      },
      {
        id: "doc-11",
        name: "Dr. Reshma D'Souza",
        qualification: "MBBS, DCH",
        specialty: "Pediatrics",
        onDuty: false,
        shift: "15:00 - 19:00",
        queueCount: 0,
        room: "MCH Room 2"
      },
      {
        id: "doc-12",
        name: "Dr. Naveen Kotian",
        qualification: "MBBS",
        specialty: "General Practitioner",
        onDuty: false,
        shift: "08:00 - 13:00 (Morning)",
        queueCount: 0,
        room: "Consulting Room 1"
      }
    ],
    medicines: [
      { id: "med-16", name: "Paracetamol 650mg", category: "Antipyretic", stock: 14, unit: "strips", threshold: 20, price: "Subsidized (₹10/strip)" },
      { id: "med-17", name: "Amoxicillin 500mg", category: "Antibiotic", stock: 45, unit: "strips", threshold: 15, price: "Subsidized (₹35/strip)" },
      { id: "med-18", name: "Metformin 500mg", category: "Diabetes", stock: 60, unit: "strips", threshold: 20, price: "Subsidized (₹18/strip)" },
      { id: "med-19", name: "ORS Electrolyte Sachets", category: "Rehydration", stock: 140, unit: "packets", threshold: 30, price: "Free (Outreach)" },
      { id: "med-20", name: "Insulin Glargine 100IU", category: "Diabetes", stock: 0, unit: "vials", threshold: 5, price: "₹290/vial" }
    ],
    vaccines: [
      { id: "vac-7", name: "Covaxin (Adult)", batch: "BB-OUT-00", doses: 0, expiry: "10/2026", coldChainStatus: "Exhausted" },
      { id: "vac-8", name: "Pentavalent Vaccine", batch: "SER-PV12", doses: 18, expiry: "07/2026", coldChainStatus: "Normal (3.7°C)" }
    ]
  }
];

class HealthDataStore {
  constructor() {
    this.storageKey = "medipulse_hospitals_v1";
    this.auditKey = "medipulse_audit_log_v1";
    this.hospitals = this.loadHospitals();
    this.auditLog = this.loadAuditLog();
    this.listeners = [];
  }

  loadHospitals() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved hospital data", e);
      }
    }
    return JSON.parse(JSON.stringify(INITIAL_HOSPITALS));
  }

  saveHospitals() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.hospitals));
    this.notify();
  }

  loadAuditLog() {
    const saved = localStorage.getItem(this.auditKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing audit log", e);
      }
    }
    return [
      { id: "log-1", time: "10 mins ago", user: "Staff Sister Prema", action: "Updated Dr. Ramesh Bhat duty status to ON DUTY", facility: "Alva's Health Centre" },
      { id: "log-2", time: "25 mins ago", user: "Pharmacist K. Shenoy", action: "Added 100 strips Paracetamol 650mg into inventory", facility: "CHC Moodbidri" },
      { id: "log-3", time: "1 hr ago", user: "Duty Nurse Reena", action: "Cold-chain verification recorded: 3.2°C compliant", facility: "Prasad Hospital" }
    ];
  }

  addAudit(action, facility, user = "Desk Staff") {
    const newEntry = {
      id: "log-" + Date.now(),
      time: "Just now",
      user,
      action,
      facility
    };
    this.auditLog.unshift(newEntry);
    if (this.auditLog.length > 20) this.auditLog.pop();
    localStorage.setItem(this.auditKey, JSON.stringify(this.auditLog));
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.hospitals));
  }

  getAll() {
    return this.hospitals;
  }

  getById(id) {
    return this.hospitals.find(h => h.id === id);
  }

  toggleDoctorDuty(hospitalId, doctorId) {
    const hospital = this.getById(hospitalId);
    if (!hospital) return null;
    const doc = hospital.doctors.find(d => d.id === doctorId);
    if (!doc) return null;

    doc.onDuty = !doc.onDuty;
    hospital.lastUpdatedMins = 0;
    this.addAudit(`Changed ${doc.name} duty status to ${doc.onDuty ? 'ON DUTY' : 'OFF DUTY'}`, hospital.name);
    this.saveHospitals();
    return doc;
  }

  updateMedicineStock(hospitalId, medicineId, newStock) {
    const hospital = this.getById(hospitalId);
    if (!hospital) return null;
    const med = hospital.medicines.find(m => m.id === medicineId);
    if (!med) return null;

    med.stock = Math.max(0, parseInt(newStock) || 0);
    hospital.lastUpdatedMins = 0;
    this.addAudit(`Updated ${med.name} stock to ${med.stock} ${med.unit}`, hospital.name);
    this.saveHospitals();
    return med;
  }

  updateVaccineDoses(hospitalId, vaccineId, newDoses) {
    const hospital = this.getById(hospitalId);
    if (!hospital) return null;
    const vac = hospital.vaccines.find(v => v.id === vaccineId);
    if (!vac) return null;

    vac.doses = Math.max(0, parseInt(newDoses) || 0);
    hospital.lastUpdatedMins = 0;
    this.addAudit(`Updated ${vac.name} available doses to ${vac.doses}`, hospital.name);
    this.saveHospitals();
    return vac;
  }

  resetToDefaults() {
    this.hospitals = JSON.parse(JSON.stringify(INITIAL_HOSPITALS));
    this.saveHospitals();
  }
}

window.dataStore = new HealthDataStore();
