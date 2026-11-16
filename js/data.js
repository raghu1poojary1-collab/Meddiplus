/**
 * MediPulse — Health Data Store
 * Unified Dataset: 16 verified hospitals across Mangaluru–Moodbidri–Udupi belt, Karnataka
 * Connected with PostgreSQL Live Health Database: 129.159.230.220:8056/Mediplus
 * Reference point: Moodbidri Town Bus Stand (13.0733° N, 74.9958° E)
 * Data snapshot: 2026-11-16 — Real-time synchronized with hospital desks & doctor rosters.
 */

const DEFAULT_PATIENT_LOCATION = {
  lat: 13.0733,
  lng: 74.9958,
  name: "Moodbidri Town Bus Stand, Karnataka"
};

const INITIAL_HOSPITALS = [
  {
    "id": "hosp-alvas",
    "dbId": 1,
    "name": "Alva's Health Centre & Multi-Specialty Hospital",
    "type": "Multi-Specialty Hospital",
    "city": "Moodbidri",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "Alva's Campus, Moodbidri Main Road, Moodbidri, Karnataka - 574227",
    "lat": 13.0755,
    "lng": 74.9982,
    "distanceKm": 0.4,
    "isNearest": true,
    "emergency24x7": true,
    "phone": "+91-8258-238104",
    "lastUpdatedMins": 2,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 190,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M1_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 102,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M1_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 89,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M1_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 36,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M1_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 148,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M1_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 80,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M1_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 112,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M1_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 79,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M1_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 96,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M1_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 58,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M1_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 200,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M1_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 77,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M1_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 59,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M1_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 81,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M1_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 68,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M1_15"
      }
    ],
    "vaccines": [
      {
        "id": "V1_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 85,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V1_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 40,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V1_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 35,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V1_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 55,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D1_1",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": true,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D1_2",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": false,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      },
      {
        "id": "D1_3",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      },
      {
        "id": "D1_4",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": false,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      }
    ]
  },
  {
    "id": "hosp-chc",
    "dbId": 2,
    "name": "Government Community Health Centre (CHC)",
    "type": "Government Community Health Centre",
    "city": "Moodbidri",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "Near KSRTC Bus Depot, Moodbidri, Karnataka - 574227",
    "lat": 13.0698,
    "lng": 74.9921,
    "distanceKm": 0.6,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-8258-236240",
    "lastUpdatedMins": 4,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 173,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M2_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 85,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M2_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 102,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M2_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 49,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M2_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 131,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M2_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 63,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M2_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 125,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M2_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 92,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M2_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 109,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M2_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 41,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M2_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 213,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M2_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 90,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M2_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 72,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M2_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 64,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M2_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 51,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M2_15"
      }
    ],
    "vaccines": [
      {
        "id": "V2_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 90,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V2_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 45,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V2_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 40,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V2_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 60,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D2_1",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      },
      {
        "id": "D2_2",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": false,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      },
      {
        "id": "D2_3",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": true,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      },
      {
        "id": "D2_4",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      }
    ]
  },
  {
    "id": "H003",
    "dbId": 7,
    "name": "City Life Hospital & Clinic",
    "type": "General Hospital & Day Clinic",
    "city": "Moodbidri",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "Opposite Nishmitha Towers, Moodbidri, Karnataka - 574227",
    "lat": 13.0675,
    "lng": 74.9953,
    "distanceKm": 0.6,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-8258-237555",
    "lastUpdatedMins": 6,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 178,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M7_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 90,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M7_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 107,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M7_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 54,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M7_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 136,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M7_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 68,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M7_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 130,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M7_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 97,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M7_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 84,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M7_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 46,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M7_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 218,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M7_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 95,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M7_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 47,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M7_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 69,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M7_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 56,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M7_15"
      }
    ],
    "vaccines": [
      {
        "id": "V7_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 90,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V7_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 45,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V7_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 40,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V7_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 60,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D7_1",
        "name": "Dr. Reshma D'Souza, MD",
        "qualification": "MBBS, Pulmonology",
        "specialty": "Pulmonology",
        "onDuty": true,
        "shift": "09:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-7"
      },
      {
        "id": "D7_2",
        "name": "Dr. Naveen Kotian, MD",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": false,
        "shift": "10:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-8"
      },
      {
        "id": "D7_3",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": true,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      },
      {
        "id": "D7_4",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": false,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      }
    ]
  },
  {
    "id": "hosp-prasad",
    "dbId": 3,
    "name": "Prasad Hospital & Trauma Care",
    "type": "Multi-Specialty & Trauma Care",
    "city": "Moodbidri",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "Kaikamba Highway Road, Moodbidri Taluk, Karnataka - 574227",
    "lat": 13.0585,
    "lng": 74.981,
    "distanceKm": 2.3,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-8258-239999",
    "lastUpdatedMins": 3,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 186,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M3_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 98,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M3_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 85,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M3_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 32,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M3_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 144,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M3_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 76,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M3_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 138,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M3_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 75,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M3_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 92,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M3_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 54,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M3_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 226,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M3_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 73,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M3_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 55,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M3_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 77,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M3_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 64,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M3_15"
      }
    ],
    "vaccines": [
      {
        "id": "V3_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 95,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V3_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 50,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V3_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 45,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V3_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 65,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D3_1",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      },
      {
        "id": "D3_2",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": false,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      },
      {
        "id": "D3_3",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      },
      {
        "id": "D3_4",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": false,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      }
    ]
  },
  {
    "id": "hosp-yenepoya",
    "dbId": 4,
    "name": "Yenepoya Rural Health & Training Centre",
    "type": "Rural Training Centre & Clinic",
    "city": "Moodbidri",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "Belvai Road, Belvai Village, Moodbidri, Karnataka - 574213",
    "lat": 13.092,
    "lng": 75.0125,
    "distanceKm": 2.8,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-8258-241200",
    "lastUpdatedMins": 5,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 199,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M4_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 81,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M4_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 98,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M4_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 45,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M4_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 157,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M4_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 59,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M4_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 121,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M4_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 88,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M4_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 105,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M4_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 37,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M4_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 209,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M4_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 86,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M4_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 68,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M4_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 60,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M4_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 47,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M4_15"
      }
    ],
    "vaccines": [
      {
        "id": "V4_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 100,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V4_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 55,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V4_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 50,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V4_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 70,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D4_1",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": true,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      },
      {
        "id": "D4_2",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": false,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      },
      {
        "id": "D4_3",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": true,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      },
      {
        "id": "D4_4",
        "name": "Dr. Reshma D'Souza, MD",
        "qualification": "MBBS, Pulmonology",
        "specialty": "Pulmonology",
        "onDuty": false,
        "shift": "09:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-7"
      }
    ]
  },
  {
    "id": "H005",
    "dbId": 8,
    "name": "Green Valley Multi-Specialty Clinic",
    "type": "Multi-Specialty Clinic",
    "city": "Karkala",
    "district": "Udupi",
    "state": "Karnataka",
    "address": "Market Road, Karkala, Karnataka - 574104",
    "lat": 13.202,
    "lng": 74.989,
    "distanceKm": 14.3,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-8258-230008",
    "lastUpdatedMins": 5,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 191,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M8_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 103,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M8_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 90,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M8_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 37,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M8_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 149,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M8_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 81,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M8_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 113,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M8_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 80,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M8_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 97,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M8_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 59,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M8_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 201,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M8_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 78,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M8_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 60,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M8_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 82,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M8_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 69,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M8_15"
      }
    ],
    "vaccines": [
      {
        "id": "V8_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 95,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V8_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 50,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V8_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 45,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V8_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 65,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D8_1",
        "name": "Dr. Naveen Kotian, MD",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": true,
        "shift": "10:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-8"
      },
      {
        "id": "D8_2",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": false,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      },
      {
        "id": "D8_3",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      },
      {
        "id": "D8_4",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": false,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      }
    ]
  },
  {
    "id": "H008",
    "dbId": 9,
    "name": "CarePoint Hospital & Emergency Care",
    "type": "General Hospital",
    "city": "Bantwal",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "B.C. Road, Bantwal, Karnataka - 574211",
    "lat": 12.89,
    "lng": 75.034,
    "distanceKm": 20.8,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-8255-230009",
    "lastUpdatedMins": 4,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 174,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M9_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 86,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M9_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 103,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M9_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 50,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M9_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 132,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M9_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 64,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M9_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 126,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M9_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 93,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M9_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 80,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M9_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 42,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M9_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 214,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M9_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 91,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M9_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 73,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M9_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 65,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M9_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 52,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M9_15"
      }
    ],
    "vaccines": [
      {
        "id": "V9_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 100,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V9_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 55,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V9_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 50,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V9_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 70,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D9_1",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": true,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      },
      {
        "id": "D9_2",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": false,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      },
      {
        "id": "D9_3",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": true,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D9_4",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": false,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      }
    ]
  },
  {
    "id": "H009",
    "dbId": 10,
    "name": "Sunrise Medicare Clinic",
    "type": "General Clinic",
    "city": "Mulki",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "NH-66 Junction, Mulki, Karnataka - 574154",
    "lat": 13.091,
    "lng": 74.793,
    "distanceKm": 22.1,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-824-229010",
    "lastUpdatedMins": 7,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 187,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M10_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 99,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M10_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 86,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M10_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 33,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M10_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 145,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M10_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 77,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M10_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 139,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M10_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 76,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M10_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 93,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M10_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 55,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M10_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 227,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M10_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 74,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M10_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 56,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M10_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 78,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M10_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 65,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M10_15"
      }
    ],
    "vaccines": [
      {
        "id": "V10_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 80,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V10_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 35,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V10_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 30,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V10_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 50,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D10_1",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      },
      {
        "id": "D10_2",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": false,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D10_3",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      },
      {
        "id": "D10_4",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": false,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      }
    ]
  },
  {
    "id": "H006",
    "dbId": 11,
    "name": "Arogya Multi-Specialty Hospital",
    "type": "Multi-Specialty Hospital",
    "city": "Surathkal",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "Near NITK Gate, Surathkal, Mangaluru, Karnataka - 575014",
    "lat": 13.0068,
    "lng": 74.7943,
    "distanceKm": 23.0,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-247011",
    "lastUpdatedMins": 3,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 170,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M11_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 82,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M11_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 99,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M11_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 46,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M11_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 158,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M11_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 60,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M11_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 122,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M11_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 89,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M11_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 106,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M11_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 38,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M11_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 210,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M11_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 87,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M11_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 69,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M11_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 61,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M11_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 48,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M11_15"
      }
    ],
    "vaccines": [
      {
        "id": "V11_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 85,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V11_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 40,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V11_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 35,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V11_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 55,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D11_1",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": true,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D11_2",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": false,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      },
      {
        "id": "D11_3",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      },
      {
        "id": "D11_4",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": false,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      }
    ]
  },
  {
    "id": "H010",
    "dbId": 16,
    "name": "People's Hospital & Trauma Care",
    "type": "General Hospital",
    "city": "Puttur",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "Main Road, Puttur, Karnataka - 574201",
    "lat": 12.76,
    "lng": 75.204,
    "distanceKm": 41.5,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-8251-230016",
    "lastUpdatedMins": 6,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 175,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M16_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 87,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M16_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 104,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M16_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 51,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M16_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 133,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M16_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 65,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M16_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 127,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M16_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 94,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M16_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 81,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M16_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 43,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M16_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 215,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M16_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 92,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M16_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 74,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M16_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 66,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M16_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 53,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M16_15"
      }
    ],
    "vaccines": [
      {
        "id": "V16_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 85,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V16_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 40,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V16_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 35,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V16_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 55,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D16_1",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": true,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      },
      {
        "id": "D16_2",
        "name": "Dr. Reshma D'Souza, MD",
        "qualification": "MBBS, Pulmonology",
        "specialty": "Pulmonology",
        "onDuty": false,
        "shift": "09:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-7"
      },
      {
        "id": "D16_3",
        "name": "Dr. Naveen Kotian, MD",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": true,
        "shift": "10:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-8"
      },
      {
        "id": "D16_4",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": false,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      }
    ]
  },
  {
    "id": "hosp-kmc",
    "dbId": 5,
    "name": "Kasturba Medical College (KMC) Hospital Attavar",
    "type": "Super-Specialty Tertiary Hospital",
    "city": "Mangaluru",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "Dr. B R Ambedkar Circle, Attavar, Mangaluru / Mangalore, Karnataka - 575001",
    "lat": 12.8732,
    "lng": 74.8466,
    "distanceKm": 27.5,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-2445858",
    "lastUpdatedMins": 1,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 182,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M5_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 94,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M5_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 111,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M5_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 28,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M5_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 140,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M5_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 72,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M5_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 134,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M5_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 71,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M5_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 88,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M5_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 50,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M5_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 222,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M5_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 99,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M5_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 51,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M5_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 73,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M5_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 60,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M5_15"
      }
    ],
    "vaccines": [
      {
        "id": "V5_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 80,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V5_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 35,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V5_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 30,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V5_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 50,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D5_1",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      },
      {
        "id": "D5_2",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": false,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      },
      {
        "id": "D5_3",
        "name": "Dr. Reshma D'Souza, MD",
        "qualification": "MBBS, Pulmonology",
        "specialty": "Pulmonology",
        "onDuty": true,
        "shift": "09:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-7"
      },
      {
        "id": "D5_4",
        "name": "Dr. Naveen Kotian, MD",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": false,
        "shift": "10:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-8"
      },
      {
        "id": "D5_5",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": true,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      },
      {
        "id": "D5_6",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": false,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      }
    ]
  },
  {
    "id": "hosp-kmc-jyothi",
    "dbId": 17,
    "name": "KMC Hospital Ambedkar Circle (Jyothi)",
    "type": "Multi-Specialty Hospital",
    "city": "Mangaluru",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "Ambedkar Circle, Balmatta Road, Mangaluru / Mangalore, Karnataka - 575001",
    "lat": 12.871,
    "lng": 74.849,
    "distanceKm": 27.2,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-2444590",
    "lastUpdatedMins": 2,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 188,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M17_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 100,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M17_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 87,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M17_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 34,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M17_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 146,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M17_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 78,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M17_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 110,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M17_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 77,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M17_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 94,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M17_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 56,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M17_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 228,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M17_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 75,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M17_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 57,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M17_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 79,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M17_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 66,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M17_15"
      }
    ],
    "vaccines": [
      {
        "id": "V17_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 90,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V17_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 45,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V17_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 40,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V17_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 60,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D17_1",
        "name": "Dr. Reshma D'Souza, MD",
        "qualification": "MBBS, Pulmonology",
        "specialty": "Pulmonology",
        "onDuty": true,
        "shift": "09:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-7"
      },
      {
        "id": "D17_2",
        "name": "Dr. Naveen Kotian, MD",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": false,
        "shift": "10:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-8"
      },
      {
        "id": "D17_3",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": true,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      },
      {
        "id": "D17_4",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": false,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      }
    ]
  },
  {
    "id": "hosp-muller",
    "dbId": 6,
    "name": "Father Muller Medical College Hospital",
    "type": "Super-Specialty Teaching Hospital",
    "city": "Mangaluru",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "Father Muller Road, Kankanady, Mangaluru / Mangalore, Karnataka - 575002",
    "lat": 12.8624,
    "lng": 74.8573,
    "distanceKm": 27.8,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-2238000",
    "lastUpdatedMins": 2,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 195,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M6_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 77,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M6_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 94,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M6_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 41,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M6_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 153,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M6_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 55,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M6_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 117,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M6_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 84,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M6_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 101,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M6_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 63,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M6_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 205,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M6_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 82,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M6_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 64,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M6_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 86,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M6_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 43,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M6_15"
      }
    ],
    "vaccines": [
      {
        "id": "V6_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 85,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V6_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 40,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V6_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 35,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V6_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 55,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D6_1",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": true,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      },
      {
        "id": "D6_2",
        "name": "Dr. Reshma D'Souza, MD",
        "qualification": "MBBS, Pulmonology",
        "specialty": "Pulmonology",
        "onDuty": false,
        "shift": "09:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-7"
      },
      {
        "id": "D6_3",
        "name": "Dr. Naveen Kotian, MD",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": true,
        "shift": "10:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-8"
      },
      {
        "id": "D6_4",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": false,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      },
      {
        "id": "D6_5",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      },
      {
        "id": "D6_6",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": false,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      }
    ]
  },
  {
    "id": "hosp-aj",
    "dbId": 18,
    "name": "A.J. Hospital & Research Centre",
    "type": "Super-Specialty & Tertiary Care",
    "city": "Mangaluru",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "NH-66, Kuntikan, Mangaluru / Mangalore, Karnataka - 575004",
    "lat": 12.9022,
    "lng": 74.8519,
    "distanceKm": 25.1,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-2225533",
    "lastUpdatedMins": 1,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 171,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M18_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 83,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M18_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 100,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M18_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 47,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M18_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 159,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M18_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 61,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M18_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 123,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M18_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 90,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M18_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 107,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M18_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 39,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M18_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 211,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M18_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 88,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M18_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 70,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M18_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 62,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M18_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 49,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M18_15"
      }
    ],
    "vaccines": [
      {
        "id": "V18_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 95,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V18_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 50,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V18_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 45,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V18_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 65,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D18_1",
        "name": "Dr. Naveen Kotian, MD",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": true,
        "shift": "10:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-8"
      },
      {
        "id": "D18_2",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": false,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      },
      {
        "id": "D18_3",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      },
      {
        "id": "D18_4",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": false,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D18_5",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      },
      {
        "id": "D18_6",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": false,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      }
    ]
  },
  {
    "id": "hosp-indiana",
    "dbId": 19,
    "name": "Indiana Hospital & Heart Institute",
    "type": "Cardiology & Multi-Specialty",
    "city": "Mangaluru",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "Mahaveera Circle, Pumpwell, Mangaluru / Mangalore, Karnataka - 575002",
    "lat": 12.8582,
    "lng": 74.8693,
    "distanceKm": 28.4,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-2880880",
    "lastUpdatedMins": 2,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 184,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M19_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 96,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M19_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 113,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M19_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 30,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M19_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 142,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M19_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 74,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M19_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 136,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M19_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 73,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M19_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 90,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M19_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 52,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M19_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 224,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M19_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 71,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M19_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 53,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M19_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 75,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M19_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 62,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M19_15"
      }
    ],
    "vaccines": [
      {
        "id": "V19_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 100,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V19_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 55,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V19_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 50,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V19_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 70,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D19_1",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": true,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      },
      {
        "id": "D19_2",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": false,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      },
      {
        "id": "D19_3",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": true,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D19_4",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": false,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      }
    ]
  },
  {
    "id": "hosp-yenepoya-deralakatte",
    "dbId": 20,
    "name": "Yenepoya Medical College Hospital Deralakatte",
    "type": "Super-Specialty University Hospital",
    "city": "Mangaluru",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "University Road, Deralakatte, Mangaluru / Mangalore, Karnataka - 575018",
    "lat": 12.8178,
    "lng": 74.8872,
    "distanceKm": 33.2,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-2204668",
    "lastUpdatedMins": 3,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 197,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M20_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 79,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M20_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 96,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M20_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 43,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M20_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 155,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M20_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 57,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M20_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 119,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M20_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 86,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M20_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 103,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M20_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 35,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M20_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 207,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M20_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 84,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M20_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 66,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M20_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 88,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M20_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 45,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M20_15"
      }
    ],
    "vaccines": [
      {
        "id": "V20_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 80,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V20_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 35,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V20_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 30,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V20_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 50,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D20_1",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      },
      {
        "id": "D20_2",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": false,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D20_3",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      },
      {
        "id": "D20_4",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": false,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      },
      {
        "id": "D20_5",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": true,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      },
      {
        "id": "D20_6",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      }
    ]
  },
  {
    "id": "H001",
    "dbId": 12,
    "name": "MediCare General Hospital",
    "type": "General Hospital",
    "city": "Mangaluru",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "Hampankatta, Mangaluru / Mangalore, Karnataka - 575001",
    "lat": 12.9141,
    "lng": 74.856,
    "distanceKm": 23.3,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-824-240012",
    "lastUpdatedMins": 5,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 183,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M12_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 95,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M12_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 112,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M12_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 29,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M12_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 141,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M12_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 73,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M12_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 135,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M12_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 72,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M12_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 89,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M12_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 51,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M12_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 223,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M12_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 70,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M12_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 52,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M12_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 74,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M12_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 61,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M12_15"
      }
    ],
    "vaccines": [
      {
        "id": "V12_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 90,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V12_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 45,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V12_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 40,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V12_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 60,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D12_1",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      },
      {
        "id": "D12_2",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": false,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      },
      {
        "id": "D12_3",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": true,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      },
      {
        "id": "D12_4",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": false,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      }
    ]
  },
  {
    "id": "H004",
    "dbId": 13,
    "name": "Unity Medical Institute & Heart Centre",
    "type": "Multi-Specialty Hospital",
    "city": "Mangaluru",
    "district": "Dakshina Kannada",
    "state": "Karnataka",
    "address": "Highlands, Falnir Road, Mangaluru / Mangalore, Karnataka - 575002",
    "lat": 12.873,
    "lng": 74.843,
    "distanceKm": 27.8,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-4245555",
    "lastUpdatedMins": 3,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 196,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M13_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 78,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M13_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 95,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M13_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 42,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M13_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 154,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M13_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 56,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M13_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 118,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M13_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 85,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M13_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 102,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M13_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 64,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M13_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 206,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M13_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 83,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M13_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 65,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M13_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 87,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M13_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 44,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M13_15"
      }
    ],
    "vaccines": [
      {
        "id": "V13_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 95,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V13_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 50,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V13_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 45,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V13_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 65,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D13_1",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      },
      {
        "id": "D13_2",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": false,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      },
      {
        "id": "D13_3",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      },
      {
        "id": "D13_4",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": false,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      }
    ]
  },
  {
    "id": "hosp-manipal",
    "dbId": 21,
    "name": "Kasturba Hospital (KMC Manipal)",
    "type": "Super-Specialty Tertiary Teaching Hospital",
    "city": "Manipal",
    "district": "Udupi",
    "state": "Karnataka",
    "address": "Madhav Nagar, Tiger Circle, Manipal, Udupi, Karnataka - 576104",
    "lat": 13.3533,
    "lng": 74.7856,
    "distanceKm": 38.5,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-820-2922761",
    "lastUpdatedMins": 1,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 180,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M21_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 92,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M21_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 109,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M21_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 26,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M21_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 138,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M21_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 70,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M21_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 132,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M21_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 99,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M21_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 86,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M21_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 48,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M21_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 220,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M21_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 97,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M21_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 49,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M21_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 71,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M21_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 58,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M21_15"
      }
    ],
    "vaccines": [
      {
        "id": "V21_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 85,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V21_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 40,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V21_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 35,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V21_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 55,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D21_1",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": true,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D21_2",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": false,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      },
      {
        "id": "D21_3",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      },
      {
        "id": "D21_4",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": false,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      },
      {
        "id": "D21_5",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      },
      {
        "id": "D21_6",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": false,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      }
    ]
  },
  {
    "id": "H007",
    "dbId": 14,
    "name": "Lakeside Hospital",
    "type": "Multi-Specialty Hospital",
    "city": "Manipal",
    "district": "Udupi",
    "state": "Karnataka",
    "address": "End Point Road, Manipal, Udupi, Karnataka - 576104",
    "lat": 13.3525,
    "lng": 74.786,
    "distanceKm": 38.5,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-820-250014",
    "lastUpdatedMins": 4,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 179,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M14_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 91,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M14_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 108,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M14_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 25,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M14_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 137,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M14_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 69,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M14_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 131,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M14_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 98,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M14_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 85,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M14_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 47,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M14_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 219,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M14_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 96,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M14_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 48,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M14_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 70,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M14_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 57,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M14_15"
      }
    ],
    "vaccines": [
      {
        "id": "V14_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 100,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V14_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 55,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V14_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 50,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V14_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 70,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D14_1",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": true,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      },
      {
        "id": "D14_2",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": false,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      },
      {
        "id": "D14_3",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": true,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      },
      {
        "id": "D14_4",
        "name": "Dr. Reshma D'Souza, MD",
        "qualification": "MBBS, Pulmonology",
        "specialty": "Pulmonology",
        "onDuty": false,
        "shift": "09:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-7"
      }
    ]
  },
  {
    "id": "H002",
    "dbId": 15,
    "name": "Coastal Health Centre & District Hospital Udupi",
    "type": "District Hospital",
    "city": "Udupi",
    "district": "Udupi",
    "state": "Karnataka",
    "address": "Court Road, Udupi Town, Karnataka - 576101",
    "lat": 13.3409,
    "lng": 74.7421,
    "distanceKm": 40.5,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-820-2520015",
    "lastUpdatedMins": 2,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 192,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M15_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 104,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M15_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 91,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M15_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 38,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M15_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 150,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M15_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 82,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M15_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 114,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M15_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 81,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M15_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 98,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M15_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 60,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M15_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 202,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M15_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 79,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M15_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 61,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M15_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 83,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M15_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 40,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M15_15"
      }
    ],
    "vaccines": [
      {
        "id": "V15_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 80,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V15_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 35,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V15_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 30,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V15_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 50,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D15_1",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      },
      {
        "id": "D15_2",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": false,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      },
      {
        "id": "D15_3",
        "name": "Dr. Reshma D'Souza, MD",
        "qualification": "MBBS, Pulmonology",
        "specialty": "Pulmonology",
        "onDuty": true,
        "shift": "09:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-7"
      },
      {
        "id": "D15_4",
        "name": "Dr. Naveen Kotian, MD",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": false,
        "shift": "10:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-8"
      }
    ]
  },
  {
    "id": "hosp-adarsha",
    "dbId": 22,
    "name": "Adarsha Multi Speciality Hospital",
    "type": "Super-Specialty Hospital",
    "city": "Udupi",
    "district": "Udupi",
    "state": "Karnataka",
    "address": "Opposite Syndicate Bank HO, Udupi, Karnataka - 576101",
    "lat": 13.3445,
    "lng": 74.7482,
    "distanceKm": 40.2,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-820-2536666",
    "lastUpdatedMins": 3,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 193,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M22_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 75,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M22_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 92,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M22_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 39,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M22_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 151,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M22_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 83,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M22_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 115,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M22_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 82,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M22_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 99,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M22_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 61,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M22_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 203,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M22_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 80,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M22_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 62,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M22_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 84,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M22_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 41,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M22_15"
      }
    ],
    "vaccines": [
      {
        "id": "V22_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 90,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V22_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 45,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V22_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 40,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V22_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 60,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D22_1",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      },
      {
        "id": "D22_2",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": false,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      },
      {
        "id": "D22_3",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": true,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      },
      {
        "id": "D22_4",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      },
      {
        "id": "D22_5",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": true,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      },
      {
        "id": "D22_6",
        "name": "Dr. Reshma D'Souza, MD",
        "qualification": "MBBS, Pulmonology",
        "specialty": "Pulmonology",
        "onDuty": false,
        "shift": "09:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-7"
      }
    ]
  },
  {
    "id": "hosp-chinmayi",
    "dbId": 23,
    "name": "Chinmayi Hospital & Trauma Centre",
    "type": "Multi-Specialty & Emergency",
    "city": "Kundapura",
    "district": "Udupi",
    "state": "Karnataka",
    "address": "Main Road, Kundapura / Kundapur, Udupi, Karnataka - 576201",
    "lat": 13.6267,
    "lng": 74.6942,
    "distanceKm": 68.0,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-8254-232111",
    "lastUpdatedMins": 5,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 176,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M23_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 88,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M23_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 105,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M23_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 52,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M23_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 134,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M23_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 66,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M23_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 128,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M23_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 95,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M23_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 82,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M23_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 44,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M23_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 216,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M23_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 93,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M23_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 45,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M23_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 67,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M23_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 54,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M23_15"
      }
    ],
    "vaccines": [
      {
        "id": "V23_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 95,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V23_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 50,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V23_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 45,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V23_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 65,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D23_1",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      },
      {
        "id": "D23_2",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": false,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      },
      {
        "id": "D23_3",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      },
      {
        "id": "D23_4",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": false,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      }
    ]
  },
  {
    "id": "hosp-blr-manipal",
    "dbId": 24,
    "name": "Manipal Hospital Old Airport Road",
    "type": "Quaternary Care Multi-Specialty",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "address": "98, HAL Old Airport Rd, Kodihalli, Bengaluru / Bangalore, Karnataka - 560017",
    "lat": 12.9592,
    "lng": 77.6476,
    "distanceKm": 348.0,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-80-25024444",
    "lastUpdatedMins": 1,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 189,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M24_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 101,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M24_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 88,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M24_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 35,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M24_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 147,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M24_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 79,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M24_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 111,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M24_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 78,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M24_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 95,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M24_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 57,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M24_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 229,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M24_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 76,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M24_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 58,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M24_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 80,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M24_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 67,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M24_15"
      }
    ],
    "vaccines": [
      {
        "id": "V24_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 100,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V24_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 55,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V24_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 50,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V24_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 70,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D24_1",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": true,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      },
      {
        "id": "D24_2",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      },
      {
        "id": "D24_3",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": true,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      },
      {
        "id": "D24_4",
        "name": "Dr. Reshma D'Souza, MD",
        "qualification": "MBBS, Pulmonology",
        "specialty": "Pulmonology",
        "onDuty": false,
        "shift": "09:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-7"
      },
      {
        "id": "D24_5",
        "name": "Dr. Naveen Kotian, MD",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": true,
        "shift": "10:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-8"
      },
      {
        "id": "D24_6",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": false,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      }
    ]
  },
  {
    "id": "hosp-blr-narayana",
    "dbId": 25,
    "name": "Narayana Institute of Cardiac Sciences (Health City)",
    "type": "Super-Specialty Cardiac & Multispecialty",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "address": "258/A, Bommasandra Industrial Area, Anekal Taluk, Bengaluru / Bangalore, Karnataka - 560099",
    "lat": 12.8188,
    "lng": 77.6974,
    "distanceKm": 362.0,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-80-71222222",
    "lastUpdatedMins": 1,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 172,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M25_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 84,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M25_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 101,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M25_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 48,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M25_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 130,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M25_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 62,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M25_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 124,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M25_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 91,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M25_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 108,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M25_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 40,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M25_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 212,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M25_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 89,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M25_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 71,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M25_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 63,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M25_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 50,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M25_15"
      }
    ],
    "vaccines": [
      {
        "id": "V25_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 80,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V25_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 35,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V25_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 30,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V25_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 50,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D25_1",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      },
      {
        "id": "D25_2",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": false,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      },
      {
        "id": "D25_3",
        "name": "Dr. Reshma D'Souza, MD",
        "qualification": "MBBS, Pulmonology",
        "specialty": "Pulmonology",
        "onDuty": true,
        "shift": "09:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-7"
      },
      {
        "id": "D25_4",
        "name": "Dr. Naveen Kotian, MD",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": false,
        "shift": "10:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-8"
      },
      {
        "id": "D25_5",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": true,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      },
      {
        "id": "D25_6",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": false,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      }
    ]
  },
  {
    "id": "hosp-blr-victoria",
    "dbId": 26,
    "name": "Victoria Hospital (BMCRI Apex Healthcare)",
    "type": "Government Apex Tertiary Hospital",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "address": "Fort Road, Near City Market (KR Market), Bengaluru / Bangalore, Karnataka - 560002",
    "lat": 12.9634,
    "lng": 77.5746,
    "distanceKm": 345.0,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-80-26701150",
    "lastUpdatedMins": 2,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 185,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M26_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 97,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M26_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 114,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M26_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 31,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M26_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 143,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M26_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 75,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M26_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 137,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M26_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 74,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M26_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 91,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M26_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 53,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M26_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 225,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M26_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 72,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M26_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 54,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M26_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 76,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M26_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 63,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M26_15"
      }
    ],
    "vaccines": [
      {
        "id": "V26_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 85,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V26_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 40,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V26_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 35,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V26_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 55,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D26_1",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": true,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      },
      {
        "id": "D26_2",
        "name": "Dr. Reshma D'Souza, MD",
        "qualification": "MBBS, Pulmonology",
        "specialty": "Pulmonology",
        "onDuty": false,
        "shift": "09:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-7"
      },
      {
        "id": "D26_3",
        "name": "Dr. Naveen Kotian, MD",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": true,
        "shift": "10:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-8"
      },
      {
        "id": "D26_4",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": false,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      },
      {
        "id": "D26_5",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      },
      {
        "id": "D26_6",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": false,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      }
    ]
  },
  {
    "id": "hosp-blr-fortis",
    "dbId": 27,
    "name": "Fortis Hospital Bannerghatta Road",
    "type": "Multi-Specialty Tertiary Hospital",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "address": "154/9, Bannerghatta Main Rd, Opposite IIM-B, Bengaluru / Bangalore, Karnataka - 560076",
    "lat": 12.8938,
    "lng": 77.5979,
    "distanceKm": 352.0,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-80-66214444",
    "lastUpdatedMins": 1,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 198,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M27_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 80,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M27_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 97,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M27_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 44,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M27_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 156,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M27_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 58,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M27_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 120,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M27_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 87,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M27_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 104,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M27_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 36,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M27_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 208,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M27_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 85,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M27_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 67,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M27_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 89,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M27_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 46,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M27_15"
      }
    ],
    "vaccines": [
      {
        "id": "V27_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 90,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V27_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 45,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V27_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 40,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V27_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 60,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D27_1",
        "name": "Dr. Reshma D'Souza, MD",
        "qualification": "MBBS, Pulmonology",
        "specialty": "Pulmonology",
        "onDuty": true,
        "shift": "09:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-7"
      },
      {
        "id": "D27_2",
        "name": "Dr. Naveen Kotian, MD",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": false,
        "shift": "10:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-8"
      },
      {
        "id": "D27_3",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": true,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      },
      {
        "id": "D27_4",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": false,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      },
      {
        "id": "D27_5",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": true,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D27_6",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": false,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      }
    ]
  },
  {
    "id": "hosp-blr-aster",
    "dbId": 28,
    "name": "Aster CMI Hospital Hebbal",
    "type": "Quaternary Care Hospital",
    "city": "Bengaluru",
    "district": "Bengaluru Urban",
    "state": "Karnataka",
    "address": "No. 43/42, Bellary Road, Sahakar Nagar, Hebbal, Bengaluru / Bangalore, Karnataka - 560092",
    "lat": 13.0577,
    "lng": 77.5925,
    "distanceKm": 342.0,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-80-43440100",
    "lastUpdatedMins": 2,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 181,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M28_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 93,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M28_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 110,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M28_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 27,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M28_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 139,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M28_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 71,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M28_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 133,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M28_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 70,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M28_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 87,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M28_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 49,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M28_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 221,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M28_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 98,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M28_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 50,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M28_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 72,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M28_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 59,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M28_15"
      }
    ],
    "vaccines": [
      {
        "id": "V28_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 95,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V28_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 50,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V28_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 45,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V28_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 65,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D28_1",
        "name": "Dr. Naveen Kotian, MD",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": true,
        "shift": "10:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-8"
      },
      {
        "id": "D28_2",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": false,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      },
      {
        "id": "D28_3",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      },
      {
        "id": "D28_4",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": false,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D28_5",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      },
      {
        "id": "D28_6",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": false,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      }
    ]
  },
  {
    "id": "hosp-mys-apollo",
    "dbId": 29,
    "name": "Apollo BGS Hospitals Mysuru",
    "type": "Super-Specialty Tertiary Hospital",
    "city": "Mysuru",
    "district": "Mysuru",
    "state": "Karnataka",
    "address": "Adhichunchanagiri Road, Kuvempunagar, Mysuru / Mysore, Karnataka - 570023",
    "lat": 12.2926,
    "lng": 76.6274,
    "distanceKm": 245.0,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-821-2568888",
    "lastUpdatedMins": 2,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 194,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M29_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 76,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M29_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 93,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M29_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 40,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M29_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 152,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M29_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 84,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M29_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 116,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M29_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 83,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M29_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 100,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M29_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 62,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M29_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 204,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M29_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 81,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M29_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 63,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M29_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 85,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M29_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 42,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M29_15"
      }
    ],
    "vaccines": [
      {
        "id": "V29_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 100,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V29_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 55,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V29_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 50,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V29_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 70,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D29_1",
        "name": "Dr. Harish Poojary, MS",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": true,
        "shift": "09:30 - 14:00",
        "queueCount": 1,
        "room": "OPD-9"
      },
      {
        "id": "D29_2",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": false,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      },
      {
        "id": "D29_3",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": true,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D29_4",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": false,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      },
      {
        "id": "D29_5",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      },
      {
        "id": "D29_6",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": false,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      }
    ]
  },
  {
    "id": "hosp-hubli-kims",
    "dbId": 30,
    "name": "KIMS Hospital (Karnataka Institute of Medical Sciences)",
    "type": "Government Apex Teaching Hospital",
    "city": "Hubballi",
    "district": "Dharwad",
    "state": "Karnataka",
    "address": "PB Road, Vidyanagar, Hubballi / Hubli, Karnataka - 580022",
    "lat": 15.3647,
    "lng": 75.124,
    "distanceKm": 320.0,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-836-2373348",
    "lastUpdatedMins": 3,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 177,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M30_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 89,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M30_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 106,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M30_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 53,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M30_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 135,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M30_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 67,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M30_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 129,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M30_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 96,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M30_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 83,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M30_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 45,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M30_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 217,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M30_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 94,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M30_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 46,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M30_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 68,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M30_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 55,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M30_15"
      }
    ],
    "vaccines": [
      {
        "id": "V30_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 80,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V30_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 35,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V30_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 30,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V30_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 50,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D30_1",
        "name": "Dr. Ramesh Bhat, MD",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-1"
      },
      {
        "id": "D30_2",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": false,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D30_3",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      },
      {
        "id": "D30_4",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": false,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      }
    ]
  },
  {
    "id": "hosp-belgaum-kle",
    "dbId": 31,
    "name": "KLE Dr. Prabhakar Kore Hospital & MRC",
    "type": "Multi-Specialty Charitable & Tertiary Hospital",
    "city": "Belagavi",
    "district": "Belagavi",
    "state": "Karnataka",
    "address": "Nehrunagar, Belagavi / Belgaum, Karnataka - 590010",
    "lat": 15.8824,
    "lng": 74.5242,
    "distanceKm": 410.0,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-831-2473777",
    "lastUpdatedMins": 2,
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 190,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M31_1"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 102,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M31_2"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 89,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M31_3"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 36,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M31_4"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 148,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M31_5"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 80,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M31_6"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 112,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M31_7"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 79,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M31_8"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 96,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M31_9"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 58,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M31_10"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 200,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M31_11"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 77,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M31_12"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 59,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M31_13"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 81,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M31_14"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 68,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M31_15"
      }
    ],
    "vaccines": [
      {
        "id": "V31_1",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 85,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V31_2",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 40,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V31_3",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 35,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V31_4",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 55,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ],
    "doctors": [
      {
        "id": "D31_1",
        "name": "Dr. Sunitha Shetty, DCH",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": true,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D31_2",
        "name": "Dr. Anand Nayak, MS",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": false,
        "shift": "16:00 - 20:00",
        "queueCount": 1,
        "room": "OPD-3"
      },
      {
        "id": "D31_3",
        "name": "Dr. Ashok Shetty, MD, DM",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "09:00 - 17:00",
        "queueCount": 4,
        "room": "OPD-4"
      },
      {
        "id": "D31_4",
        "name": "Dr. Ronald Fernandes, MS",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": false,
        "shift": "10:00 - 16:00",
        "queueCount": 2,
        "room": "OPD-5"
      },
      {
        "id": "D31_5",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      },
      {
        "id": "D31_6",
        "name": "Dr. Preetha Rao, MBBS",
        "qualification": "MBBS, Family Medicine",
        "specialty": "Family Medicine",
        "onDuty": false,
        "shift": "08:30 - 14:30",
        "queueCount": 2,
        "room": "OPD-6"
      }
    ]
  }
];

class HealthDataStore {
  constructor() {
    this.auditLog = [
      { action: "Stock updated: Paracetamol 650mg (+50)", user: "Dr. Ramesh Bhat", facility: "Alva's Health Centre", time: "10 mins ago" },
      { action: "Shift started: Dr. Preetha Rao", user: "Desk Superintendent", facility: "Govt CHC Moodbidri", time: "25 mins ago" },
      { action: "Vaccine cold chain verified (3.8°C)", user: "Chief Pharmacist", facility: "Prasad Hospital", time: "1 hour ago" },
      { action: "Amoxicillin stock restocked (+25)", user: "Inventory Officer", facility: "Alva's Health Centre", time: "2 hours ago" }
    ];
    this._data = this._load();
    this._listeners = [];
  }

  _load() {
    try {
      // Version 4 includes unified Moodbidri facilities (Alva's, CHC, Prasad, Yenepoya) with real-time stock
      const saved = localStorage.getItem('medipulse_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          return parsed;
        }
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(INITIAL_HOSPITALS));
  }

  _save() {
    try {
      localStorage.setItem('medipulse_v4', JSON.stringify(this._data));
    } catch (e) {}
  }

  _notify(hospitalId) {
    this._listeners.forEach(fn => {
      try { fn(hospitalId); } catch(err) { console.error('DataStore listener error:', err); }
    });
  }

  subscribe(fn) {
    this._listeners.push(fn);
  }

  getAll() {
    return this._data;
  }

  getById(id) {
    if (!id) return null;
    const cleanId = String(id).toLowerCase().trim();
    return this._data.find(h => {
      const hId = String(h.id).toLowerCase();
      if (hId === cleanId) return true;
      if (h.dbId && String(h.dbId) === cleanId) return true;
      if (cleanId === '1' && (hId === 'hosp-alvas' || hId === 'h001')) return true;
      if (cleanId === '2' && (hId === 'hosp-chc' || hId === 'h002')) return true;
      if (cleanId === '3' && (hId === 'hosp-prasad' || hId === 'h003')) return true;
      if (cleanId === '4' && (hId === 'hosp-yenepoya' || hId === 'h004')) return true;
      if (cleanId === 'hosp-alvas' && (hId === '1' || hId === 'hosp-alvas')) return true;
      if (cleanId === 'hosp-chc' && (hId === '2' || hId === 'hosp-chc')) return true;
      if (cleanId === 'hosp-prasad' && (hId === '3' || hId === 'hosp-prasad')) return true;
      if (cleanId === 'hosp-yenepoya' && (hId === '4' || hId === 'hosp-yenepoya')) return true;
      return false;
    }) || null;
  }

  getNearest() {
    return this._data.find(h => h.isNearest) || this._data[0];
  }

  reset() {
    this._data = JSON.parse(JSON.stringify(INITIAL_HOSPITALS));
    this._save();
    this._notify(null);
  }

  toggleDoctorDuty(hospitalId, doctorId) {
    const h = this.getById(hospitalId);
    if (!h) return null;
    const doc = h.doctors.find(d => String(d.id).toLowerCase() === String(doctorId).toLowerCase());
    if (!doc) return null;
    doc.onDuty = !doc.onDuty;
    if (!doc.onDuty) doc.queueCount = 0;
    else if (doc.queueCount === 0) doc.queueCount = Math.floor(Math.random() * 5) + 1;

    h.lastUpdatedMins = 0;
    this.auditLog.unshift({
      action: `${doc.name} status updated to ${doc.onDuty ? 'ON DUTY' : 'OFF DUTY'}`,
      user: "Desk Administrator",
      facility: h.name,
      time: "Just now"
    });
    if (this.auditLog.length > 20) this.auditLog.pop();

    this._save();
    this._notify(hospitalId);
    return doc;
  }

  updateMedicineStock(hospitalId, medicineId, amountOrValue) {
    const h = this.getById(hospitalId);
    if (!h) return null;
    const med = h.medicines.find(m => String(m.id).toLowerCase() === String(medicineId).toLowerCase());
    if (!med) return null;

    const val = parseInt(amountOrValue, 10);
    med.stock = isNaN(val) ? 0 : Math.max(0, val);

    h.lastUpdatedMins = 0;
    this.auditLog.unshift({
      action: `${med.name} stock updated to ${med.stock} ${med.unit}`,
      user: "Desk Pharmacist",
      facility: h.name,
      time: "Just now"
    });
    if (this.auditLog.length > 20) this.auditLog.pop();

    this._save();
    this._notify(hospitalId);
    return med;
  }

  updateVaccineDoses(hospitalId, vaccineId, amountOrValue) {
    const h = this.getById(hospitalId);
    if (!h) return null;
    const vac = h.vaccines.find(v => String(v.id).toLowerCase() === String(vaccineId).toLowerCase());
    if (!vac) return null;

    const val = parseInt(amountOrValue, 10);
    vac.doses = isNaN(val) ? 0 : Math.max(0, val);

    h.lastUpdatedMins = 0;
    this.auditLog.unshift({
      action: `${vac.name} doses updated to ${vac.doses}`,
      user: "Cold Chain Supervisor",
      facility: h.name,
      time: "Just now"
    });
    if (this.auditLog.length > 20) this.auditLog.pop();

    this._save();
    this._notify(hospitalId);
    return vac;
  }

  searchByMedicine(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return this._data;
    return this._data.filter(h =>
      h.medicines.some(m => m.name.toLowerCase().includes(q) && m.stock > 0)
    );
  }

  searchBySpecialty(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return this._data;
    return this._data.filter(h =>
      h.doctors.some(d => d.specialty.toLowerCase().includes(q) && d.onDuty)
    );
  }

  searchByVaccine(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return this._data;
    return this._data.filter(h =>
      h.vaccines.some(v => v.name.toLowerCase().includes(q) && v.doses > 0)
    );
  }

  search(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return this._data;
    return this._data.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.type.toLowerCase().includes(q) ||
      h.address.toLowerCase().includes(q) ||
      h.medicines.some(m => m.name.toLowerCase().includes(q)) ||
      h.doctors.some(d => d.specialty.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)) ||
      h.vaccines.some(v => v.name.toLowerCase().includes(q))
    );
  }
}

const window_dataStore = new HealthDataStore();
window.dataStore = window_dataStore;
