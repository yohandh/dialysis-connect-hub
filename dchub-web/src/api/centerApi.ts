import { useMockApi, apiCall } from "@/config/api.config";
import { dialysisCenters } from "@/data/centerData";
import { DialysisCenter } from "@/types/centerTypes";

// Mock API delay
const API_DELAY = 300;

// Function to convert time format
function convertTimeFormat(time: string): string {
  try {
    // Parse time like "6:00 AM" or "7:30 PM" to database format "06:00:00" or "19:30:00"
    const [timePart, ampm] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    
    // Convert to 24-hour format
    if (ampm.toUpperCase() === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }
    
    // Format as HH:MM:SS
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  } catch (error) {
    console.error('Error converting time format:', error);
    return time; // Return original if parsing fails
  }
}

// Get all dialysis centers
export const getAllCenters = async (): Promise<DialysisCenter[]> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      return dialysisCenters;
    } else {
      const response = await apiCall<DialysisCenter[]>('/centers');
      console.log('API Response - Centers:', response);
      console.log('First center data structure:', response[0]);
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
      
      const center = dialysisCenters.find(c => c.id.toString() === centerId);
      
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
export const createCenter = async (centerData: any): Promise<DialysisCenter> => {
  try {
    // Extract operating hours data if present
    const { centerHours, ...centerFields } = centerData;
    
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      // Generate a new ID
      const newId = Math.floor(Math.random() * 1000) + 10;
      
      // Create new center object
      const newCenter: DialysisCenter = {
        ...centerFields,
        id: newId,
        isActive: true
      };
      
      console.log('Creating new center with mock API:', newCenter);
      console.log('Operating hours data:', centerHours);
      
      // Add the center to the mock data array for this session
      dialysisCenters.push(newCenter);
      
      return newCenter;
    } else {
      // Prepare center data for the API
      const apiData = {
        name: centerFields.name,
        address: centerFields.address,
        contact_no: centerFields.contactNo,
        email: centerFields.email,
        total_capacity: centerFields.totalCapacity,
        manage_by_id: centerFields.manageById,
        is_active: true,
        center_hours: centerHours.map((hour: any) => ({
          weekday: hour.day,
          open_time: hour.openTime ? convertTimeFormat(hour.openTime) : null,
          close_time: hour.closeTime ? convertTimeFormat(hour.closeTime) : null
        }))
      };
      
      console.log('Submitting center data to API:', apiData);
      
      const response = await apiCall<DialysisCenter>('/centers', {
        method: 'POST',
        body: JSON.stringify(apiData)
      });
      
      return response;
    }
  } catch (error) {
    console.error("Failed to create center:", error);
    throw error;
  }
};

// Update existing center
export const updateCenter = async (centerData: any): Promise<DialysisCenter> => {
  try {
    // Extract operating hours data if present
    const { centerHours, ...centerFields } = centerData;
    
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      const centerIndex = dialysisCenters.findIndex(c => c.id === centerFields.id);
      
      if (centerIndex === -1) {
        throw new Error("Center not found");
      }
      
      console.log('Updating center with mock API:', centerFields);
      console.log('Operating hours data:', centerHours);
      
      // Update center in mock data
      dialysisCenters[centerIndex] = {
        ...dialysisCenters[centerIndex],
        ...centerFields,
      };
      
      return dialysisCenters[centerIndex];
    } else {
      // Prepare center data for the API
      const apiData = {
        name: centerFields.name,
        address: centerFields.address,
        contact_no: centerFields.contactNo,
        email: centerFields.email,
        total_capacity: centerFields.totalCapacity,
        manage_by_id: centerFields.manageById,
        is_active: centerFields.isActive,
        center_hours: centerHours.map((hour: any) => ({
          weekday: hour.day,
          open_time: hour.openTime ? convertTimeFormat(hour.openTime) : null,
          close_time: hour.closeTime ? convertTimeFormat(hour.closeTime) : null
        }))
      };
      
      console.log('Submitting update to API:', apiData);
      
      const response = await apiCall<DialysisCenter>(`/centers/${centerFields.id}`, {
        method: 'PUT',
        body: JSON.stringify(apiData)
      });
      
      return response;
    }
  } catch (error) {
    console.error("Failed to update center:", error);
    throw error;
  }
};

// Delete center (soft delete - sets is_active to 0)
export const deleteCenter = async (centerId: string): Promise<void> => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      const centerIndex = dialysisCenters.findIndex(c => c.id.toString() === centerId);
      
      if (centerIndex === -1) {
        throw new Error("Center not found");
      }
      
      // Instead of removing from array, mark as inactive
      dialysisCenters[centerIndex].isActive = false;
    } else {
      await apiCall<void>(`/centers/${centerId}`, {
        method: 'DELETE'
      });
    }
  } catch (error) {
    console.error("Failed to deactivate center:", error);
    throw error;
  }
};

// For compatibility with existing imports
export const fetchCenters = getAllCenters;
export const fetchCenterById = getCenterDetails;
