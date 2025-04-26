import { useMockApi, apiCall } from "@/config/api.config";
import axios from 'axios'; // Import axios

// Mock API delay
const API_DELAY = 300;

// Mock user data
const mockUsers = [
  {
    id: 1,
    email: "admin@dialyzeease.org",
    password: "example.com", // In a real app, passwords would be hashed
    name: "DialyzeEase Admin",
    role_id: 1000, // Admin role
    is_active: true
  },
  {
    id: 2,
    email: "staff@dialyzeease.org",
    password: "example.com",
    name: "DialyzeEase Staff",
    role_id: 1001, // Staff role
    is_active: true
  },
  {
    id: 3,
    email: "doctor@dialyzeease.org",
    password: "example.com",
    name: "DialyzeEase Doctor",
    role_id: 1002, // Doctor role
    is_active: true
  },
  {
    id: 4,
    email: "patient@dialyzeease.org",
    password: "example.com",
    name: "DialyzeEase Patient",
    role_id: 1003, // Patient role
    is_active: true
  }
];

// Login user
export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    // Direct API call to the backend
    const response = await axios.post('/api/auth/login', credentials);
    
    if (response.data && response.data.token) {
      // Store auth token in localStorage
      localStorage.setItem('authToken', response.data.token);
      
      // Also store user data
      localStorage.setItem('userData', JSON.stringify({
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        roleId: response.data.user.roleId,
        roleName: response.data.user.roleName
      }));
      
      console.log('Authentication successful, token stored');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  // Any other cleanup needed
  return { success: true };
};

// Get current user
export const getCurrentUser = async (token: string) => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      // In a real app, we would validate the token
      // For mock, we'll extract the user ID from the token
      const tokenParts = token.split('-');
      if (tokenParts.length < 2) {
        throw new Error("Invalid token");
      }
      
      const userId = parseInt(tokenParts[1]);
      const user = mockUsers.find(u => u.id === userId);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Return user data without the password
      const { password, ...userWithoutPassword } = user;
      
      return userWithoutPassword;
    } else {
      // Real API call
      const response = await apiCall('/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response;
    }
  } catch (error) {
    console.error("Failed to get current user:", error);
    throw error;
  }
};
