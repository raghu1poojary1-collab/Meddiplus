-- ===================================================================
-- MediPulse Realistic Seed Data Migration V2
-- Facilities centered in Moodbidri & Mangaluru rural/urban taluks, Karnataka
-- Coordinate anchor: Moodbidri (13.0733° N, 74.9958° E), Mangaluru (12.8732° N, 74.8466° E)
-- Default admin password for all accounts is: admin123
-- BCrypt hash for 'admin123': $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
-- ===================================================================

-- 1. Insert Hospitals
INSERT INTO hospital (id, name, address, city, latitude, longitude, contact_number, created_at) VALUES
(1, 'Alva''s Health Centre & Multi-Specialty Hospital', 'Alva''s Campus, Moodbidri Main Road', 'Moodbidri', 13.0755, 74.9982, '+91 8258 238104', NOW() - INTERVAL 1 DAY),
(2, 'Government Community Health Centre (CHC)', 'Near KSRTC Bus Depot, Moodbidri', 'Moodbidri', 13.0698, 74.9921, '+91 8258 236222', NOW() - INTERVAL 1 DAY),
(3, 'Prasad Hospital & Trauma Care', 'Kaikamba Highway Road, Moodbidri Taluk', 'Moodbidri', 13.0585, 74.9810, '+91 8258 239870', NOW() - INTERVAL 1 DAY),
(4, 'Yenepoya Rural Health & Training Centre', 'Belvai Road, Belvai Village, Moodbidri', 'Moodbidri', 13.0920, 75.0125, '+91 8258 244510', NOW() - INTERVAL 1 DAY),
(5, 'Kasturba Medical College (KMC) Hospital', 'Dr. B R Ambedkar Circle, Attavar', 'Mangaluru', 12.8732, 74.8466, '+91 824 2445858', NOW() - INTERVAL 2 DAY),
(6, 'Father Muller Medical College Hospital', 'Father Muller Road, Kankanady', 'Mangaluru', 12.8624, 74.8573, '+91 824 2238000', NOW() - INTERVAL 2 DAY);

-- 2. Insert Doctors
-- Note: Timestamps reflect varying update freshness to showcase the Freshness-Weighted Ranking Algorithm!
INSERT INTO doctor (id, hospital_id, name, specialization, on_duty, queue_count, consulting_hours, last_updated, version) VALUES
(1, 1, 'Dr. Ramesh Bhat', 'General Medicine', TRUE, 4, '08:00 - 16:00', NOW() - INTERVAL 2 MINUTE, 0),
(2, 1, 'Dr. Sunitha Shetty', 'Pediatrics', TRUE, 2, '09:00 - 15:00', NOW() - INTERVAL 15 MINUTE, 0),
(3, 1, 'Dr. Anand Nayak', 'Orthopedics', FALSE, 0, '16:00 - 20:00 (Evening)', NOW() - INTERVAL 45 MINUTE, 0),

(4, 2, 'Dr. Preetha Rao', 'General Medicine', TRUE, 8, '08:00 - 14:00', NOW() - INTERVAL 5 MINUTE, 0),
(5, 2, 'Dr. Vignesh Kamath', 'Emergency Medicine', TRUE, 1, '24-Hour Casualty', NOW() - INTERVAL 12 MINUTE, 0),
(6, 2, 'Dr. Malathi Shenoy', 'Obstetrics & Gynecology', FALSE, 0, '14:00 - 20:00 (Afternoon)', NOW() - INTERVAL 180 MINUTE, 0),

(7, 3, 'Dr. Harish Poojary', 'Cardiology', TRUE, 3, '10:00 - 18:00', NOW() - INTERVAL 11 MINUTE, 0),
(8, 3, 'Dr. Divya Hegde', 'General Medicine', TRUE, 5, '09:00 - 17:00', NOW() - INTERVAL 360 MINUTE, 0), -- Stale data: 6 hours ago!
(9, 3, 'Dr. Sudheer Alva', 'Pediatrics', FALSE, 0, '18:00 - 22:00 (Night)', NOW() - INTERVAL 240 MINUTE, 0),

