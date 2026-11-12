/**
 * MediPulse — Health Data Store
 * AUTO-GENERATED from MediPulse_Unified_Dataset.csv
 * 10 hospitals across Mangaluru–Moodbidri–Udupi belt, Karnataka
 * Reference point: Moodbidri Town Bus Stand (13.0733° N, 74.9958° E)
 * Data snapshot: 2026-11-12 09:00 IST — synthetic, not for clinical use.
 */

const DEFAULT_PATIENT_LOCATION = {
  lat: 13.0733,
  lng: 74.9958,
  name: "Moodbidri Town Bus Stand, Karnataka"
};

const INITIAL_HOSPITALS = [
  {
    "id": "H003",
    "name": "City Life Hospital",
    "type": "General",
    "address": "Moodbidri, Karnataka - 574227",
    "lat": 13.0675,
    "lng": 74.9953,
    "distanceKm": 0.6,
    "isNearest": true,
    "emergency24x7": true,
    "phone": "+91-824-500003",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D005",
        "name": "Dr. Meera Pai",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 3,
        "room": "OPD - DER"
      },
      {
        "id": "D017",
        "name": "Dr. Vikram Sharma",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": false,
        "shift": "16:00-20:00",
        "queueCount": 0,
        "room": "OPD - DER"
      }
    ],
    "medicines": [
      {
        "id": "M007",
        "name": "ORS Sachet",
        "category": "Sachet",
        "stock": 75,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹5/sachet)"
      },
      {
        "id": "M008",
        "name": "Azithromycin 500 mg",
        "category": "Tablet",
        "stock": 40,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M018",
        "name": "Amoxicillin 500 mg",
        "category": "Capsule",
        "stock": 0,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹20/strip)"
      },
      {
        "id": "M023",
        "name": "ORS Sachet",
        "category": "Sachet",
        "stock": 75,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹5/sachet)"
      },
      {
        "id": "M030",
        "name": "Cough Syrup",
        "category": "Syrup",
        "stock": 120,
        "unit": "units",
        "threshold": 10,
        "price": "₹60/bottle"
      },
      {
        "id": "M032",
        "name": "Iron Folic Acid",
        "category": "Tablet",
        "stock": 0,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      }
    ],
    "vaccines": [
      {
        "id": "V023",
        "name": "Hepatitis A",
        "batch": "BATCH-2026-0023",
        "doses": 50,
        "expiry": "11/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V024",
        "name": "Typhoid",
        "batch": "BATCH-2026-0024",
        "doses": 5,
        "expiry": "12/2027",
        "coldChainStatus": "Normal (3.8°C)"
      }
    ]
  },
  {
    "id": "H005",
    "name": "Green Valley Clinic",
    "type": "Clinic",
    "address": "Karkala, Karnataka - 574104",
    "lat": 13.202,
    "lng": 74.989,
    "distanceKm": 14.3,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-824-500005",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D020",
        "name": "Dr. Rahul Sharma",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": false,
        "shift": "10:00-14:00",
        "queueCount": 0,
        "room": "OPD - DER"
      },
      {
        "id": "D025",
        "name": "Dr. Vikram Naik",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": false,
        "shift": "16:00-20:00",
        "queueCount": 0,
        "room": "OPD - ENT"
      }
    ],
    "medicines": [
      {
        "id": "M020",
        "name": "Metformin 500 mg",
        "category": "Tablet",
        "stock": 40,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M021",
        "name": "Amlodipine 5 mg",
        "category": "Tablet",
        "stock": 75,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M024",
        "name": "Azithromycin 500 mg",
        "category": "Tablet",
        "stock": 8,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      }
    ],
    "vaccines": [
      {
        "id": "V003",
        "name": "Influenza",
        "batch": "BATCH-2026-0003",
        "doses": 35,
        "expiry": "08/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V011",
        "name": "Influenza",
        "batch": "BATCH-2026-0011",
        "doses": 35,
        "expiry": "10/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V017",
        "name": "COVID-19",
        "batch": "BATCH-2026-0017",
        "doses": 5,
        "expiry": "10/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V019",
        "name": "Influenza",
        "batch": "BATCH-2026-0019",
        "doses": 35,
        "expiry": "09/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V020",
        "name": "MMR",
        "batch": "BATCH-2026-0020",
        "doses": 10,
        "expiry": "01/2027",
        "coldChainStatus": "Normal (3.8°C)"
      }
    ]
  },
  {
    "id": "H008",
    "name": "CarePoint Hospital",
    "type": "General",
    "address": "Bantwal, Karnataka - 574211",
    "lat": 12.89,
    "lng": 75.034,
    "distanceKm": 20.8,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-500008",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D004",
        "name": "Dr. Arjun Rao",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": false,
        "shift": "14:00-18:00",
        "queueCount": 0,
        "room": "OPD - GEN"
      },
      {
        "id": "D014",
        "name": "Dr. Rahul Pai",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "14:00-18:00",
        "queueCount": 23,
        "room": "OPD - GEN"
      },
      {
        "id": "D018",
        "name": "Dr. Arjun Sharma",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "14:00-18:00",
        "queueCount": 24,
        "room": "OPD - CAR"
      },
      {
        "id": "D024",
        "name": "Dr. Rahul Pai",
        "qualification": "MBBS, Neurology",
        "specialty": "Neurology",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 22,
        "room": "OPD - NEU"
      }
    ],
    "medicines": [
      {
        "id": "M001",
        "name": "Paracetamol 500 mg",
        "category": "Tablet",
        "stock": 40,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M009",
        "name": "Ibuprofen 400 mg",
        "category": "Tablet",
        "stock": 15,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M016",
        "name": "Iron Folic Acid",
        "category": "Tablet",
        "stock": 75,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      }
    ],
    "vaccines": [
      {
        "id": "V010",
        "name": "Hepatitis B",
        "batch": "BATCH-2026-0010",
        "doses": 0,
        "expiry": "09/2027",
        "coldChainStatus": "Warning (chain break)"
      }
    ]
  },
  {
    "id": "H009",
    "name": "Sunrise Clinic",
    "type": "Clinic",
    "address": "Mulki, Karnataka - 574154",
    "lat": 13.091,
    "lng": 74.793,
    "distanceKm": 22.1,
    "isNearest": false,
    "emergency24x7": false,
    "phone": "+91-824-500009",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D016",
        "name": "Dr. Nisha Rao",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 20,
        "room": "OPD - CAR"
      },
      {
        "id": "D029",
        "name": "Dr. Rahul Naik",
        "qualification": "MBBS, Gynecology",
        "specialty": "Gynecology",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 25,
        "room": "OPD - GYN"
      }
    ],
    "medicines": [
      {
        "id": "M006",
        "name": "Omeprazole 20 mg",
        "category": "Capsule",
        "stock": 8,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹20/strip)"
      },
      {
        "id": "M011",
        "name": "Salbutamol Inhaler",
        "category": "Inhaler",
        "stock": 75,
        "unit": "units",
        "threshold": 10,
        "price": "₹120/unit"
      },
      {
        "id": "M022",
        "name": "Omeprazole 20 mg",
        "category": "Capsule",
        "stock": 40,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹20/strip)"
      },
      {
        "id": "M029",
        "name": "Atorvastatin 10 mg",
        "category": "Tablet",
        "stock": 75,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M031",
        "name": "Insulin Glargine",
        "category": "Injection",
        "stock": 0,
        "unit": "units",
        "threshold": 10,
        "price": "₹280/vial"
      }
    ],
    "vaccines": [
      {
        "id": "V007",
        "name": "Hepatitis A",
        "batch": "BATCH-2026-0007",
        "doses": 0,
        "expiry": "05/2027",
        "coldChainStatus": "Warning (chain break)"
      },
      {
        "id": "V012",
        "name": "MMR",
        "batch": "BATCH-2026-0012",
        "doses": 50,
        "expiry": "01/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V013",
        "name": "Tetanus (Td)",
        "batch": "BATCH-2026-0013",
        "doses": 35,
        "expiry": "05/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V016",
        "name": "Typhoid",
        "batch": "BATCH-2026-0016",
        "doses": 35,
        "expiry": "03/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V025",
        "name": "COVID-19",
        "batch": "BATCH-2026-0025",
        "doses": 10,
        "expiry": "12/2027",
        "coldChainStatus": "Normal (3.8°C)"
      }
    ]
  },
  {
    "id": "H006",
    "name": "Arogya Hospital",
    "type": "General",
    "address": "Surathkal, Karnataka - 575014",
    "lat": 13.0068,
    "lng": 74.7943,
    "distanceKm": 23.0,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-500006",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D006",
        "name": "Dr. Sneha Sharma",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 17,
        "room": "OPD - ORT"
      },
      {
        "id": "D010",
        "name": "Dr. Meera Naik",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 17,
        "room": "OPD - ORT"
      },
      {
        "id": "D012",
        "name": "Dr. Ananya Shetty",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": false,
        "shift": "16:00-20:00",
        "queueCount": 0,
        "room": "OPD - CAR"
      },
      {
        "id": "D019",
        "name": "Dr. Kiran Pai",
        "qualification": "MBBS, Neurology",
        "specialty": "Neurology",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 0,
        "room": "OPD - NEU"
      },
      {
        "id": "D021",
        "name": "Dr. Rahul Sharma",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": false,
        "shift": "16:00-20:00",
        "queueCount": 0,
        "room": "OPD - CAR"
      },
      {
        "id": "D028",
        "name": "Dr. Kiran Sharma",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": false,
        "shift": "16:00-20:00",
        "queueCount": 0,
        "room": "OPD - PED"
      }
    ],
    "medicines": [
      {
        "id": "M039",
        "name": "ORS Sachet",
        "category": "Sachet",
        "stock": 120,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹5/sachet)"
      }
    ],
    "vaccines": [
      {
        "id": "V001",
        "name": "COVID-19",
        "batch": "BATCH-2026-0001",
        "doses": 35,
        "expiry": "04/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V008",
        "name": "Typhoid",
        "batch": "BATCH-2026-0008",
        "doses": 0,
        "expiry": "02/2027",
        "coldChainStatus": "Warning (chain break)"
      },
      {
        "id": "V009",
        "name": "COVID-19",
        "batch": "BATCH-2026-0009",
        "doses": 0,
        "expiry": "05/2027",
        "coldChainStatus": "Warning (chain break)"
      },
      {
        "id": "V018",
        "name": "Hepatitis B",
        "batch": "BATCH-2026-0018",
        "doses": 0,
        "expiry": "04/2027",
        "coldChainStatus": "Warning (chain break)"
      }
    ]
  },
  {
    "id": "H001",
    "name": "MediCare General Hospital",
    "type": "Multi-specialty",
    "address": "Mangaluru, Karnataka - 575001",
    "lat": 12.9141,
    "lng": 74.856,
    "distanceKm": 23.3,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-500001",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D031",
        "name": "Dr. Rohan Shetty",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 5,
        "room": "OPD - CAR"
      },
      {
        "id": "D032",
        "name": "Dr. Divya Hegde",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 3,
        "room": "OPD - PED"
      },
      {
        "id": "D033",
        "name": "Dr. Suresh Bhat",
        "qualification": "MBBS, General Medicine",
        "specialty": "General Medicine",
        "onDuty": true,
        "shift": "09:00-13:00",
        "queueCount": 6,
        "room": "OPD - GEN"
      }
    ],
    "medicines": [
      {
        "id": "M012",
        "name": "Pantoprazole 40 mg",
        "category": "Tablet",
        "stock": 0,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M013",
        "name": "Atorvastatin 10 mg",
        "category": "Tablet",
        "stock": 120,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M019",
        "name": "Cetirizine 10 mg",
        "category": "Tablet",
        "stock": 40,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M025",
        "name": "Ibuprofen 400 mg",
        "category": "Tablet",
        "stock": 8,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M026",
        "name": "Vitamin C 500 mg",
        "category": "Tablet",
        "stock": 120,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M027",
        "name": "Salbutamol Inhaler",
        "category": "Inhaler",
        "stock": 25,
        "unit": "units",
        "threshold": 10,
        "price": "₹120/unit"
      }
    ],
    "vaccines": [
      {
        "id": "V022",
        "name": "HPV",
        "batch": "BATCH-2026-0022",
        "doses": 0,
        "expiry": "06/2027",
        "coldChainStatus": "Warning (chain break)"
      }
    ]
  },
  {
    "id": "H004",
    "name": "Unity Medical Institute",
    "type": "Multi-specialty",
    "address": "Mangaluru, Karnataka - 575002",
    "lat": 12.873,
    "lng": 74.843,
    "distanceKm": 27.8,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-500004",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D003",
        "name": "Dr. Meera Sharma",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 7,
        "room": "OPD - CAR"
      },
      {
        "id": "D011",
        "name": "Dr. Rahul Bhat",
        "qualification": "MBBS, Neurology",
        "specialty": "Neurology",
        "onDuty": false,
        "shift": "10:00-14:00",
        "queueCount": 0,
        "room": "OPD - NEU"
      },
      {
        "id": "D026",
        "name": "Dr. Meera Rao",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 18,
        "room": "OPD - ENT"
      },
      {
        "id": "D027",
        "name": "Dr. Ananya Rao",
        "qualification": "MBBS, Cardiology",
        "specialty": "Cardiology",
        "onDuty": true,
        "shift": "09:00-13:00",
        "queueCount": 1,
        "room": "OPD - CAR"
      }
    ],
    "medicines": [
      {
        "id": "M005",
        "name": "Amlodipine 5 mg",
        "category": "Tablet",
        "stock": 8,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M014",
        "name": "Cough Syrup",
        "category": "Syrup",
        "stock": 0,
        "unit": "units",
        "threshold": 10,
        "price": "₹60/bottle"
      },
      {
        "id": "M034",
        "name": "Amoxicillin 500 mg",
        "category": "Capsule",
        "stock": 0,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹20/strip)"
      },
      {
        "id": "M040",
        "name": "Azithromycin 500 mg",
        "category": "Tablet",
        "stock": 15,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      }
    ],
    "vaccines": [
      {
        "id": "V026",
        "name": "COVID-19",
        "batch": "BATCH-2026-0026",
        "doses": 30,
        "expiry": "06/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V027",
        "name": "Influenza",
        "batch": "BATCH-2026-0027",
        "doses": 25,
        "expiry": "08/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V028",
        "name": "Tetanus (Td)",
        "batch": "BATCH-2026-0028",
        "doses": 15,
        "expiry": "09/2027",
        "coldChainStatus": "Normal (3.8°C)"
      }
    ]
  },
  {
    "id": "H007",
    "name": "Lakeside Hospital",
    "type": "Multi-specialty",
    "address": "Manipal, Karnataka - 576104",
    "lat": 13.3525,
    "lng": 74.786,
    "distanceKm": 38.5,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-500007",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D030",
        "name": "Dr. Meera Rao",
        "qualification": "MBBS, Dermatology",
        "specialty": "Dermatology",
        "onDuty": false,
        "shift": "14:00-18:00",
        "queueCount": 0,
        "room": "OPD - DER"
      }
    ],
    "medicines": [
      {
        "id": "M003",
        "name": "Cetirizine 10 mg",
        "category": "Tablet",
        "stock": 0,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M015",
        "name": "Insulin Glargine",
        "category": "Injection",
        "stock": 3,
        "unit": "units",
        "threshold": 10,
        "price": "₹280/vial"
      },
      {
        "id": "M017",
        "name": "Paracetamol 500 mg",
        "category": "Tablet",
        "stock": 8,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M038",
        "name": "Omeprazole 20 mg",
        "category": "Capsule",
        "stock": 0,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹20/strip)"
      }
    ],
    "vaccines": [
      {
        "id": "V002",
        "name": "Hepatitis B",
        "batch": "BATCH-2026-0002",
        "doses": 5,
        "expiry": "03/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V021",
        "name": "Tetanus (Td)",
        "batch": "BATCH-2026-0021",
        "doses": 0,
        "expiry": "05/2027",
        "coldChainStatus": "Warning (chain break)"
      }
    ]
  },
  {
    "id": "H002",
    "name": "Coastal Health Centre",
    "type": "General",
    "address": "Udupi, Karnataka - 576101",
    "lat": 13.3409,
    "lng": 74.7421,
    "distanceKm": 40.5,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-500002",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D001",
        "name": "Dr. Ananya Naik",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 4,
        "room": "OPD - ORT"
      },
      {
        "id": "D002",
        "name": "Dr. Kiran Sharma",
        "qualification": "MBBS, Neurology",
        "specialty": "Neurology",
        "onDuty": true,
        "shift": "09:00-13:00",
        "queueCount": 2,
        "room": "OPD - NEU"
      },
      {
        "id": "D007",
        "name": "Dr. Vikram Rao",
        "qualification": "MBBS, Orthopedics",
        "specialty": "Orthopedics",
        "onDuty": false,
        "shift": "10:00-14:00",
        "queueCount": 0,
        "room": "OPD - ORT"
      },
      {
        "id": "D008",
        "name": "Dr. Ananya Naik",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": false,
        "shift": "09:00-13:00",
        "queueCount": 0,
        "room": "OPD - PED"
      },
      {
        "id": "D009",
        "name": "Dr. Vikram Pai",
        "qualification": "MBBS, Gynecology",
        "specialty": "Gynecology",
        "onDuty": false,
        "shift": "10:00-14:00",
        "queueCount": 0,
        "room": "OPD - GYN"
      },
      {
        "id": "D013",
        "name": "Dr. Meera Sharma",
        "qualification": "MBBS, ENT",
        "specialty": "ENT",
        "onDuty": true,
        "shift": "16:00-20:00",
        "queueCount": 12,
        "room": "OPD - ENT"
      },
      {
        "id": "D022",
        "name": "Dr. Sneha Pai",
        "qualification": "MBBS, Pediatrics",
        "specialty": "Pediatrics",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 18,
        "room": "OPD - PED"
      },
      {
        "id": "D023",
        "name": "Dr. Kiran Naik",
        "qualification": "MBBS, Gynecology",
        "specialty": "Gynecology",
        "onDuty": true,
        "shift": "10:00-14:00",
        "queueCount": 4,
        "room": "OPD - GYN"
      }
    ],
    "medicines": [
      {
        "id": "M002",
        "name": "Amoxicillin 500 mg",
        "category": "Capsule",
        "stock": 0,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹20/strip)"
      },
      {
        "id": "M004",
        "name": "Metformin 500 mg",
        "category": "Tablet",
        "stock": 25,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M010",
        "name": "Vitamin C 500 mg",
        "category": "Tablet",
        "stock": 8,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M035",
        "name": "Cetirizine 10 mg",
        "category": "Tablet",
        "stock": 40,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      }
    ],
    "vaccines": [
      {
        "id": "V004",
        "name": "MMR",
        "batch": "BATCH-2026-0004",
        "doses": 5,
        "expiry": "01/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V006",
        "name": "HPV",
        "batch": "BATCH-2026-0006",
        "doses": 0,
        "expiry": "09/2027",
        "coldChainStatus": "Warning (chain break)"
      },
      {
        "id": "V014",
        "name": "HPV",
        "batch": "BATCH-2026-0014",
        "doses": 35,
        "expiry": "03/2027",
        "coldChainStatus": "Normal (3.8°C)"
      },
      {
        "id": "V015",
        "name": "Hepatitis A",
        "batch": "BATCH-2026-0015",
        "doses": 5,
        "expiry": "02/2027",
        "coldChainStatus": "Normal (3.8°C)"
      }
    ]
  },
  {
    "id": "H010",
    "name": "People's Hospital",
    "type": "General",
    "address": "Puttur, Karnataka - 574201",
    "lat": 12.76,
    "lng": 75.204,
    "distanceKm": 41.5,
    "isNearest": false,
    "emergency24x7": true,
    "phone": "+91-824-500010",
    "lastUpdatedMins": 2,
    "doctors": [
      {
        "id": "D015",
        "name": "Dr. Vikram Sharma",
        "qualification": "MBBS, Neurology",
        "specialty": "Neurology",
        "onDuty": false,
        "shift": "10:00-14:00",
        "queueCount": 0,
        "room": "OPD - NEU"
      }
    ],
    "medicines": [
      {
        "id": "M028",
        "name": "Pantoprazole 40 mg",
        "category": "Tablet",
        "stock": 0,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M033",
        "name": "Paracetamol 500 mg",
        "category": "Tablet",
        "stock": 0,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M036",
        "name": "Metformin 500 mg",
        "category": "Tablet",
        "stock": 8,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      },
      {
        "id": "M037",
        "name": "Amlodipine 5 mg",
        "category": "Tablet",
        "stock": 0,
        "unit": "units",
        "threshold": 10,
        "price": "Subsidized (₹15/strip)"
      }
    ],
    "vaccines": [
      {
        "id": "V005",
        "name": "Tetanus (Td)",
        "batch": "BATCH-2026-0005",
        "doses": 10,
        "expiry": "10/2027",
        "coldChainStatus": "Normal (3.8°C)"
      }
    ]
  }
];

