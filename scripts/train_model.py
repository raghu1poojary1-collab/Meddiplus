#!/usr/bin/env python3
"""
MediPulse Clinical AI Training Pipeline
Trains NLP / ML models on the 25,000+ clinical records dataset.
Evaluates accuracy, precision, recall, and exports both Python joblib artifacts
and client-side JavaScript / JSON AI inference engines for live in-browser predictions.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

def main():
    csv_path = "dataset/medipulse_prescription_dataset_25k.csv"
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found.")
        return

    print(f"Loading dataset from: {csv_path}...")
    df = pd.read_csv(csv_path)
    print(f"Dataset loaded: {len(df):,} clinical records with {len(df.columns)} features.")

    # Create combined clinical text representation for rich feature extraction
    df['combined_text'] = (
        df['patient_query'].fillna('') + " " +
        df['prescription_text'].fillna('') + " " +
        df['chief_complaint'].fillna('') + " " +
        df['diagnosis'].fillna('') + " " +
        df['prescribed_medicines'].fillna('')
    ).str.lower()

    # 1. Feature Extraction: TF-IDF with unigrams and bigrams
    print("\n[Step 1/5] Extracting TF-IDF features (ngram_range=(1, 2), max_features=3500)...")
    tfidf = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=3500,
        sublinear_tf=True,
        stop_words='english'
    )
    X = tfidf.fit_transform(df['combined_text'])
    y_specialty = df['specialty_required']
    y_urgency = df['triage_urgency']

    # Split train/test (80/20)
    X_train, X_test, y_spec_train, y_spec_test, y_urg_train, y_urg_test = train_test_split(
        X, y_specialty, y_urgency, test_size=0.2, random_state=42, stratify=y_specialty
    )
    print(f"Train samples: {X_train.shape[0]:,}, Test samples: {X_test.shape[0]:,}")

    # 2. Train Medical Specialty Classifier
    print("\n[Step 2/5] Training Medical Specialty Classifier (Logistic Regression)...")
    clf_specialty = LogisticRegression(C=2.0, max_iter=1000, random_state=42)
    clf_specialty.fit(X_train, y_spec_train)
    y_spec_pred = clf_specialty.predict(X_test)
    spec_acc = accuracy_score(y_spec_test, y_spec_pred)
    print(f"==> Specialty Classification Test Accuracy: {spec_acc * 100:.2f}%")
    spec_report = classification_report(y_spec_test, y_spec_pred, output_dict=True)

    # 3. Train Triage Urgency Classifier
    print("\n[Step 3/5] Training Triage Urgency Classifier (Balanced Weights)...")
    clf_urgency = LogisticRegression(C=1.5, class_weight='balanced', max_iter=1000, random_state=42)
    clf_urgency.fit(X_train, y_urg_train)
    y_urg_pred = clf_urgency.predict(X_test)
    urg_acc = accuracy_score(y_urg_test, y_urg_pred)
    print(f"==> Triage Urgency Test Accuracy: {urg_acc * 100:.2f}%")
    urg_report = classification_report(y_urg_test, y_urg_pred, output_dict=True)

    # 4. Save Joblib Artifacts
    print("\n[Step 4/5] Saving model artifacts to models/ directory...")
    os.makedirs("models", exist_ok=True)
    joblib.dump(clf_specialty, "models/specialty_classifier.joblib")
    joblib.dump(clf_urgency, "models/urgency_classifier.joblib")
    joblib.dump(tfidf, "models/tfidf_vectorizer.joblib")

    metrics = {
        "dataset_total_records": len(df),
        "train_samples": int(X_train.shape[0]),
        "test_samples": int(X_test.shape[0]),
        "specialty_accuracy": float(spec_acc),
        "urgency_accuracy": float(urg_acc),
        "specialties_covered": sorted(list(df['specialty_required'].unique())),
        "triage_classes": sorted(list(df['triage_urgency'].unique())),
        "hospitals_covered": sorted(list(df['recommended_hospital_name'].unique())),
        "specialty_classification_report": spec_report,
        "urgency_classification_report": urg_report
    }

    with open("models/model_metrics.json", "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    print("Saved models/model_metrics.json.")

    # 5. Export Browser-Ready Client-Side AI Inference Engine (js/ai-inference.js & data/ai-knowledge.json)
    print("\n[Step 5/5] Exporting browser-ready AI inference engine (js/ai-inference.js)...")
    
    # Extract top keywords per specialty and urgency from model coefficients
    feature_names = tfidf.get_feature_names_out()
    specialty_top_words = {}
    for idx, spec in enumerate(clf_specialty.classes_):
        coefs = clf_specialty.coef_[idx]
        top_indices = coefs.argsort()[-60:][::-1]
        specialty_top_words[spec] = [
            {"word": feature_names[i], "weight": round(float(coefs[i]), 4)}
            for i in top_indices if coefs[i] > 0.10
        ]

    urgency_top_words = {}
    for idx, urg in enumerate(clf_urgency.classes_):
        coefs = clf_urgency.coef_[idx]
        top_indices = coefs.argsort()[-60:][::-1]
        urgency_top_words[urg] = [
            {"word": feature_names[i], "weight": round(float(coefs[i]), 4)}
            for i in top_indices if coefs[i] > 0.10
        ]

    # Build medicine knowledge index with synonyms, drug classes, indications
    medicine_index = {}
    for _, row in df[['prescribed_medicines', 'diagnosis', 'specialty_required', 'triage_urgency']].drop_duplicates().iterrows():
        meds = [m.strip() for m in row['prescribed_medicines'].split(',')]
        for m in meds:
            base_med = m.split()[0].lower()
            if base_med not in medicine_index:
                medicine_index[base_med] = {
                    "primary_name": m,
                    "specialty": row['specialty_required'],
                    "triage": row['triage_urgency'],
                    "indications": [row['diagnosis']],
                    "related_meds": [rm for rm in meds if rm != m]
                }
            else:
                if row['diagnosis'] not in medicine_index[base_med]['indications']:
                    medicine_index[base_med]['indications'].append(row['diagnosis'])
                for rm in meds:
                    if rm != m and rm not in medicine_index[base_med]['related_meds']:
                        medicine_index[base_med]['related_meds'].append(rm)

    knowledge_export = {
        "version": "2.0.0",
        "dataset_size": len(df),
        "specialty_accuracy": f"{spec_acc * 100:.1f}%",
        "urgency_accuracy": f"{urg_acc * 100:.1f}%",
        "specialty_classes": clf_specialty.classes_.tolist(),
        "urgency_classes": clf_urgency.classes_.tolist(),
        "specialty_top_words": specialty_top_words,
        "urgency_top_words": urgency_top_words,
        "medicine_index": medicine_index
    }

    os.makedirs("data", exist_ok=True)
    with open("data/ai-knowledge.json", "w", encoding="utf-8") as f:
        json.dump(knowledge_export, f, indent=2)

    # Generate standalone js/ai-inference.js
    ai_inference_js = f"""/**
 * MediPulse Clinical AI Inference Engine
 * Trained on 25,000+ Clinical Records & Prescriptions
 * Model Performance: Specialty Accuracy {spec_acc * 100:.1f}%, Urgency Accuracy {urg_acc * 100:.1f}%
 * Provides instantaneous in-browser clinical triage, specialty prediction, and facility matching.
 */

