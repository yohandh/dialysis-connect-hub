import axios from '../lib/axios';

// Fetch all scheduled sessions for a center
export const fetchScheduledSessionsByCenter = async (centerId: string, startDate?: string, endDate?: string) => {
  let url = `/api/centers/${centerId}/schedule-sessions`;
  
  // Add date range filter if provided
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  } else if (startDate) {
    url += `?startDate=${startDate}`;
  } else if (endDate) {
    url += `?endDate=${endDate}`;
  }
  
  const response = await axios.get(url);
  return response.data;
};

// Create a new scheduled session
export const createScheduledSession = async (data: {
  center_id: number;
  session_id?: number | null;
  session_date: string;
  start_time: string;
  end_time: string;
  available_beds: number;
  notes?: string;
}) => {
  console.log('API createScheduledSession called with:', data);
  const response = await axios.post('/api/centers/schedule-sessions', data);
  console.log('API createScheduledSession response:', response.data);
  return response.data;
};

// Update a scheduled session
export const updateScheduledSession = async (id: number, data: {
  session_id?: number | null;
  session_date?: string;
  start_time?: string;
  end_time?: string;
  available_beds?: number;
  notes?: string;
  status?: string;
}) => {
  console.log('API updateScheduledSession called with:', id, data);
  const response = await axios.put(`/api/centers/schedule-sessions/${id}`, data);
  console.log('API updateScheduledSession response:', response.data);
  return response.data;
};

// Delete a scheduled session
export const deleteScheduledSession = async (id: number) => {
  console.log('API deleteScheduledSession called with:', id);
  const response = await axios.delete(`/api/centers/schedule-sessions/${id}`);
  console.log('API deleteScheduledSession response:', response.data);
  return response.data;
};

// Generate scheduled sessions from recurring sessions
export const generateScheduledSessions = async (data: {
  center_id: number;
  start_date: string;
  end_date: string;
  session_ids?: number[];
}) => {
  console.log('API generateScheduledSessions called with:', data);
  const response = await axios.post(`/api/centers/${data.center_id}/schedule-sessions/generate`, data);
  console.log('API generateScheduledSessions response:', response.data);
  return response.data;
};
