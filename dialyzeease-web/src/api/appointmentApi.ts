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
    console.log(`Fetching appointments for patient ID: ${patientId}`);
    // Get the auth token from localStorage
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    const response = await axios.get(`/api/appointments/patient/${patientId}`, {
      headers: {
        'Authorization': `Bearer ${token || 'mock-auth-token-for-testing'}`
      }
    });
    console.log('Appointments data received:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching appointment slots for patient ${patientId}:`, error.response?.data || error.message);
    // If API call fails, try a direct fetch to the full URL as a fallback
    try {
      console.log('Trying direct fetch as fallback...');
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const fallbackResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments/patient/${patientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || 'mock-auth-token-for-testing'}`
        }
      });
      
      if (!fallbackResponse.ok) {
        throw new Error(`API Error: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
      }
      
      const data = await fallbackResponse.json();
      console.log('Fallback fetch successful:', data);
      return data;
    } catch (fallbackError) {
      console.error('Fallback fetch also failed:', fallbackError);
      throw error; // Throw the original error
    }
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
    return axios.post(`/api/appointments/${id}/book`, { patientId }, {
      headers: {
        'Authorization': 'Bearer mock-auth-token-for-testing'
      }
    });
  } catch (error: any) {
    console.error('Error booking appointment:', error.response?.data || error.message);
    throw error;
  }
}

// Book recurring appointments
export const bookRecurringAppointments = async (slotId: string, patientId: string, dates: string[]) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments/recurring`, {
      slotId,
      patientId,
      dates
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || 'mock-auth-token-for-testing'}`
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error booking recurring appointments:', error.response?.data || error.message);
    throw error;
  }
}

// Book multiple appointments
export const bookMultipleAppointments = async (appointments: {date: string, slotId: string}[], patientId: string) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments/multiple`, {
      appointments,
      patientId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || 'mock-auth-token-for-testing'}`
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error booking multiple appointments:', error.response?.data || error.message);
    throw error;
  }
};

// Cancel an appointment
export const cancelAppointment = async (id: string) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments/${id}/cancel`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

// Types for patient appointment stats
export interface PatientAppointmentStats {
  totalAppointments: number;
  completedAppointments: number;
  lastSessionDaysAgo: number | null;
  nextAppointment: {
    sessionDate: string;
    startTime: string;
    centerName: string;
  } | null;
}

// Types for patient appointments
export interface PatientAppointment {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  centerName: string;
  doctorName: string | null;
  status: string;
  bedCode?: string;
}

// Fetch patient appointment statistics
export const fetchPatientAppointmentStats = async (patientId: number): Promise<PatientAppointmentStats> => {
  // Check if we're in development mode or if the API endpoint is not yet implemented
  const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_USE_REAL_API;
  
  if (isDevelopment) {
    // For development/testing, use mock data without making API calls
    console.log('Using mock data for patient appointment stats');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // For user ID 1006 (Yohan Hirimuthugoda), provide specific mock data
    if (patientId === 1006) {
      return {
        totalAppointments: 36,
        completedAppointments: 32,
        lastSessionDaysAgo: 2,
        nextAppointment: {
          sessionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '10:30 AM',
          centerName: 'Colombo Dialysis Center'
        }
      };
    }
    
    // Generic mock data for other users
    return {
      totalAppointments: 24,
      completedAppointments: 20,
      lastSessionDaysAgo: 3,
      nextAppointment: {
        sessionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '11:00 AM',
        centerName: 'Kandy Kidney Care'
      }
    };
  }
  
  try {
    // The backend should handle the complex joins according to the schema relationships
    // to get the appointment statistics for the patient
    const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/patients/${patientId}/appointment-stats`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    // Transform the response data if needed
    const stats: PatientAppointmentStats = {
      totalAppointments: response.data.totalAppointments || 0,
      completedAppointments: response.data.completedAppointments || 0,
      lastSessionDaysAgo: response.data.lastSessionDaysAgo || null,
      nextAppointment: response.data.nextAppointment ? {
        sessionDate: response.data.nextAppointment.sessionDate || response.data.nextAppointment.session_date,
        startTime: response.data.nextAppointment.startTime || response.data.nextAppointment.start_time,
        centerName: response.data.nextAppointment.centerName || response.data.nextAppointment.center_name
      } : null
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching patient appointment stats:', error);
    throw error;
  }
};

