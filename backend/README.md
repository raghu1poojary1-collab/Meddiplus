# 🏥 MediPulse Backend — Production-Grade Real-Time Healthcare Platform

> **"Know before you go — turn a wasted trip into a confirmed one."**

MediPulse is a high-reliability, real-time healthcare availability and booking backend built with **Java 21**, **Spring Boot 3.3.4**, **Spring Data JPA**, **Spring Security**, and **MySQL 8.0**. It is engineered specifically for semi-urban and rural healthcare networks across South India (centered on Moodbidri and Mangaluru, Karnataka).

---

## 🌟 Architectural Differentiators (Viva & Defense Points)

### 1. Freshness-Weighted Ranking Algorithm
Traditional healthcare directories sort purely by physical distance. In rural healthcare, distance without freshness is dangerous: a clinic 500 meters away with unverified data from 6 hours ago frequently leads to a wasted trip, while a facility 2.5 km away whose stock was verified 90 seconds ago is safe and trustworthy.

MediPulse implements a mathematical scoring model:

$$\text{Score} = \left(\frac{1}{1 + \text{Distance}_{\text{km}}}\right) \times W_{\text{distance}} + \left(\frac{1}{1 + \text{Minutes}_{\text{since\_update}}}\right) \times W_{\text{freshness}}$$

- **Configurable Weights**: Defaults to $W_{\text{distance}} = 0.6$ and $W_{\text{freshness}} = 0.4$, adjustable via `application.yml`.
- **Monotonic Trust Ordering**: Results are sorted descending by this composite score.
- **Viva Defense**: Demonstrates understanding of domain-specific data reliability over naive Euclidean sorting.

---

### 2. Optimistic Locking (Zero Row Deadlocks)
Rather than locking rows with database-level pessimistic locks (`SELECT FOR UPDATE`), entities (`Medicine`, `Vaccine`, `Doctor`) utilize JPA's `@Version` field.

- **Non-blocking concurrency**: Under high concurrent load (e.g. 20 patients attempting to book the final vaccine dose or insulin vial), exactly one transaction succeeds.
- **Immediate Graceful Fallbacks**: The remaining concurrent transactions fail fast with `OptimisticLockingFailureException` and are returned an **HTTP 409 Conflict** containing a list of **alternative nearby hospitals** offering the same resource, ranked by the Freshness-Weighted algorithm.

---

### 3. Transactional Outbox Pattern (Guaranteed Notifications)
Calling telecom APIs (Twilio SMS, WhatsApp, SendGrid) synchronously inside a database booking transaction causes two fatal bugs:
1. A slow or failing external gateway rolls back a successful booking.
2. A database crash right after external API call loses the booking while charging the notification.

**The Solution:**
1. The `Booking` row and an `OutboxEvent` row (`status = 'PENDING'`) are saved in the **exact same ACID database transaction**.
2. A separate background `@Scheduled` poller queries pending outbox events every 2.5 seconds, dispatches them through a **Resilience4j Circuit Breaker**, and marks them `SENT` or retries up to $N$ times.

---

### 4. Caffeine In-Memory Caching & Event-Driven Eviction
- Public searches on `/api/search` are read-heavy. Search queries are cached using **Caffeine** with a 15-second TTL, keyed by `(resourceType, normalizedQuery, city)`.
- **Zero Stale Reads**: Whenever a hospital administrator updates stock or doctor status, a `HospitalDataChangedEvent` is published, triggering an event listener that **immediately evicts the cache**, guaranteeing real-time correctness.

---

### 5. Circuit Breaker Architecture (Resilience4j)
External dependencies (Tesseract OCR for prescription recognition, SMS gateways) are guarded with **Resilience4j Circuit Breakers**:
- If image scanning or telecom gateways experience latency or fail repeatedly, the circuit transitions from `CLOSED` to `OPEN`.
- Callers receive an instant fallback response:
  ```json
  {
    "success": false,
    "fallback": true,
    "message": "Image search is temporarily unavailable — please type the medicine name instead."
  }
  ```
- Protects Tomcat request worker threads from thread starvation.

---

