import { useMockApi, apiCall } from "@/config/api.config";
import { appointments, Appointment } from "@/data/appointmentData";
import { patients, PatientRecord } from "@/data/patientData";
import { users } from "@/data/userData";
import { dialysisCenters } from "@/data/centerData";
import { DialysisCenter } from "@/types/centerTypes";
import { getUserById, normalizeUser } from "@/data/userData";
import { getUserFirstName, getUserLastName } from "@/utils/userUtils";
import { getScheduleSessionsByCenterAndDate, convertScheduleSessionsToAppointments } from "@/data/scheduleSessionData";

// Types
export interface DialogysisSession {
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

// Mock data for dialysis sessions and CKD measurements
const mockDialysisSessions: DialogysisSession[] = [
  {
    id: "session-001",
    appointmentId: "apt-001",
    patientId: "user-001",
    startTime: "09:00",
    endTime: "12:00",
    duration: 180,
    preWeight: 82.5,
    postWeight: 80.1,
    ultrafiltrationGoal: 2.5,
    actualUltrafiltration: 2.4,
    bloodPressureBefore: {
      systolic: 145,
      diastolic: 85
    },
    bloodPressureAfter: {
      systolic: 135,
      diastolic: 80
    },
    heartRateBefore: 75,
    heartRateAfter: 72,
    notes: "Patient tolerated session well",
    complications: [],
    staffId: "staff-001",
    date: "2025-06-01"
  },
  {
    id: "session-002",
    appointmentId: "apt-004",
    patientId: "user-001",
    startTime: "09:00",
    endTime: "12:00",
    duration: 180,
    preWeight: 83.2,
    postWeight: 80.5,
    ultrafiltrationGoal: 2.5,
    actualUltrafiltration: 2.7,
    bloodPressureBefore: {
      systolic: 150,
      diastolic: 90
    },
    bloodPressureAfter: {
      systolic: 130,
      diastolic: 75
    },
    heartRateBefore: 78,
    heartRateAfter: 70,
    notes: "Patient experienced mild cramping at 2-hour mark",
    complications: ["Cramping"],
    staffId: "staff-001",
    date: "2025-06-08"
  }
];

const mockCkdMeasurements: CkdMeasurement[] = [
  {
    id: "ckd-001",
    patientId: "user-001",
    date: "2025-05-01",
    eGFR: 42,
    creatinine: 1.8,
    calculatedStage: 3,
    notes: "Patient showing stable kidney function",
    staffId: "staff-001"
  },
  {
    id: "ckd-002",
    patientId: "user-001",
    date: "2025-05-15",
    eGFR: 38,
    creatinine: 2.1,
    calculatedStage: 3,
    notes: "Slight decrease in kidney function, monitoring",
    staffId: "staff-001"
  }
];

// Mock API delays
const API_DELAY = 300;

// Function to calculate CKD stage based on eGFR value
export const calculateCkdStage = (eGFR: number): number => {
  if (eGFR >= 90) return 1;
  if (eGFR >= 60) return 2;
  if (eGFR >= 30) return 3;
  if (eGFR >= 15) return 4;
  return 5;
};

// Staff API functions
// 1. Get assigned centers
export const getAssignedCenters = async (staffId: string): Promise<DialysisCenter[]> => {
  try {
    if (useMockApi()) {
      // Mock implementation - Return all centers for now
      // In a real app, this would filter based on staff assignments
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      return dialysisCenters;
    } else {
      return await apiCall<DialysisCenter[]>(`/staff/${staffId}/centers`);
    }
  } catch (error) {
    console.error("Failed to fetch assigned centers:", error);
    // Fallback to mock data on failure
    return dialysisCenters;
  }
};

// 2. Get all patients
export const getAllPatients = async (): Promise<PatientRecord[]> => {
  try {
    // Always use real API data for patient dropdown in admin interface
    console.log('Fetching real patient data from API');
    return await apiCall<PatientRecord[]>('/staff/patients');
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    // Only fallback to mock data if there's an error
    console.warn("Falling back to mock patient data due to API error");
    
    // Enrich mock patient data for fallback
    const enrichedPatients = patients.map(patient => {
      const user = users.find(u => String(u.id) === patient.userId);
      if (user) {
        const normalizedUser = normalizeUser(user);
        return {
          ...patient,
          firstName: normalizedUser.firstName,
          lastName: normalizedUser.lastName,
          email: normalizedUser.email
        };
      }
      return patient;
    });
    return enrichedPatients;
  }
};

// 3. Get patient details
export const getPatientDetails = async (id: string): Promise<PatientRecord | null> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      const patient = patients.find(p => p.id === id);
      if (!patient) return null;
      
      return patient;
    } else {
      return await apiCall<PatientRecord>(`/staff/patients/${id}`);
    }
  } catch (error) {
    console.error(`Failed to fetch patient details for ID ${id}:`, error);
    return null;
  }
};

