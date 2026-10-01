# 🏥 MediPulse — Real-Time Healthcare Availability Platform

> **"Know before you go — turn a wasted trip into a confirmed one."**

MediPulse is a real-time healthcare availability platform engineered for semi-urban and rural patients across South India, including elderly and low-literacy users. It allows patients to check — before ever leaving home — whether a doctor is on duty, an essential medicine is in stock, or a vaccine dose is available at nearby health facilities.

---

## 🌟 Key Highlights

- **10 South Asian Languages with RTL:** Real i18n engine with natural phrasing in English, Kannada, Tulu (Kannada script), Hindi, Telugu, Tamil, Malayalam, Marathi, Bengali, and **Urdu (with full Right-to-Left layout mirroring)**.
- **Voice Search with Web Speech API:** Automatically switches recognition locale (`kn-IN`, `ta-IN`, `te-IN`, `ur-IN`, etc.) to match selected language, with expanding ring audio feedback.
- **Prescription OCR Scanner:** Instant handwriting recognition simulation extracting medicines directly into live searches.
- **Leaflet.js + CartoDB Voyager Map:** Centered in Moodbidri, Karnataka (`13.0733° N, 74.9958° E`) with custom SVG teardrop pins, nearest facility pulse ring, bidirectional map-card synchronization, and an incrementally growing dashed route polyline.
- **Interactive Reservation Flow:** Morphing button flow (button width → spinner → character-by-character token typing) with SMS/WhatsApp confirmation banner.
- **Telemedicine Fallback:** Immediate video consultation trigger when a specialist is off-duty.
- **Hospital Admin Desk Portal (Page 2):** Staff authentication with shake-on-error animation, doctor duty toggling with row pulse flash, medicine stock controls with low-stock color warning states, vaccine cold-chain monitoring, and real-time public synchronization.

---

## 🎨 Design System

| Token | Hex | Usage Context |
| :--- | :--- | :--- |
| `--ink` | `#12312E` | Deep teal-forest: sticky header, text headlines, map banner, primary buttons |
| `--paper` | `#FAF6EF` | Warm parchment page background, accordion tables, and dropzone |
| `--sage` | `#6B8F71` | Muted green: route polyline, icons, secondary pills, confirmed booking states |
| `--pulse` | `#E8622C` | **Coral-amber (RESERVED ONLY):** Live status ripple dot, EKG line, and Reserve button |
| `--slate` | `#46524F` | Body typography and descriptive labels |
| `--line` | `#DDD5C7` | Hairline borders, dividers, and card outlines |
| `--danger-soft` | `#C4453A` | Low stock, off-duty doctors, and unavailable vaccine states (static stillness) |
| `--white` | `#FFFFFF` | Facility cards, popups, and elevated inputs |

### Typography
- **Headlines (H1, H2):** [Fraunces](https://fonts.google.com/specimen/Fraunces) (400, 600, negative letter spacing)
- **UI & Body:** [Inter](https://fonts.google.com/specimen/Inter) layered with **Google Noto Sans** variants (Noto Sans Devanagari, Kannada, Tamil, Telugu, Malayalam, Bengali, Arabic).
- Automatic **+10% line-height breathing room** applied for Indic and Urdu scripts.

---

## 📂 Architecture

```
├── index.html         # Page 1: Public Patient Portal (Web Speech, Leaflet, OCR)
├── admin.html         # Page 2: Hospital Staff Admin Dashboard
├── css/
│   └── style.css      # Design tokens, responsive grid, 12 animations, RTL rules
├── js/
│   ├── i18n.js        # 10-language translation dictionary & Web Speech mapping
│   ├── data.js        # Moodbidri health facilities mock store & live event bus
│   └── app.js         # Leaflet map, polyline route, voice search, OCR & reservations
├── backend/           # Production-Grade Spring Boot 3.3 Modular Monolith
│   ├── pom.xml        # Maven build (Java 21, Spring Boot 3.3.4, Resilience4j, Caffeine)
│   ├── src/main/java/com/medipulse/
│   │   ├── availability/  # Freshness-Weighted Ranking Algorithm + Search
│   │   ├── booking/       # Optimistic Locking (@Version) + Outbox Writer
│   │   ├── notification/  # Transactional Outbox Poller + Resilience4j Circuit Breaker
│   │   ├── admin/         # Hospital Staff Portal + Decoupled Event Listeners
│   │   ├── ocr/           # Prescription OCR with Circuit Breaker
│   │   ├── realtime/      # Spring WebSocket + STOMP Live Availability Broadcast
│   │   └── common/        # Haversine distance, Security, JWT, Error Handling
│   └── src/main/resources/
│       ├── application.yml
│       ├── db/migration/  # Flyway V1 schema & V2 realistic Moodbidri seed data
│       └── static/ws-test.html # Built-in WebSocket tester
└── README.md
```

---

## 🚀 Running Locally

### 1. Frontend (Static Web Portal)
You can run MediPulse using any standard static file server or Python:

```bash
# Using Python 3
python -m http.server 3000

# Or using Node.js npx serve
npx serve -l 3000
```

Open your browser at:
- **Patient Portal (Page 1):** [http://localhost:3000/](http://localhost:3000/)
- **Staff Admin Portal (Page 2):** [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

### 2. Backend (Spring Boot 3.3.4 Modular Monolith)
Navigate to the `backend/` directory:

```bash
cd backend

# Option A: Run with local MySQL 8.0 (Flyway auto-migrates V1 schema + V2 seed data)
mvn clean spring-boot:run

# Option B: Run with zero-setup In-Memory H2 Mode
mvn clean spring-boot:run -Dspring-boot.run.profiles=test

# Run full test suite (Concurrency test, Ranking proof, Cache eviction, Circuit breakers)
mvn test
```

- **Backend REST API:** [http://localhost:8080/api/search](http://localhost:8080/api/search)
- **Live WebSocket Test Page:** [http://localhost:8080/ws-test.html](http://localhost:8080/ws-test.html)

### Hospital Staff Demo Credentials
- **Frontend Demo:** Staff ID: `admin` | PIN: `medipulse2025`
- **Backend JWT Auth:**
  - Alva's Health Centre: `alvas_admin` / `admin123`
  - Government CHC Moodbidri: `chc_admin` / `admin123`
  - Prasad Hospital: `prasad_admin` / `admin123`
  - Super Admin: `super_admin` / `admin123`

---

## 📜 License
MIT License. Aligned with Ayushman Bharat Digital Mission (ABDM) standards.
