
# Dialysis Connect Database Schema

## Overview

This document outlines the database schema for the Dialysis Connect application. The schema is designed to support the management of dialysis centers, patients, appointments, and related healthcare information.

## Tables

### 1. users
Stores all users of the system (patients, staff, admins).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| first_name | VARCHAR | User's first name |
| last_name | VARCHAR | User's last name |
| email | VARCHAR | User's email (unique) |
| password_hash | VARCHAR | Hashed password |
| role_id | UUID | Foreign key to roles table |
| date_of_birth | DATE | User's date of birth |
| phone | VARCHAR | User's phone number |
| profile_image | VARCHAR | URL to profile image |
| created_at | TIMESTAMP | When the user was created |
| last_login | TIMESTAMP | Last time user logged in |
| status | ENUM | active, inactive, suspended |

### 2. roles
Defines user roles and permissions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Role name (admin, staff, patient) |
| description | TEXT | Description of the role |
| permissions | JSONB | JSON of role permissions |

### 3. patient_records
Stores patient-specific medical information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users table |
| blood_type | ENUM | A+, A-, B+, B-, AB+, AB-, O+, O- |
| height | FLOAT | Height in cm |
| weight | FLOAT | Weight in kg |
| primary_nephrologist_id | UUID | Foreign key to staff in users table |
| diagnosis_date | DATE | When CKD was diagnosed |
| ckd_stage | INT | 1-5, stage of chronic kidney disease |
| dialysis_start_date | DATE | When dialysis treatment started |
| access_type | ENUM | fistula, graft, catheter |
| preferred_center_id | UUID | Foreign key to dialysis_centers |

### 4. patient_medical_history
Stores detailed medical history for patients.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | Foreign key to patient_records |
| comorbidities | JSONB | Array of comorbid conditions |
| allergies | JSONB | Array of allergies |
| notes | TEXT | Medical notes |

### 5. emergency_contacts
Stores emergency contact information for patients.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | Foreign key to patient_records |
| name | VARCHAR | Contact name |
| relationship | VARCHAR | Relationship to patient |
| phone | VARCHAR | Contact phone |
| email | VARCHAR | Contact email |
| is_primary | BOOLEAN | Whether this is the primary contact |

### 6. medications
Stores information about medications.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | Foreign key to patient_records |
| name | VARCHAR | Medication name |
| dosage | VARCHAR | Dosage information |
| frequency | VARCHAR | How often medication is taken |
| start_date | DATE | When medication was started |
| end_date | DATE | When medication was ended (if applicable) |
| active | BOOLEAN | Whether prescription is active |

### 7. dialysis_centers
Stores information about dialysis centers.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Center name |
| address | TEXT | Center address |
| city | VARCHAR | City |
| state | VARCHAR | State |
| zip_code | VARCHAR | ZIP code |
| phone | VARCHAR | Center phone |
| email | VARCHAR | Center email |
| capacity | INT | Number of dialysis stations |
| operating_hours | JSONB | Operating hours by day |
| description | TEXT | Center description |

### 8. appointments
Stores actual appointments (booked sessions).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | Foreign key to patient_records |
| staff_id | UUID | Foreign key to users (staff) |
| center_id | UUID | Foreign key to dialysis_centers |
| appointment_slot_id | UUID | Foreign key to appointment_slots |
| date | DATE | Appointment date |
| start_time | TIME | Start time |
| end_time | TIME | End time |
| status | ENUM | booked, canceled, completed |
| type | ENUM | dialysis, consultation, checkup |
| notes | TEXT | Appointment notes |
| created_at | TIMESTAMP | When appointment was created |
| updated_at | TIMESTAMP | Last modified |

### 9. appointment_slots
Stores pre-created available time slots for appointments.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| center_id | UUID | Foreign key to dialysis_centers |
| date | DATE | Slot date |
| start_time | TIME | Start time |
| end_time | TIME | End time |
| capacity | INT | How many appointments can be booked in this slot |
| booked_count | INT | Number of appointments currently booked |
| status | ENUM | available, fully_booked, blocked |

### 10. dialysis_sessions
Records details of completed dialysis sessions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| appointment_id | UUID | Foreign key to appointments |
| pre_weight | FLOAT | Pre-dialysis weight in kg |
| post_weight | FLOAT | Post-dialysis weight in kg |
| duration | INT | Session duration in minutes |
| ultrafiltration | FLOAT | Ultrafiltration volume |
| blood_flow_rate | INT | Blood flow rate |
| dialysate_flow_rate | INT | Dialysate flow rate |
| notes | TEXT | Session notes |
| complications | JSONB | Any complications during session |

### 11. ckd_records
Stores eGFR/Creatinine readings & CKD stage progression.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| patient_id | UUID | Foreign key to patient_records |
| test_date | DATE | Date of test |
| egfr | FLOAT | Estimated Glomerular Filtration Rate |
| creatinine | FLOAT | Creatinine levels |
| ckd_stage | INT | CKD stage determined by readings |
| notes | TEXT | Comments on test results |

### 12. education_materials
Stores diet/lifestyle tips & educational content by CKD stage.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR | Material title |
| content | TEXT | Material content |
| ckd_stage | INT | Relevant CKD stage (1-5) |
| category | ENUM | diet, exercise, medication, general |
| format | ENUM | text, video, pdf |
| url | VARCHAR | URL if external resource |
| created_at | TIMESTAMP | When created |
| updated_at | TIMESTAMP | Last updated |

## Relationships

- A user has one role
- A patient_record belongs to one user
- A patient_record has one primary_nephrologist (staff user)
- A patient_record has many appointments
- A patient_record has many medications
- A patient_record has many emergency_contacts
- A patient_record belongs to one preferred dialysis_center
- An appointment belongs to one patient_record
- An appointment belongs to one staff (optional)
- An appointment belongs to one dialysis_center
- An appointment belongs to one appointment_slot
- An appointment has one dialysis_session (if completed)
- A dialysis_center has many appointment_slots
- A dialysis_center has many appointments

## Indexes

- users: email (unique), role_id
- patient_records: user_id (unique), primary_nephrologist_id, preferred_center_id
- appointments: patient_id, staff_id, center_id, date, status
- appointment_slots: center_id, date, status
- ckd_records: patient_id, test_date
- medications: patient_id, active
