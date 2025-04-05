
# DiaCare API Models

This document outlines the data models used in API requests and responses for the DiaCare system.

## Authentication

### Login Request
```typescript
interface LoginRequest {
  email: string;
  password: string;
  role: 'patient' | 'staff' | 'admin';
}
```

### Login Response
```typescript
interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'patient' | 'staff' | 'admin';
  };
}
```

## Patients

### Patient Model
```typescript
interface Patient {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodType: string;
  height: number;
  weight: number;
  ckdStage: number;
  diagnosisDate: string;
  dialysisStartDate?: string;
  accessType?: 'fistula' | 'graft' | 'catheter';
  primaryNephrologist: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  comorbidities: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
}
```

## Appointments

### Appointment Model
```typescript
interface Appointment {
  id: string;
  patientId: string | null;
  centerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'booked' | 'canceled' | 'completed' | 'available';
  type: 'dialysis' | 'consultation' | 'checkup';
  notes?: string;
}
```

### Create Appointment Request
```typescript
interface CreateAppointmentRequest {
  centerId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'dialysis' | 'consultation' | 'checkup';
}
```

### Book Appointment Request
```typescript
interface BookAppointmentRequest {
  patientId: string;
}
```

## Dialysis Centers

### Center Model
```typescript
interface DialysisCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  capacity: number;
  currentPatients: number;
  operatingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  nephrologists: string[];
}
```

## Dialysis Sessions

### Dialysis Session Model
```typescript
interface DialogysisSession {
  id: string;
  appointmentId: string;
  patientId: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  preWeight: number; // in kg
  postWeight: number; // in kg
  ultrafiltrationGoal: number; // in liters
  actualUltrafiltration: number; // in liters
  bloodPressureBefore: {
    systolic: number;
    diastolic: number;
  };
  bloodPressureAfter: {
    systolic: number;
    diastolic: number;
  };
  heartRateBefore: number;
  heartRateAfter: number;
  notes: string;
  complications: string[];
  staffId: string;
  date: string;
}
```

## CKD Measurements

### CKD Measurement Model
```typescript
interface CkdMeasurement {
  id: string;
  patientId: string;
  date: string;
  eGFR: number;
  creatinine: number;
  calculatedStage: number;
  notes?: string;
  staffId: string;
}
```

## Staff

### Staff Model
```typescript
interface Staff {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  specialization: string;
  assignedCenters: string[];
  licenseNumber: string;
  joinDate: string;
}
```

## Users

### User Model
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'staff' | 'admin';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}
```

## Error Response

```typescript
interface ErrorResponse {
  message: string;
  error?: any;
}
```
