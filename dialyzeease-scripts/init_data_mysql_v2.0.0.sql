-- MySQL initialization script for DialyzeEase (Sri Lanka Version)
-- Updated with localized sample data including Sri Lankan names, numbers, and centers

-- Disable foreign key checks temporarily for easier data loading
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate all data
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE notifications;
TRUNCATE TABLE education_materials;
TRUNCATE TABLE ckd_stages;
TRUNCATE TABLE ckd_records;
TRUNCATE TABLE dialysis_histories;
TRUNCATE TABLE appointments;
TRUNCATE TABLE session_beds;
TRUNCATE TABLE schedule_sessions;
TRUNCATE TABLE sessions;
TRUNCATE TABLE beds;
TRUNCATE TABLE center_hours;
TRUNCATE TABLE center_users;
TRUNCATE TABLE centers;
TRUNCATE TABLE doctors;
TRUNCATE TABLE patients;
TRUNCATE TABLE users;
TRUNCATE TABLE roles;

-- Insert roles
INSERT INTO roles (id, name) VALUES 
(1000, 'admin'),
(1001, 'staff'),
(1002, 'doctor'),
(1003, 'patient');

-- Admins
INSERT INTO users (id, role_id, first_name, last_name, email, password, mobile_no, is_active, last_login_at) VALUES
(1000, 1000, 'Admin', 'User', 'admin@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '011-242-2335', 1, NOW()),
(1001, 1000, 'Suwan', 'Rathnayake', 'suwan@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '077-912-4893', 1, NOW()),
(1002, 1000, 'Yohan', 'Hirimuthugoda', 'yohan@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '077-727-8874', 1, NOW());

-- Staff
INSERT INTO users (id, role_id, first_name, last_name, email, password, mobile_no, is_active, last_login_at) VALUES
(1001, 1001, 'Nadeesha', 'Wijeratne', 'nadeesha@dialyzeease.org', '$2a$10$hashforstaff1', '077-1234567', 1, NOW()),
(1002, 1001, 'Sameera', 'Kariyawasam', 'sameera@dialyzeease.org', '$2a$10$hashforstaff2', '071-5678910', 1, NOW()),
(1003, 1001, 'Harsha', 'Bandara', 'harsha@dialyzeease.org', '$2a$10$hashforstaff3', '072-6789012', 1, NOW());

-- Doctors
INSERT INTO users (id, role_id, first_name, last_name, email, password, mobile_no, is_active, last_login_at) VALUES
(1004, 1002, 'Malitha', 'Perera', 'malitha.perera@dialyzeease.org', '$2a$10$hashfordoc1', '071-4567890', 1, NOW()),
(1005, 1002, 'Ishara', 'Fernando', 'ishara.fernando@dialyzeease.org', '$2a$10$hashfordoc2', '077-2345678', 1, NOW()),
(1006, 1002, 'Nuwan', 'Jayasinghe', 'nuwan.jayasinghe@dialyzeease.org', '$2a$10$hashfordoc3', '075-9123456', 1, NOW());

-- Patients
INSERT INTO users (id, role_id, first_name, last_name, email, password, mobile_no, is_active, last_login_at) VALUES
(1007, 1003, 'Sanduni', 'Wickramasinghe', 'sanduni@dialyzeease.org', '$2a$10$hashforpatient1', '071-8881122', 1, NOW()),
(1008, 1003, 'Kasun', 'Dissanayake', 'kasun@dialyzeease.org', '$2a$10$hashforpatient2', '072-9933445', 1, NOW());

-- Patients details
INSERT INTO patients (id, user_id, address, dob, gender, blood_group, height, weight, allergies, chronic_conditions, emergency_contact_no, emergency_contact_name, emergency_contact_relation, insurance_provider) VALUES
(1000, 1007, '125 Temple Road, Nugegoda, Colombo', '1981-03-12', 'female', 'A+', '165 cm', '60 kg', 'Penicillin', 'Hypertension', '077-3456789', 'Ruwan Wickramasinghe', 'Brother', 'SLI Medical'),
(1001, 1008, '33 Kandy Road, Peradeniya', '1975-07-18', 'male', 'O+', '172 cm', '72 kg', NULL, 'Diabetes Type 2', '078-4561230', 'Nimal Dissanayake', 'Father', 'Nawaloka Insurance');

-- Doctors details
INSERT INTO doctors (id, user_id, emergency_contact_no, specialization, medical_license_no, address, dob, gender, blood_group) VALUES
(1000, 1004, '011-2333445', 'Nephrology', 'SLMC123456', '234 Elvitigala Mawatha, Colombo 08', '1974-11-22', 'male', 'B+'),
(1001, 1005, '011-2890223', 'Nephrology & Hypertension', 'SLMC654321', '99 Park Street, Colombo 02', '1980-01-15', 'female', 'A-'),
(1002, 1006, '081-2233445', 'Pediatric Nephrology', 'SLMC778899', 'Galaha Road, Kandy', '1972-05-10', 'male', 'O+');

-- Dialysis Centers (Sri Lankan)
INSERT INTO centers (id, name, address, contact_no, email, total_capacity, is_active) VALUES
(1000, 'Colombo Kidney Care Center', 'Colombo 07', '011-2547896', 'colombo@dialyzeease.org', 50, 1),
(1001, 'Kandy Renal Unit', 'Kandy General Hospital', '081-2223456', 'kandy@dialyzeease.org', 35, 1),
(1002, 'Galle Nephrology Institute', 'Teaching Hospital, Galle', '091-2233445', 'galle@dialyzeease.org', 30, 1);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;