
import { appointments, Appointment } from "@/data/appointmentData";

export interface CreateAppointmentSlotRequest {
  centerId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'dialysis' | 'consultation' | 'checkup';
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
  await new Promise(resolve => setTimeout(resolve, 300));
  return appointments.filter(apt => apt.centerId === centerId);
};

// Add the missing function for fetching appointments by patient ID
export const fetchAppointmentsByPatient = async (patientId: string): Promise<Appointment[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return appointments.filter(apt => apt.patientId === patientId);
};

// Add the missing function for fetching available appointments
export const fetchAvailableAppointments = async (): Promise<Appointment[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return appointments.filter(apt => apt.status === 'available');
};

export const createAppointmentSlot = async (data: CreateAppointmentSlotRequest): Promise<Appointment> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const newId = `apt-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
  
  const newAppointment: Appointment = {
    id: newId,
    patientId: null,
    centerId: data.centerId,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    status: 'available',
    type: data.type
  };
  
  console.log("Created new appointment slot:", newAppointment);
  
  // In a real application, this would be saved to the database
  appointments.push(newAppointment);
  
  return newAppointment;
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
