Scheduling and Appointments - **Real-World Example Step-by-Step**

---

## 💡 **Real-Life Analogy** (Think Like a Clinic)

Let’s say:
- 📍 There is a **dialysis center** in Colombo.
- 🛏 The center has **10 dialysis beds**.
- 📆 They run 3 dialysis **sessions per weekday** (morning, afternoon, evening).
- 👨‍⚕️ Each session is optionally supervised by a doctor.
- 👩‍🦰 Patients need to **book an appointment** to get a bed in a session.

---

## 🛠️ Now Walk Through the Process — Step by Step

---

### ✅ **Step 1: Define the Center**

```sql
INSERT INTO centers (name, total_capacity) VALUES ('Colombo Kidney Care', 10);
```

---

### ✅ **Step 2: Add Beds**

```sql
INSERT INTO beds (center_id, code) VALUES 
(1, 'BED-A1'), (1, 'BED-A2'), ..., (1, 'BED-A10');
```

---

### ✅ **Step 3: Define a Recurring Session**

```sql
-- Every Monday 10AM–11AM supervised by Dr. Silva
INSERT INTO sessions (center_id, doctor_id, weekday, start_time, end_time, default_capacity)
VALUES (1, 5, 'Mon', '10:00:00', '11:00:00', 10);
```

---

### ✅ **Step 4: System Generates a Session on a Specific Date**

This might happen via cron job or admin panel. Example:

```sql
-- For upcoming Monday, April 8th
INSERT INTO schedule_sessions (center_id, session_id, session_date, start_time, end_time, available_beds, created_by_id)
VALUES (1, 1, '2025-04-08', '10:00:00', '11:00:00', 10, 2);
```

---

### ✅ **Step 5: Assign Beds to Session**

The system (or staff) maps available beds to this session:

```sql
INSERT INTO session_beds (schedule_session_id, bed_id, status)
VALUES 
(1, 1, 'available'), 
(1, 2, 'available'),
... up to 10
;
```

---

### ✅ **Step 6: Patient Books an Appointment**

A patient (user_id: 20) wants to book on April 8 session.

```sql
-- Bed may be assigned later
INSERT INTO appointments (schedule_session_id, patient_id, staff_id, doctor_id, status)
VALUES (1, 20, 4, 5, 'scheduled');
```

Later, bed may be assigned:
```sql
UPDATE appointments SET bed_id = 2 WHERE id = 1;
UPDATE session_beds SET status = 'reserved' WHERE bed_id = 2 AND schedule_session_id = 1;
```

---

## 🧠 Summary of Concepts

| Term                  | Meaning                                                                 |
|-----------------------|-------------------------------------------------------------------------|
| **sessions**          | Weekly recurring time blocks (e.g., Mon 10AM)                           |
| **schedule_sessions** | Real scheduled instance for a specific date (e.g., Apr 8, Mon 10AM)     |
| **beds**              | Physical dialysis machines (e.g., BED-A1)                               |
| **session_beds**      | Mapping of which beds are active/available in a session                 |
| **appointments**      | Actual booking by a patient for a session                               |

---

## 🎯 Business-Level Benefits

- **Session capacity** = count of available `session_beds`
- **Real-time availability** = total beds – booked appointments
- **Audit history** = which staff/doctor handled each patient
- **Flexibility** = cancel/reschedule sessions or mark beds unavailable

---

## 📌 Optional Enhancements

| Feature                        | Table or Logic               |
|--------------------------------|------------------------------|
| Generate slots in advance      | `cron` + `sessions` → `schedule_sessions` |
| Visual calendar in frontend    | Based on `schedule_sessions` |
| Daily availability per center  | Count of available beds per session |
| Overbooking prevention         | Only allow appointments if bed count not exceeded |

---

Would you like me to:
- Generate **sample seed data** for this?
- Create a **flowchart diagram** of this process?
- Build a **Lovable prompt** for managing this in Admin/Staff UI?

You’re *very close* to implementing a world-class scheduling system 💪🩺📆