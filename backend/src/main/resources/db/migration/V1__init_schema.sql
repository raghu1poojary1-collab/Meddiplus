-- ===================================================================
-- MediPulse Database Schema Migration V1
-- Supports MySQL 8.0, 5.7, and H2 (MySQL Mode)
-- ===================================================================

-- 1. Hospital Facilities
CREATE TABLE hospital (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hospital_lat_lng ON hospital(latitude, longitude);
CREATE INDEX idx_hospital_city ON hospital(city);

-- 2. Doctor Availability
CREATE TABLE doctor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hospital_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(150) NOT NULL,
    on_duty BOOLEAN NOT NULL DEFAULT TRUE,
    queue_count INT NOT NULL DEFAULT 0,
    consulting_hours VARCHAR(100),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_doctor_hospital FOREIGN KEY (hospital_id) REFERENCES hospital(id) ON DELETE CASCADE
);

CREATE INDEX idx_doctor_specialization ON doctor(specialization);
CREATE INDEX idx_doctor_hospital ON doctor(hospital_id);

-- 3. Medicine Inventory
CREATE TABLE medicine (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hospital_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(150),
    stock_level INT NOT NULL DEFAULT 0,
    stock_status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    unit VARCHAR(50) NOT NULL DEFAULT 'strips',
    price VARCHAR(100),
    threshold INT NOT NULL DEFAULT 10,
    last_restocked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_medicine_hospital FOREIGN KEY (hospital_id) REFERENCES hospital(id) ON DELETE CASCADE
);

CREATE INDEX idx_medicine_name ON medicine(name);
CREATE INDEX idx_medicine_hospital ON medicine(hospital_id);

-- 4. Vaccine Inventory & Cold-Chain
CREATE TABLE vaccine (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hospital_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    batch_no VARCHAR(100) NOT NULL,
    doses_available INT NOT NULL DEFAULT 0,
    eligible_age_min INT NOT NULL DEFAULT 0,
    eligible_age_max INT NOT NULL DEFAULT 120,
    expiry_date DATE NOT NULL,
    cold_chain_status VARCHAR(100) DEFAULT 'Normal (3.5°C)',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_vaccine_hospital FOREIGN KEY (hospital_id) REFERENCES hospital(id) ON DELETE CASCADE
);

CREATE INDEX idx_vaccine_name ON vaccine(name);
CREATE INDEX idx_vaccine_hospital ON vaccine(hospital_id);

-- 5. Patients
CREATE TABLE patient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patient_phone ON patient(phone);

-- 6. Bookings
CREATE TABLE booking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(64) NOT NULL UNIQUE,
    patient_id BIGINT NOT NULL,
    hospital_id BIGINT NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id BIGINT NOT NULL,
    resource_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_patient FOREIGN KEY (patient_id) REFERENCES patient(id),
    CONSTRAINT fk_booking_hospital FOREIGN KEY (hospital_id) REFERENCES hospital(id)
);

CREATE INDEX idx_booking_ref ON booking(booking_reference);
CREATE INDEX idx_booking_patient ON booking(patient_id);
CREATE INDEX idx_booking_hospital ON booking(hospital_id);

-- 7. Hospital Admin Users
CREATE TABLE admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    hospital_id BIGINT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_HOSPITAL_ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_hospital FOREIGN KEY (hospital_id) REFERENCES hospital(id)
);

CREATE INDEX idx_admin_username ON admin(username);

-- 8. Transactional Outbox Events (Outbox Pattern)
CREATE TABLE outbox_event (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id BIGINT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    retry_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL
);

CREATE INDEX idx_outbox_status_created ON outbox_event(status, created_at);

-- 9. Comprehensive Audit Log
CREATE TABLE audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT NULL,
    admin_username VARCHAR(100),
    action VARCHAR(255) NOT NULL,
    target_table VARCHAR(100) NOT NULL,
    target_id BIGINT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT NULL,
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_target ON audit_log(target_table, target_id);
CREATE INDEX idx_audit_changed_at ON audit_log(changed_at);

-- 10. Patient Search Interest for Automated Restock Alerts
CREATE TABLE search_interest (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    hospital_id BIGINT NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_interest_patient FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE,
    CONSTRAINT fk_interest_hospital FOREIGN KEY (hospital_id) REFERENCES hospital(id) ON DELETE CASCADE
);

CREATE INDEX idx_interest_lookup ON search_interest(hospital_id, resource_type, resource_name);
