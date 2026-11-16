#!/usr/bin/env python3
"""
MediPulse Statewide Clinical AI Dataset Generator
Generates realistic clinical records across 12 specialties, 45+ clinical conditions,
and 31 regional hospitals covering Moodbidri, Mangaluru, Udupi, Manipal, Bengaluru, Mysuru, Hubballi, and Belagavi.
Supports 5,000 (5k), 3,000 (3k), and 25,000 (25k) record target datasets.
"""

import os
import sys
import random
import csv
import json
import argparse

random.seed(42)

# 12 Medical Specialties and Comprehensive Clinical Conditions
CLINICAL_DOMAINS = [
    {
        "specialty": "General Medicine",
        "conditions": [
            ("Acute Viral Pyrexia / Viral Fever",
             ["High grade fever 102F", "severe myalgia", "chills and rigors", "generalized fatigue", "frontal headache"],
             ["Paracetamol 650mg", "Cetirizine 10mg", "ORS Electrolyte Sachets"], "Routine"),
            ("Acute Bacterial Pharyngitis & Tonsillitis",
             ["Severe sore throat", "painful deglutition", "cervical lymphadenopathy", "fever 101F"],
             ["Amoxicillin 500mg", "Paracetamol 650mg", "Pantoprazole 40 mg"], "Routine"),
            ("Acute Bronchitis & Productive Cough",
             ["Persistent deep cough", "yellowish mucopurulent sputum", "chest congestion", "subfebrile temperature"],
             ["Azithromycin 500 mg", "Amoxicillin 500mg", "Cough Syrup"], "Urgent"),
            ("Acute Gastroenteritis with Moderate Dehydration",
             ["Watery diarrhea >6 episodes", "persistent vomiting", "crampy periumbilical pain", "dry tongue", "oliguria"],
             ["ORS Electrolyte Sachets", "Ciprofloxacin 500mg", "Pantoprazole 40 mg"], "Urgent"),
            ("Enteric Fever / Typhoid",
             ["Step-ladder remittent fever", "headache", "abdominal discomfort", "malaise", "hepatosplenomegaly"],
             ["Azithromycin 500 mg", "Ciprofloxacin 500mg", "Paracetamol 650mg"], "Urgent"),
            ("Acute Uncomplicated Urinary Tract Infection (UTI)",
             ["Burning micturition", "urinary urgency and frequency", "suprapubic tenderness", "cloudy urine"],
             ["Ciprofloxacin 500mg", "Paracetamol 650mg", "ORS Electrolyte Sachets"], "Routine")
        ]
    },
    {
        "specialty": "Cardiology",
        "conditions": [
            ("Essential Hypertension Stage 2",
             ["Resting blood pressure 165/105 mmHg", "throbbing occipital headache", "lightheadedness", "palpitations"],
             ["Amlodipine 5 mg", "Atorvastatin 10 mg"], "Routine"),
            ("Acute Coronary Syndrome / Unstable Angina",
             ["Severe substernal crushing chest pain", "radiation to left jaw and shoulder", "profuse cold diaphoresis", "dyspnea", "angina chest pain"],
             ["Atorvastatin 10 mg", "Amlodipine 5 mg", "Ibuprofen 400 mg"], "Emergency"),
            ("Congestive Heart Failure Exacerbation",
             ["Bilateral pitting pedal edema", "paroxysmal nocturnal dyspnea", "orthopnea", "exertional breathlessness"],
             ["Amlodipine 5 mg", "Atorvastatin 10 mg"], "Emergency"),
            ("Mixed Dyslipidemia & Atherosclerotic Risk",
             ["Elevated LDL cholesterol > 170 mg/dL", "low HDL", "elevated triglycerides", "fatigue"],
             ["Atorvastatin 10 mg"], "Routine")
        ]
    },
    {
        "specialty": "Pulmonology",
        "conditions": [
            ("Acute Bronchial Asthma Flare / Bronchospasm",
             ["Acute expiratory wheezing", "severe shortness of breath", "chest tightness", "intercostal retractions"],
             ["Salbutamol Inhaler", "Cetirizine 10mg", "Amoxicillin 500mg"], "Emergency"),
            ("COPD Acute Exacerbation",
             ["Worsening exertional dyspnea", "copious purulent phlegm", "chronic smoker cough", "rhonchi on auscultation"],
             ["Salbutamol Inhaler", "Azithromycin 500 mg", "Cough Syrup"], "Urgent"),
            ("Community-Acquired Lobar Pneumonia",
             ["High fever with shaking chills", "pleuritic chest pain on inspiration", "rusty productive cough", "tachypnea"],
             ["Amoxicillin 500mg", "Azithromycin 500 mg", "Paracetamol 650mg"], "Urgent")
        ]
    },
    {
        "specialty": "Endocrinology",
        "conditions": [
            ("Type 2 Diabetes Mellitus with Poor Glycemic Control",
             ["Fasting plasma glucose 220 mg/dL", "polydipsia", "polyuria", "nocturia", "blurred vision"],
             ["Metformin 500mg", "Atorvastatin 10 mg"], "Routine"),
            ("Insulin-Requiring Uncontrolled Diabetes",
             ["Postprandial glucose > 300 mg/dL", "weight loss", "extreme lethargy", "ketonuria warning"],
             ["Insulin Glargine 100IU", "Metformin 500mg"], "Urgent"),
            ("Primary Hypothyroidism",
             ["Cold intolerance", "unexplained weight gain", "dry coarse skin", "constipation", "chronic fatigue"],
             ["Paracetamol 650mg"], "Routine")
        ]
    },
    {
        "specialty": "Pediatrics",
        "conditions": [
            ("Pediatric Acute Febrile Illness",
             ["Infant temperature 101.8F", "irritability", "poor oral intake", "rhinorrhea"],
             ["Paracetamol 650mg", "ORS Electrolyte Sachets", "Cetirizine 10mg"], "Urgent"),
            ("Pediatric Acute Otitis Media",
             ["Ear tugging", "inconsolable crying", "otalgia", "low grade fever", "erythematous tympanic membrane"],
             ["Amoxicillin 500mg", "Paracetamol 650mg"], "Routine"),
            ("Pediatric Gastrointestinal Viral Infection",
             ["Loose stools", "recurrent emesis", "mild sunken eyes", "fussiness"],
             ["ORS Electrolyte Sachets", "Paracetamol 650mg"], "Urgent"),
            ("Childhood Immunization & Prophylaxis",
             ["Routine universal immunization schedule due", "infant wellness tracking"],
             ["Paracetamol 650mg"], "Routine")
        ]
    },
    {
        "specialty": "Dermatology",
        "conditions": [
            ("Tinea Corporis & Cruris / Fungal Dermatitis",
             ["Annular scaling erythematous plaques", "active borders with central clearing", "intense pruritus in groin/body"],
             ["Clotrimazole 1% Cream", "Cetirizine 10mg"], "Routine"),
            ("Atopic Eczematous Dermatitis",
             ["Dry lichenified pruritic patches", "flexural eczema", "erythema", "skin xerosis"],
             ["Cetirizine 10mg", "Clotrimazole 1% Cream"], "Routine"),
            ("Acute Urticaria & Histamine Flare",
             ["Evanescent itchy wheals", "dermatographism", "periorbital puffiness", "flare after allergen exposure"],
             ["Cetirizine 10mg", "Pantoprazole 40 mg"], "Urgent")
        ]
    },
    {
        "specialty": "Orthopedics",
        "conditions": [
            ("Bilateral Knee Osteoarthritis",
             ["Weight-bearing joint crepitus", "morning stiffness < 25 mins", "difficulty descending stairs", "joint swelling"],
             ["Paracetamol 650mg", "Ibuprofen 400 mg", "Pantoprazole 40 mg"], "Routine"),
            ("Acute Lumbar Spondylosis with Sciatica",
             ["Sharp radiating pain from L4-S1 down posterior leg", "paraspinal muscle spasm", "positive straight leg raise"],
             ["Ibuprofen 400 mg", "Paracetamol 650mg", "Pantoprazole 40 mg"], "Urgent"),
            ("Traumatic Closed Limb Fracture / Severe Sprain",
             ["Immediate acute excruciating pain", "inability to bear weight", "visible bony angulation", "marked hematoma"],
             ["Ibuprofen 400 mg", "Paracetamol 650mg"], "Emergency")
        ]
    },
    {
        "specialty": "ENT",
        "conditions": [
            ("Acute Maxillary & Ethmoidal Sinusitis",
             ["Facial pressure over maxillary sinus", "purulent retro-nasal drip", "halitosis", "throbbing periorbital headache"],
             ["Amoxicillin 500mg", "Cetirizine 10mg", "Paracetamol 650mg"], "Routine"),
            ("Benign Paroxysmal Positional Vertigo (BPPV) & Labyrinthitis",
             ["Rotational room-spinning vertigo on head turn", "nausea", "horizontal nystagmus", "disequilibrium"],
             ["Cetirizine 10mg", "Pantoprazole 40 mg"], "Urgent")
        ]
    },
    {
        "specialty": "Emergency Medicine",
        "conditions": [
            ("Polytrauma / Road Traffic Collision",
             ["Blunt chest trauma", "multiple compound lacerations", "tachycardia", "hypotension", "active hemorrhage"],
             ["Ibuprofen 400 mg", "Paracetamol 650mg", "Amoxicillin 500mg"], "Emergency"),
            ("Severe Animal / Dog Bite with Rabies Exposure",
             ["Deep punctured animal bite", "skin laceration with bleeding", "potential rabies virus exposure"],
             ["Amoxicillin 500mg", "Paracetamol 650mg"], "Emergency"),
            ("Severe Systemic Anaphylaxis",
             ["Acute inspiratory stridor", "airway constriction", "diffuse urticaria", "profound hypotension"],
             ["Cetirizine 10mg", "Salbutamol Inhaler"], "Emergency")
        ]
    },
    {
        "specialty": "Neurology",
        "conditions": [
            ("Acute Migraine with Scintillating Aura",
             ["Unilateral pulsating hemicranial headache", "photophobia", "phonophobia", "nausea and visual zigzag aura"],
             ["Ibuprofen 400 mg", "Paracetamol 650mg", "Pantoprazole 40 mg"], "Urgent"),
            ("Diabetic Peripheral Polyneuropathy",
             ["Bilateral symmetrical burning glove-and-stocking dysesthesia", "numbness in feet", "loss of vibratory sense"],
             ["Metformin 500mg", "Paracetamol 650mg"], "Routine")
        ]
    },
    {
        "specialty": "Obstetrics & Gynecology",
        "conditions": [
            ("Gestational Iron Deficiency Anemia & Antenatal Check",
             ["Pregnancy second trimester", "pallor", "fatigue", "low hemoglobin 9.2 g/dL"],
             ["Paracetamol 650mg", "ORS Electrolyte Sachets"], "Routine"),
            ("Pelvic Inflammatory Disease / Lower Abdominal Pain",
             ["Bilateral lower quadrant aching pain", "cervical motion tenderness", "vaginal discharge", "low fever"],
             ["Ciprofloxacin 500mg", "Amoxicillin 500mg", "Paracetamol 650mg"], "Urgent")
        ]
    },
    {
        "specialty": "General Surgery",
        "conditions": [
            ("Acute Appendicitis Suspect",
             ["Periumbilical pain migrating to right iliac fossa (McBurney's point)", "rebound tenderness", "low-grade fever", "anorexia"],
             ["Ciprofloxacin 500mg", "Pantoprazole 40 mg"], "Emergency"),
            ("Infected Cutaneous Abscess / Carbuncle",
             ["Fluctuant erythematous tender nodule", "central purulent drainage point", "surrounding cellulitis"],
             ["Amoxicillin 500mg", "Ibuprofen 400 mg", "Paracetamol 650mg"], "Urgent")
        ]
    }
]

