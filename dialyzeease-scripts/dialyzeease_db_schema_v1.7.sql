-- ROLES TABLE
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(64) UNIQUE NOT NULL
);

-- USERS TABLE
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT,
  first_name VARCHAR(128),
  last_name VARCHAR(128),
  email VARCHAR(128) UNIQUE,
  password VARCHAR(255),
  mobile_no VARCHAR(16),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at DATETIME DEFAULT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- PATIENTS TABLE
CREATE TABLE patients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE,
  address TEXT,  
  dob DATE,
  gender ENUM('male', 'female', 'other'),
  blood_group VARCHAR(16),
  height VARCHAR(16),
  weight VARCHAR(16),
  allergies TEXT,
  chronic_conditions TEXT,
  emergency_contact_no VARCHAR(16),
  emergency_contact_name VARCHAR(128),
  emergency_contact_relation VARCHAR(64),
  insurance_provider VARCHAR(128),  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  INDEX idx_patients_user_id (user_id)
);

-- DOCTORS TABLE
CREATE TABLE doctors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE,
  emergency_contact_no VARCHAR(16),
  specialization VARCHAR(128),
  medical_license_no VARCHAR(128),
  address TEXT,
  dob DATE,
  gender ENUM('male', 'female', 'other'),
  blood_group VARCHAR(16),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  INDEX idx_doctors_user_id (user_id)
);

-- CENTERS TABLE
CREATE TABLE centers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128),
  address TEXT,
  contact_no VARCHAR(16),
  email VARCHAR(128),
  total_capacity INT,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_centers_name (name)
);

-- CENTER USERS
CREATE TABLE center_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  center_id INT,
  user_id INT,
  assigned_role ENUM('admin', 'staff', 'doctor'),
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive') DEFAULT 'active',
  FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  INDEX idx_center_users_center_id (center_id),
  INDEX idx_center_users_user_id (user_id)
);

-- CENTER OPERATING HOURS
CREATE TABLE center_hours (
  id INT PRIMARY KEY AUTO_INCREMENT,
  center_id INT,
  weekday ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'),
  open_time TIME,
  close_time TIME,
  FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  INDEX idx_center_hours_center_id (center_id)
);

-- BEDS / MACHINES
CREATE TABLE beds (
  id INT PRIMARY KEY AUTO_INCREMENT,
  center_id INT,
  code VARCHAR(32),
  status ENUM('active', 'inactive') DEFAULT 'active',
  FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  INDEX idx_beds_center_id (center_id)
);

-- SESSIONS
CREATE TABLE sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  center_id INT,
  doctor_id INT NULL, -- Optional: Assign a specific doctor for the session
  weekday ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'),
  start_time TIME,
  end_time TIME,
  default_capacity INT,
  recurrence_pattern ENUM('daily', 'weekly') DEFAULT 'daily',
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_by_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE NO ACTION,
  FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  INDEX idx_sessions_center_id (center_id),
  INDEX idx_sessions_doctor_id (doctor_id),
  INDEX idx_sessions_created_by_id (created_by_id)
);

-- SCHEDULED SESSIONS
CREATE TABLE schedule_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  center_id INT,
  session_id INT NULL,
  session_date DATE,
  start_time TIME,
  end_time TIME,
  available_beds INT,
  notes TEXT,
  status ENUM('scheduled', 'in-progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_by_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  INDEX idx_schedule_sessions_center_id (center_id),
  INDEX idx_schedule_sessions_session_id (session_id),
  INDEX idx_schedule_sessions_created_by_id (created_by_id)
);

-- BEDS ASSIGNED TO SESSIONS
CREATE TABLE session_beds (
  id INT PRIMARY KEY AUTO_INCREMENT,
  schedule_session_id INT,
  bed_id INT,
  notes TEXT,
  status ENUM('available', 'unavailable', 'reserved') DEFAULT 'available',
  FOREIGN KEY (schedule_session_id) REFERENCES schedule_sessions(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (bed_id) REFERENCES beds(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  INDEX idx_session_beds_schedule_session_id (schedule_session_id),
  INDEX idx_session_beds_bed_id (bed_id)
);

-- PATIENT APPOINTMENTS
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  schedule_session_id INT,
  bed_id INT NULL,
  patient_id INT,
  staff_id INT,
  doctor_id INT NULL,
  notes TEXT,
  status ENUM('scheduled', 'completed', 'cancelled', 'no-show') DEFAULT 'scheduled',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (schedule_session_id) REFERENCES schedule_sessions(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (bed_id) REFERENCES beds(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  INDEX idx_appointments_schedule_session_id (schedule_session_id),
  INDEX idx_appointments_bed_id (bed_id),
  INDEX idx_appointments_patient_id (patient_id),
  INDEX idx_appointments_staff_id (staff_id),
  INDEX idx_appointments_doctor_id (doctor_id)
);

-- DIALYSIS HISTORY
CREATE TABLE dialysis_histories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id INT,
  patient_id INT,
  staff_id INT,
  treatment_summary TEXT,
  duration INT,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  INDEX idx_dialysis_histories_appointment_id (appointment_id),
  INDEX idx_dialysis_histories_patient_id (patient_id),
  INDEX idx_dialysis_histories_staff_id (staff_id)
);

-- CKD RECORDS
CREATE TABLE ckd_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT,
  egfr_value FLOAT,
  creatinine_value FLOAT,
  ckd_stage INT,
  notes TEXT,
  recorded_by_id INT,
  recorded_at DATETIME,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (recorded_by_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  INDEX idx_ckd_records_patient_id (patient_id),
  INDEX idx_ckd_records_recorded_by_id (recorded_by_id)
);

-- CKD STAGES TABLE
CREATE TABLE ckd_stages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  stage_number INT,
  min_egfr FLOAT,
  max_egfr FLOAT,
  description TEXT
);

-- EDUCATION MATERIALS
CREATE TABLE education_materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ckd_stage INT,
  lang_code VARCHAR(8) DEFAULT 'en',
  type ENUM('diet', 'lifestyle', 'general'),
  title VARCHAR(255),
  content TEXT
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recipient_id INT,
  recipient_role ENUM('admin', 'staff', 'patient', 'doctor'),
  title VARCHAR(128),
  message TEXT,
  type ENUM('email', 'sms', 'app'),
  status ENUM('pending', 'sent', 'failed', 'read'),
  sent_at DATETIME,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  INDEX idx_notifications_recipient_id (recipient_id)
);

-- CENTRALIZED AUDIT LOGS
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  table_name VARCHAR(128),
  record_id INT,
  action ENUM('create', 'update', 'delete'),
  changed_by_id INT,
  old_data JSON,
  new_data JSON,
  ip_address VARCHAR(64),
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (changed_by_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  INDEX idx_audit_logs_changed_by_id (changed_by_id)
);
