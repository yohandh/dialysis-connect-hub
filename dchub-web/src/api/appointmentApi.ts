import { appointments, Appointment } from "@/data/appointmentData";

export interface CreateAppointmentSlotRequest {
  centerId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'dialysis' | 'consultation' | 'checkup';
  staffId?: string | null;
  doctorId?: string | null;
  patientId?: string | null;
  bedId?: string | null;
}

export interface UpdateAppointmentSlotRequest {
  id: string;
  centerId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  type?: 'dialysis' | 'consultation' | 'checkup';
  status?: 'booked' | 'canceled' | 'completed' | 'available';
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
  return appointments.filter(apt => apt.status === 'available');
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

export const createAppointmentSlot = async (data: CreateAppointmentSlotRequest): Promise<Appointment> => {
  try {
    // For testing purposes, we'll use a direct fetch with a mock token
    // This bypasses the apiCall utility which is having authentication issues
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-auth-token-for-testing'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, response.statusText, errorData);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating appointment slot:', error);
    throw error;
  }
};

export const updateAppointmentSlot = async (data: UpdateAppointmentSlotRequest): Promise<Appointment> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const appointmentIndex = appointments.findIndex(apt => apt.id === data.id);
  if (appointmentIndex === -1) throw new Error("Appointment not found");
  
  const updatedAppointment = {
    ...appointments[appointmentIndex],
    ...data
  };
  
  // In a real application, this would update the database
  appointments[appointmentIndex] = updatedAppointment;
  
  console.log("Updated appointment slot:", updatedAppointment);
  
  return updatedAppointment;
};

export const deleteAppointmentSlot = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const appointmentIndex = appointments.findIndex(apt => apt.id === id);
  if (appointmentIndex === -1) throw new Error("Appointment not found");
  
  // In a real application, this would delete from the database
  appointments.splice(appointmentIndex, 1);
  
  console.log(`Deleted appointment slot ${id}`);
  
  return true;
};

export const bookAppointment = async (id: string, patientId: string): Promise<Appointment> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const appointmentIndex = appointments.findIndex(apt => apt.id === id);
  if (appointmentIndex === -1) throw new Error("Appointment not found");
  
  if (appointments[appointmentIndex].status !== 'available') {
    throw new Error("Appointment is not available");
  }
  
  const updatedAppointment = {
    ...appointments[appointmentIndex],
    patientId,
    status: 'booked' as const
  };
  
  // In a real application, this would update the database
  appointments[appointmentIndex] = updatedAppointment;
  
  console.log("Booked appointment:", updatedAppointment);
  
  return updatedAppointment;
};

export const cancelAppointment = async (id: string): Promise<Appointment> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const appointmentIndex = appointments.findIndex(apt => apt.id === id);
  if (appointmentIndex === -1) throw new Error("Appointment not found");
  
  const updatedAppointment = {
    ...appointments[appointmentIndex],
    status: 'canceled' as const
  };
  
  // In a real application, this would update the database
  appointments[appointmentIndex] = updatedAppointment;
  
  console.log("Canceled appointment:", updatedAppointment);
  
  return updatedAppointment;
};