(10, 4, 'Dr. Farhan Ahmed', 'General Medicine', TRUE, 6, '09:00 - 16:00', NOW() - INTERVAL 17 MINUTE, 0),
(11, 4, 'Dr. Reshma D''Souza', 'Pediatrics', FALSE, 0, '15:00 - 19:00', NOW() - INTERVAL 50 MINUTE, 0),
(12, 4, 'Dr. Naveen Kotian', 'General Practice', FALSE, 0, '08:00 - 13:00 (Morning)', NOW() - INTERVAL 75 MINUTE, 0),

(13, 5, 'Dr. Ashok Shetty', 'Cardiology', TRUE, 7, '09:00 - 17:00', NOW() - INTERVAL 3 MINUTE, 0),
(14, 6, 'Dr. Ronald Fernandes', 'General Surgery', TRUE, 4, '10:00 - 16:00', NOW() - INTERVAL 8 MINUTE, 0);

-- 3. Insert Medicines
INSERT INTO medicine (id, hospital_id, name, category, stock_level, stock_status, unit, price, threshold, last_restocked, version) VALUES
(1, 1, 'Paracetamol 650mg', 'Analgesic & Antipyretic', 185, 'AVAILABLE', 'strips', '₹15/strip', 30, NOW() - INTERVAL 3 MINUTE, 0),
(2, 1, 'Amoxicillin 500mg', 'Antibiotic', 64, 'AVAILABLE', 'strips', '₹45/strip', 20, NOW() - INTERVAL 4 MINUTE, 0),
(3, 1, 'Metformin 500mg', 'Diabetes Care', 12, 'LIMITED', 'strips', '₹22/strip', 25, NOW() - INTERVAL 8 MINUTE, 0),
(4, 1, 'Insulin Glargine 100IU', 'Injectable Insulin', 25, 'AVAILABLE', 'vials', '₹280/vial', 8, NOW() - INTERVAL 10 MINUTE, 0),
(5, 1, 'Cetirizine 10mg', 'Anti-Allergy', 95, 'AVAILABLE', 'strips', '₹12/strip', 20, NOW() - INTERVAL 25 MINUTE, 0),

(6, 2, 'Paracetamol 650mg', 'Antipyretic', 340, 'AVAILABLE', 'strips', 'Free (Govt Supply)', 50, NOW() - INTERVAL 5 MINUTE, 0),
(7, 2, 'Amoxicillin 500mg', 'Antibiotic', 16, 'LIMITED', 'strips', 'Free (Govt Supply)', 25, NOW() - INTERVAL 30 MINUTE, 0),
(8, 2, 'ORS Electrolyte Sachets', 'Rehydration', 210, 'AVAILABLE', 'packets', 'Free (Govt Supply)', 40, NOW() - INTERVAL 12 MINUTE, 0),
(9, 2, 'Metformin 500mg', 'Diabetes Care', 0, 'OUT_OF_STOCK', 'strips', 'Free (Govt Supply)', 20, NOW() - INTERVAL 400 MINUTE, 0), -- Out of stock!
(10, 2, 'Cetirizine 10mg', 'Anti-Allergy', 80, 'AVAILABLE', 'strips', 'Free (Govt Supply)', 20, NOW() - INTERVAL 60 MINUTE, 0),

