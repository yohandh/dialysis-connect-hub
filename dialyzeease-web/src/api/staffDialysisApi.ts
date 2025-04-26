
import { useMockApi, apiCall, API_BASE_URL } from "@/config/api.config";

// Types for Dialysis Session
export interface DialysisSession {
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
  status: 'completed' | 'in-progress' | 'cancelled';
}

// Create a new dialysis session
export const createDialysisSession = async (session: Omit<DialysisSession, 'id'>): Promise<DialysisSession> => {
  if (useMockApi()) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a mock ID
    const newId = `session-${Date.now()}`;
    
    // Mock response
    return {
      ...session,
      id: newId
    };
  } else {
    // Real API call
    return await apiCall<DialysisSession>('/dialysis-sessions', {
      method: 'POST',
      body: JSON.stringify(session)
    });
  }
};

// Get dialysis sessions for a patient
export const getDialysisSessionsByPatient = async (patientId: string): Promise<DialysisSession[]> => {
  if (useMockApi()) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - would be stored in a local variable in a real implementation
    return [
      {
        id: "session-1",
        appointmentId: "app-1",
        patientId,
        date: "2023-04-01",
        startTime: "09:00",
        endTime: "13:00",
        duration: 240,
        preWeight: 72.5,
        postWeight: 70.1,
        ultrafiltrationGoal: 2.5,
        actualUltrafiltration: 2.4,
        bloodPressureBefore: {
          systolic: 145,
          diastolic: 90
        },
        bloodPressureAfter: {
          systolic: 135,
          diastolic: 85
        },
        heartRateBefore: 82,
        heartRateAfter: 78,
        notes: "Patient tolerated treatment well",
        complications: [],
        staffId: "staff-1",
        status: 'completed'
      },
      {
        id: "session-2",
        appointmentId: "app-2",
        patientId,
        date: "2023-04-04",
        startTime: "09:00",
        endTime: "13:00",
        duration: 240,
        preWeight: 73.2,
        postWeight: 70.5,
        ultrafiltrationGoal: 2.8,
        actualUltrafiltration: 2.7,
        bloodPressureBefore: {
          systolic: 150,
          diastolic: 92
        },
        bloodPressureAfter: {
          systolic: 132,
          diastolic: 84
        },
        heartRateBefore: 84,
        heartRateAfter: 76,
        notes: "Patient experienced mild cramping at end of treatment",
        complications: ["Cramping"],
        staffId: "staff-1",
        status: 'completed'
      }
    ];
  } else {
    return await apiCall<DialysisSession[]>(`/patients/${patientId}/dialysis-sessions`);
  }
};

// Types for CKD Measurements
export interface CkdMeasurement {
  id: string;
  patientId: string;
  date: string;
  eGFR: number;
  creatinine: number;
  calculatedStage: number;
  notes?: string;
  staffId: string;
}

// Calculate CKD stage based on eGFR
export const calculateCkdStage = (eGFR: number): number => {
  if (eGFR >= 90) return 1;
  if (eGFR >= 60) return 2;
  if (eGFR >= 30) return 3;
  if (eGFR >= 15) return 4;
  return 5;
};

// Create a new CKD measurement
export const createCkdMeasurement = async (
  measurement: Omit<CkdMeasurement, 'id' | 'calculatedStage'>
): Promise<CkdMeasurement> => {
  // Calculate the CKD stage
  const calculatedStage = calculateCkdStage(measurement.eGFR);
  
  if (useMockApi()) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a mock ID
    const newId = `ckd-${Date.now()}`;
    
    // Mock response
    return {
      ...measurement,
      id: newId,
      calculatedStage
    };
  } else {
    return await apiCall<CkdMeasurement>('/ckd-measurements', {
      method: 'POST',
      body: JSON.stringify({
        ...measurement,
        calculatedStage
      })
    });
  }
};

// Get CKD measurements for a patient
export const getCkdMeasurementsByPatient = async (patientId: string): Promise<CkdMeasurement[]> => {
  if (useMockApi()) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    return [
      {
        id: "ckd-1",
        patientId,
        date: "2023-03-15",
        eGFR: 35,
        creatinine: 1.9,
        calculatedStage: 3,
        notes: "Stable kidney function",
        staffId: "staff-1"
      },
      {
        id: "ckd-2",
        patientId,
        date: "2023-02-15",
        eGFR: 38,
        creatinine: 1.8,
        calculatedStage: 3,
        notes: "Slight improvement from last measurement",
        staffId: "staff-1"
      },
      {
        id: "ckd-3",
        patientId,
        date: "2023-01-15",
        eGFR: 32,
        creatinine: 2.1,
        calculatedStage: 3,
        notes: "Initial measurement",
        staffId: "staff-1"
      }
    ];
  } else {
    return await apiCall<CkdMeasurement[]>(`/patients/${patientId}/ckd-measurements`);
  }
};

// Types for Staff Centers
export interface StaffCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  totalCapacity: number;
  currentPatients: number;
}

// Get centers assigned to a staff member
export const getStaffAssignedCenters = async (staffId: string): Promise<StaffCenter[]> => {
  if (useMockApi()) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    return [
      {
        id: "center-1",
        name: "Downtown Dialysis Center",
        address: "123 Main St",
        city: "Metropolis",
        state: "NY",
        totalCapacity: 30,
        currentPatients: 24
      },
      {
        id: "center-2",
        name: "Westside Renal Care",
        address: "456 Park Ave",
        city: "Metropolis",
        state: "NY",
        totalCapacity: 25,
        currentPatients: 18
      }
    ];
  } else {
    return await apiCall<StaffCenter[]>(`/staff/${staffId}/centers`);
  }
};