// 4. Appointment/Slot Management
// 4.1 Get appointments by center
export const getAppointmentsByCenter = async (centerId: string): Promise<Appointment[]> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      return appointments.filter(apt => apt.centerId === centerId);
    } else {
      return await apiCall<Appointment[]>(`/centers/${centerId}/appointments`);
    }
  } catch (error) {
    console.error(`Failed to fetch appointments for center ${centerId}:`, error);
    // Fallback to mock data
    return appointments.filter(apt => apt.centerId === centerId);
  }
};

// 4.2 Create appointment slot
export interface CreateAppointmentSlotRequest {
  centerId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'dialysis' | 'consultation' | 'checkup';
  patientId?: string;
}

export const createAppointmentSlot = async (data: CreateAppointmentSlotRequest): Promise<Appointment> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      const newId = `apt-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
      const newAppointment: Appointment = {
        id: newId,
        patientId: data.patientId || null,
        centerId: data.centerId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.patientId ? 'scheduled' : 'scheduled',
        type: data.type
      };
      
      appointments.push(newAppointment);
      return newAppointment;
    } else {
      return await apiCall<Appointment>('/appointments', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    }
  } catch (error) {
    console.error("Failed to create appointment slot:", error);
    throw error;
  }
};

// 4.3 Update appointment slot
export interface UpdateAppointmentRequest {
  id: string;
  patientId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  type?: 'dialysis' | 'consultation' | 'checkup';
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export const updateAppointment = async (data: UpdateAppointmentRequest): Promise<Appointment> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      const index = appointments.findIndex(a => a.id === data.id);
      if (index === -1) throw new Error("Appointment not found");
      
      // Convert any non-standard status to a valid Appointment status
      let appointmentStatus: Appointment['status'] = 'scheduled';
      if (data.status) {
        if (data.status === 'completed' || data.status === 'scheduled' || 
            data.status === 'in-progress' || data.status === 'cancelled' || 
            data.status === 'no-show') {
          appointmentStatus = data.status;
        } else if (data.status === 'booked') {
          appointmentStatus = 'scheduled';
        } else if (data.status === 'canceled') {
          appointmentStatus = 'cancelled';
        }
      }
      
      const updatedAppointment = {
        ...appointments[index],
        ...data,
        status: appointmentStatus
      };
      
      appointments[index] = updatedAppointment;
      return updatedAppointment;
    } else {
      return await apiCall<Appointment>(`/appointments/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    }
  } catch (error) {
    console.error(`Failed to update appointment ${data.id}:`, error);
    throw error;
  }
};

// 4.4 Delete appointment slot
export const deleteAppointmentSlot = async (id: string): Promise<boolean> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      const index = appointments.findIndex(a => a.id === id);
      if (index === -1) throw new Error("Appointment not found");
      
      appointments.splice(index, 1);
      return true;
    } else {
      await apiCall<void>(`/appointments/${id}`, {
        method: 'DELETE'
      });
      return true;
    }
  } catch (error) {
    console.error(`Failed to delete appointment ${id}:`, error);
    throw error;
  }
};

// 4.5 Book appointment for patient
export const bookAppointmentForPatient = async (appointmentId: string, patientId: string): Promise<Appointment> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      const index = appointments.findIndex(a => a.id === appointmentId);
      if (index === -1) throw new Error("Appointment not found");
      
      if (appointments[index].status !== 'scheduled') {
        throw new Error("Appointment is not available");
      }
      
      const updatedAppointment: Appointment = {
        ...appointments[index],
        patientId,
        status: 'scheduled' // Use 'scheduled' instead of 'booked'
      };
      
      appointments[index] = updatedAppointment;
      return updatedAppointment;
    } else {
      console.log(`Booking appointment with ID: ${appointmentId}`);
      
      // Check if the appointmentId is a slot ID (format: slot-centerId-sessionId-date)
      if (appointmentId.startsWith('slot-')) {
        // Use the new slot-booking endpoint
        console.log(`Using slot-booking endpoint with slotId: ${appointmentId}`);
        return await apiCall<Appointment>(`/appointments/slot-booking`, {
          method: 'POST',
          body: JSON.stringify({ 
            slotId: appointmentId,
            patientId 
          })
        });
      } else {
        // Use the regular appointment ID endpoint
        return await apiCall<Appointment>(`/appointments/${appointmentId}/book`, {
          method: 'POST',
          body: JSON.stringify({ patientId })
        });
      }
    }
  } catch (error) {
    console.error(`Failed to book appointment ${appointmentId} for patient ${patientId}:`, error);
    throw error;
  }
};