(11, 3, 'Paracetamol 650mg', 'Antipyretic', 120, 'AVAILABLE', 'strips', '₹20/strip', 25, NOW() - INTERVAL 11 MINUTE, 0),
(12, 3, 'Insulin Glargine 100IU', 'Diabetes Care', 6, 'LIMITED', 'vials', '₹310/vial', 10, NOW() - INTERVAL 300 MINUTE, 0),
(13, 3, 'Amoxicillin 500mg', 'Antibiotic', 0, 'OUT_OF_STOCK', 'strips', '₹50/strip', 15, NOW() - INTERVAL 180 MINUTE, 0),
(14, 3, 'Metformin 500mg', 'Diabetes Care', 85, 'AVAILABLE', 'strips', '₹25/strip', 20, NOW() - INTERVAL 15 MINUTE, 0),
(15, 3, 'Cetirizine 10mg', 'Anti-Allergy', 50, 'AVAILABLE', 'strips', '₹15/strip', 15, NOW() - INTERVAL 90 MINUTE, 0),

(16, 4, 'Paracetamol 650mg', 'Antipyretic', 14, 'LIMITED', 'strips', '₹10/strip', 20, NOW() - INTERVAL 17 MINUTE, 0),
(17, 4, 'Amoxicillin 500mg', 'Antibiotic', 45, 'AVAILABLE', 'strips', '₹35/strip', 15, NOW() - INTERVAL 22 MINUTE, 0),
(18, 4, 'Metformin 500mg', 'Diabetes Care', 60, 'AVAILABLE', 'strips', '₹18/strip', 20, NOW() - INTERVAL 45 MINUTE, 0),
(19, 4, 'ORS Electrolyte Sachets', 'Rehydration', 140, 'AVAILABLE', 'packets', 'Free (Outreach)', 30, NOW() - INTERVAL 70 MINUTE, 0),
(20, 4, 'Insulin Glargine 100IU', 'Diabetes Care', 0, 'OUT_OF_STOCK', 'vials', '₹290/vial', 5, NOW() - INTERVAL 210 MINUTE, 0),

(21, 5, 'Insulin Glargine 100IU', 'Diabetes Care', 150, 'AVAILABLE', 'vials', '₹275/vial', 20, NOW() - INTERVAL 1 MINUTE, 0),
(22, 6, 'Epinephrine (1:1000)', 'Emergency Resuscitation', 40, 'AVAILABLE', 'ampoules', '₹95/ampoule', 10, NOW() - INTERVAL 6 MINUTE, 0);

-- 4. Insert Vaccines
INSERT INTO vaccine (id, hospital_id, name, batch_no, doses_available, eligible_age_min, eligible_age_max, expiry_date, cold_chain_status, last_updated, version) VALUES
(1, 1, 'Covaxin (Adult & Adolescent)', 'BB-2024-CV8', 48, 12, 120, '2026-12-31', 'Normal (3.2°C)', NOW() - INTERVAL 5 MINUTE, 0),
(2, 1, 'Pentavalent Vaccine', 'SER-PV09', 22, 0, 5, '2026-08-31', 'Normal (4.0°C)', NOW() - INTERVAL 15 MINUTE, 0),
(3, 1, 'Single Dose Concurrency Demo Vaccine', 'CONCUR-DEMO-01', 1, 0, 100, '2027-01-01', 'Normal (3.5°C)', NOW() - INTERVAL 1 MINUTE, 0), -- For testing 20 concurrent requests on 1 dose!

(4, 2, 'BCG Vaccine (Newborn)', 'BCG-IND-44', 34, 0, 1, '2026-10-31', 'Normal (3.6°C)', NOW() - INTERVAL 8 MINUTE, 0),
(5, 2, 'Tetanus Toxoid (TT)', 'TT-2024-11', 60, 5, 120, '2027-05-31', 'Normal (4.2°C)', NOW() - INTERVAL 14 MINUTE, 0),

(6, 3, 'Covishield (COVID-19)', 'SII-CS-881', 15, 18, 120, '2026-11-30', 'Normal (3.9°C)', NOW() - INTERVAL 11 MINUTE, 0),
(7, 3, 'Hepatitis B Pediatric', 'HB-2024-03', 28, 0, 18, '2026-09-30', 'Normal (3.1°C)', NOW() - INTERVAL 220 MINUTE, 0),

