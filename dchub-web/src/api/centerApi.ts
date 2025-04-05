
import { useMockApi, apiCall } from "@/config/api.config";
import { dialysisCenters, DialysisCenter } from "@/data/centerData";

// Mock API delay
const API_DELAY = 300;

// Get all dialysis centers
export const getAllCenters = async (): Promise<DialysisCenter[]> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      return dialysisCenters;
    } else {
      const response = await apiCall<DialysisCenter[]>('/centers');
      return response;
    }
  } catch (error) {
    console.error("Failed to fetch centers:", error);
    throw error;
  }
};

// Get center details by ID
export const getCenterDetails = async (centerId: string): Promise<DialysisCenter> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      const center = dialysisCenters.find(c => c.id === centerId);
      
      if (!center) {
        throw new Error("Center not found");
      }
      
      return center;
    } else {
      const response = await apiCall<DialysisCenter>(`/centers/${centerId}`);
      return response;
    }
  } catch (error) {
    console.error("Failed to fetch center details:", error);
    throw error;
  }
};

// Create new center
export const createCenter = async (centerData: Omit<DialysisCenter, 'id' | 'currentPatients' | 'nephrologists'>): Promise<DialysisCenter> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      // Generate a new ID
      const newId = `center-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      // Create new center object
      const newCenter: DialysisCenter = {
        ...centerData,
        id: newId,
        currentPatients: 0,
        nephrologists: [] // Initialize with empty array
      };
      
      // In a real implementation, this would be persisted to a database
      // For now, we'll just return the created center
      
      return newCenter;
    } else {
      const response = await apiCall<DialysisCenter>('/centers', {
        method: 'POST',
        body: JSON.stringify(centerData)
      });
      return response;
    }
  } catch (error) {
    console.error("Failed to create center:", error);
    throw error;
  }
};

// Update existing center
export const updateCenter = async (centerData: Partial<DialysisCenter> & { id: string }): Promise<DialysisCenter> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      // Find the center to update
      const centerIndex = dialysisCenters.findIndex(c => c.id === centerData.id);
      
      if (centerIndex === -1) {
        throw new Error("Center not found");
      }
      
      // In a real implementation, this would update the database
      // Return the updated center
      return {
        ...dialysisCenters[centerIndex],
        ...centerData
      };
    } else {
      const response = await apiCall<DialysisCenter>(`/centers/${centerData.id}`, {
        method: 'PUT',
        body: JSON.stringify(centerData)
      });
      return response;
    }
  } catch (error) {
    console.error("Failed to update center:", error);
    throw error;
  }
};

// Delete center
export const deleteCenter = async (centerId: string): Promise<void> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      // Find the center to delete
      const centerIndex = dialysisCenters.findIndex(c => c.id === centerId);
      
      if (centerIndex === -1) {
        throw new Error("Center not found");
      }
      
      // In a real implementation, this would delete from the database
      // For our mock, we just return success
      return;
    } else {
      await apiCall(`/centers/${centerId}`, {
        method: 'DELETE'
      });
    }
  } catch (error) {
    console.error("Failed to delete center:", error);
    throw error;
  }
};

// For compatibility with existing imports
export const fetchCenters = getAllCenters;
export const fetchCenterById = getCenterDetails;
