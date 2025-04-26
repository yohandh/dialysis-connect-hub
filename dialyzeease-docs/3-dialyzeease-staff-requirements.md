**Comprehensive breakdown of the Staff Portal Features** in **DialyzeEase**, tailored for center-assigned medical staff such as nurses, front-desk personnel, or dialysis technicians.

These features are scoped based on center assignment and exclude patient-sensitive clinical data unless relevant to appointment management.

---

## 👨‍⚕️ **Staff Portal – Features Overview**


### 🏥 1. **Assigned Center Overview**
- 🏷 View assigned dialysis center(s)
- 🕒 View operating hours
- 📊 Monitor center capacity & current utilization
- 📍 Quick access to center-specific appointments and slots

---

### 📆 2. **Appointment Slot Management (Own Centers Only)**
- 📅 View existing appointment slots in calendar/table view
- ➕ Add/Edit/Delete Slots:
  - Slot Date, Start/End Time, Max Capacity, Status
- 🔁 Define recurring time slots (e.g. Mon–Fri 10–11 AM)
- 🛑 Automatically prevent overlapping slots

---

### 📋 3. **Appointment Handling**
- 👥 View upcoming, past, and pending appointments
- 🔄 Book/Reschedule/Cancel appointments on behalf of patients
- 📌 Check patient attendance & slot status (e.g. no-show)
- ✅ Mark appointments as completed

---

### 💉 4. **Dialysis Treatment History Entry**
- 📝 After appointment completion:
  - Enter **treatment summary**
  - Record **treatment duration** (e.g., minutes/hours)
- 🔐 Data saved under `dialysis_histories` table
- 📎 Automatically linked to appointment and patient

---

### 📈 5. **CKD Record Entry**
- 🧪 Input eGFR and creatinine values
- 🧠 System computes CKD stage automatically
- 🗒 Add optional medical notes per reading
- 🔐 All entries stored in `ckd_records` with timestamp and staff ID

---

### 👤 6. **Patient Overview (Non-sensitive)**
- 🔍 View basic patient profile:
  - Name, gender, DOB, emergency contact
- 📅 View patient’s dialysis schedule (appointment list)
- 🚫 Cannot view:
  - Previous CKD data
  - Full dialysis history
  - Internal audit logs or other center assignments

---

### 🔔 7. **Notification Handling**
- 📨 View recent messages/reminders sent to patients
- 🛠 Mark appointment reminders as sent/acknowledged
- 📵 No access to change notification templates

---

### 📊 8. **Performance Metrics (Optional/Future)**
- 📈 View summary counts:
  - Slots managed
  - Appointments handled
  - Dialysis sessions recorded
- 🧾 Download CSV report (optional future feature)

---

### 🔐 Access Control
- 🔒 Can **only view and manage data for assigned centers**
- 🔒 Cannot:
  - Add new users
  - Manage education content
  - Modify centers or roles
  - View centralized audit logs
  - Access sensitive patient health history beyond what's needed for treatment logs

---

Let me know if you'd like this:
- In a **markdown doc or .txt**
- As a **task list or sprint-ready checklist**
- Or converted into a **UI wireframe spec**

You’ve nailed the separation of responsibilities — and this Staff Portal is shaping up to be truly practical and safe 👩‍⚕️🛡️