(8, 4, 'Covaxin (Adult)', 'BB-OUT-00', 0, 18, 120, '2026-10-31', 'Exhausted', NOW() - INTERVAL 350 MINUTE, 0),
(9, 4, 'Pentavalent Vaccine', 'SER-PV12', 18, 0, 5, '2026-07-31', 'Normal (3.7°C)', NOW() - INTERVAL 18 MINUTE, 0);

-- 5. Insert Sample Patients
INSERT INTO patient (id, name, phone, email, created_at) VALUES
(1, 'Raghavendra Poojary', '+919876543210', 'raghavendra.p@example.com', NOW() - INTERVAL 3 DAY),
(2, 'Anita Shenoy', '+919845112233', 'anita.shenoy@example.com', NOW() - INTERVAL 2 DAY),
(3, 'Kiran Kumar Hegde', '+919448899001', 'kiran.hegde@example.com', NOW() - INTERVAL 1 DAY);

-- 6. Insert Search Interest (for Restock Notification Testing)
-- Patient 1 and 2 are eagerly waiting for Metformin 500mg at CHC Moodbidri (which is currently at 0 stock!)
INSERT INTO search_interest (id, patient_id, hospital_id, resource_type, resource_name, created_at) VALUES
(1, 1, 2, 'MEDICINE', 'Metformin 500mg', NOW() - INTERVAL 4 HOUR),
(2, 2, 2, 'MEDICINE', 'Metformin 500mg', NOW() - INTERVAL 2 HOUR),
(3, 3, 4, 'MEDICINE', 'Insulin Glargine 100IU', NOW() - INTERVAL 1 HOUR);

-- 7. Insert Hospital Administrators
-- Credentials:
-- alvas_admin / admin123 (Hospital 1)
-- chc_admin / admin123 (Hospital 2)
-- prasad_admin / admin123 (Hospital 3)
-- yenepoya_admin / admin123 (Hospital 4)
-- super_admin / admin123 (Super Admin, Hospital 1 default)
INSERT INTO admin (id, username, password_hash, hospital_id, full_name, role, created_at) VALUES
(1, 'alvas_admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 1, 'Sister Prema (Alva''s Ops)', 'ROLE_HOSPITAL_ADMIN', NOW() - INTERVAL 10 DAY),
(2, 'chc_admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 2, 'Pharmacist K. Shenoy (CHC)', 'ROLE_HOSPITAL_ADMIN', NOW() - INTERVAL 10 DAY),
(3, 'prasad_admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 3, 'Duty Nurse Reena (Prasad)', 'ROLE_HOSPITAL_ADMIN', NOW() - INTERVAL 10 DAY),
(4, 'yenepoya_admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 4, 'Admin Staff Belvai', 'ROLE_HOSPITAL_ADMIN', NOW() - INTERVAL 10 DAY),
(5, 'super_admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 1, 'Chief Medical Officer', 'ROLE_SUPER_ADMIN', NOW() - INTERVAL 10 DAY);

-- 8. Seed Initial Audit Log
INSERT INTO audit_log (id, admin_id, admin_username, action, target_table, target_id, changed_at, metadata) VALUES
(1, 1, 'alvas_admin', 'UPDATE_DUTY_STATUS', 'doctor', 1, NOW() - INTERVAL 10 MINUTE, '{"field": "onDuty", "from": false, "to": true, "doctor": "Dr. Ramesh Bhat"}'),
(2, 2, 'chc_admin', 'RESTOCK_MEDICINE', 'medicine', 6, NOW() - INTERVAL 25 MINUTE, '{"field": "stockLevel", "added": 100, "medicine": "Paracetamol 650mg"}'),
(3, 3, 'prasad_admin', 'COLD_CHAIN_VERIFY', 'vaccine', 6, NOW() - INTERVAL 60 MINUTE, '{"temperature": "3.9°C", "compliant": true}');