### 6. Event-Driven Decoupled Architecture
Admin updates publish a `HospitalDataChangedEvent` through Spring's `ApplicationEventPublisher`. Decoupled `@EventListener` components execute single responsibilities:
1. **`AuditLogEventListener`**: Writes immutable audit trail to `audit_log`.
2. **`RestockAlertEventListener`**: Checks if stock changed from $0 \to >0$; if so, writes `RESTOCK_ALERT` outbox notifications for waiting patients registered in `search_interest`.
3. **`RealtimeBroadcastEventListener`**: Broadcasts live WebSocket messages to `/topic/hospital/{id}/availability`.
4. **`CacheEvictionEventListener`**: Flushes Caffeine search caches.

---

## 🏗️ Modular Monolith Structure

```
backend/src/main/java/com/medipulse/
├── MediPulseApplication.java               # Spring Boot Application entrypoint
├── availability/                          # Domain: Availability & Ranking
│   ├── controller/AvailabilityController.java
│   ├── domain/{Doctor, Medicine, Vaccine}.java
│   ├── dto/SearchResultDto.java
│   ├── repository/{Doctor, Medicine, Vaccine}Repository.java
│   └── service/{AvailabilityService, AvailabilityServiceImpl}.java
├── booking/                               # Domain: Reservation & Concurrency
│   ├── controller/BookingController.java
│   ├── domain/Booking.java
│   ├── dto/{BookingRequestDto, BookingResponseDto}.java
│   ├── repository/BookingRepository.java
│   └── service/{BookingService, BookingServiceImpl}.java
├── notification/                          # Domain: Outbox Pattern & Dispatch
│   ├── domain/OutboxEvent.java
│   ├── repository/OutboxEventRepository.java
│   └── service/{NotificationService, NotificationServiceImpl, NotificationSenderService}.java
├── admin/                                 # Domain: Hospital Portal & Auditing
│   ├── controller/{AdminAuthController, AdminHospitalController}.java
│   ├── domain/{Admin, AuditLog, SearchInterest}.java
│   ├── dto/{LoginRequestDto, LoginResponseDto, Update*Dto}.java
│   ├── listener/{AuditLog, RestockAlert, RealtimeBroadcast, CacheEviction}EventListener.java
│   ├── repository/{Admin, AuditLog, SearchInterest}Repository.java
│   └── service/{AdminService, AdminServiceImpl}.java
├── ocr/                                   # Domain: Prescription OCR & Circuit Breaker
│   ├── controller/PrescriptionOcrController.java
│   ├── dto/OcrResponseDto.java
│   └── service/PrescriptionOcrService.java
├── realtime/                              # Domain: STOMP WebSockets
│   ├── config/WebSocketConfig.java
│   ├── dto/AvailabilityUpdateMessage.java
│   └── service/RealtimeBroadcaster.java
└── common/                                # Shared Utilities & Security
    ├── domain/{Hospital, Patient}.java
    ├── dto/AlternateHospitalDto.java
    ├── event/HospitalDataChangedEvent.java
    ├── exception/{GlobalExceptionHandler, BookingConflictException, ...}.java
    ├── repository/{Hospital, Patient}Repository.java
    ├── security/{SecurityConfig, JwtAuthenticationFilter, JwtTokenProvider}.java
    └── util/{HaversineDistanceCalculator, CacheKeyUtils}.java
```

---

## 🚀 Running Locally

### Prerequisites
- **Java 21** or later
- **Maven 3.8+**
- **MySQL 8.0** (or run with built-in in-memory H2 profile)

### Option A: Running with MySQL 8.0
1. Create database:
   ```sql
   CREATE DATABASE medipulse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Set environment variables or update `application.yml`:
   ```bash
   export DB_URL="jdbc:mysql://localhost:3306/medipulse?useSSL=false&serverTimezone=UTC"
   export DB_USERNAME="root"
   export DB_PASSWORD="your_password"
   ```
3. Run the application:
   ```bash
   mvn clean spring-boot:run
   ```
   *Flyway automatically applies `V1__init_schema.sql` and `V2__seed_data.sql` on startup.*

### Option B: Running with In-Memory H2 Mode (Zero Setup)
```bash
mvn clean spring-boot:run -Dspring-boot.run.profiles=test
```

---

## 🛠️ Configuration & Mock Mode

The platform features mock toggles in `application.yml` allowing teammates to run and demo the entire stack without external paid accounts:

```yaml
medipulse:
  mock-mode:
    notifications: true   # Simulates Twilio/WhatsApp/Email to log console
    ocr: true             # Simulates OCR handwriting recognition
  ranking:
    distance-weight: 0.6  # Adjust distance influence
    freshness-weight: 0.4 # Adjust data freshness influence
  outbox:
    fixed-delay-ms: 2500  # Outbox background poller interval
    max-retries: 3        # Maximum delivery retry attempts
