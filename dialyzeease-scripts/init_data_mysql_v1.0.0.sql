-- MySQL initialization script for DialyzeEase
-- Generated from mock-data.json

-- Disable foreign key checks temporarily for easier data loading
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data
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

-- Insert users
-- Note: Converting string IDs to numeric and starting from 1000
-- Format: first_name and last_name are extracted from name
INSERT INTO users (id, role_id, first_name, last_name, email, password, mobile_no, is_active, last_login_at) VALUES
-- Admin users
(1000, 1000, 'Admin', 'User', 'admin@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '011-242-2335', 1, NOW()),
(1001, 1000, 'Suwan', 'Rathnayake', 'suwan@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '077-912-4893', 1, NOW()),
(1002, 1000, 'Yohan', 'Hirimuthugoda', 'yohan@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '077-727-8874', 1, NOW()),

-- Staff users
(1003, 1001, 'Sarah', 'Johnson', 'sarah.johnson@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-200-0001', 1, NOW()),
(1004, 1001, 'David', 'Chen', 'david.chen@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-200-0002', 1, '2023-06-19 10:45:00'),

-- Doctor users
(1005, 1002, 'Patricia', 'Garcia', 'patricia.garcia@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-300-0001', 1, '2023-06-18 09:15:00'),
(1006, 1002, 'Thomas', 'Brown', 'thomas.brown@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-300-0002', 1, '2023-06-17 16:30:00'),
(1007, 1002, 'Emma', 'Williams', 'emma.williams@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-300-0003', 1, '2023-06-16 11:45:00'),
(1008, 1002, 'Robert', 'Miller', 'robert.miller@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-300-0004', 1, '2023-06-15 14:20:00'),
(1009, 1002, 'James', 'Wilson', 'james.wilson@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-300-0005', 1, '2023-06-14 09:10:00'),
(1010, 1002, 'Linda', 'Martinez', 'linda.martinez@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-300-0006', 1, '2023-06-13 15:30:00'),
(1011, 1002, 'Michael', 'Johnson', 'michael.johnson@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-300-0007', 1, '2023-06-12 10:45:00'),
(1012, 1002, 'Susan', 'Lee', 'susan.lee@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-300-0008', 1, '2023-06-11 13:20:00'),
(1013, 1002, 'Jennifer', 'Adams', 'jennifer.adams@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-300-0009', 1, '2023-06-10 09:15:00'),
(1014, 1002, 'Richard', 'Taylor', 'richard.taylor@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-300-0010', 1, '2023-06-09 14:30:00'),
(1015, 1002, 'Elizabeth', 'Clark', 'elizabeth.clark@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-300-0011', 1, '2023-06-08 11:45:00'),

-- Patient users
(1016, 1003, 'John', 'Smith', 'john.smith@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-400-0001', 1, '2023-06-20 14:30:00'),
(1017, 1003, 'Maria', 'Rodriguez', 'maria.rodriguez@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-400-0002', 1, '2023-06-18 09:45:00'),
(1018, 1003, 'Robert', 'Johnson', 'robert.johnson@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-400-0003', 1, '2023-06-19 16:10:00'),
(1019, 1003, 'Emily', 'Chen', 'emily.chen@dialyzeease.org', '$2a$10$xVqPkfPgG8VuV.PxjJJCm.UKiUNjQYxZCQHbcZuHCXHV9bKJ2Iduy', '555-400-0004', 1, '2023-06-17 13:25:00');

-- Insert patients
INSERT INTO patients (id, user_id, address, dob, gender, blood_group, height, weight, allergies, chronic_conditions, emergency_contact_no, emergency_contact_name, emergency_contact_relation, insurance_provider) VALUES
(1000, 1016, '123 Main St, Metropolis, NY 10001', '1965-04-15', 'male', 'A+', '175 cm', '82 kg', 'Penicillin', 'Diabetes Type 2, Hypertension, Coronary Artery Disease', '555-234-5678', 'Mary Smith', 'Wife', 'MetroHealth Insurance'),
(1001, 1017, '456 Oak Ave, Centerville, CA 90210', '1978-09-23', 'female', 'O+', '162 cm', '65 kg', 'Sulfa drugs', 'Polycystic Kidney Disease', '555-876-5432', 'Carlos Rodriguez', 'Husband', 'CalHealth'),
(1002, 1018, '789 Pine St, Riverside, TX 77001', '1952-01-30', 'male', 'B+', '180 cm', '79 kg', NULL, 'Hypertension, Gout', '555-345-6789', 'Linda Johnson', 'Daughter', 'TexasCare Plus'),
(1003, 1019, '101 Cedar Rd, Highland, IL 60035', '1989-07-12', 'female', 'AB-', '165 cm', '58 kg', 'Ibuprofen, Aspirin', 'Lupus Nephritis', '555-456-7890', 'Wei Chen', 'Brother', 'MidwestHealth');

-- Insert doctors
INSERT INTO doctors (id, user_id, emergency_contact_no, specialization, medical_license_no, address, dob, gender, blood_group) VALUES
(1000, 1003, '555-111-1111', 'Nephrology', 'ML123456', '200 Doctor Blvd, Metropolis, NY 10001', '1975-06-15', 'female', 'O+'),
(1001, 1004, '555-111-2222', 'Nephrology', 'ML234567', '210 Physician St, Centerville, CA 90210', '1980-03-22', 'male', 'A-'),
(1002, 1005, '555-111-3333', 'Nephrology, Transplant Medicine', 'ML345678', '220 Healer Ave, Riverside, TX 77001', '1972-11-08', 'female', 'B+'),
(1003, 1006, '555-111-4444', 'Nephrology, Hypertension', 'ML456789', '230 Wellness Dr, Highland, IL 60035', '1978-09-30', 'male', 'AB+'),
(1004, 1007, '555-111-5555', 'Nephrology, Pediatric', 'ML567890', '240 Care St, Metropolis, NY 10001', '1982-05-17', 'female', 'O-'),
(1005, 1008, '555-111-6666', 'Nephrology, Geriatric', 'ML678901', '250 Health Rd, Centerville, CA 90210', '1970-12-03', 'male', 'A+'),
(1006, 1009, '555-111-7777', 'Nephrology', 'ML789012', '260 Medical Ct, Riverside, TX 77001', '1976-08-25', 'male', 'B-'),
(1007, 1010, '555-111-8888', 'Nephrology, Critical Care', 'ML890123', '270 Doctor Ln, Highland, IL 60035', '1979-04-11', 'female', 'AB-'),
(1008, 1011, '555-111-9999', 'Nephrology', 'ML901234', '280 Physician Dr, Eastville, FL 33101', '1974-01-29', 'male', 'O+'),
(1009, 1012, '555-222-0000', 'Nephrology, Research', 'ML012345', '290 Healer St, Eastville, FL 33101', '1981-07-14', 'female', 'A+'),
(1010, 1013, '555-222-1111', 'Nephrology, Dialysis', 'ML123456', '300 Wellness Ave, Metropolis, NY 10001', '1977-10-05', 'female', 'B+'),
(1011, 1014, '555-222-2222', 'Nephrology', 'ML234567', '310 Care Dr, Centerville, CA 90210', '1973-02-18', 'male', 'AB+'),
(1012, 1015, '555-222-3333', 'Nephrology, Transplant', 'ML345678', '320 Health St, Eastville, FL 33101', '1980-11-22', 'female', 'O-');

-- Insert centers
INSERT INTO centers (id, name, address, contact_no, email, total_capacity, is_active) VALUES
(1000, 'Metro Dialysis Center', '123 Healthcare Blvd, Metropolis, NY 10001', '555-111-2222', 'info@metrodialysis.lk', 50, 1),
(1001, 'Central Kidney Care', '456 Medical Drive, Centerville, CA 90210', '555-333-4444', 'info@centralkidneycare.lk', 40, 1),
(1002, 'Riverside Renal Center', '789 River Road, Riverside, TX 77001', '555-555-6666', 'info@riversiderenal.lk', 35, 1),
(1003, 'Highland Dialysis', '101 Highland Ave, Highland, IL 60035', '555-777-8888', 'info@highlanddialysis.lk', 25, 1),
(1004, 'Eastside Kidney Center', '202 East Main Street, Eastville, FL 33101', '555-999-0000', 'info@eastsidekidney.lk', 30, 1);

-- Insert center hours
-- Metro Dialysis Center hours
INSERT INTO center_hours (center_id, weekday, open_time, close_time) VALUES
(1000, 'mon', '06:00:00', '21:00:00'),
(1000, 'tue', '06:00:00', '21:00:00'),
(1000, 'wed', '06:00:00', '21:00:00'),
(1000, 'thu', '06:00:00', '21:00:00'),
(1000, 'fri', '06:00:00', '21:00:00'),
(1000, 'sat', '07:00:00', '17:00:00'),
(1000, 'sun', '07:00:00', '17:00:00');

-- Central Kidney Care hours
INSERT INTO center_hours (center_id, weekday, open_time, close_time) VALUES
(1001, 'mon', '07:00:00', '20:00:00'),
(1001, 'tue', '07:00:00', '20:00:00'),
(1001, 'wed', '07:00:00', '20:00:00'),
(1001, 'thu', '07:00:00', '20:00:00'),
(1001, 'fri', '07:00:00', '20:00:00'),
(1001, 'sat', '08:00:00', '16:00:00');

-- Riverside Renal Center hours
INSERT INTO center_hours (center_id, weekday, open_time, close_time) VALUES
(1002, 'mon', '06:30:00', '19:30:00'),
(1002, 'tue', '06:30:00', '19:30:00'),
(1002, 'wed', '06:30:00', '19:30:00'),
(1002, 'thu', '06:30:00', '19:30:00'),
(1002, 'fri', '06:30:00', '19:30:00'),
(1002, 'sat', '07:30:00', '15:30:00');

-- Highland Dialysis hours
INSERT INTO center_hours (center_id, weekday, open_time, close_time) VALUES
(1003, 'mon', '07:00:00', '19:00:00'),
(1003, 'tue', '07:00:00', '19:00:00'),
(1003, 'wed', '07:00:00', '19:00:00'),
(1003, 'thu', '07:00:00', '19:00:00'),
(1003, 'fri', '07:00:00', '19:00:00'),
(1003, 'sat', '08:00:00', '15:00:00');

-- Eastside Kidney Center hours
INSERT INTO center_hours (center_id, weekday, open_time, close_time) VALUES
(1004, 'mon', '06:00:00', '20:00:00'),
(1004, 'tue', '06:00:00', '20:00:00'),
(1004, 'wed', '06:00:00', '20:00:00'),
(1004, 'thu', '06:00:00', '20:00:00'),
(1004, 'fri', '06:00:00', '20:00:00'),
(1004, 'sat', '07:00:00', '17:00:00'),
(1004, 'sun', '07:00:00', '12:00:00');

-- Insert center users (staff and doctors assigned to centers)
INSERT INTO center_users (center_id, user_id, assigned_role, assigned_at, status) VALUES
-- Metro Dialysis Center staff and doctors
(1000, 1003, 'doctor', '2022-01-15 00:00:00', 'active'),  -- Dr. Sarah Johnson
(1000, 1004, 'doctor', '2022-01-15 00:00:00', 'active'),  -- Dr. David Chen
(1000, 1007, 'doctor', '2022-01-15 00:00:00', 'active'),  -- Dr. Emma Williams

-- Central Kidney Care staff and doctors
(1001, 1008, 'doctor', '2022-02-01 00:00:00', 'active'),  -- Dr. Robert Miller
(1001, 1005, 'doctor', '2022-02-01 00:00:00', 'active'),  -- Dr. Patricia Garcia
(1001, 1009, 'doctor', '2022-02-01 00:00:00', 'active'),  -- Dr. James Wilson

-- Riverside Renal Center staff and doctors
(1002, 1006, 'doctor', '2022-03-10 00:00:00', 'active'),  -- Dr. Thomas Brown
(1002, 1010, 'doctor', '2022-03-10 00:00:00', 'active'),  -- Dr. Linda Martinez

-- Highland Dialysis staff and doctors
(1003, 1011, 'doctor', '2022-04-05 00:00:00', 'active'),  -- Dr. Michael Johnson
(1003, 1012, 'doctor', '2022-04-05 00:00:00', 'active'),  -- Dr. Susan Lee

-- Eastside Kidney Center staff and doctors
(1004, 1013, 'doctor', '2022-05-20 00:00:00', 'active'),  -- Dr. Jennifer Adams
(1004, 1014, 'doctor', '2022-05-20 00:00:00', 'active'),  -- Dr. Richard Taylor
(1004, 1015, 'doctor', '2022-05-20 00:00:00', 'active');  -- Dr. Elizabeth Clark

-- Insert beds for each center
-- Metro Dialysis Center beds
INSERT INTO beds (id, center_id, bed_number, is_active) VALUES
(1000, 1000, 'A-01', 1),
(1001, 1000, 'A-02', 1),
(1002, 1000, 'A-03', 1),
(1003, 1000, 'A-04', 1),
(1004, 1000, 'A-05', 1),
(1005, 1000, 'B-01', 1),
(1006, 1000, 'B-02', 1),
(1007, 1000, 'B-03', 1),
(1008, 1000, 'B-04', 1),
(1009, 1000, 'B-05', 1);

-- Central Kidney Care beds
INSERT INTO beds (id, center_id, bed_number, is_active) VALUES
(1010, 1001, 'A-01', 1),
(1011, 1001, 'A-02', 1),
(1012, 1001, 'A-03', 1),
(1013, 1001, 'A-04', 1),
(1014, 1001, 'B-01', 1),
(1015, 1001, 'B-02', 1),
(1016, 1001, 'B-03', 1),
(1017, 1001, 'B-04', 1);

-- Riverside Renal Center beds
INSERT INTO beds (id, center_id, bed_number, is_active) VALUES
(1018, 1002, 'A-01', 1),
(1019, 1002, 'A-02', 1),
(1020, 1002, 'A-03', 1),
(1021, 1002, 'B-01', 1),
(1022, 1002, 'B-02', 1),
(1023, 1002, 'B-03', 1);

-- Highland Dialysis beds
INSERT INTO beds (id, center_id, bed_number, is_active) VALUES
(1024, 1003, 'A-01', 1),
(1025, 1003, 'A-02', 1),
(1026, 1003, 'A-03', 1),
(1027, 1003, 'B-01', 1),
(1028, 1003, 'B-02', 1);

-- Eastside Kidney Center beds
INSERT INTO beds (id, center_id, bed_number, is_active) VALUES
(1029, 1004, 'A-01', 1),
(1030, 1004, 'A-02', 1),
(1031, 1004, 'A-03', 1),
(1032, 1004, 'B-01', 1),
(1033, 1004, 'B-02', 1),
(1034, 1004, 'B-03', 1);

-- Insert sessions
INSERT INTO sessions (id, name, start_time, end_time, center_id, is_active) VALUES
-- Metro Dialysis Center sessions
(1000, 'Morning Session', '06:00:00', '10:00:00', 1000, 1),
(1001, 'Mid-day Session', '11:00:00', '15:00:00', 1000, 1),
(1002, 'Evening Session', '16:00:00', '20:00:00', 1000, 1),

-- Central Kidney Care sessions
(1003, 'Morning Session', '07:00:00', '11:00:00', 1001, 1),
(1004, 'Afternoon Session', '12:00:00', '16:00:00', 1001, 1),
(1005, 'Evening Session', '17:00:00', '20:00:00', 1001, 1),

-- Riverside Renal Center sessions
(1006, 'Early Morning', '06:30:00', '10:30:00', 1002, 1),
(1007, 'Late Morning', '11:00:00', '15:00:00', 1002, 1),
(1008, 'Afternoon', '15:30:00', '19:30:00', 1002, 1),

-- Highland Dialysis sessions
(1009, 'Morning', '07:00:00', '11:00:00', 1003, 1),
(1010, 'Afternoon', '12:00:00', '16:00:00', 1003, 1),
(1011, 'Evening', '16:30:00', '19:00:00', 1003, 1),

-- Eastside Kidney Center sessions
(1012, 'Early Morning', '06:00:00', '10:00:00', 1004, 1),
(1013, 'Mid-day', '11:00:00', '15:00:00', 1004, 1),
(1014, 'Late Afternoon', '16:00:00', '20:00:00', 1004, 1);

-- Insert schedule sessions (recurring sessions for each weekday)
INSERT INTO schedule_sessions (id, session_id, weekday) VALUES
-- Metro Dialysis Center schedule
(1000, 1000, 'mon'), (1001, 1000, 'tue'), (1002, 1000, 'wed'), (1003, 1000, 'thu'), (1004, 1000, 'fri'), (1005, 1000, 'sat'),
(1006, 1001, 'mon'), (1007, 1001, 'tue'), (1008, 1001, 'wed'), (1009, 1001, 'thu'), (1010, 1001, 'fri'), (1011, 1001, 'sat'),
(1012, 1002, 'mon'), (1013, 1002, 'tue'), (1014, 1002, 'wed'), (1015, 1002, 'thu'), (1016, 1002, 'fri'),

-- Central Kidney Care schedule
(1017, 1003, 'mon'), (1018, 1003, 'tue'), (1019, 1003, 'wed'), (1020, 1003, 'thu'), (1021, 1003, 'fri'), (1022, 1003, 'sat'),
(1023, 1004, 'mon'), (1024, 1004, 'tue'), (1025, 1004, 'wed'), (1026, 1004, 'thu'), (1027, 1004, 'fri'),
(1028, 1005, 'mon'), (1029, 1005, 'tue'), (1030, 1005, 'wed'), (1031, 1005, 'thu'), (1032, 1005, 'fri'),

-- Riverside Renal Center schedule
(1033, 1006, 'mon'), (1034, 1006, 'tue'), (1035, 1006, 'wed'), (1036, 1006, 'thu'), (1037, 1006, 'fri'), (1038, 1006, 'sat'),
(1039, 1007, 'mon'), (1040, 1007, 'tue'), (1041, 1007, 'wed'), (1042, 1007, 'thu'), (1043, 1007, 'fri'),
(1044, 1008, 'mon'), (1045, 1008, 'tue'), (1046, 1008, 'wed'), (1047, 1008, 'thu'), (1048, 1008, 'fri'),

-- Highland Dialysis schedule
(1049, 1009, 'mon'), (1050, 1009, 'tue'), (1051, 1009, 'wed'), (1052, 1009, 'thu'), (1053, 1009, 'fri'), (1054, 1009, 'sat'),
(1055, 1010, 'mon'), (1056, 1010, 'tue'), (1057, 1010, 'wed'), (1058, 1010, 'thu'), (1059, 1010, 'fri'),
(1060, 1011, 'mon'), (1061, 1011, 'tue'), (1062, 1011, 'wed'), (1063, 1011, 'thu'), (1064, 1011, 'fri'),

-- Eastside Kidney Center schedule
(1065, 1012, 'mon'), (1066, 1012, 'tue'), (1067, 1012, 'wed'), (1068, 1012, 'thu'), (1069, 1012, 'fri'), (1070, 1012, 'sat'), (1071, 1012, 'sun'),
(1072, 1013, 'mon'), (1073, 1013, 'tue'), (1074, 1013, 'wed'), (1075, 1013, 'thu'), (1076, 1013, 'fri'), (1077, 1013, 'sat'),
(1078, 1014, 'mon'), (1079, 1014, 'tue'), (1080, 1014, 'wed'), (1081, 1014, 'thu'), (1082, 1014, 'fri');

-- Insert appointments
INSERT INTO appointments (id, patient_id, center_id, doctor_id, appointment_date, start_time, end_time, status, type, notes) VALUES
(1000, 1016, 1000, 1000, '2023-06-01', '09:00:00', '12:00:00', 'completed', 'dialysis', 'Regular session, no complications'),
(1001, 1017, 1000, 1000, '2023-06-05', '13:00:00', '16:00:00', 'booked', 'dialysis', NULL),
(1002, 1018, 1001, 1005, '2023-06-02', '10:00:00', '13:00:00', 'canceled', 'dialysis', 'Patient requested cancelation due to feeling unwell'),
(1003, 1016, 1000, 1000, '2023-06-08', '09:00:00', '12:00:00', 'booked', 'dialysis', NULL),
(1004, 1019, 1002, 1006, '2023-06-03', '14:00:00', '15:00:00', 'completed', 'consultation', 'Discussed diet plan changes');

-- Insert CKD records
INSERT INTO ckd_records (id, patient_id, doctor_id, record_date, egfr, creatinine, stage, notes) VALUES
(1000, 1016, 1000, '2023-01-15', 42, 1.8, 3, 'Patient showing stable kidney function.'),
(1001, 1016, 1000, '2023-03-20', 38, 2.1, 3, 'Slight decrease in kidney function. Monitoring closely.'),
(1002, 1016, 1000, '2023-05-10', 35, 2.3, 3, 'Consider adjusting medication regimen.'),
(1003, 1017, 1005, '2023-02-10', 55, 1.3, 3, 'Kidney function improving with current treatment.'),
(1004, 1018, 1006, '2023-04-05', 28, 2.5, 4, 'Significant decline in kidney function. Discussing dialysis options.'),
(1005, 1019, 1012, '2023-03-15', 60, 1.2, 2, 'Early stage CKD. Implementing dietary changes and medication.');

-- Insert CKD stages educational content
INSERT INTO ckd_stages (id, stage, egfr_range, description, diet_recommendations, lifestyle_recommendations, monitoring_recommendations) VALUES
(1000, 1, '90 or higher', 'Normal kidney function but urine findings or structural abnormalities or genetic trait point to kidney disease', 'Maintain a healthy diet with plenty of fruits and vegetables. Limit sodium intake to less than 2,300 mg per day. Stay hydrated with water.', 'Regular exercise (at least 30 minutes, 5 days a week). Maintain healthy weight. Avoid smoking. Limit alcohol consumption.', 'Annual check-up with your doctor. Regular blood pressure monitoring. Blood and urine tests as recommended by your doctor.'),
(1001, 2, '60-89', 'Mild reduction in kidney function, with other findings pointing to kidney disease', 'Limit sodium intake to less than 2,300 mg per day. Maintain adequate protein intake (discuss with your doctor). Consider reducing phosphorus intake. Stay hydrated but don\'t overdo fluid intake.', 'Regular exercise as tolerated. Maintain healthy weight. Avoid smoking and limit alcohol. Manage stress through relaxation techniques.', 'Regular check-ups with your nephrologist. Monitor blood pressure regularly. Blood and urine tests every 6-12 months. Keep track of any new symptoms.'),
(1002, 3, '30-59', 'Moderate reduction in kidney function', 'Work with a renal dietitian to develop a personalized meal plan. Limit sodium to less than 2,000 mg per day. Monitor protein intake (usually 0.8 g/kg body weight). Limit phosphorus and potassium intake. Control fluid intake based on your doctor\'s recommendation.', 'Exercise program approved by your doctor. Maintain healthy weight. Avoid smoking and limit alcohol. Get adequate sleep. Manage stress effectively.', 'Check-ups with your nephrologist every 3-6 months. Monitor blood pressure daily. Regular blood and urine tests. Keep a symptom diary. Medication review with your doctor.'),
(1003, 4, '15-29', 'Severe reduction in kidney function', 'Strict adherence to renal diet prescribed by your dietitian. Low sodium (less than 2,000 mg per day). Controlled protein intake (usually 0.6-0.8 g/kg body weight). Restricted phosphorus, potassium, and fluid intake. Possible calorie supplementation if experiencing poor appetite.', 'Light to moderate exercise as tolerated and approved by your doctor. Conserve energy while staying active. Absolutely no smoking or excessive alcohol. Prioritize rest and stress management. Consider support groups.', 'Frequent check-ups with your nephrologist (every 2-3 months). Daily monitoring of blood pressure, weight, and fluid intake/output. Regular comprehensive blood and urine tests. Discussion about future renal replacement therapy options. Medication adjustments as kidney function changes.'),
(1004, 5, 'Less than 15', 'Kidney failure (dialysis or kidney transplant needed)', 'Very strict renal diet customized to your treatment method. Severely restricted sodium, potassium, and phosphorus. Protein intake adjusted based on dialysis treatment. Strict fluid restriction based on remaining kidney function and treatment. Possible nutritional supplements prescribed by your doctor.', 'Activity as tolerated, with regular rest periods. Structured daily routine around dialysis schedule (if applicable). Meticulous hygiene especially around access sites. No smoking or alcohol. Emotional support through counseling or support groups.', 'Very frequent medical visits (often weekly with dialysis). Strict monitoring of all vital signs and symptoms. Careful tracking of medications and their effects. Dialysis adequacy testing. Transplant evaluation and waitlist status (if applicable).');

-- Insert educational materials
INSERT INTO education_materials (id, title, type, content_summary, target_audience, duration_minutes, last_updated) VALUES
(1000, 'Understanding Chronic Kidney Disease', 'article', 'A comprehensive overview of CKD, its causes, stages, and management strategies.', 'newly diagnosed', 15, '2023-01-10'),
(1001, 'Renal Diet Basics', 'video', 'Nutritionist explains dietary recommendations for CKD patients at different stages.', 'all patients', 22, '2023-02-15'),
(1002, 'Preparing for Dialysis', 'guide', 'Step-by-step preparation guide for patients starting dialysis treatment.', 'stage 4-5', 30, '2023-03-20'),
(1003, 'Medication Management for CKD', 'interactive', 'Interactive tool to help patients understand their medications and potential interactions.', 'all patients', 25, '2023-04-05'),
(1004, 'Living Well with Kidney Disease', 'webinar', 'Recorded webinar featuring patients sharing their experiences and coping strategies.', 'all patients', 45, '2023-05-12');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