class HealthDataStore {
  constructor() {
    this._data = this._load();
    this._listeners = [];
  }

  _load() {
    try {
      const saved = localStorage.getItem('medipulse_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return JSON.parse(JSON.stringify(INITIAL_HOSPITALS));
  }

  _save() {
    try { localStorage.setItem('medipulse_v3', JSON.stringify(this._data)); } catch (e) {}
  }

  _notify(hospitalId) {
    this._listeners.forEach(fn => fn(hospitalId));
  }

  subscribe(fn) { this._listeners.push(fn); }

  getAll()       { return this._data; }
  getById(id)    { return this._data.find(h => h.id === id) || null; }
  getNearest()   { return this._data.find(h => h.isNearest) || this._data[0]; }

  reset() {
    this._data = JSON.parse(JSON.stringify(INITIAL_HOSPITALS));
    this._save();
    this._notify(null);
  }

  updateDoctor(hospitalId, doctorId, changes) {
    const h = this.getById(hospitalId);
    if (!h) return false;
    const d = h.doctors.find(doc => doc.id === doctorId);
    if (!d) return false;
    Object.assign(d, changes);
    if (!d.onDuty) d.queueCount = 0;
    this._save();
    this._notify(hospitalId);
    return true;
  }

  updateMedicine(hospitalId, medicineId, changes) {
    const h = this.getById(hospitalId);
    if (!h) return false;
    const m = h.medicines.find(med => med.id === medicineId);
    if (!m) return false;
    Object.assign(m, changes);
    this._save();
    this._notify(hospitalId);
    return true;
  }

  updateVaccine(hospitalId, vaccineId, changes) {
    const h = this.getById(hospitalId);
    if (!h) return false;
    const v = h.vaccines.find(vac => vac.id === vaccineId);
    if (!v) return false;
    Object.assign(v, changes);
    this._save();
    this._notify(hospitalId);
    return true;
  }

  searchByMedicine(query) {
    const q = query.trim().toLowerCase();
    if (!q) return this._data;
    return this._data.filter(h =>
      h.medicines.some(m => m.name.toLowerCase().includes(q) && m.stock > 0)
    );
  }

  searchBySpecialty(query) {
    const q = query.trim().toLowerCase();
    if (!q) return this._data;
    return this._data.filter(h =>
      h.doctors.some(d => d.specialty.toLowerCase().includes(q) && d.onDuty)
    );
  }

  searchByVaccine(query) {
    const q = query.trim().toLowerCase();
    if (!q) return this._data;
    return this._data.filter(h =>
      h.vaccines.some(v => v.name.toLowerCase().includes(q) && v.doses > 0)
    );
  }

  search(query) {
    const q = query.trim().toLowerCase();
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
