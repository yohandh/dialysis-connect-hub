
// Admin portal type definitions based on DB schema

export type Role = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  roleId: number;
  name: string;
  email: string;
  mobileNo: string;
  status: 'active' | 'inactive';
  password?: string; // Only used for creation/updates, never returned from API
  roleName?: string; // Joined data
  lastLogin?: string;
  createdAt?: string;
};

export type Patient = {
  id: number;
  userId: number;
  gender: 'male' | 'female' | 'other';
  dob: string;
  address: string;
  bloodGroup: string;
  emergencyContactNo: string;
  emergencyContact: string;
  insuranceProvider: string;
  allergies: string;
  chronicConditions: string;
  // User joined data
  name?: string;
  email?: string;
  mobileNo?: string;
};

export type Doctor = {
  id: number;
  userId: number;
  specialization: string;
  address: string;
  emergencyContactNo: string;
  gender: 'male' | 'female' | 'other';
  // User joined data
  name?: string;
  email?: string;
  mobileNo?: string;
};

export type Center = {
  id: number;
  name: string;
  address: string;
  phoneNo: string;
  email: string;
  totalCapacity: number;
  centerHours?: CenterHours[];
};

export type CenterHours = {
  id: number;
  centerId: number;
  weekday: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  openTime: string;
  closeTime: string;
};

export type CenterUser = {
  id: number;
  userId: number;
  centerId: number;
  assignedRole: 'admin' | 'staff' | 'doctor';
  assignedAt: string;
  status: 'active' | 'inactive';
  // Joined data
  userName?: string;
  centerName?: string;
};

export type AppointmentSlot = {
  id: number;
  centerId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  status: 'available' | 'closed' | 'full';
  // Joined data
  centerName?: string;
};

export type Appointment = {
  id: number;
  slotId: number;
  patientId: number;
  staffId: number | null;
  status: 'booked' | 'canceled' | 'rescheduled' | 'completed';
  notes?: string;
  // Joined data
  patientName?: string;
  staffName?: string;
  slotDate?: string;
  slotStartTime?: string;
  slotEndTime?: string;
  centerName?: string;
};

export type DialysisHistory = {
  id: number;
  appointmentId: number;
  patientId: number;
  staffId: number;
  treatmentSummary: string;
  duration: number; // in minutes
  // Joined data
  patientName?: string;
  staffName?: string;
  appointmentDate?: string;
};

export type CkdRecord = {
  id: number;
  patientId: number;
  egfrValue: number;
  creatinineValue: number;
  ckdStage: number;
  note?: string;
  recordedById: number;
  recordedAt: string;
  // Joined data
  patientName?: string;
  recordedByName?: string;
};

export type CkdStage = {
  id: number;
  stageNumber: number;
  minEgfr: number;
  maxEgfr: number;
  description: string;
};

export type EducationMaterial = {
  id: number;
  ckdStage: number;
  langCode: string;
  type: 'diet' | 'lifestyle' | 'general';
  title: string;
  content: string;
};

export type Notification = {
  id: number;
  recipientId: number;
  recipientRole: 'admin' | 'staff' | 'patient' | 'doctor';
  title: string;
  message: string;
  type: 'email' | 'sms' | 'app';
  status: 'sent' | 'failed' | 'read';
  sentAt: string;
  // Joined data
  recipientName?: string;
};

export type AuditLog = {
  id: number;
  tableName: string;
  recordId: number;
  action: 'create' | 'update' | 'delete';
  changedById: number;
  oldData?: any;
  newData?: any;
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
  // Joined data
  changedByName?: string;
};
