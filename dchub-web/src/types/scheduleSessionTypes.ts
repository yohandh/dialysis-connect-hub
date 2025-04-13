export interface ScheduledSession {
  id: number;
  center_id: number;
  session_id: number | null;
  session_date: string;
  start_time: string;
  end_time: string;
  available_beds: number;
  notes: string | null;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  created_by_id: number;
  created_at: string;
  updated_at: string | null;
  // Joined fields
  session_name?: string;
  doctor_name?: string;
}

export interface ScheduledSessionFormValues {
  session_id: number | null;
  session_date: string;
  start_time: string;
  end_time: string;
  available_beds: number;
  notes?: string;
  status?: string;
}

export interface GenerateSessionsFormValues {
  start_date: string;
  end_date: string;
  session_ids: number[];
}

export const statusOptions = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];