// Fetch patient appointments with optional filters
export const fetchPatientAppointments = async (
  patientId: number, 
  options: { status?: string; limit?: number } = {}
): Promise<PatientAppointment[]> => {
  // Check if we're in development mode or if the API endpoint is not yet implemented
  const isDevelopment = import.meta.env.DEV || !import.meta.env.VITE_USE_REAL_API;
  
  if (isDevelopment) {
    // For development/testing, use mock data without making API calls
    console.log('Using mock data for patient appointments');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Generate mock appointments based on current date
    const today = new Date();
    
    // Special case for Yohan Hirimuthugoda (user ID 1006)
    if (patientId === 1006) {
      console.log('Using specific mock data for Yohan Hirimuthugoda (ID: 1006)');
      const mockAppointmentsForYohan = [
        {
          id: '1001',
          sessionDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '10:30 AM',
          endTime: '12:30 PM',
          centerName: 'Colombo Dialysis Center',
          doctorName: 'Dr. Samantha Perera',
          status: 'scheduled',
          bedCode: 'B-101'
        },
        {
          id: '1002',
          sessionDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '10:30 AM',
          endTime: '12:30 PM',
          centerName: 'Colombo Dialysis Center',
          doctorName: 'Dr. Samantha Perera',
          status: 'scheduled',
          bedCode: 'B-103'
        },
        {
          id: '1003',
          sessionDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '11:00 AM',
          endTime: '1:00 PM',
          centerName: 'Colombo Dialysis Center',
          doctorName: 'Dr. Samantha Perera',
          status: 'confirmed',
          bedCode: 'B-105'
        }
      ];
      
      // Apply filters if provided
      let filteredAppointments = [...mockAppointmentsForYohan];
      
      if (options.status) {
        filteredAppointments = filteredAppointments.filter(apt => 
          apt.status.toLowerCase() === options.status?.toLowerCase()
        );
      }
      
      if (options.limit && options.limit > 0) {
        filteredAppointments = filteredAppointments.slice(0, options.limit);
      }
      
      return filteredAppointments;
    }
    
    // Default mock appointments for other users
    const mockAppointments = [
      {
        id: '1',
        sessionDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '10:30 AM',
        endTime: '12:30 PM',
        centerName: 'Colombo Dialysis Center',
        doctorName: 'Dr. Samantha Perera',
        status: 'confirmed',
        bedCode: 'B-101'
      },
      {
        id: '2',
        sessionDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '11:00 AM',
        endTime: '1:00 PM',
        centerName: 'Colombo Dialysis Center',
        doctorName: 'Dr. Samantha Perera',
        status: 'confirmed',
        bedCode: 'B-103'
      },
      {
        id: '3',
        sessionDate: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '10:30 AM',
        endTime: '12:30 PM',
        centerName: 'Colombo Dialysis Center',
        doctorName: 'Dr. Samantha Perera',
        status: 'scheduled',
        bedCode: 'B-105'
      }
    ];
    
    // Apply filters if provided
    let filteredAppointments = [...mockAppointments];
    
    if (options.status) {
      filteredAppointments = filteredAppointments.filter(apt => 
        apt.status.toLowerCase() === options.status?.toLowerCase()
      );
    }
    
    if (options.limit && options.limit > 0) {
      filteredAppointments = filteredAppointments.slice(0, options.limit);
    }
    
    return filteredAppointments;
  }
  
  try {
    // The backend should handle the complex joins according to the schema relationships:
    // 1. appointments.patient_id = users.id (where users.id = patientId)
    // 2. appointments.schedule_session_id = schedule_sessions.id (for date and time)
    // 3. schedule_sessions.center_id = centers.id (for center name)
    // 4. schedule_sessions.session_id = sessions.id
    // 5. sessions.doctor_id = doctors.id (for doctor info)
    // 6. doctors.user_id = users.id (for doctor name)
    
    // The API endpoint should return data already joined and formatted
    let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/patients/${patientId}/appointments`;
    
    // Add query parameters if provided
    const params = new URLSearchParams();
    if (options.status) params.append('status', options.status);
    if (options.limit) params.append('limit', options.limit.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    // Transform the response data to match the PatientAppointment interface
    const appointments = response.data.map((apt: any) => ({
      id: apt.id.toString(),
      sessionDate: apt.sessionDate || apt.schedule_session?.session_date,
      startTime: apt.startTime || apt.schedule_session?.start_time,
      endTime: apt.endTime || apt.schedule_session?.end_time,
      centerName: apt.centerName || apt.center?.name || apt.schedule_session?.center?.name,
      doctorName: apt.doctorName || 
                (apt.doctor?.first_name && apt.doctor?.last_name ? 
                `Dr. ${apt.doctor.first_name} ${apt.doctor.last_name}` : 
                (apt.session?.doctor?.first_name && apt.session?.doctor?.last_name ? 
                `Dr. ${apt.session.doctor.first_name} ${apt.session.doctor.last_name}` : null)),
      status: apt.status,
      bedCode: apt.bedCode || apt.bed?.code
    }));
    
    return appointments;
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    throw error;
  }
};
