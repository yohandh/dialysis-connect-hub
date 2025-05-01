import { useMockApi, apiCall } from "@/config/api.config";
import { getPatientByUserId } from "@/data/patientData";
import { getUserById } from "@/data/userData";
import { Appointment } from "@/data/appointmentData";

// Mock API delay
const API_DELAY = 300;

export interface PatientProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  height: number;
  weight: number;
  primaryNephrologist: string;
  diagnosisDate: string;
  ckdStage: 1 | 2 | 3 | 4 | 5;
  dialysisStartDate?: string;
  accessType?: 'fistula' | 'graft' | 'catheter';
  comorbidities: string[];
  allergies: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  contactPhone?: string; // Added
  contactEmail?: string; // Added
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferredCenter: string;
  notificationPreferences: NotificationPreference;
}

export interface NotificationPreference {
  email: boolean;
  sms: boolean;
  push: boolean;
  appointmentReminders: boolean;
  labResults: boolean;
  treatmentUpdates: boolean;
  medicationReminders: boolean;
}

export interface CkdHistoryItem {
  id: string;
  date: string;
  eGFR: number;
  creatinine: number;
  stage: number;
  userId: string;
}

export type CkdHistoryEntry = CkdHistoryItem;

export interface AddCkdRecordRequest {
  eGFR: number;
  creatinine: number;
  notes?: string;
  patientId?: string;
}

export const getPatientData = async (): Promise<PatientProfile> => {
  try {
    // First try to use the real API
    if (!useMockApi()) {
      try {
        console.info("Attempting to use real API for patient data");
        const response = await apiCall<PatientProfile>('/patients/profile');
        console.info("Successfully retrieved patient data from API");
        return response;
      } catch (apiError) {
        console.error("API call failed, falling back to mock data:", apiError);
        // If the API call fails, fall back to mock data
        // Don't rethrow the error, just continue with mock data
      }
    }
    
    // Use mock data either by choice or as a fallback
    console.info("Using mock patient data");
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    
    const userId = 'user-001';
    const patient = getPatientByUserId(userId);
    const user = getUserById(userId);
    
    if (!patient || !user) {
      throw new Error("Patient data not found");
    }
    
    const patientProfile: PatientProfile = {
      userId: patient.userId,
      firstName: user.name ? user.name.split(' ')[0] : '',
      lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
      email: user.email || '',
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      bloodType: patient.bloodType,
      height: patient.height,
      weight: patient.weight,
      primaryNephrologist: patient.primaryNephrologist,
      diagnosisDate: patient.diagnosisDate,
      ckdStage: patient.ckdStage,
      dialysisStartDate: patient.dialysisStartDate,
      accessType: patient.accessType,
      comorbidities: patient.comorbidities,
      allergies: patient.allergies,
      medications: patient.medications,
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210'
      },
      phone: '555-123-4567',
      contactPhone: '555-987-6543',
      contactEmail: 'contact@example.com',
      emergencyContact: patient.emergencyContact,
      preferredCenter: patient.preferredCenter,
      notificationPreferences: {
        email: true,
        sms: true,
        push: false,
        appointmentReminders: true,
        labResults: true,
        treatmentUpdates: true,
        medicationReminders: true
      }
    };
    
    return patientProfile;
  } catch (error) {
    console.error("Failed to fetch patient data:", error);
    throw error;
  }
};

export const fetchPatientProfile = getPatientData;

export const updatePatientProfile = async (data: Partial<PatientProfile>): Promise<PatientProfile> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      const currentProfile = await getPatientData();
      return {
        ...currentProfile,
        ...data
      };
    } else {
      const response = await apiCall<PatientProfile>('/patients/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return response;
    }
  } catch (error) {
    console.error("Failed to update patient profile:", error);
    throw error;
  }
};

export const updateNotificationPreferences = async (
  preferences: NotificationPreference
): Promise<NotificationPreference> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      return preferences;
    } else {
      const response = await apiCall<NotificationPreference>('/patients/notifications/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences)
      });
      return response;
    }
  } catch (error) {
    console.error("Failed to update notification preferences:", error);
    throw error;
  }
};

export const getCkdHistory = async (): Promise<CkdHistoryItem[]> => {
  try {
    if (useMockApi()) {
      console.info("Using mock CKD history data");
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      const mockCkdHistory: CkdHistoryItem[] = [
        {
          id: 'ckd-001',
          date: '2023-01-15',
          eGFR: 45,
          creatinine: 1.8,
          stage: 3,
          userId: 'user-001'
        },
        {
          id: 'ckd-002',
          date: '2023-02-20',
          eGFR: 42,
          creatinine: 1.9,
          stage: 3,
          userId: 'user-001'
        },
        {
          id: 'ckd-003',
          date: '2023-03-25',
          eGFR: 38,
          creatinine: 2.1,
          stage: 3,
          userId: 'user-001'
        },
        {
          id: 'ckd-004',
          date: '2023-04-30',
          eGFR: 32,
          creatinine: 2.4,
          stage: 3,
          userId: 'user-001'
        },
        {
          id: 'ckd-005',
          date: '2023-06-05',
          eGFR: 28,
          creatinine: 2.7,
          stage: 4,
          userId: 'user-001'
        }
      ];
      
      return mockCkdHistory;
    } else {
      const response = await apiCall<CkdHistoryItem[]>('/patients/ckd-history');
      return response;
    }
  } catch (error) {
    console.error("Failed to fetch CKD history:", error);
    throw error;
  }
};

