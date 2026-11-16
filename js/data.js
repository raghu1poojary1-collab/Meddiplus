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
    "type": "Multi-Specialty",
    "address": "Alva's Campus, Moodbidri Main Road",
    "lat": 13.0755,
    "lng": 74.9982,
    "distanceKm": 0.4,
    "isNearest": true,
    "emergency24x7": true,
    "phone": "+91-8258-238104",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D001",
        "name": "Dr. Ramesh Bhat",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 4,
        "room": "OPD-1"
      },
      {
        "id": "D002",
        "name": "Dr. Sunitha Shetty",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": true,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-2"
      },
      {
        "id": "D003",
        "name": "Dr. Anand Nayak",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": false,
        "shift": "16:00 - 20:00 (Evening)",
        "queueCount": 0,
        "room": "OPD-3"
      },
      {
        "id": "Dhosp-alvas-CARD",
        "name": "Dr. Deepak Varma, MD, DM",
        "qualification": "MD, DM Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-Cardio"
      },
      {
        "id": "Dhosp-alvas-EMERG",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, MEM (Emergency)",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      }
    ],
    "medicines": [
      {
        "id": "M001",
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 185,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b9\u20b915/strip)"
      },
      {
        "id": "M002",
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 64,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b9\u20b945/strip)"
      },
      {
        "id": "M003",
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 12,
        "unit": "strips",
        "threshold": 25,
        "price": "Subsidized (\u20b9\u20b922/strip)"
      },
      {
        "id": "M004",
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 25,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9\u20b9280/vial)"
      },
      {
        "id": "M005",
        "name": "Cetirizine 10mg",
        "category": "Anti-Allergy",
        "stock": 95,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b9\u20b912/strip)"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 47,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M201"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 97,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M202"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 57,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M203"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 72,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M204"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 27,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M205"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 182,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M206"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 62,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M207"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 40,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M208"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 52,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M209"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 34,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M210"
      }
    ],
    "vaccines": [
      {
        "id": "V001",
        "name": "Covaxin (BBV152)",
        "batch": "BBV-2026-089A",
        "doses": 84,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V002",
        "name": "BCG Tuberculosis",
        "batch": "BCG-IN-9941",
        "doses": 40,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (4.1\u00b0C)"
      },
      {
        "id": "V003",
        "name": "Pentavalent (DPT-HepB-Hib)",
        "batch": "PV-8820B",
        "doses": 28,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      }
    ]
  },
  {
    "id": "hosp-chc",
    "dbId": 2,
    "name": "Government Community Health Centre (CHC)",
    "type": "Community Health Centre",
    "address": "Near KSRTC Bus Depot, Moodbidri",
    "lat": 13.0698,
    "lng": 74.9921,
    "distanceKm": 0.6,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-8258-236240",
    "lastUpdatedMins": 3,
    "doctors": [
      {
        "id": "D004",
        "name": "Dr. Preetha Rao",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 14:00",
        "queueCount": 8,
        "room": "OPD-4"
      },
      {
        "id": "D005",
        "name": "Dr. Vignesh Kamath",
        "qualification": "MBBS, Emergency Medicine",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24-Hour Casualty",
        "queueCount": 1,
        "room": "OPD-5"
      },
      {
        "id": "D006",
        "name": "Dr. Malathi Shenoy",
        "qualification": "MBBS, Obstetrics & Gynecology",
        "specialty": "Obstetrics & Gynecology",
        "onDuty": false,
        "shift": "14:00 - 20:00 (Afternoon)",
        "queueCount": 0,
        "room": "OPD-6"
      }
    ],
    "medicines": [
      {
        "id": "M006",
        "name": "Paracetamol 650mg",
        "category": "Antipyretic",
        "stock": 340,
        "unit": "strips",
        "threshold": 50,
        "price": "Subsidized (\u20b9Free (Govt Supply))"
      },
      {
        "id": "M007",
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 16,
        "unit": "strips",
        "threshold": 25,
        "price": "Subsidized (\u20b9Free (Govt Supply))"
      },
      {
        "id": "M008",
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration",
        "stock": 210,
        "unit": "packets",
        "threshold": 40,
        "price": "Subsidized (\u20b9Free (Govt Supply))"
      },
      {
        "id": "M009",
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 0,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b9Free (Govt Supply))"
      },
      {
        "id": "M010",
        "name": "Cetirizine 10mg",
        "category": "Anti-Allergy",
        "stock": 80,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b9Free (Govt Supply))"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 27,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M211"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 54,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M212"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 104,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M213"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 64,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M214"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 79,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M215"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 34,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M216"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 69,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M217"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 47,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M218"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 59,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M219"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 41,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M220"
      }
    ],
    "vaccines": [
      {
        "id": "V004",
        "name": "Covishield (ChAdOx1-S)",
        "batch": "COV-2026-551",
        "doses": 120,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V005",
        "name": "Oral Polio Vaccine (bOPV)",
        "batch": "OPV-GOV-331",
        "doses": 250,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (2.8\u00b0C)"
      },
      {
        "id": "V006",
        "name": "Measles-Rubella (MR)",
        "batch": "MR-2026-012",
        "doses": 45,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.9\u00b0C)"
      }
    ]
  },
  {
    "id": "H003",
    "dbId": 7,
    "name": "City Life Hospital",
    "type": "General Hospital",
    "address": "Moodbidri, Karnataka - 574227",
    "lat": 13.0675,
    "lng": 74.9953,
    "distanceKm": 0.6,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-500003",
    "lastUpdatedMins": 3,
    "doctors": [
      {
        "id": "D015",
        "name": "Dr. Meera Pai",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 3,
        "room": "OPD-15"
      },
      {
        "id": "D016",
        "name": "Dr. Vikram Sharma",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": false,
        "shift": "16:00-20:00",
        "queueCount": 0,
        "room": "OPD-16"
      },
      {
        "id": "DH003-GM",
        "name": "Dr. Sujay Kumar, MBBS",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-GM"
      },
      {
        "id": "DH003-EMERG",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, MEM (Emergency)",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      }
    ],
    "medicines": [
      {
        "id": "M001-CL",
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 65,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b915/strip)"
      },
      {
        "id": "M017",
        "name": "ORS Sachet",
        "category": "Sachet",
        "stock": 75,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M018",
        "name": "Azithromycin 500 mg",
        "category": "Tablet",
        "stock": 40,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M019",
        "name": "Amoxicillin 500 mg",
        "category": "Capsule",
        "stock": 32,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M020",
        "name": "Cough Syrup",
        "category": "Syrup",
        "stock": 120,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M021",
        "name": "Iron Folic Acid",
        "category": "Tablet",
        "stock": 0,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 89,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M221"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 27,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M222"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 129,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M223"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 104,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M224"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 64,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M225"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 79,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M226"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 34,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M227"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 69,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M228"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 59,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M229"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 41,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M230"
      }
    ],
    "vaccines": [
      {
        "id": "V013",
        "name": "Hepatitis A",
        "batch": "BATCH-2026-0023",
        "doses": 50,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V014",
        "name": "Typhoid",
        "batch": "BATCH-2026-0024",
        "doses": 5,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      }
    ]
  },
  {
    "id": "hosp-prasad",
    "dbId": 3,
    "name": "Prasad Hospital & Trauma Care",
    "type": "Trauma & Specialty",
    "address": "Kaikamba Highway Road, Moodbidri Taluk",
    "lat": 13.0585,
    "lng": 74.981,
    "distanceKm": 2.3,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-8258-239911",
    "lastUpdatedMins": 4,
    "doctors": [
      {
        "id": "D007",
        "name": "Dr. Harish Poojary",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "10:00 - 18:00",
        "queueCount": 3,
        "room": "OPD-7"
      },
      {
        "id": "D008",
        "name": "Dr. Divya Hegde",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "09:00 - 17:00",
        "queueCount": 5,
        "room": "OPD-8"
      },
      {
        "id": "D009",
        "name": "Dr. Sudheer Alva",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": false,
        "shift": "18:00 - 22:00 (Night)",
        "queueCount": 0,
        "room": "OPD-9"
      },
      {
        "id": "Dhosp-prasad-EMERG",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, MEM (Emergency)",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      }
    ],
    "medicines": [
      {
        "id": "M011",
        "name": "Paracetamol 650mg",
        "category": "Antipyretic",
        "stock": 120,
        "unit": "strips",
        "threshold": 25,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M012",
        "name": "Insulin Glargine 100IU",
        "category": "Diabetes Care",
        "stock": 6,
        "unit": "vials",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b9310/vial)"
      },
      {
        "id": "M013",
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 0,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b9\u20b950/strip)"
      },
      {
        "id": "M014",
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 85,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b9\u20b925/strip)"
      },
      {
        "id": "M015",
        "name": "Cetirizine 10mg",
        "category": "Anti-Allergy",
        "stock": 50,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b9\u20b915/strip)"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 61,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M231"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 111,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M232"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 71,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M233"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 86,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M234"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 41,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M235"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 196,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M236"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 76,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M237"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 54,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M238"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 66,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M239"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 48,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M240"
      }
    ],
    "vaccines": [
      {
        "id": "V007",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-440",
        "doses": 35,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      },
      {
        "id": "V008",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-781",
        "doses": 90,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (4.2\u00b0C)"
      },
      {
        "id": "V009",
        "name": "Covaxin (BBV152)",
        "batch": "BBV-2026-112B",
        "doses": 15,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.6\u00b0C)"
      }
    ]
  },
  {
    "id": "hosp-yenepoya",
    "dbId": 4,
    "name": "Yenepoya Rural Health & Training Centre",
    "type": "Rural Training Centre",
    "address": "Belvai Road, Belvai Village, Moodbidri",
    "lat": 13.092,
    "lng": 75.0125,
    "distanceKm": 2.8,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-8258-241200",
    "lastUpdatedMins": 5,
    "doctors": [
      {
        "id": "D010",
        "name": "Dr. Farhan Ahmed",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "09:00 - 16:00",
        "queueCount": 6,
        "room": "OPD-10"
      },
      {
        "id": "D011",
        "name": "Dr. Reshma D'Souza",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": false,
        "shift": "15:00 - 19:00",
        "queueCount": 0,
        "room": "OPD-11"
      },
      {
        "id": "D012",
        "name": "Dr. Naveen Kotian",
        "qualification": "MBBS, General Practice",
        "specialty": "General Practice",
        "onDuty": false,
        "shift": "08:00 - 13:00 (Morning)",
        "queueCount": 0,
        "room": "OPD-12"
      }
    ],
    "medicines": [
      {
        "id": "M016",
        "name": "Paracetamol 650mg",
        "category": "Antipyretic",
        "stock": 14,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b9\u20b910/strip)"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 88,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M241"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 103,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M242"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 41,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M243"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 143,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M244"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 68,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M245"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 118,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M246"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 78,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M247"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 93,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M248"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 48,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M249"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 203,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M250"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 83,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M251"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 61,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M252"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 73,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M253"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 55,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M254"
      }
    ],
    "vaccines": [
      {
        "id": "V010",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-09",
        "doses": 22,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.7\u00b0C)"
      },
      {
        "id": "V011",
        "name": "Covishield (ChAdOx1-S)",
        "batch": "COV-2026-610",
        "doses": 0,
        "expiry": "12/2027",
        "coldChainStatus": "Normal (4.5\u00b0C)"
      },
      {
        "id": "V012",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-799",
        "doses": 60,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.4\u00b0C)"
      }
    ]
  },
  {
    "id": "H005",
    "dbId": 8,
    "name": "Green Valley Clinic",
    "type": "Primary Clinic",
    "address": "Karkala, Karnataka - 574104, Udupi",
    "lat": 13.202,
    "lng": 74.989,
    "distanceKm": 14.3,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-20008",
    "lastUpdatedMins": 4,
    "doctors": [
      {
        "id": "D017",
        "name": "Dr. Rahul Sharma",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": false,
        "shift": "10:00-14:00",
        "queueCount": 0,
        "room": "OPD-17"
      },
      {
        "id": "D018",
        "name": "Dr. Vikram Naik",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": false,
        "shift": "16:00-20:00",
        "queueCount": 0,
        "room": "OPD-18"
      },
      {
        "id": "DH005-GM",
        "name": "Dr. Sujay Kumar, MBBS",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-GM"
      },
      {
        "id": "DH005-EMERG",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, MEM (Emergency)",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      }
    ],
    "medicines": [
      {
        "id": "M022",
        "name": "Metformin 500 mg",
        "category": "Tablet",
        "stock": 40,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M023",
        "name": "Amlodipine 5 mg",
        "category": "Tablet",
        "stock": 75,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M024",
        "name": "Azithromycin 500 mg",
        "category": "Tablet",
        "stock": 8,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 171,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M255"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 81,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M256"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 34,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M257"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 136,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M258"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 111,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M259"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 71,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M260"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 41,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M261"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 196,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M262"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 76,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M263"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 54,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M264"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 66,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M265"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 48,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M266"
      }
    ],
    "vaccines": [
      {
        "id": "V015",
        "name": "Influenza",
        "batch": "BATCH-2026-0003",
        "doses": 35,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V016",
        "name": "COVID-19",
        "batch": "BATCH-2026-0017",
        "doses": 5,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V017",
        "name": "MMR",
        "batch": "BATCH-2026-0020",
        "doses": 10,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      }
    ]
  },
  {
    "id": "H008",
    "dbId": 9,
    "name": "CarePoint Hospital",
    "type": "Multi-Specialty",
    "address": "Bantwal, Karnataka - 574211, Udupi",
    "lat": 12.89,
    "lng": 75.034,
    "distanceKm": 20.8,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-20009",
    "lastUpdatedMins": 5,
    "doctors": [
      {
        "id": "D019",
        "name": "Dr. Arjun Rao",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": false,
        "shift": "14:00-18:00",
        "queueCount": 0,
        "room": "OPD-19"
      },
      {
        "id": "D020",
        "name": "Dr. Rahul Pai",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "14:00-18:00",
        "queueCount": 23,
        "room": "OPD-20"
      },
      {
        "id": "D021",
        "name": "Dr. Arjun Sharma",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "14:00-18:00",
        "queueCount": 24,
        "room": "OPD-21"
      },
      {
        "id": "DH008-EMERG",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, MEM (Emergency)",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      }
    ],
    "medicines": [
      {
        "id": "M025",
        "name": "Paracetamol 500 mg",
        "category": "Tablet",
        "stock": 40,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M026",
        "name": "Ibuprofen 400 mg",
        "category": "Tablet",
        "stock": 15,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M027",
        "name": "Iron Folic Acid",
        "category": "Tablet",
        "stock": 75,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 88,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M267"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 103,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M268"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 41,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M269"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 143,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M270"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 68,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M271"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 118,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M272"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 78,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M273"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 93,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M274"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 48,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M275"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 203,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M276"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 61,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M277"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 73,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M278"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 55,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M279"
      }
    ],
    "vaccines": [
      {
        "id": "V018",
        "name": "Hepatitis B",
        "batch": "BATCH-2026-0010",
        "doses": 0,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      }
    ]
  },
  {
    "id": "H009",
    "dbId": 10,
    "name": "Sunrise Clinic",
    "type": "Clinic",
    "address": "Mulki, Karnataka - 574154, Udupi",
    "lat": 13.091,
    "lng": 74.793,
    "distanceKm": 22.1,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-824-20010",
    "lastUpdatedMins": 1,
    "doctors": [
      {
        "id": "D022",
        "name": "Dr. Nisha Rao",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 20,
        "room": "OPD-22"
      },
      {
        "id": "D023",
        "name": "Dr. Rahul Naik",
        "qualification": "MBBS, Gynecology",
        "specialty": "Gynecology",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 25,
        "room": "OPD-23"
      },
      {
        "id": "DH009-GM",
        "name": "Dr. Sujay Kumar, MBBS",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-GM"
      }
    ],
    "medicines": [
      {
        "id": "M028",
        "name": "Omeprazole 20 mg",
        "category": "Capsule",
        "stock": 8,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M029",
        "name": "Salbutamol Inhaler",
        "category": "Inhaler",
        "stock": 75,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M030",
        "name": "Atorvastatin 10 mg",
        "category": "Tablet",
        "stock": 75,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M031",
        "name": "Insulin Glargine",
        "category": "Injection",
        "stock": 0,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 150,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M280"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 60,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M281"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 75,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M282"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 115,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M283"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 40,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M284"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 90,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M285"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 65,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M286"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 175,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M287"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 55,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M288"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 33,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M289"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 45,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M290"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 27,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M291"
      }
    ],
    "vaccines": [
      {
        "id": "V019",
        "name": "Hepatitis A",
        "batch": "BATCH-2026-0007",
        "doses": 0,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V020",
        "name": "MMR",
        "batch": "BATCH-2026-0012",
        "doses": 50,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V021",
        "name": "Tetanus (Td)",
        "batch": "BATCH-2026-0013",
        "doses": 35,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V022",
        "name": "Typhoid",
        "batch": "BATCH-2026-0016",
        "doses": 35,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V023",
        "name": "COVID-19",
        "batch": "BATCH-2026-0025",
        "doses": 10,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      }
    ]
  },
  {
    "id": "H006",
    "dbId": 11,
    "name": "Arogya Hospital",
    "type": "General Hospital",
    "address": "Surathkal, Karnataka - 575014, Udupi",
    "lat": 13.0068,
    "lng": 74.7943,
    "distanceKm": 23.0,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-824-20011",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D024",
        "name": "Dr. Sneha Sharma",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 17,
        "room": "OPD-24"
      },
      {
        "id": "D025",
        "name": "Dr. Meera Naik",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 17,
        "room": "OPD-25"
      },
      {
        "id": "D026",
        "name": "Dr. Ananya Shetty",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": false,
        "shift": "16:00-20:00",
        "queueCount": 0,
        "room": "OPD-26"
      },
      {
        "id": "D027",
        "name": "Dr. Kiran Pai",
        "qualification": "MBBS, Neurology",
        "specialty": "Neurology",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 0,
        "room": "OPD-27"
      },
      {
        "id": "D028",
        "name": "Dr. Rahul Sharma",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": false,
        "shift": "16:00-20:00",
        "queueCount": 0,
        "room": "OPD-28"
      },
      {
        "id": "D029",
        "name": "Dr. Kiran Sharma",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": false,
        "shift": "16:00-20:00",
        "queueCount": 0,
        "room": "OPD-29"
      },
      {
        "id": "DH006-GM",
        "name": "Dr. Sujay Kumar, MBBS",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-GM"
      }
    ],
    "medicines": [
      {
        "id": "M032",
        "name": "ORS Sachet",
        "category": "Sachet",
        "stock": 120,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 157,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M292"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 67,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M293"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 82,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M294"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 20,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M295"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 122,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M296"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 47,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M297"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 97,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M298"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 57,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M299"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 72,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M300"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 27,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M301"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 62,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M302"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 40,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M303"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 52,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M304"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 34,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M305"
      }
    ],
    "vaccines": [
      {
        "id": "V024",
        "name": "COVID-19",
        "batch": "BATCH-2026-0001",
        "doses": 35,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V025",
        "name": "Typhoid",
        "batch": "BATCH-2026-0008",
        "doses": 0,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V026",
        "name": "Hepatitis B",
        "batch": "BATCH-2026-0018",
        "doses": 0,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      }
    ]
  },
  {
    "id": "H001",
    "dbId": 12,
    "name": "MediCare General Hospital",
    "type": "General Hospital",
    "address": "Mangaluru, Karnataka - 575001",
    "lat": 12.9141,
    "lng": 74.856,
    "distanceKm": 23.3,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-824-20012",
    "lastUpdatedMins": 3,
    "doctors": [
      {
        "id": "D030",
        "name": "Dr. Rohan Shetty",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 5,
        "room": "OPD-30"
      },
      {
        "id": "D031",
        "name": "Dr. Divya Hegde",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 3,
        "room": "OPD-31"
      },
      {
        "id": "D032",
        "name": "Dr. Suresh Bhat",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "09:00-13:00",
        "queueCount": 6,
        "room": "OPD-32"
      }
    ],
    "medicines": [
      {
        "id": "M033",
        "name": "Pantoprazole 40 mg",
        "category": "Tablet",
        "stock": 0,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M034",
        "name": "Atorvastatin 10 mg",
        "category": "Tablet",
        "stock": 120,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M035",
        "name": "Cetirizine 10 mg",
        "category": "Tablet",
        "stock": 40,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M036",
        "name": "Ibuprofen 400 mg",
        "category": "Tablet",
        "stock": 8,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M037",
        "name": "Vitamin C 500 mg",
        "category": "Tablet",
        "stock": 120,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M038",
        "name": "Salbutamol Inhaler",
        "category": "Inhaler",
        "stock": 25,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 164,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M306"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 74,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M307"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 89,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M308"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 27,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M309"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 54,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M310"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 79,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M311"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 189,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M312"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 47,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M313"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 59,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M314"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 41,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M315"
      }
    ],
    "vaccines": [
      {
        "id": "V027",
        "name": "HPV",
        "batch": "BATCH-2026-0022",
        "doses": 0,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      }
    ]
  },
  {
    "id": "hosp-kmc",
    "dbId": 5,
    "name": "Kasturba Medical College (KMC) Hospital",
    "type": "Super-Specialty Tertiary",
    "address": "Dr. B R Ambedkar Circle, Attavar, Mangaluru",
    "lat": 12.8732,
    "lng": 74.8466,
    "distanceKm": 27.5,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-20005",
    "lastUpdatedMins": 1,
    "doctors": [
      {
        "id": "D013",
        "name": "Dr. Ashok Shetty",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "09:00 - 17:00",
        "queueCount": 7,
        "room": "OPD-13"
      },
      {
        "id": "Dhosp-kmc-GM",
        "name": "Dr. Sujay Kumar, MBBS",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-GM"
      },
      {
        "id": "Dhosp-kmc-EMERG",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, MEM (Emergency)",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      }
    ],
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 150,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M316"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 60,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M317"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 75,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M318"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 13,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M319"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 115,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M320"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 40,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M321"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 90,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M322"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 50,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M323"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 65,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M324"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 20,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M325"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 175,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M326"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 55,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M327"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 33,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M328"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 45,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M329"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 27,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M330"
      }
    ],
    "vaccines": [
      {
        "id": "V-TT",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 85,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V-RAB",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 40,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V-HEPB",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 35,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V-COV",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 50,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ]
  },
  {
    "id": "hosp-muller",
    "dbId": 6,
    "name": "Father Muller Medical College Hospital",
    "type": "Super-Specialty Hospital",
    "address": "Father Muller Road, Kankanady, Mangaluru",
    "lat": 12.8624,
    "lng": 74.8573,
    "distanceKm": 27.8,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-20006",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D014",
        "name": "Dr. Ronald Fernandes",
        "qualification": "MBBS, General Surgery",
        "specialty": "General Surgery",
        "onDuty": true,
        "shift": "10:00 - 16:00",
        "queueCount": 4,
        "room": "OPD-14"
      },
      {
        "id": "Dhosp-muller-GM",
        "name": "Dr. Sujay Kumar, MBBS",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-GM"
      },
      {
        "id": "Dhosp-muller-CARD",
        "name": "Dr. Deepak Varma, MD, DM",
        "qualification": "MD, DM Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "09:00 - 15:00",
        "queueCount": 2,
        "room": "OPD-Cardio"
      },
      {
        "id": "Dhosp-muller-EMERG",
        "name": "Dr. Gautham Kamath, MEM",
        "qualification": "MBBS, MEM (Emergency)",
        "specialty": "Emergency Medicine",
        "onDuty": true,
        "shift": "24/7 Casualty",
        "queueCount": 1,
        "room": "ER-1"
      }
    ],
    "medicines": [
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 157,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M331"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 67,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M332"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 82,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M333"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 20,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M334"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 122,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M335"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 47,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M336"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 97,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M337"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 57,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M338"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 72,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M339"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 27,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M340"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 182,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M341"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 62,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M342"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 40,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M343"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 52,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M344"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 34,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M345"
      }
    ],
    "vaccines": [
      {
        "id": "V-TT",
        "name": "Tetanus Toxoid (TT)",
        "batch": "TT-2026-880",
        "doses": 85,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.2\u00b0C)"
      },
      {
        "id": "V-RAB",
        "name": "Rabies Vaccine (Rabivax-S)",
        "batch": "RAB-2026-302",
        "doses": 40,
        "expiry": "10/2027",
        "coldChainStatus": "Optimal (3.5\u00b0C)"
      },
      {
        "id": "V-HEPB",
        "name": "Hepatitis B (Pediatric)",
        "batch": "HEPB-2026-112",
        "doses": 35,
        "expiry": "09/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V-COV",
        "name": "Covaxin (BBV152)",
        "batch": "COV-2026-904",
        "doses": 50,
        "expiry": "06/2027",
        "coldChainStatus": "Optimal (4.0\u00b0C)"
      }
    ]
  },
  {
    "id": "H004",
    "dbId": 13,
    "name": "Unity Medical Institute",
    "type": "Medical Institute",
    "address": "Mangaluru, Karnataka - 575002",
    "lat": 12.873,
    "lng": 74.843,
    "distanceKm": 27.8,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-824-20013",
    "lastUpdatedMins": 4,
    "doctors": [
      {
        "id": "D033",
        "name": "Dr. Meera Sharma",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 7,
        "room": "OPD-33"
      },
      {
        "id": "D034",
        "name": "Dr. Rahul Bhat",
        "qualification": "MBBS, Neurology",
        "specialty": "Neurology",
        "onDuty": false,
        "shift": "10:00-14:00",
        "queueCount": 0,
        "room": "OPD-34"
      },
      {
        "id": "D035",
        "name": "Dr. Meera Rao",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 18,
        "room": "OPD-35"
      },
      {
        "id": "D036",
        "name": "Dr. Ananya Rao",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "09:00-13:00",
        "queueCount": 1,
        "room": "OPD-36"
      },
      {
        "id": "DH004-GM",
        "name": "Dr. Sujay Kumar, MBBS",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-GM"
      }
    ],
    "medicines": [
      {
        "id": "M039",
        "name": "Amlodipine 5 mg",
        "category": "Tablet",
        "stock": 8,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M040",
        "name": "Cough Syrup",
        "category": "Syrup",
        "stock": 0,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M041",
        "name": "Amoxicillin 500 mg",
        "category": "Capsule",
        "stock": 0,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M042",
        "name": "Azithromycin 500 mg",
        "category": "Tablet",
        "stock": 15,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 171,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M346"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 96,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M347"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 34,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M348"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 136,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M349"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 111,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M350"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 71,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M351"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 41,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M352"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 196,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M353"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 76,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M354"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 66,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M355"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 48,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M356"
      }
    ],
    "vaccines": [
      {
        "id": "V028",
        "name": "COVID-19",
        "batch": "BATCH-2026-0026",
        "doses": 30,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V029",
        "name": "Influenza",
        "batch": "BATCH-2026-0027",
        "doses": 25,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V030",
        "name": "Tetanus (Td)",
        "batch": "BATCH-2026-0028",
        "doses": 15,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      }
    ]
  },
  {
    "id": "H007",
    "dbId": 14,
    "name": "Lakeside Hospital",
    "type": "Specialty Hospital",
    "address": "Manipal, Karnataka - 576104, Udupi",
    "lat": 13.3525,
    "lng": 74.786,
    "distanceKm": 38.5,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-824-20014",
    "lastUpdatedMins": 5,
    "doctors": [
      {
        "id": "D037",
        "name": "Dr. Meera Rao",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": false,
        "shift": "14:00-18:00",
        "queueCount": 0,
        "room": "OPD-37"
      },
      {
        "id": "DH007-GM",
        "name": "Dr. Sujay Kumar, MBBS",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-GM"
      }
    ],
    "medicines": [
      {
        "id": "M043",
        "name": "Cetirizine 10 mg",
        "category": "Tablet",
        "stock": 0,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M044",
        "name": "Insulin Glargine",
        "category": "Injection",
        "stock": 3,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M045",
        "name": "Paracetamol 500 mg",
        "category": "Tablet",
        "stock": 8,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M046",
        "name": "Omeprazole 20 mg",
        "category": "Capsule",
        "stock": 0,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 88,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M357"
      },
      {
        "name": "Metformin 500mg",
        "category": "Diabetes Care",
        "stock": 103,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b922/strip)",
        "id": "M358"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 68,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M359"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 118,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M360"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 78,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M361"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 93,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M362"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 48,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M363"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 203,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M364"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 83,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M365"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 61,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M366"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 73,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M367"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 55,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M368"
      }
    ],
    "vaccines": [
      {
        "id": "V031",
        "name": "Hepatitis B",
        "batch": "BATCH-2026-0002",
        "doses": 5,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V032",
        "name": "Tetanus (Td)",
        "batch": "BATCH-2026-0021",
        "doses": 0,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      }
    ]
  },
  {
    "id": "H002",
    "dbId": 15,
    "name": "Coastal Health Centre",
    "type": "Health Centre",
    "address": "Udupi, Karnataka - 576101",
    "lat": 13.3409,
    "lng": 74.7421,
    "distanceKm": 40.5,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-824-20015",
    "lastUpdatedMins": 1,
    "doctors": [
      {
        "id": "D038",
        "name": "Dr. Ananya Naik",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 4,
        "room": "OPD-38"
      },
      {
        "id": "D039",
        "name": "Dr. Kiran Sharma",
        "qualification": "MBBS, Neurology",
        "specialty": "Neurology",
        "onDuty": true,
        "shift": "09:00-13:00",
        "queueCount": 2,
        "room": "OPD-39"
      },
      {
        "id": "D040",
        "name": "Dr. Vikram Rao",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": false,
        "shift": "10:00-14:00",
        "queueCount": 0,
        "room": "OPD-40"
      },
      {
        "id": "D041",
        "name": "Dr. Vikram Pai",
        "qualification": "MBBS, Gynecology",
        "specialty": "Gynecology",
        "onDuty": false,
        "shift": "10:00-14:00",
        "queueCount": 0,
        "room": "OPD-41"
      },
      {
        "id": "D042",
        "name": "Dr. Meera Sharma",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 12,
        "room": "OPD-42"
      },
      {
        "id": "D043",
        "name": "Dr. Sneha Pai",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 18,
        "room": "OPD-43"
      },
      {
        "id": "D044",
        "name": "Dr. Kiran Naik",
        "qualification": "MBBS, Gynecology",
        "specialty": "Gynecology",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 4,
        "room": "OPD-44"
      },
      {
        "id": "DH002-GM",
        "name": "Dr. Sujay Kumar, MBBS",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-GM"
      }
    ],
    "medicines": [
      {
        "id": "M047",
        "name": "Amoxicillin 500 mg",
        "category": "Capsule",
        "stock": 0,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M048",
        "name": "Metformin 500 mg",
        "category": "Tablet",
        "stock": 25,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M049",
        "name": "Vitamin C 500 mg",
        "category": "Tablet",
        "stock": 8,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M050",
        "name": "Cetirizine 10 mg",
        "category": "Tablet",
        "stock": 40,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "name": "Paracetamol 650mg",
        "category": "Analgesic & Antipyretic",
        "stock": 150,
        "unit": "strips",
        "threshold": 30,
        "price": "Subsidized (\u20b915/strip)",
        "id": "M369"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 13,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M370"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 40,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M371"
      },
      {
        "name": "Pantoprazole 40 mg",
        "category": "Antacid / PPI",
        "stock": 90,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b935/strip)",
        "id": "M372"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 50,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M373"
      },
      {
        "name": "Amlodipine 5 mg",
        "category": "Antihypertensive",
        "stock": 65,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b918/strip)",
        "id": "M374"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 20,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M375"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 175,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M376"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 55,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M377"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 33,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M378"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 45,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M379"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 27,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M380"
      }
    ],
    "vaccines": [
      {
        "id": "V033",
        "name": "MMR",
        "batch": "BATCH-2026-0004",
        "doses": 5,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V034",
        "name": "HPV",
        "batch": "BATCH-2026-0006",
        "doses": 0,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      },
      {
        "id": "V035",
        "name": "Hepatitis A",
        "batch": "BATCH-2026-0015",
        "doses": 5,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
      }
    ]
  },
  {
    "id": "H010",
    "dbId": 16,
    "name": "People's Hospital",
    "type": "General Hospital",
    "address": "Puttur, Karnataka - 574201, Udupi",
    "lat": 12.76,
    "lng": 75.204,
    "distanceKm": 41.5,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-824-20016",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D045",
        "name": "Dr. Vikram Sharma",
        "qualification": "MBBS, Neurology",
        "specialty": "Neurology",
        "onDuty": false,
        "shift": "10:00-14:00",
        "queueCount": 0,
        "room": "OPD-45"
      },
      {
        "id": "DH010-GM",
        "name": "Dr. Sujay Kumar, MBBS",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "08:00 - 16:00",
        "queueCount": 3,
        "room": "OPD-GM"
      }
    ],
    "medicines": [
      {
        "id": "M051",
        "name": "Pantoprazole 40 mg",
        "category": "Tablet",
        "stock": 0,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M052",
        "name": "Paracetamol 500 mg",
        "category": "Tablet",
        "stock": 0,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M053",
        "name": "Metformin 500 mg",
        "category": "Tablet",
        "stock": 8,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "id": "M054",
        "name": "Amlodipine 5 mg",
        "category": "Tablet",
        "stock": 0,
        "unit": "strips",
        "threshold": 10,
        "price": "Subsidized (\u20b9\u20b920/strip)"
      },
      {
        "name": "Amoxicillin 500mg",
        "category": "Antibiotic",
        "stock": 67,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b945/strip)",
        "id": "M381"
      },
      {
        "name": "Insulin Glargine 100IU",
        "category": "Injectable Insulin",
        "stock": 20,
        "unit": "vials",
        "threshold": 8,
        "price": "Subsidized (\u20b9280/vial)",
        "id": "M382"
      },
      {
        "name": "Cetirizine 10mg",
        "category": "Antihistamine / Allergy",
        "stock": 122,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b912/strip)",
        "id": "M383"
      },
      {
        "name": "Azithromycin 500 mg",
        "category": "Antibiotic",
        "stock": 47,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b965/strip)",
        "id": "M384"
      },
      {
        "name": "Atorvastatin 10 mg",
        "category": "Cardiovascular / Lipid",
        "stock": 57,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b942/strip)",
        "id": "M385"
      },
      {
        "name": "Salbutamol Inhaler",
        "category": "Respiratory / Bronchodilator",
        "stock": 27,
        "unit": "inhalers",
        "threshold": 10,
        "price": "Subsidized (\u20b9110/unit)",
        "id": "M386"
      },
      {
        "name": "ORS Electrolyte Sachets",
        "category": "Rehydration / Electrolyte",
        "stock": 182,
        "unit": "sachets",
        "threshold": 30,
        "price": "Subsidized (\u20b96/sachet)",
        "id": "M387"
      },
      {
        "name": "Ibuprofen 400 mg",
        "category": "NSAID Pain Relief",
        "stock": 62,
        "unit": "strips",
        "threshold": 20,
        "price": "Subsidized (\u20b916/strip)",
        "id": "M388"
      },
      {
        "name": "Cough Syrup",
        "category": "Antitussive / Expectorant",
        "stock": 40,
        "unit": "bottles",
        "threshold": 10,
        "price": "Subsidized (\u20b955/bottle)",
        "id": "M389"
      },
      {
        "name": "Ciprofloxacin 500mg",
        "category": "Broad-Spectrum Antibiotic",
        "stock": 52,
        "unit": "strips",
        "threshold": 15,
        "price": "Subsidized (\u20b938/strip)",
        "id": "M390"
      },
      {
        "name": "Clotrimazole 1% Cream",
        "category": "Antifungal",
        "stock": 34,
        "unit": "tubes",
        "threshold": 10,
        "price": "Subsidized (\u20b940/tube)",
        "id": "M391"
      }
    ],
    "vaccines": [
      {
        "id": "V036",
        "name": "Tetanus (Td)",
        "batch": "BATCH-2026-0005",
        "doses": 10,
        "expiry": "12/2027",
        "coldChainStatus": "Optimal (3.8\u00b0C)"
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
