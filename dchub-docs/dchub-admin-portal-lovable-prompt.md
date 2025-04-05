
📌 Build the **Admin Portal UI** for **Dialysis Connect Hub** using the provided database schema.

This portal is designed for administrative users to manage users, dialysis centers, appointment slots, assignments, and education material. The admin should have access to all features but must adhere to privacy rules (e.g., no access to sensitive health data directly).

---

🧑‍💼 USER MANAGEMENT (patients, staff, doctors, admins)

Generate a unified user management interface that supports role-based forms and displays:

- User List View:
  - Paginated, searchable, and filterable by role, name, or mobile number
  - Columns: Name, Email, Mobile, Role, Status
  - Actions per row: ➕ Add, ✏️ Edit, 👁 View, 🗑 Deactivate

- Add/Edit User Dialog:
  - Base Fields: Full Name, Email, Mobile No, Password, Role (dropdown from `roles`)
  - Role = patient → show: DOB, Blood Group, Address, Insurance Provider, Emergency Contact
  - Role = doctor → show: Specialization, Address, Emergency Contact No, Gender
  - Role = staff → show: Gender, (optional) Designation
  - Field visibility and validation should dynamically adjust based on selected Role

- View Details Dialog/Page:
  - Show only non-sensitive profile information
  - Include assigned centers (if any)
  - For staff: show slot management summary
  - For doctors: show specialization and assigned centers
  - DO NOT show any direct medical records, CKD readings, or appointment history with personal treatment details

---

🏥 CENTER MANAGEMENT

Allow Admins to manage dialysis centers including contact info, operating hours, capacity, and user assignments.

- Center List View:
  - Searchable table or cards of centers
  - Display Name, Phone, City, Capacity (used/total), Status
  - Actions: View, Edit, Assign Staff/Doctor

- Center Detail View:
  - Contact info, address
  - Operating Hours (Mon–Sun with open/close time)
  - Assigned users table (staff/doctors)
  - Slot listing (tabular/calendar style)
  - Statistics: % utilization, total appointments

---

🔧 ASSIGNMENT MANAGEMENT (Center ↔ Users)

Allow Admins to assign staff and doctors to centers:

- Modal to assign user (role = staff/doctor) to a center
- Fields: user selector, assigned_role dropdown
- List current assignments with actions to unassign

---

📆 SLOT MANAGEMENT

Admins and assigned staff can manage appointment slots per center:

- View slot calendar or date-wise slot table
- Add/Edit/Delete slot actions:
  - Fields: Date, Start Time, End Time, Max Capacity, Status (`available`, `closed`, `full`)
- Prevent slot overlaps for same center/time
- Optional: define recurring patterns (Mon–Fri, 10–11AM)

---

📚 EDUCATION MATERIALS

Admins can manage educational resources for CKD patients:

- Add/Edit/Delete materials
- Fields: CKD Stage (linked to `ckd_stages`), Language Code (`lang_code`), Type (`diet`, `lifestyle`, `general`), Title, Content

---

🔔 NOTIFICATIONS OVERVIEW

View logs of notifications sent to users:

- Filter by recipient role or type
- Status: sent, failed, read
- Show only metadata: title, type, timestamp — DO NOT expose message body to admins for patient-specific notifications

---

🛡️ AUDIT LOGS (Admin Only)

Show audit log table for internal accountability:

- Fields: Table Name, Record ID, Action, Changed By, Timestamp
- View JSON diff for old_data → new_data (if available)

---

🔒 RULES & CONSTRAINTS

- Admins can view and manage all data but cannot view:
  - Patients’ health readings (CKD)
  - Dialysis history content
- Use dialog modals for Add/Edit wherever applicable
- Use role-based UI rendering logic
- All deletions should use a “soft delete” mechanism (toggle active/inactive)
- Every form and detail view must respect the role context and avoid exposing sensitive medical info

---

🎨 DESIGN GUIDELINES

- Use clean, responsive, and accessible design
- Modals for Create/Edit, pages for detailed center/user views
- Role badges with color coding
- Tables with filters, search, pagination
- Optional: use TailwindCSS components or equivalent utility-first design

---

✅ COMPONENT CHECKLIST

- [x] Role-Based User CRUD (Patient, Staff, Doctor, Admin)
- [x] Center Management + Assignment
- [x] Center Hours Setup
- [x] Slot Creation/Editing (Per Center)
- [x] Education Material CRUD
- [x] Notification Log (meta only)
- [x] Audit Log Viewer
