
-- SESSION TEMPLATES (Recurring Weekly Schedule)
CREATE TABLE session_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  center_id INT,
  weekday ENUM('Mon','Tue','Wed','Thu','Fri','Sat','Sun'),
  start_time TIME,
  end_time TIME,
  default_capacity INT,
  created_by_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (center_id) REFERENCES centers(id),
  FOREIGN KEY (created_by_id) REFERENCES users(id)
);

-- SCHEDULED SESSIONS (Calendar-specific sessions)
CREATE TABLE schedule_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  center_id INT,
  session_template_id INT NULL,
  session_date DATE,
  start_time TIME,
  end_time TIME,
  available_beds INT,
  status ENUM('open', 'partial', 'cancelled', 'full') DEFAULT 'open',
  note TEXT,
  created_by_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (center_id) REFERENCES centers(id),
  FOREIGN KEY (session_template_id) REFERENCES session_templates(id),
  FOREIGN KEY (created_by_id) REFERENCES users(id)
);

-- BEDS / MACHINES
CREATE TABLE beds (
  id INT PRIMARY KEY AUTO_INCREMENT,
  center_id INT,
  code VARCHAR(32),
  status ENUM('active', 'under_maintenance') DEFAULT 'active',
  FOREIGN KEY (center_id) REFERENCES centers(id)
);

-- BEDS ASSIGNED TO SESSION
CREATE TABLE session_beds (
  id INT PRIMARY KEY AUTO_INCREMENT,
  schedule_session_id INT,
  bed_id INT,
  is_available BOOLEAN DEFAULT TRUE,
  note TEXT,
  FOREIGN KEY (schedule_session_id) REFERENCES schedule_sessions(id),
  FOREIGN KEY (bed_id) REFERENCES beds(id)
);

-- PATIENT APPOINTMENTS (updated version)
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  schedule_session_id INT,
  bed_id INT NULL,
  patient_id INT,
  staff_id INT,
  status ENUM('booked', 'completed', 'canceled', 'rescheduled'),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (schedule_session_id) REFERENCES schedule_sessions(id),
  FOREIGN KEY (bed_id) REFERENCES beds(id),
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (staff_id) REFERENCES users(id)
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_schedule_session_id ON appointments(schedule_session_id);
CREATE INDEX idx_bed_id ON appointments(bed_id);
CREATE INDEX idx_session_beds_id ON session_beds(schedule_session_id);