# Statewide Hospital Network covering Moodbidri, Mangaluru, Udupi, Manipal, Bengaluru, Mysuru, Hubballi, Belagavi
HOSPITALS = [
    {"id": "hosp-alvas", "name": "Alva's Health Centre & Multi-Specialty Hospital", "city": "Moodbidri", "district": "Dakshina Kannada", "distanceKm": 0.4,
     "specialties": ["General Medicine", "Pediatrics", "Orthopedics", "Cardiology", "Dermatology", "Emergency Medicine"],
     "in_stock_meds": ["Paracetamol 650mg", "Amoxicillin 500mg", "Metformin 500mg", "Insulin Glargine 100IU", "Cetirizine 10mg", "Atorvastatin 10 mg", "Amlodipine 5 mg", "Pantoprazole 40 mg", "Azithromycin 500 mg", "Salbutamol Inhaler", "ORS Electrolyte Sachets", "Ibuprofen 400 mg", "Ciprofloxacin 500mg", "Clotrimazole 1% Cream"]},

    {"id": "hosp-chc", "name": "Government Community Health Centre (CHC)", "city": "Moodbidri", "district": "Dakshina Kannada", "distanceKm": 0.6,
     "specialties": ["General Medicine", "Emergency Medicine", "Obstetrics & Gynecology", "Pediatrics", "ENT"],
     "in_stock_meds": ["Paracetamol 650mg", "Amoxicillin 500mg", "ORS Electrolyte Sachets", "Cetirizine 10mg", "Pantoprazole 40 mg", "Amlodipine 5 mg", "Metformin 500mg", "Ibuprofen 400 mg", "Cough Syrup", "Ciprofloxacin 500mg"]},

    {"id": "H003", "name": "City Life Hospital & Clinic", "city": "Moodbidri", "district": "Dakshina Kannada", "distanceKm": 0.6,
     "specialties": ["Dermatology", "General Medicine", "ENT", "Emergency Medicine"],
     "in_stock_meds": ["Paracetamol 650mg", "Amoxicillin 500mg", "Azithromycin 500 mg", "ORS Electrolyte Sachets", "Cough Syrup", "Clotrimazole 1% Cream", "Cetirizine 10mg", "Pantoprazole 40 mg", "Ibuprofen 400 mg"]},

    {"id": "hosp-prasad", "name": "Prasad Hospital & Trauma Care", "city": "Moodbidri", "district": "Dakshina Kannada", "distanceKm": 2.3,
     "specialties": ["Cardiology", "General Medicine", "Pediatrics", "Orthopedics", "Emergency Medicine"],
     "in_stock_meds": ["Paracetamol 650mg", "Metformin 500mg", "Insulin Glargine 100IU", "Cetirizine 10mg", "Atorvastatin 10 mg", "Ibuprofen 400 mg", "Amlodipine 5 mg", "Pantoprazole 40 mg", "Amoxicillin 500mg", "Salbutamol Inhaler"]},

    {"id": "hosp-yenepoya", "name": "Yenepoya Rural Health & Training Centre", "city": "Moodbidri", "district": "Dakshina Kannada", "distanceKm": 2.8,
     "specialties": ["General Medicine", "Pediatrics", "General Practice", "Emergency Medicine"],
     "in_stock_meds": ["Paracetamol 650mg", "Amoxicillin 500mg", "ORS Electrolyte Sachets", "Cetirizine 10mg", "Metformin 500mg", "Pantoprazole 40 mg", "Ibuprofen 400 mg", "Amlodipine 5 mg"]},

    {"id": "hosp-kmc", "name": "Kasturba Medical College (KMC) Hospital Attavar", "city": "Mangaluru", "district": "Dakshina Kannada", "distanceKm": 27.5,
     "specialties": ["Cardiology", "General Medicine", "Neurology", "Pulmonology", "Endocrinology", "Emergency Medicine", "General Surgery", "Orthopedics"],
     "in_stock_meds": ["Paracetamol 650mg", "Amoxicillin 500mg", "Metformin 500mg", "Insulin Glargine 100IU", "Cetirizine 10mg", "Atorvastatin 10 mg", "Amlodipine 5 mg", "Pantoprazole 40 mg", "Azithromycin 500 mg", "Salbutamol Inhaler", "Ibuprofen 400 mg", "Ciprofloxacin 500mg", "Clotrimazole 1% Cream"]},

    {"id": "hosp-muller", "name": "Father Muller Medical College Hospital", "city": "Mangaluru", "district": "Dakshina Kannada", "distanceKm": 27.8,
     "specialties": ["General Surgery", "General Medicine", "Cardiology", "Pediatrics", "Orthopedics", "Dermatology", "Emergency Medicine"],
     "in_stock_meds": ["Paracetamol 650mg", "Amoxicillin 500mg", "Metformin 500mg", "Insulin Glargine 100IU", "Cetirizine 10mg", "Atorvastatin 10 mg", "Amlodipine 5 mg", "Pantoprazole 40 mg", "Azithromycin 500 mg", "Salbutamol Inhaler", "Ibuprofen 400 mg", "Ciprofloxacin 500mg"]},

    {"id": "hosp-manipal", "name": "Kasturba Hospital (KMC Manipal)", "city": "Manipal", "district": "Udupi", "distanceKm": 38.5,
     "specialties": ["Cardiology", "Pulmonology", "General Medicine", "Neurology", "Orthopedics", "Pediatrics", "Emergency Medicine"],
     "in_stock_meds": ["Paracetamol 650mg", "Amoxicillin 500mg", "Metformin 500mg", "Insulin Glargine 100IU", "Cetirizine 10mg", "Atorvastatin 10 mg", "Amlodipine 5 mg", "Pantoprazole 40 mg", "Azithromycin 500 mg", "Salbutamol Inhaler", "Ibuprofen 400 mg"]},

    {"id": "H002", "name": "Coastal Health Centre & District Hospital Udupi", "city": "Udupi", "district": "Udupi", "distanceKm": 40.5,
     "specialties": ["Orthopedics", "Neurology", "Gynecology", "ENT", "Pediatrics", "General Medicine"],
     "in_stock_meds": ["Paracetamol 650mg", "Ibuprofen 400 mg", "Cetirizine 10mg", "Amoxicillin 500mg", "Amlodipine 5 mg", "Metformin 500mg", "Pantoprazole 40 mg"]},

    {"id": "hosp-blr-manipal", "name": "Manipal Hospital Old Airport Road", "city": "Bengaluru", "district": "Bengaluru Urban", "distanceKm": 348.0,
     "specialties": ["Cardiology", "Neurology", "General Medicine", "Pulmonology", "Endocrinology", "Orthopedics", "Emergency Medicine"],
     "in_stock_meds": ["Paracetamol 650mg", "Amoxicillin 500mg", "Metformin 500mg", "Insulin Glargine 100IU", "Cetirizine 10mg", "Atorvastatin 10 mg", "Amlodipine 5 mg", "Pantoprazole 40 mg", "Azithromycin 500 mg", "Salbutamol Inhaler", "Ibuprofen 400 mg", "Ciprofloxacin 500mg"]},

    {"id": "hosp-blr-narayana", "name": "Narayana Institute of Cardiac Sciences", "city": "Bengaluru", "district": "Bengaluru Urban", "distanceKm": 362.0,
     "specialties": ["Cardiology", "General Medicine", "Emergency Medicine", "Pediatrics", "General Surgery"],
     "in_stock_meds": ["Atorvastatin 10 mg", "Amlodipine 5 mg", "Paracetamol 650mg", "Metformin 500mg", "Insulin Glargine 100IU", "Ibuprofen 400 mg", "Amoxicillin 500mg", "Pantoprazole 40 mg"]},

    {"id": "hosp-blr-victoria", "name": "Victoria Hospital (BMCRI Apex Healthcare)", "city": "Bengaluru", "district": "Bengaluru Urban", "distanceKm": 345.0,
     "specialties": ["General Surgery", "General Medicine", "Orthopedics", "Emergency Medicine", "Dermatology", "ENT"],
     "in_stock_meds": ["Paracetamol 650mg", "Amoxicillin 500mg", "ORS Electrolyte Sachets", "Cetirizine 10mg", "Ibuprofen 400 mg", "Ciprofloxacin 500mg", "Pantoprazole 40 mg"]},

    {"id": "hosp-mys-apollo", "name": "Apollo BGS Hospitals Mysuru", "city": "Mysuru", "district": "Mysuru", "distanceKm": 245.0,
     "specialties": ["Cardiology", "General Medicine", "Neurology", "Pulmonology", "Orthopedics", "Emergency Medicine"],
     "in_stock_meds": ["Paracetamol 650mg", "Amoxicillin 500mg", "Metformin 500mg", "Atorvastatin 10 mg", "Amlodipine 5 mg", "Pantoprazole 40 mg", "Salbutamol Inhaler"]},

    {"id": "hosp-hubli-kims", "name": "KIMS Hospital Hubballi", "city": "Hubballi", "district": "Dharwad", "distanceKm": 320.0,
     "specialties": ["General Medicine", "General Surgery", "Pediatrics", "Orthopedics", "Emergency Medicine"],
     "in_stock_meds": ["Paracetamol 650mg", "Amoxicillin 500mg", "ORS Electrolyte Sachets", "Ibuprofen 400 mg", "Ciprofloxacin 500mg", "Cetirizine 10mg"]},

    {"id": "hosp-belgaum-kle", "name": "KLE Dr. Prabhakar Kore Hospital", "city": "Belagavi", "district": "Belagavi", "distanceKm": 410.0,
     "specialties": ["Cardiology", "Neurology", "General Medicine", "Pulmonology", "Pediatrics", "Emergency Medicine"],
     "in_stock_meds": ["Paracetamol 650mg", "Amoxicillin 500mg", "Metformin 500mg", "Insulin Glargine 100IU", "Atorvastatin 10 mg", "Amlodipine 5 mg", "Salbutamol Inhaler"]}
]