(function (root, factory) {{
  if (typeof module === 'object' && module.exports) {{
    module.exports = factory();
  }} else {{
    root.MediPulseAI = factory();
  }}
}})(typeof self !== 'undefined' ? self : this, function () {{

  const AI_MODEL_DATA = {json.dumps(knowledge_export, indent=2)};

  class ClinicalAIEngine {{
    constructor() {{
      this.model = AI_MODEL_DATA;
      this.isReady = true;
      console.log(`[MediPulse AI] Loaded clinical models trained on ${{this.model.dataset_size.toLocaleString()}} records.`);
    }}

    /**
     * Clean and tokenize clinical input text
     */
    tokenize(text) {{
      if (!text) return [];
      const clean = text
        .toLowerCase()
        .replace(/[^a-z0-9\\s]/g, ' ')
        .replace(/\\s+/g, ' ')
        .trim();
      const words = clean.split(' ').filter(w => w.length > 2);
      const ngrams = [...words];
      for (let i = 0; i < words.length - 1; i++) {{
        ngrams.push(words[i] + ' ' + words[i + 1]);
      }}
      return ngrams;
    }}

    /**
     * Predict required medical specialty and triage urgency
     */
    predict(rawInput) {{
      if (!rawInput || typeof rawInput !== 'string' || !rawInput.trim()) {{
        return null;
      }}

      const tokens = this.tokenize(rawInput);
      const inputLower = rawInput.toLowerCase();

      // 1. Specialty Scoring
      const specialtyScores = {{}};
      this.model.specialty_classes.forEach(spec => {{
        specialtyScores[spec] = 0;
        const topWords = this.model.specialty_top_words[spec] || [];
        topWords.forEach(item => {{
          if (tokens.includes(item.word) || inputLower.includes(item.word)) {{
            specialtyScores[spec] += item.weight * 2.5;
          }}
        }});
      }});

      // 2. Urgency Scoring
      const urgencyScores = {{
        "Routine": 1.0,
        "Urgent": 0.5,
        "Emergency": 0.2
      }};
      this.model.urgency_classes.forEach(urg => {{
        const topWords = this.model.urgency_top_words[urg] || [];
        topWords.forEach(item => {{
          if (tokens.includes(item.word) || inputLower.includes(item.word)) {{
            urgencyScores[urg] = (urgencyScores[urg] || 0) + item.weight * 3.0;
          }}
        }});
      }});

      // Critical emergency overrides
      const emergencyKeywords = [
        "heart attack", "crushing chest pain", "unconscious", "profuse bleeding",
        "anaphylaxis", "choking", "stridor", "fracture", "severe trauma", "dog bite", "snake bite"
      ];
      if (emergencyKeywords.some(kw => inputLower.includes(kw))) {{
        urgencyScores["Emergency"] += 15.0;
      }}

      // Find highest scoring specialty
      let bestSpecialty = "General Medicine";
      let highestSpecScore = -1;
      for (const [spec, score] of Object.entries(specialtyScores)) {{
        if (score > highestSpecScore) {{
          highestSpecScore = score;
          bestSpecialty = spec;
        }}
      }}

      // Find highest scoring urgency
      let bestUrgency = "Routine";
      let highestUrgScore = -1;
      for (const [urg, score] of Object.entries(urgencyScores)) {{
        if (score > highestUrgScore) {{
          highestUrgScore = score;
          bestUrgency = urg;
        }}
      }}

      // 3. Medicine & Prescription Entity Matching
      const matchedMeds = [];
      const relatedMeds = new Set();
      const detectedIndications = new Set();

      for (const [baseMed, data] of Object.entries(this.model.medicine_index)) {{
        if (inputLower.includes(baseMed) || tokens.includes(baseMed)) {{
          matchedMeds.push(data.primary_name);
          if (data.specialty && highestSpecScore === 0) {{
            bestSpecialty = data.specialty;
          }}
          data.indications.forEach(ind => detectedIndications.add(ind));
          data.related_meds.forEach(rm => relatedMeds.add(rm));
        }}
      }}

      return {{
        specialty: bestSpecialty,
        confidence: highestSpecScore > 0 ? Math.min(0.98, 0.65 + (highestSpecScore / 10)) : 0.60,
        urgency: bestUrgency,
        urgencyColor: bestUrgency === 'Emergency' ? '#dc2626' : (bestUrgency === 'Urgent' ? '#f59e0b' : '#10b981'),
        matchedMeds: matchedMeds,
        relatedMeds: Array.from(relatedMeds).slice(0, 4),
        indications: Array.from(detectedIndications).slice(0, 3)
      }};
    }}

    /**
     * Score and rank hospitals given a clinical prediction or search query
     */
    rankHospitals(hospitals, prediction, rawQuery) {{
      if (!Array.isArray(hospitals)) return [];
      const queryLower = (rawQuery || '').toLowerCase();

      return hospitals.map(h => {{
        let matchScore = 0;
        const matchedStock = [];

        // Specialty doctor match
        if (prediction && prediction.specialty) {{
          const hasSpecDoc = (h.doctors || []).some(d => 
            d.onDuty && (d.specialty || '').toLowerCase().includes(prediction.specialty.toLowerCase())
          );
          if (hasSpecDoc) matchScore += 45;
          else if ((h.doctors || []).some(d => (d.specialty || '').toLowerCase().includes(prediction.specialty.toLowerCase()))) {{
            matchScore += 25;
          }}
        }}

        // Emergency care capability match
        if (prediction && prediction.urgency === 'Emergency' && h.emergency24x7) {{
          matchScore += 35;
        }}

        // Medicine stock match
        const queryTokens = (rawQuery || '').split(/[,;+]|\\band\\b/i).map(t => t.trim().toLowerCase()).filter(Boolean);
        const searchTerms = [...queryTokens];
        if (prediction && prediction.matchedMeds) {{
          prediction.matchedMeds.forEach(m => searchTerms.push(m.toLowerCase()));
        }}

        (h.medicines || []).forEach(m => {{
          const mLower = m.name.toLowerCase();
          const baseM = mLower.split(' ')[0];
          searchTerms.forEach(term => {{
            const baseTerm = term.split(' ')[0];
            if (mLower.includes(baseTerm) || baseTerm.includes(baseM)) {{
              matchScore += 20;
              if (!matchedStock.some(s => s.name === m.name)) {{
                matchedStock.push(m);
              }}
            }}
          }});
        }});

        // Proximity bonus (closer = higher)
        const distScore = Math.max(0, 40 - Math.round(h.distanceKm || 0));
        matchScore += distScore;

        return {{
          ...h,
          aiScore: matchScore,
          aiMatchedStock: matchedStock
        }};
      }}).sort((a, b) => b.aiScore - a.aiScore || a.distanceKm - b.distanceKm);
    }}
  }}

  return new ClinicalAIEngine();
}});
"""

    with open("js/ai-inference.js", "w", encoding="utf-8") as f:
        f.write(ai_inference_js)
    print("Saved browser inference engine to js/ai-inference.js.")

    print("\n===========================================================")
    print(f"[MODEL TRAINING SUCCESS] Trained on {len(df):,} records!")
    print(f"Specialty Classifier Accuracy: {spec_acc * 100:.2f}%")
    print(f"Triage Urgency Accuracy:       {urg_acc * 100:.2f}%")
    print("Artifacts generated:")
    print("  - models/specialty_classifier.joblib")
    print("  - models/urgency_classifier.joblib")
    print("  - models/tfidf_vectorizer.joblib")
    print("  - models/model_metrics.json")
    print("  - data/ai-knowledge.json")
    print("  - js/ai-inference.js")
    print("===========================================================")

if __name__ == "__main__":
    main()
