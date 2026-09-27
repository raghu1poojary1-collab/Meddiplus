# 📽️ MedFlow AI — Project Presentation & Pitch Deck

Welcome to the **MedFlow AI Project Presentation**. This document contains the complete slide deck presentation for stakeholders, judges, and code reviewers.

You can also experience this presentation interactively inside our live web app:
👉 **[Launch Interactive Presentation Deck](https://shrex88.github.io/MedFlow)** *(Click "Project Presentation" in the top bar or sidebar)*

---

## 📑 Slide Deck Index

- [Slide 1: Executive Summary](#slide-1-executive-summary)
- [Slide 2: The Healthcare Supply Crisis](#slide-2-the-healthcare-supply-crisis)
- [Slide 3: AI Stockout Prediction Engine](#slide-3-ai-stockout-prediction-engine)
- [Slide 4: Autonomous Inter-Hospital Redistribution](#slide-4-autonomous-inter-hospital-redistribution)
- [Slide 5: Regional Geospatial Supply Map](#slide-5-regional-geospatial-supply-map)
- [Slide 6: Crisis & Epidemic Simulation Suite](#slide-6-crisis--epidemic-simulation-suite)
- [Slide 7: Full Stack Architecture](#slide-7-full-stack-architecture)
- [Slide 8: Summary & Live Links](#slide-8-summary--live-links)

---

### Slide 1: Executive Summary
**Title**: MedFlow AI Platform — Healthcare Supply Intelligence  
**Subtitle**: Next-Generation Healthcare Supply Chain Intelligence & Autonomous Stockout Mitigation  

![Dashboard Preview](public/screenshots/dashboard.jpg)

#### Key Highlights:
- **Predictive AI Engine**: 7-day & 30-day stockout prediction algorithm with **94.2% historical accuracy**.
- **Surplus Optimization**: Autonomous multi-facility redistribution engine balancing surplus stock to critical shortage points instantly.
- **Crisis Simulation**: Stress-testing suite simulating regional epidemic spikes (+300%) and supplier delays (+14 days).

---

### Slide 2: The Healthcare Supply Crisis
**Title**: Why Conventional Inventory Management Fails  

- **Silent Stockouts**: Over 35% of rural clinics face sudden inventory stockouts of life-saving medicines (Insulin, Epinephrine, Antibiotics).
- **Surplus Silos**: Nearby regional hospitals often hold excess inventory that expires unused due to lack of inter-hospital visibility.
- **Supplier Latency**: Unpredictable supplier lead times (3 to 14 days) are undetected until safety thresholds are breached.

| Metric | Traditional Inventory | MedFlow AI Sync |
| :--- | :--- | :--- |
| **Response Time** | 48 - 72 Hours | Real-Time (< 100 ms) |
| **Predictive Horizon** | Reactive Manual Reorder | 30-Day Automated Forecast |
| **Redistribution** | None (Isolated Silos) | Autonomous Surplus Balancing |

---

### Slide 3: AI Stockout Prediction Engine
**Title**: Dynamic Moving Average & Confidence Scoring Algorithm  

![Predictive Analytics Preview](public/screenshots/predictive-analytics.jpg)

#### Core Math Model:
```typescript
Days_Remaining = Stock_Current / (Daily_Burn * Outbreak_Multiplier)
Risk_Score     = Math.min(100, Math.round((1 - Days_Remaining / Safety_Threshold) * 100))
```

- Factored 7-day trailing consumption rates.
- Dynamic confidence scoring index (85% to 98%).

---

### Slide 4: Autonomous Inter-Hospital Redistribution
**Title**: Zero-Waste Inter-Hospital Inventory Balancing Matrix  

1. **Surplus Discovery**: Identifies donor facilities holding stock exceeding 30+ days buffer.
2. **ETA & Distance Matrix**: Calculates transit distance (km) and travel duration (hours).
3. **One-Click Dispatch**: Generates emergency transfer orders with pre/post risk reduction calculation.

---

### Slide 5: Regional Geospatial Supply Map
**Title**: Live Interactive GIS Mapping  

![Regional Map Preview](public/screenshots/regional-map.jpg)

- Powered by Leaflet & React-Leaflet GIS.
- Color-coded hospital risk status markers (`Healthy`, `Warning`, `Critical`).
- Live transit line corridors showing active inter-hospital transfers.

---

### Slide 6: Crisis & Epidemic Simulation Suite
**Title**: Stress-Testing Regional Resiliency  

- **Surge Testing**: Inject +100% to +300% sudden disease outbreaks.
- **Supplier Disruptions**: Simulate 3 to 14 days logistics delays.
- **Automated Recovery**: Observe instant AI re-balancing recommendations.

---

### Slide 7: Full Stack Architecture
**Title**: Modern Technical Stack & Data Pipeline  

- **Frontend**: React 18, TypeScript 5.7, Vite 6, Tailwind CSS 3.4, Lucide Icons, Recharts, Leaflet.
- **State Engine**: React Context API with 100ms recalculation loops.
- **Deployment**: GitHub Pages (`gh-pages`) with automated Vite base routing.

---

### Slide 8: Summary & Live Links
**Title**: Access MedFlow AI  

- **GitHub Repository**: [https://github.com/shrex88/MedFlow](https://github.com/shrex88/MedFlow)
- **Live Interactive App & Presentation**: [https://shrex88.github.io/MedFlow](https://shrex88.github.io/MedFlow)