```

---

## 🧪 Comprehensive Test Suite

Run all verification tests with Maven:
```bash
mvn test
```

### Key Automated Tests:
| Test Class | Focus & Assertion |
| :--- | :--- |
| `ConcurrencyOptimisticLockingTest` | **20 concurrent threads compete for 1 dose**. Asserts exactly 1 succeeds and 19 receive HTTP 409 with alternative hospital recommendations. |
| `FreshnessWeightedRankingTest` | Proves a hospital 1 km away with 1-min-old verified data mathematically outranks a 500m hospital with 6-hour-stale data. |
| `CacheEvictionTest` | Verifies search result caching in Caffeine and immediate eviction upon an admin inventory update. |
| `CircuitBreakerOcrTest` | Forces failures on OCR, asserting circuit transitions to `OPEN` and delivers graceful fallback responses. |
| `OutboxNotificationTest` | Proves booking atomically queues outbox event, and background poller delivers and transitions to `SENT`. |
| `RestockAlertEventTest` | Restocking item from 0 to $>0$ dispatches domain event creating automated `RESTOCK_ALERT` outbox notifications. |
| `AdminSecurityTest` | Validates JWT issue and asserts hospital-scoped access blocks staff from modifying other facilities. |

---

## 📡 Live WebSocket Verification

1. Start the backend: `mvn spring-boot:run`.
2. Open the built-in test page in any browser:
   👉 **`http://localhost:8080/ws-test.html`**
3. Open a terminal or Postman and update any inventory item via PUT `/api/admin/hospitals/1/medicines/1`.
4. Observe the WebSocket test page instantly receive the live JSON broadcast without browser refresh!

Or verify via plain STOMP over CLI:
```bash
# Connect using wscat
npx wscat -c ws://localhost:8080/ws-plain
```

---

## 🔑 Demo Admin Credentials (from `V2__seed_data.sql`)

| Username | Password | Hospital | Role |
| :--- | :--- | :--- | :--- |
| `alvas_admin` | `admin123` | Alva's Health Centre (Hospital 1) | `ROLE_HOSPITAL_ADMIN` |
| `chc_admin` | `admin123` | Government CHC Moodbidri (Hospital 2) | `ROLE_HOSPITAL_ADMIN` |
| `prasad_admin` | `admin123` | Prasad Hospital & Trauma (Hospital 3) | `ROLE_HOSPITAL_ADMIN` |
| `yenepoya_admin` | `admin123` | Yenepoya Rural Health (Hospital 4) | `ROLE_HOSPITAL_ADMIN` |
| `super_admin` | `admin123` | All Facilities | `ROLE_SUPER_ADMIN` |

---

## 📚 REST API Reference

### 1. Search (Public & Cached)
- **`GET /api/search`**
  - Query params: `type` (DOCTOR|MEDICINE|VACCINE|ALL), `query`, `city`, `lat`, `lng`
  - Response: List of resources sorted descending by Freshness-Weighted composite score.
  - Rate Limited: 30 requests/minute.

### 2. Booking (Optimistic Locking & Outbox)
- **`POST /api/bookings`**
  - Payload:
    ```json
    {
      "patientName": "Ramesh Gowda",
      "patientPhone": "+919845112233",
      "hospitalId": 1,
      "resourceType": "MEDICINE",
      "resourceId": 1,
      "quantity": 2
    }
    ```
  - Success: `201 Created` with booking reference token.
  - Conflict: `409 Conflict` with `alternateHospitals` payload.

### 3. OCR Image Recognition (Circuit Breaker Protected)
- **`POST /api/ocr/extract-medicines`** (multipart form with image file)

### 4. Admin Portal (JWT Protected)
- **`POST /api/admin/auth/login`**: Authenticate and retrieve JWT token.
- **`PUT /api/admin/hospitals/{hospitalId}/doctors/{doctorId}`**: Toggle duty status.
- **`PUT /api/admin/hospitals/{hospitalId}/medicines/{medicineId}`**: Update inventory stock.
- **`PUT /api/admin/hospitals/{hospitalId}/vaccines/{vaccineId}`**: Update cold-chain status.
- **`GET /api/admin/audit-logs`**: View immutable audit trail.