// Appointment Slot types
export interface AppointmentSlot {
  id: string;
  centerId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'dialysis' | 'consultation' | 'checkup';
  status: 'available' | 'booked' | 'completed' | 'canceled';
  patientId: string | null;
}

// Create a new appointment slot
export interface CreateAppointmentSlotRequest {
  centerId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'dialysis' | 'consultation' | 'checkup';
}

export const createAppointmentSlot = async (
  request: CreateAppointmentSlotRequest
): Promise<AppointmentSlot> => {
  if (useMockApi()) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a mock ID
    const newId = `slot-${Date.now()}`;
    
    // Mock response
    return {
      id: newId,
      ...request,
      status: 'available',
      patientId: null
    };
  } else {
    return await apiCall<AppointmentSlot>('/appointment-slots', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }
};

// Get appointment slots for a center
export const getAppointmentSlotsByCenter = async (centerId: string): Promise<AppointmentSlot[]> => {
  if (useMockApi()) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    return [
      {
        id: "slot-1",
        centerId,
        date: "2023-04-10",
        startTime: "09:00",
        endTime: "12:00",
        type: "dialysis",
        status: "available",
        patientId: null
      },
      {
        id: "slot-2",
        centerId,
        date: "2023-04-10",
        startTime: "13:00",
        endTime: "16:00",
        type: "dialysis",
        status: "booked",
        patientId: "patient-1"
      },
      {
        id: "slot-3",
        centerId,
        date: "2023-04-11",
        startTime: "09:00",
        endTime: "10:00",
        type: "consultation",
        status: "available",
        patientId: null
      }
    ];
  } else {
    return await apiCall<AppointmentSlot[]>(`/centers/${centerId}/appointment-slots`);
  }
};

// Book an appointment for a patient
export interface BookAppointmentRequest {
  slotId: string;
  patientId: string;
}

export const bookAppointment = async (request: BookAppointmentRequest): Promise<AppointmentSlot> => {
  if (useMockApi()) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock response - in a real implementation, would update the slot in a local store
    return {
      id: request.slotId,
      centerId: "center-1", // Mock center ID
      date: "2023-04-10",
      startTime: "09:00",
      endTime: "12:00",
      type: "dialysis",
      status: "booked",
      patientId: request.patientId
    };
  } else {
    return await apiCall<AppointmentSlot>(`/appointment-slots/${request.slotId}/book`, {
      method: 'POST',
      body: JSON.stringify({ patientId: request.patientId })
    });
  }
};

// Mark an appointment as completed
export const completeAppointment = async (slotId: string): Promise<AppointmentSlot> => {
  if (useMockApi()) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock response
    return {
      id: slotId,
      centerId: "center-1", // Mock center ID
      date: "2023-04-10",
      startTime: "09:00",
      endTime: "12:00",
      type: "dialysis",
      status: "completed",
      patientId: "patient-1" // Mock patient ID
    };
  } else {
    return await apiCall<AppointmentSlot>(`/appointment-slots/${slotId}/complete`, {
      method: 'POST'
    });
  }
};

// Cancel an appointment
export const cancelAppointment = async (slotId: string): Promise<AppointmentSlot> => {
  if (useMockApi()) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock response
    return {
      id: slotId,
      centerId: "center-1", // Mock center ID
      date: "2023-04-10",
      startTime: "09:00",
      endTime: "12:00",
      type: "dialysis",
      status: "canceled",
      patientId: null
    };
  } else {
    return await apiCall<AppointmentSlot>(`/appointment-slots/${slotId}/cancel`, {
      method: 'POST'
    });
  }
};

// Delete an appointment slot
export const deleteAppointmentSlot = async (slotId: string): Promise<boolean> => {
  if (useMockApi()) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock response
    return true;
  } else {
    await apiCall<void>(`/appointment-slots/${slotId}`, {
      method: 'DELETE'
    });
    return true;
  }
};

// Patient types for staff view
export interface StaffPatientView {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  ckdStage: number;
  contactPhone: string;
  contactEmail: string;
}

// Get patients for a staff member
export const getStaffPatients = async (): Promise<StaffPatientView[]> => {
  if (useMockApi()) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    return [
      {
        id: "patient-1",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1965-05-15",
        gender: "male",
        bloodType: "A+",
        ckdStage: 4,
        contactPhone: "555-123-4567",
        contactEmail: "john.doe@example.com"
      },
      {
        id: "patient-2",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: "1970-08-22",
        gender: "female",
        bloodType: "O-",
        ckdStage: 5,
        contactPhone: "555-987-6543",
        contactEmail: "jane.smith@example.com"
      },
      {
        id: "patient-3",
        firstName: "Robert",
        lastName: "Johnson",
        dateOfBirth: "1958-12-10",
        gender: "male",
        bloodType: "B+",
        ckdStage: 3,
        contactPhone: "555-456-7890",
        contactEmail: "robert.j@example.com"
      }
    ];
  } else {
    return await apiCall<StaffPatientView[]>('/staff/patients');
  }
};

// Get detailed information about a specific patient
export const getStaffPatientDetail = async (patientId: string): Promise<StaffPatientView> => {
  if (useMockApi()) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    return {
      id: patientId,
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1965-05-15",
      gender: "male",
      bloodType: "A+",
      ckdStage: 4,
      contactPhone: "555-123-4567",
      contactEmail: "john.doe@example.com"
    };
  } else {
    return await apiCall<StaffPatientView>(`/staff/patients/${patientId}`);
  }
};
