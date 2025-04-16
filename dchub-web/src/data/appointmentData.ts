export interface Appointment {
  id: string;
  patientId: string | null;
  patientName?: string;
  centerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: 'dialysis' | 'consultation' | 'checkup';
  notes?: string;
}

// Today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Tomorrow's date in YYYY-MM-DD format
const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

// Day after tomorrow in YYYY-MM-DD format
const dayAfterTomorrow = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0];

// Next week date in YYYY-MM-DD format
const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];

export const appointments: Appointment[] = [
  {
    id: "apt-001",
    patientId: "user-001",
    patientName: "John Doe",
    centerId: "center-001",
    date: "2023-06-01",
    startTime: "09:00",
    endTime: "12:00",
    status: "completed",
    type: "dialysis",
    notes: "Regular session, no complications"
  },
  {
    id: "apt-002",
    patientId: "user-002",
    patientName: "Jane Smith",
    centerId: "center-001",
    date: "2023-06-05",
    startTime: "13:00",
    endTime: "16:00",
    status: "scheduled",
    type: "dialysis"
  },
  {
    id: "apt-003",
    patientId: "user-003",
    patientName: "Robert Johnson",
    centerId: "center-002",
    date: "2023-06-02",
    startTime: "10:00",
    endTime: "13:00",
    status: "cancelled",
    type: "dialysis",
    notes: "Patient requested cancelation due to feeling unwell"
  },
  {
    id: "apt-004",
    patientId: "user-001",
    patientName: "John Doe",
    centerId: "center-001",
    date: "2023-06-08",
    startTime: "09:00",
    endTime: "12:00",
    status: "scheduled",
    type: "dialysis"
  },
  {
    id: "apt-005",
    patientId: "user-004",
    patientName: "Sarah Williams",
    centerId: "center-003",
    date: "2023-06-03",
    startTime: "14:00",
    endTime: "15:00",
    status: "completed",
    type: "consultation",
    notes: "Discussed diet plan changes"
  },
  {
    id: "apt-006",
    patientId: null,
    centerId: "center-002",
    date: today,
    startTime: "10:00",
    endTime: "13:00",
    status: "scheduled",
    type: "dialysis"
  },
  {
    id: "apt-007",
    patientId: null,
    centerId: "center-001",
    date: today,
    startTime: "14:00",
    endTime: "17:00",
    status: "scheduled",
    type: "dialysis"
  },
  {
    id: "apt-008",
    patientId: "user-002",
    patientName: "Jane Smith",
    centerId: "center-002",
    date: "2023-06-15",
    startTime: "09:00",
    endTime: "12:00",
    status: "scheduled",
    type: "dialysis"
  },
  // Adding more available slots for today and upcoming days
  {
    id: "apt-009",
    patientId: null,
    centerId: "center-001",
    date: today,
    startTime: "09:00",
    endTime: "12:00",
    status: "scheduled",
    type: "dialysis"
  },
  {
    id: "apt-010",
    patientId: null,
    centerId: "center-002",
    date: today,
    startTime: "13:00",
    endTime: "16:00",
    status: "scheduled",
    type: "dialysis"
  },
  {
    id: "apt-011",
    patientId: null,
    centerId: "center-003",
    date: today,
    startTime: "10:00",
    endTime: "13:00",
    status: "scheduled",
    type: "dialysis"
  },
  {
    id: "apt-012",
    patientId: null,
    centerId: "center-001",
    date: tomorrow,
    startTime: "09:00",
    endTime: "12:00",
    status: "scheduled",
    type: "dialysis"
  },
  {
    id: "apt-013",
    patientId: null,
    centerId: "center-002",
    date: tomorrow,
    startTime: "13:00",
    endTime: "16:00",
    status: "scheduled",
    type: "dialysis"
  },
  {
    id: "apt-014",
    patientId: null,
    centerId: "center-003",
    date: tomorrow,
    startTime: "09:00",
    endTime: "12:00",
    status: "scheduled",
    type: "consultation"
  },
  {
    id: "apt-015",
    patientId: null,
    centerId: "center-001",
    date: dayAfterTomorrow,
    startTime: "09:00",
    endTime: "12:00",
    status: "scheduled",
    type: "dialysis"
  },
  {
    id: "apt-016",
    patientId: null,
    centerId: "center-002",
    date: dayAfterTomorrow,
    startTime: "13:00",
    endTime: "16:00",
    status: "scheduled",
    type: "dialysis"
  },
  {
    id: "apt-017",
    patientId: null,
    centerId: "center-003",
    date: dayAfterTomorrow,
    startTime: "09:00",
    endTime: "10:00",
    status: "scheduled",
    type: "checkup"
  },
  {
    id: "apt-018",
    patientId: null,
    centerId: "center-001",
    date: nextWeek,
    startTime: "09:00",
    endTime: "12:00",
    status: "scheduled",
    type: "dialysis"
  },
  {
    id: "apt-019",
    patientId: null,
    centerId: "center-002",
    date: nextWeek,
    startTime: "13:00",
    endTime: "16:00",
    status: "scheduled",
    type: "dialysis"
  },
  {
    id: "apt-020",
    patientId: null,
    centerId: "center-003",
    date: nextWeek,
    startTime: "15:00",
    endTime: "16:00",
    status: "scheduled",
    type: "consultation"
  }
];

export const getAppointmentById = (id: string): Appointment | undefined => {
  return appointments.find(apt => apt.id === id);
};

export const getAppointmentsByPatient = (patientId: string): Appointment[] => {
  return appointments.filter(apt => apt.patientId === patientId);
};

export const getAppointmentsByCenter = (centerId: string): Appointment[] => {
  return appointments.filter(apt => apt.centerId === centerId);
};

export const getAvailableAppointments = (): Appointment[] => {
  return appointments.filter(apt => apt.status === 'scheduled');
};