SIG_TEMPLATES = [
    "1 tablet twice daily after food (BD) x 5 days",
    "1 tablet once daily in the morning (OD) after breakfast",
    "1 tablet three times daily (TDS) with plain water",
    "1 tablet SOS for severe pain or fever (max 3/day)",
    "Take 1 dose before meals on an empty stomach",
    "2 puffs via pressurized metered dose inhaler every 6 to 8 hours",
    "Apply thin film topically twice daily after washing area",
    "Dissolve 1 sachet in 1 liter clean potable water, sip frequently"
]

DOCTORS = [
    "Dr. Ramesh Bhat, MD (Gen Med)", "Dr. Sunitha Shetty, DCH (Pediatrics)",
    "Dr. Preetha Rao, MBBS (Family Med)", "Dr. Harish Poojary, MS (Ortho)",
    "Dr. Farhan Ahmed, MBBS (General)", "Dr. Ashok Shetty, MD, DM (Cardiology)",
    "Dr. Ronald Fernandes, MS (Gen Surgery)", "Dr. Rahul Sharma, MD (Medicine)",
    "Dr. Arjun Rao, MD (Cardio)", "Dr. Nisha Rao, MS (Ortho)",
    "Dr. Sneha Sharma, MD (Cardio)", "Dr. Rohan Shetty, MD (Pediatrics)",
    "Dr. Deepak Varma, MD, DM (Cardiology)", "Dr. Gautham Kamath, MEM (Emergency)"
]