// 4.6 Cancel appointment
export const cancelAppointment = async (appointmentId: string): Promise<Appointment> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      const index = appointments.findIndex(a => a.id === appointmentId);
      if (index === -1) throw new Error("Appointment not found");
      
      const updatedAppointment: Appointment = {
        ...appointments[index],
        status: 'cancelled' // Use 'cancelled' instead of 'canceled'
      };
      
      appointments[index] = updatedAppointment;
      return updatedAppointment;
    } else {
      return await apiCall<Appointment>(`/appointments/${appointmentId}/cancel`, {
        method: 'POST'
      });
    }
  } catch (error) {
    console.error(`Failed to cancel appointment ${appointmentId}:`, error);
    throw error;
  }
};

// 4.7 Mark appointment as completed
export const completeAppointment = async (appointmentId: string): Promise<Appointment> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      const index = appointments.findIndex(a => a.id === appointmentId);
      if (index === -1) throw new Error("Appointment not found");
      
      const updatedAppointment: Appointment = {
        ...appointments[index],
        status: 'completed' as const
      };
      
      appointments[index] = updatedAppointment;
      return updatedAppointment;
    } else {
      return await apiCall<Appointment>(`/appointments/${appointmentId}/complete`, {
        method: 'POST'
      });
    }
  } catch (error) {
    console.error(`Failed to mark appointment ${appointmentId} as completed:`, error);
    throw error;
  }
};

// 5. Dialysis Treatment History
// 5.1 Get treatment history for a patient
export const getDialysisTreatmentHistory = async (patientId: string): Promise<DialogysisSession[]> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      return mockDialysisSessions.filter(session => session.patientId === patientId);
    } else {
      return await apiCall<DialogysisSession[]>(`/patients/${patientId}/dialysis-sessions`);
    }
  } catch (error) {
    console.error(`Failed to fetch dialysis treatment history for patient ${patientId}:`, error);
    // Fallback to mock data
    return mockDialysisSessions.filter(session => session.patientId === patientId);
  }
};

// 5.2 Record new dialysis session
export const recordDialysisSession = async (session: Omit<DialogysisSession, 'id'>): Promise<DialogysisSession> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      const newId = `session-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
      const newSession = {
        ...session,
        id: newId
      };
      
      mockDialysisSessions.push(newSession);
      return newSession;
    } else {
      return await apiCall<DialogysisSession>('/dialysis-sessions', {
        method: 'POST',
        body: JSON.stringify(session)
      });
    }
  } catch (error) {
    console.error("Failed to record dialysis session:", error);
    throw error;
  }
};

// 6. CKD Values
// 6.1 Get CKD measurements for a patient
export const getCkdMeasurements = async (patientId: string): Promise<CkdMeasurement[]> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      return mockCkdMeasurements.filter(measurement => measurement.patientId === patientId);
    } else {
      return await apiCall<CkdMeasurement[]>(`/patients/${patientId}/ckd-measurements`);
    }
  } catch (error) {
    console.error(`Failed to fetch CKD measurements for patient ${patientId}:`, error);
    // Fallback to mock data
    return mockCkdMeasurements.filter(measurement => measurement.patientId === patientId);
  }
};

// 6.2 Record new CKD measurement
export const recordCkdMeasurement = async (data: Omit<CkdMeasurement, 'id' | 'calculatedStage'>): Promise<CkdMeasurement> => {
  try {
    // Calculate CKD stage based on eGFR
    const calculatedStage = calculateCkdStage(data.eGFR);
    
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      const newId = `ckd-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
      const newMeasurement = {
        ...data,
        id: newId,
        calculatedStage
      };
      
      mockCkdMeasurements.push(newMeasurement);
      return newMeasurement;
    } else {
      return await apiCall<CkdMeasurement>('/ckd-measurements', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          calculatedStage
        })
      });
    }
  } catch (error) {
    console.error("Failed to record CKD measurement:", error);
    throw error;
  }
};

// Helper function to get patient name by ID
export const getPatientName = (patientId: string): string => {
  const patient = patients.find(p => p.userId === patientId);
  if (!patient) return "Unknown Patient";
  
  const user = users.find(u => String(u.id) === patientId);
  if (!user) return "Unknown Patient";
  
  const normalizedUser = normalizeUser(user);
  return `${normalizedUser.firstName || "Unknown"} ${normalizedUser.lastName || "Unknown"}`;
};

// Helper function to get all available timeslots for a specific date and center
export const getAvailableTimeSlots = async (centerId: string, date: string): Promise<Appointment[]> => {
  try {
    // Force using real API data for available slots
    console.log(`Fetching available slots from API for center ${centerId} and date ${date}`);
    return await apiCall<Appointment[]>(`/centers/${centerId}/available-slots?date=${date}`);
  } catch (error) {
    console.error(`Failed to fetch available time slots:`, error);
    return [];
  }
};
