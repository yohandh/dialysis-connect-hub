import axios from '../lib/axios';

// Fetch all beds for a center
export const fetchBedsByCenter = async (centerId: string) => {
  try {
    const response = await axios.get(`/api/centers/${centerId}/beds`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching beds for center ${centerId}:`, error.response?.data || error.message);
    // Return an empty array instead of throwing to prevent form loading issues
    return [];
  }
};

// Fetch available beds for a specific schedule session
export const fetchAvailableBedsForSession = async (sessionId: string) => {
  try {
    const response = await axios.get(`/api/beds/sessions/${sessionId}/available-beds`);
    return response.data;
  } catch (error) {
    console.error('Error fetching available beds for session:', error);
    throw error;
  }
};

// Create a new bed
export const createBed = async (data: { center_id: number; code: string }) => {
  const response = await axios.post('/api/beds', data);
  return response.data;
};

// Update a bed
export const updateBed = async (id: number, data: { code: string; status: string }) => {
  const response = await axios.put(`/api/beds/${id}`, data);
  return response.data;
};

// Delete a bed
export const deleteBed = async (id: number) => {
  const response = await axios.delete(`/api/beds/${id}`);
  return response.data;
};