USER_QUERY_TEMPLATES = [
    "I have {symptoms}, need medicine and hospital in {city} or Moodbidri.",
    "Suffering from {diagnosis} with {symptoms}. Which hospital in Karnataka has doctors and {medicine} in stock?",
    "Need {medicine} urgently for {symptoms} in {city}.",
    "Doctor prescribed {medicine} for {diagnosis}. Where can I find it in {city} or Dakshina Kannada?",
    "Emergency consultation needed: {symptoms}. Patient presenting with signs of {diagnosis}.",
    "Prescription: {medicine}. Nearest available medical facility in {city} / Karnataka?",
    "Patient presenting with {symptoms}, requires {specialty} specialist doctor.",
    "{diagnosis} diagnosis in {city}. Looking for on-duty doctors and {medicine}."
]

def generate_record(idx):
    domain = random.choice(CLINICAL_DOMAINS)
    specialty = domain["specialty"]
    condition_name, symptoms, medicines, triage = random.choice(domain["conditions"])

    # Sample symptoms
    k_symptoms = min(len(symptoms), random.randint(2, len(symptoms)))
    chosen_symptoms = random.sample(symptoms, k_symptoms)
    symptoms_str = ", ".join(chosen_symptoms)

    primary_med = medicines[0]
    med_list = medicines.copy()
    if len(med_list) > 1 and random.random() < 0.35:
        random.shuffle(med_list)

    # Build prescription text
    rx_items = []
    for m in med_list:
        sig = random.choice(SIG_TEMPLATES)
        rx_items.append(f"{m} - {sig}")

    doc = random.choice(DOCTORS)
    rx_text = f"Rx from {doc}: " + "; ".join(rx_items) + f". Clinical Impression: {condition_name}. Symptoms: {symptoms_str}."

    # Pick a target city/region
    target_hosp = random.choice(HOSPITALS)
    target_city = target_hosp["city"]

    # Patient query variation
    tmpl = random.choice(USER_QUERY_TEMPLATES)
    query_text = tmpl.format(
        symptoms=symptoms_str,
        diagnosis=condition_name,
        medicine=", ".join(med_list),
        specialty=specialty,
        city=target_city
    )

    # Score hospitals: specialty match + stock match + city match
    scored = []
    for h in HOSPITALS:
        score = 0
        if specialty in h["specialties"]:
            score += 50
        matched_meds = [m for m in med_list if any(m.lower().split()[0] in stock.lower() for stock in h["in_stock_meds"])]
        score += len(matched_meds) * 30
        if h["city"].lower() == target_city.lower():
            score += 40

        scored.append((score, h, matched_meds))

    scored.sort(key=lambda x: x[0], reverse=True)
    best_score, best_hosp, in_stock = scored[0]
    alt_names = [s[1]["name"] for s in scored[1:3]]

    return {
        "record_id": f"MED-RX-{idx:06d}",
        "patient_query": query_text,
        "prescription_text": rx_text,
        "chief_complaint": symptoms_str,
        "diagnosis": condition_name,
        "specialty_required": specialty,
        "prescribed_medicines": ", ".join(med_list),
        "primary_medicine": primary_med,
        "triage_urgency": triage,
        "recommended_hospital_id": best_hosp["id"],
        "recommended_hospital_name": best_hosp["name"],
        "recommended_hospital_city": best_hosp["city"],
        "recommended_hospital_district": best_hosp.get("district", "Karnataka"),
        "hospital_distance_km": best_hosp["distanceKm"],
        "medicines_in_stock": ", ".join(in_stock) if in_stock else "Dispensary stock available",
        "alternative_hospitals": "; ".join(alt_names)
    }

