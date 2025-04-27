
# DiaCare Staff Portal

## Overview

The Staff Portal is a specialized interface designed for healthcare professionals at dialysis centers. It provides tools for managing appointments, monitoring patient treatments, and recording medical data.

## Features

### 1. Appointment Management

- **View Appointments**: Filter and search appointments by date, patient, status, and type
- **Create Appointment Slots**: Add available slots for patients to book
- **Book Appointments**: Schedule appointments on behalf of patients
- **Modify Appointments**: Reschedule or cancel existing appointments
- **Complete Appointments**: Mark appointments as completed after patient visits

### 2. Patient Management

- **Patient Directory**: View all patients at a glance with key information
- **Patient Details**: Access comprehensive patient records
- **Treatment History**: View dialysis treatment history for each patient
- **CKD Monitoring**: Track CKD measurements and stage progression

### 3. Dialysis Treatment Recording

- **Session Documentation**: Record complete dialysis sessions with pre and post measurements
- **Vital Signs**: Track blood pressure, heart rate, and other vital signs
- **Weight Management**: Record pre and post dialysis weight
- **Ultrafiltration**: Set and record ultrafiltration goals and actual values
- **Complications**: Document any complications during sessions

### 4. CKD Measurement

- **eGFR Tracking**: Record estimated Glomerular Filtration Rate
- **Creatinine Levels**: Monitor creatinine levels
- **Automatic Stage Calculation**: System calculates CKD stage based on eGFR values

### 5. Center Management

- **View Assigned Centers**: Staff can see centers they're assigned to
- **Center Capacity**: Monitor current utilization of dialysis machines

## Implementation Details

### API Integration

The Staff Portal connects to backend APIs for data retrieval and storage. Key API endpoints include:

- `/api/staff/{staffId}/centers` - Get centers assigned to a staff member
- `/api/staff/patients` - Get all patients
- `/api/staff/patients/{id}` - Get patient details
- `/api/centers/{centerId}/appointments` - Get appointments for a center
- `/api/appointments` - Create new appointment slots
- `/api/appointments/{id}` - Update or delete appointments
- `/api/patients/{patientId}/dialysis-sessions` - Get dialysis treatment history
- `/api/dialysis-sessions` - Record new dialysis sessions
- `/api/patients/{patientId}/ckd-measurements` - Get CKD measurement history
- `/api/ckd-measurements` - Record new CKD measurements

### Components and Data Flow

1. **StaffAppointments**: Main component for appointment management
   - Retrieves appointments from selected center
   - Provides filters for appointment status and search
   - Handles appointment creation, completion, and cancellation

2. **StaffPatientDetails**: Comprehensive patient view
   - Displays patient information
   - Shows dialysis history 
   - Shows CKD measurements
   - Allows recording new treatments and measurements

3. **DialysisSessionForm**: Form for recording detailed dialysis sessions
   - Captures pre and post dialysis measurements
   - Records complications and notes
   - Submits data to API

4. **CkdMeasurementForm**: Form for recording kidney function
   - Records eGFR and creatinine values
   - Automatically calculates CKD stage
   - Submits data to API

### State Management

- Uses React Query for server state management
- Implements optimistic updates for better UX
- Handles loading and error states

### Mock Data

For development and testing, the system can use mock data instead of real API calls:

```typescript
// Configure in .env file
VITE_USE_MOCK_API=true // Use mock data
VITE_USE_MOCK_API=false // Use real API
```

## Future Enhancements

1. **Treatment Templates**: Predefined templates for common dialysis prescriptions
2. **Patient Education Materials**: Assign educational content based on CKD stage
3. **Lab Result Integration**: Direct import of lab results
4. **Medication Management**: Prescription tracking and renewal reminders
5. **Staff Scheduling**: Manage staff assignments and schedules
6. **Mobile Support**: Enhanced mobile experience for on-the-go access
