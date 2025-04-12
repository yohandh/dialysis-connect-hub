import axios from '../lib/axios';

// Fetch all beds for a center
export const fetchBedsByCenter = async (centerId: string) => {
  const response = await axios.get(`/api/centers/${centerId}/beds`);
  return response.data;
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