export const fetchCkdHistory = getCkdHistory;

export const addCkdRecord = async (data: AddCkdRecordRequest): Promise<CkdHistoryItem> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      let stage = 1;
      if (data.eGFR < 15) stage = 5;
      else if (data.eGFR < 30) stage = 4;
      else if (data.eGFR < 60) stage = 3;
      else if (data.eGFR < 90) stage = 2;
      
      const newRecord: CkdHistoryItem = {
        id: `ckd-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        eGFR: data.eGFR,
        creatinine: data.creatinine,
        stage,
        userId: 'user-001'
      };
      
      return newRecord;
    } else {
      const response = await apiCall<CkdHistoryItem>('/patients/ckd-record', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response;
    }
  } catch (error) {
    console.error("Failed to add CKD record:", error);
    throw error;
  }
};

export interface EducationContent {
  id: string;
  title: string;
  summary?: string;
  type?: string;
  content?: string;
  ckdStage?: number;
  language?: string;
}

export const fetchEducationContent = async (stage: number): Promise<EducationContent[]> => {
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  
  return [
    {
      id: `edu-${stage}-1`,
      title: `Diet Guidelines for CKD Stage ${stage}`,
      summary: `Important dietary guidelines for managing CKD Stage ${stage}`,
      type: 'diet',
      ckdStage: stage
    },
    {
      id: `edu-${stage}-2`,
      title: `Exercise Recommendations for CKD Stage ${stage}`,
      summary: `Safe and effective exercise recommendations for CKD Stage ${stage}`,
      type: 'lifestyle',
      ckdStage: stage
    },
    {
      id: `edu-${stage}-3`,
      title: `Understanding Your Monitoring in CKD Stage ${stage}`,
      summary: `Learn about common monitoring for CKD Stage ${stage}`,
      type: 'monitoring',
      ckdStage: stage
    }
  ];
};

export const getPatientAppointments = async (): Promise<Appointment[]> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      const userId = 'user-001';
      
      const { appointments, getAppointmentsByPatient } = await import('@/data/appointmentData');
      
      return getAppointmentsByPatient(userId);
    } else {
      const response = await apiCall<Appointment[]>('/patients/appointments');
      return response;
    }
  } catch (error) {
    console.error("Failed to fetch patient appointments:", error);
    throw error;
  }
};

export const bookAppointment = async (appointmentId: string): Promise<Appointment> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      const { appointments, getAppointmentById } = await import('@/data/appointmentData');
      const userId = 'user-001';
      
      const appointment = getAppointmentById(appointmentId);
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      
      // Check if the appointment is already booked or completed
      if (appointment.status !== 'scheduled') {
        throw new Error("Appointment is not available for booking");
      }
      
      const index = appointments.findIndex(a => a.id === appointmentId);
      if (index !== -1) {
        appointments[index] = {
          ...appointments[index],
          patientId: userId,
          status: 'scheduled' // Using 'scheduled' instead of 'booked' to match the Appointment interface
        };
      }
      
      return appointments[index];
    } else {
      const response = await apiCall<Appointment>(`/patients/appointments/book/${appointmentId}`, {
        method: 'POST'
      });
      return response;
    }
  } catch (error) {
    console.error("Failed to book appointment:", error);
    throw error;
  }
};

export const cancelAppointment = async (appointmentId: string): Promise<Appointment> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      const { appointments, getAppointmentById } = await import('@/data/appointmentData');
      
      const appointment = getAppointmentById(appointmentId);
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      
      // Check if the appointment is scheduled (booked)
      if (appointment.status !== 'scheduled') {
        throw new Error("Appointment is not booked");
      }
      
      const index = appointments.findIndex(a => a.id === appointmentId);
      if (index !== -1) {
        appointments[index] = {
          ...appointments[index],
          status: 'cancelled' // Using 'cancelled' instead of 'canceled' to match the Appointment interface
        };
      }
      
      return appointments[index];
    } else {
      const response = await apiCall<Appointment>(`/patients/appointments/cancel/${appointmentId}`, {
        method: 'POST'
      });
      return response;
    }
  } catch (error) {
    console.error("Failed to cancel appointment:", error);
    throw error;
  }
};
