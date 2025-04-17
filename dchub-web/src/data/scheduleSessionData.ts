// Import the Appointment interface for type consistency
import { Appointment } from './appointmentData';

// Define the ScheduleSession interface to match the database schema
export interface ScheduleSession {
  id: number;
  centerId: string;
  sessionId: number | null;
  sessionDate: string;
  startTime: string;
  endTime: string;
  availableBeds: number;
  notes?: string;
  status: 'scheduled' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

// Mock data for scheduled sessions based on the database screenshot
export const scheduleSessions: ScheduleSession[] = [
  {
    id: 1,
    centerId: "3", // Asiri Surgical
    sessionId: 2,
    sessionDate: "2025-04-16",
    startTime: "06:00:00",
    endTime: "07:00:00",
    availableBeds: 8,
    status: "scheduled",
    createdAt: "2025-04-15 17:23:22"
  },
  {
    id: 2,
    centerId: "3", // Asiri Surgical
    sessionId: 2,
    sessionDate: "2025-04-17",
    startTime: "06:00:00",
    endTime: "07:00:00",
    availableBeds: 8,
    status: "scheduled",
    createdAt: "2025-04-15 17:23:22"
  },
  {
    id: 3,
    centerId: "3", // Asiri Surgical
    sessionId: 3,
    sessionDate: "2025-04-18",
    startTime: "06:00:00",
    endTime: "07:00:00",
    availableBeds: 5,
    notes: "NULL",
    status: "scheduled",
    createdAt: "2025-04-15 17:23:22"
  },
  {
    id: 4,
    centerId: "3", // Asiri Surgical
    sessionId: 3,
    sessionDate: "2025-04-19",
    startTime: "06:00:00",
    endTime: "07:00:00",
    availableBeds: 5,
    notes: "NULL",
    status: "scheduled",
    createdAt: "2025-04-15 17:23:22"
  },
  {
    id: 5,
    centerId: "3", // Asiri Surgical
    sessionId: 3,
    sessionDate: "2025-04-20",
    startTime: "06:00:00",
    endTime: "07:00:00",
    availableBeds: 5,
    notes: "NULL",
    status: "scheduled",
    createdAt: "2025-04-15 17:23:22"
  },
  {
    id: 6,
    centerId: "3", // Asiri Surgical
    sessionId: 3,
    sessionDate: "2025-04-21",
    startTime: "06:00:00",
    endTime: "07:00:00",
    availableBeds: 5,
    notes: "NULL",
    status: "scheduled",
    createdAt: "2025-04-15 17:23:22"
  },
  {
    id: 7,
    centerId: "3", // Asiri Surgical
    sessionId: 3,
    sessionDate: "2025-04-22",
    startTime: "06:00:00",
    endTime: "07:00:00",
    availableBeds: 5,
    notes: "NULL",
    status: "scheduled",
    createdAt: "2025-04-15 17:23:22"
  },
  {
    id: 8,
    centerId: "3", // Asiri Surgical
    sessionId: 3,
    sessionDate: "2025-04-30",
    startTime: "21:00:00",
    endTime: "22:00:00",
    availableBeds: 5,
    notes: "NULL",
    status: "scheduled",
    createdAt: "2025-04-15 17:45:45"
  },
  {
    id: 9,
    centerId: "3", // Asiri Surgical
    sessionId: 3,
    sessionDate: "2025-05-01",
    startTime: "21:00:00",
    endTime: "22:00:00",
    availableBeds: 5,
    notes: "NULL",
    status: "scheduled",
    createdAt: "2025-04-15 17:37:14"
  },
  {
    id: 10,
    centerId: "3", // Asiri Surgical
    sessionId: 3,
    sessionDate: "2025-05-02",
    startTime: "21:00:00",
    endTime: "22:00:00",
    availableBeds: 5,
    notes: "NULL",
    status: "scheduled",
    createdAt: "2025-04-15 17:37:14"
  },
  {
    id: 11,
    centerId: "3", // Asiri Surgical
    sessionId: 3,
    sessionDate: "2025-05-03",
    startTime: "21:00:00",
    endTime: "22:00:00",
    availableBeds: 5,
    notes: "NULL",
    status: "scheduled",
    createdAt: "2025-04-15 17:37:14"
  },
  {
    id: 12,
    centerId: "3", // Asiri Surgical
    sessionId: 3,
    sessionDate: "2025-05-04",
    startTime: "21:00:00",
    endTime: "22:00:00",
    availableBeds: 5,
    notes: "NULL",
    status: "scheduled",
    createdAt: "2025-04-15 17:37:14"
  },
  {
    id: 13,
    centerId: "3", // Asiri Surgical
    sessionId: 3,
    sessionDate: "2025-05-05",
    startTime: "21:00:00",
    endTime: "22:00:00",
    availableBeds: 5,
    notes: "NULL",
    status: "scheduled",
    createdAt: "2025-04-15 17:37:14"
  },
  {
    id: 14,
    centerId: "3", // Asiri Surgical
    sessionId: 3,
    sessionDate: "2025-05-06",
    startTime: "21:00:00",
    endTime: "22:00:00",
    availableBeds: 5,
    notes: "NULL",
    status: "scheduled",
    createdAt: "2025-04-15 17:37:14"
  },
  {
    id: 15,
    centerId: "3", // Asiri Surgical
    sessionId: 3,
    sessionDate: "2025-05-07",
    startTime: "21:00:00",
    endTime: "22:00:00",
    availableBeds: 5,
    notes: "NULL",
    status: "scheduled",
    createdAt: "2025-04-15 17:37:14"
  }
];

// Helper function to get schedule sessions by center and date
export const getScheduleSessionsByCenterAndDate = (centerId: string, date: string): ScheduleSession[] => {
  return scheduleSessions.filter(session => 
    session.centerId === centerId && 
    session.sessionDate === date && 
    session.status === 'scheduled'
  );
};

// Helper function to convert schedule sessions to appointment format
export const convertScheduleSessionsToAppointments = (sessions: ScheduleSession[]): Appointment[] => {
  return sessions.map((session, index) => {
    // Map the schedule session status to the appropriate Appointment status
    // In this case, we're mapping 'scheduled' to 'scheduled' and 'cancelled' to 'cancelled'
    const appointmentStatus: Appointment['status'] = 
      session.status === 'scheduled' ? 'scheduled' : 'cancelled';
      
    return {
      id: `session-${session.id}`,
      patientId: null,
      centerId: session.centerId,
      date: session.sessionDate,
      startTime: session.startTime.substring(0, 5), // Format: HH:MM
      endTime: session.endTime.substring(0, 5),     // Format: HH:MM
      status: appointmentStatus,
      type: 'dialysis',
      notes: session.availableBeds > 0 ? `${session.availableBeds} beds available` : 'No beds available'
    };
  });
};
