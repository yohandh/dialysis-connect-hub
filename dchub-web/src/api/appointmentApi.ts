import { appointments, Appointment } from "@/data/appointmentData";
import axios from 'axios';

export interface CreateAppointmentSlotRequest {
  scheduleSessionId: string;
  patientId?: string | null;
  bedId?: string | null;
  notes?: string;
}

export interface UpdateAppointmentSlotRequest {
  patientId?: string | null;
  bedId?: string | null;
  notes?: string;
  status?: string;
}

// Mock API functions
export const fetchAppointments = async (): Promise<Appointment[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return appointments;
};

export const fetchAppointmentById = async (id: string): Promise<Appointment | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return appointments.find(apt => apt.id === id);
};

export const fetchAppointmentsByCenter = async (centerId: string): Promise<Appointment[]> => {
  try {
    // For testing purposes, we'll use a direct fetch with a mock token
    const url = centerId === 'all' 
      ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments`
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments/center/${centerId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-auth-token-for-testing'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, response.statusText, errorData);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching appointments by center:', error);
    // Return mock data as fallback
    return appointments.filter(apt => centerId === 'all' || apt.centerId === centerId);
  }
};

export const fetchAppointmentsByPatient = async (patientId: string): Promise<Appointment[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return appointments.filter(apt => apt.patientId === patientId);
};

export const fetchAvailableAppointments = async (): Promise<Appointment[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return appointments.filter(apt => apt.status === 'scheduled');
};

export const fetchAppointmentDetails = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments/${id}/details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-auth-token-for-testing'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, response.statusText, errorData);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    throw error;
  }
};

// Create a new appointment slot
export const createAppointmentSlot = async (data: CreateAppointmentSlotRequest) => {
  try {
    const response = await axios.post('/api/appointments', data, {
      headers: {
        'Authorization': 'Bearer mock-auth-token-for-testing'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating appointment slot:', error.response?.data || error.message);
    throw error;
  }
};

// Get all appointment slots
export const getAppointmentSlots = async () => {
  try {
    const response = await axios.get('/api/appointments', {
      headers: {
        'Authorization': 'Bearer mock-auth-token-for-testing'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching appointment slots:', error.response?.data || error.message);
    throw error;
  }
};

// Get appointment slots by center
export const getAppointmentSlotsByCenter = async (centerId: string) => {
  try {
    const response = await axios.get(`/api/appointments/center/${centerId}`, {
      headers: {
        'Authorization': 'Bearer mock-auth-token-for-testing'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching appointment slots for center ${centerId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Get appointment slots by patient
export const getAppointmentSlotsByPatient = async (patientId: string) => {
  try {
    const response = await axios.get(`/api/appointments/patient/${patientId}`, {
      headers: {
        'Authorization': 'Bearer mock-auth-token-for-testing'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching appointment slots for patient ${patientId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Update an appointment slot
export const updateAppointmentSlot = async (id: string, data: UpdateAppointmentSlotRequest) => {
  try {
    const response = await axios.put(`/api/appointments/${id}`, data, {
      headers: {
        'Authorization': 'Bearer mock-auth-token-for-testing'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error updating appointment slot ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Delete an appointment slot
export const deleteAppointmentSlot = async (id: string) => {
  try {
    const response = await axios.delete(`/api/appointments/${id}`, {
      headers: {
        'Authorization': 'Bearer mock-auth-token-for-testing'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting appointment slot ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Book an appointment
export const bookAppointment = async (id: string, patientId: string) => {
  try {
    const response = await axios.post(`/api/appointments/${id}/book`, { patientId }, {
      headers: {
        'Authorization': 'Bearer mock-auth-token-for-testing'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error booking appointment ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Cancel an appointment
export const cancelAppointment = async (id: string) => {
  try {
    const response = await axios.post(`/api/appointments/${id}/cancel`, {}, {
      headers: {
        'Authorization': 'Bearer mock-auth-token-for-testing'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error canceling appointment ${id}:`, error.response?.data || error.message);
    throw error;
  }
};
