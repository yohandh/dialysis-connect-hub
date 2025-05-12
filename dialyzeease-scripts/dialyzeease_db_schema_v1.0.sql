
-- ROLES TABLE
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(64) UNIQUE NOT NULL
);

-- USERS TABLE
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT,
  name VARCHAR(128),
  email VARCHAR(128) UNIQUE,
  password VARCHAR(255),
  mobile_no VARCHAR(16),
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- PATIENTS TABLE
CREATE TABLE patients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE,
  gender ENUM('male', 'female', 'other'),
  dob DATE,
  address TEXT,
  blood_group VARCHAR(16),
  emergency_contact_no VARCHAR(16),
  emergency_contact VARCHAR(128),
  insurance_provider VARCHAR(128),
  allergies TEXT,
  chronic_conditions TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- DOCTORS TABLE
CREATE TABLE doctors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE,
  gender ENUM('male', 'female', 'other'),
  address TEXT,
  emergency_contact_no VARCHAR(16),
  specialization VARCHAR(128),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CENTERS TABLE
CREATE TABLE centers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128),
  address TEXT,
  phone_no VARCHAR(16) NULL,
  email VARCHAR(128) NULL,
  total_capacity INT,
  is_active BOOLEAN DEFAULT TRUE
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
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CENTER OPERATING HOURS
CREATE TABLE center_hours (
  id INT PRIMARY KEY AUTO_INCREMENT,
  center_id INT,
  weekday ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'),
  open_time TIME,
  close_time TIME,
  FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- APPOINTMENT SLOTS
CREATE TABLE appointment_slots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  center_id INT,
  slot_date DATE,
  start_time TIME,
  end_time TIME,
  max_capacity INT DEFAULT 1,
  status ENUM('available', 'closed', 'full') DEFAULT 'available',
  created_by_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- APPOINTMENTS
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_slot_id INT,
  patient_id INT,
  staff_id INT,
  status ENUM('booked', 'canceled', 'rescheduled', 'completed'),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_slot_id) REFERENCES appointment_slots(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
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
  FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CKD RECORDS
CREATE TABLE ckd_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT,
  egfr_value FLOAT,
  creatinine_value FLOAT,
  ckd_stage INT,
  note TEXT,
  recorded_by_id INT,
  recorded_at DATETIME,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (recorded_by_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
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
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CENTRALIZED AUDIT LOG TABLE
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
  FOREIGN KEY (changed_by_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- INDEXES
CREATE INDEX idx_user_id ON patients(user_id);
CREATE INDEX idx_patient_id ON appointments(patient_id);
CREATE INDEX idx_center_id ON appointment_slots(center_id);
CREATE INDEX idx_appointment_slot_id ON appointments(appointment_slot_id);
CREATE INDEX idx_recipient_id ON notifications(recipient_id);
