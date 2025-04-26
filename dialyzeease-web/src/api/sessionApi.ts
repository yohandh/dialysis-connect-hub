import axios from '../lib/axios';

// Fetch all sessions for a center
export const fetchSessionsByCenter = async (centerId: string) => {
  const response = await axios.get(`/api/centers/${centerId}/sessions`);
  return response.data;
};

// Create a new session
export const createSession = async (data: {
  center_id: number;
  doctor_id?: number | null;
  weekday: string;
  start_time: string;
  end_time: string;
  default_capacity: number;
  recurrence_pattern?: string;
}) => {
  const response = await axios.post('/api/sessions', data);
  return response.data;
};

// Update a session
export const updateSession = async (id: number, data: {
  doctor_id?: number | null;
  weekday?: string;
  start_time?: string;
  end_time?: string;
  default_capacity?: number;
  recurrence_pattern?: string;
  status?: string;
}) => {
  const response = await axios.put(`/api/sessions/${id}`, data);
  return response.data;
};

// Delete a session
export const deleteSession = async (id: number) => {
  const response = await axios.delete(`/api/sessions/${id}`);
  return response.data;
};
