export interface Session {
  id: number;
  center_id: number;
  doctor_id: number | null;
  weekday: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  start_time: string;
  end_time: string;
  default_capacity: number;
  recurrence_pattern: 'daily' | 'weekly';
  status: 'active' | 'inactive';
  created_by_id: number;
  created_at: string;
  doctor_name?: string; // For display purposes
}

export interface SessionFormValues {
  doctor_id: number | null;
  weekday: string;
  start_time: string;
  end_time: string;
  default_capacity: number;
  recurrence_pattern: string;
  status?: string;
}

export const weekdayOptions = [
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
  { value: 'sun', label: 'Sunday' }
];

export const timeOptions = [
  { value: '06:00:00', label: '6:00 AM' },
  { value: '07:00:00', label: '7:00 AM' },
  { value: '08:00:00', label: '8:00 AM' },
  { value: '09:00:00', label: '9:00 AM' },
  { value: '10:00:00', label: '10:00 AM' },
  { value: '11:00:00', label: '11:00 AM' },
  { value: '12:00:00', label: '12:00 PM' },
  { value: '13:00:00', label: '1:00 PM' },
  { value: '14:00:00', label: '2:00 PM' },
  { value: '15:00:00', label: '3:00 PM' },
  { value: '16:00:00', label: '4:00 PM' },
  { value: '17:00:00', label: '5:00 PM' },
  { value: '18:00:00', label: '6:00 PM' },
  { value: '19:00:00', label: '7:00 PM' },
  { value: '20:00:00', label: '8:00 PM' }
];