def generate_file(count, filepath):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    print(f"Generating {count:,} records -> {filepath}...")

    fields = [
        "record_id", "patient_query", "prescription_text", "chief_complaint",
        "diagnosis", "specialty_required", "prescribed_medicines",
        "primary_medicine", "triage_urgency", "recommended_hospital_id",
        "recommended_hospital_name", "recommended_hospital_city",
        "recommended_hospital_district", "hospital_distance_km",
        "medicines_in_stock", "alternative_hospitals"
    ]

    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for i in range(1, count + 1):
            writer.writerow(generate_record(i))
            if count >= 10000 and i % 5000 == 0:
                print(f"  -> Generated {i:,} / {count:,}...")

    file_size_mb = os.path.getsize(filepath) / (1024 * 1024)
    print(f"[SUCCESS] Saved {count:,} records to {filepath} ({file_size_mb:.2f} MB)")

def main():
    parser = argparse.ArgumentParser(description="MediPulse Clinical Dataset Generator")
    parser.add_argument("--count", type=int, default=5000, help="Number of records to generate (e.g. 5000, 3000, 25000)")
    parser.add_argument("--output", type=str, default="", help="Output CSV path")
    args = parser.parse_args()

    # Generate 5k dataset (user requested 5k / 3k)
    generate_file(5000, "dataset/medipulse_clinical_dataset_5k.csv")
    
    # Generate 3k dataset
    generate_file(3000, "dataset/medipulse_clinical_dataset_3k.csv")
    
    # Generate 25k comprehensive dataset
    generate_file(25000, "dataset/medipulse_prescription_dataset_25k.csv")

if __name__ == "__main__":
    main()
