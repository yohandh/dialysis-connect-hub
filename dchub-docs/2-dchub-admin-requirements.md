**Complete list of features** for the **Admin Portal** in the **Dialysis Connect Hub** system — designed specifically for administrative users to manage operations, users, and configurations without accessing private health records.

---

## 🧑‍💼 **Admin Portal – Features Overview**

### 🧍‍♂️ 1. **User Management (All Roles: Admin, Staff, Doctor, Patient)**
- ✅ View all users with filters (role, name, mobile)
- ➕ Add New User
  - Role-based dynamic form (Doctor/Patient-specific fields)
- ✏️ Edit User Details
- 👁 View User Profile (non-sensitive only)
- 🚫 Deactivate/Reactivate User (soft delete)
- 🔁 Change Role / Center assignment

---

### 🏥 2. **Center Management**
- ✅ View All Dialysis Centers
- ➕ Add/Edit Center Details
  - Name, address, contact, capacity
- 🕒 Define Center Operating Hours
  - Per weekday: open & close times
- 📊 Monitor Capacity Utilization (total vs active slots)
- 🔄 Toggle Center Status (active/inactive)

---

### 🤝 3. **Assign Staff & Doctors to Centers**
- 🔁 Assign/Unassign Users (roles: staff, doctor)
- 📋 View Center Assignments
- ⌚ Show assigned date, status
- ✅ Role-based filtering in assignment modal

---

### 🗓️ 4. **Slot Management (Per Center)**
- 📆 View Appointment Slots (calendar + table)
- ➕ Define Slots:
  - Date, start & end time, max capacity, status (`available`, `closed`, `full`)
- 🔁 Recurring Slot Setup (e.g. Mon–Fri, 10–11 AM)
- 🚫 Prevent Overlapping Slot Conflicts
- 🛡️ Only editable by Admin or assigned staff

---

### 📚 5. **CKD Education Material Management**
- ➕ Add/Edit/Delete Education Resources
  - Based on `ckd_stage`, `type` (diet, lifestyle, general), `lang_code`
- 📖 View all materials with filters
- 🌐 Multilingual support

---

### 🔔 6. **Notification Logs**
- 📄 View history of system notifications
  - Sent to users via SMS, email, or in-app
- 🕵️ Filters: recipient role, notification type, status
- ❌ No access to message content for patient privacy

---

### 🛡️ 7. **Audit Logs (System-Wide)**
- 📋 View table of all user actions
- Fields: Table Name, Record ID, Action Type, Changed By, Timestamp
- 🔍 JSON diff: Before & after data (if available)
- 🔐 Useful for compliance, debugging, security reviews

---

### 🧠 8. **Role & Permission Management**
- 🔧 Manage roles via `roles` table (if extended)
- 🛂 Prepare for RBAC model (future-ready)

---

### 🧰 9. **System Administration Utilities**
- ⚙️ Control soft delete states (`is_active`)
- 🔍 Global search across users/centers
- 📶 Monitor system usage metrics (optional future feature)

---

### 🔒 Data Privacy Rules (Hard Enforced)
- ❌ Admins **cannot** view:
  - Patient CKD values (eGFR, creatinine)
  - Dialysis treatment summaries
- ✅ Admins **can** view:
  - Non-medical user info
  - Appointment metadata (date, slot, status)

---

Let me know if you want this in:
- A **Markdown format** for GitHub or Docs
- A **Notion page-style layout**
- A **PDF / Google Slides** one-pager

You’ve now got a full-feature Admin console mapped out. Let’s keep building it with confidence 💪