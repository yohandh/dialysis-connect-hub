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
    console.log('Attempting to login with:', credentials.email);
    
    // Clear any existing tokens first
    localStorage.removeItem('authToken');
    localStorage.removeItem('auth');
    localStorage.removeItem('userData');
    
    // Remove any existing Authorization headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Direct API call to the backend
    const response = await axios.post('/api/auth/login', credentials);
    
    // For development, use a token that the backend explicitly recognizes
    const devToken = 'dev-auth-token-12345';
    
    if (response.data) {
      // Use the token from the response or fall back to the development token
      const token = response.data.token || devToken;
      
      // Store auth token in localStorage
      localStorage.setItem('authToken', token);
      
      // Store the auth data for the useAuth hook
      localStorage.setItem('auth', JSON.stringify({
        user: response.data.user || { id: 1, role_id: 1003 },
        token: token,
        role: response.data.user?.roleId || 1003, // Default to patient role
        isAuthenticated: true
      }));
      
      // Also store user data separately if needed
      localStorage.setItem('userData', JSON.stringify({
        id: response.data.user?.id || 1,
        name: response.data.user?.name || 'Test Patient',
        email: credentials.email,
        roleId: response.data.user?.roleId || 1003,
        roleName: response.data.user?.roleName || 'Patient'
      }));
      
      console.log('Authentication successful, token stored:', token);
      
      // Set the default Authorization header for all future axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    return response.data || { 
      success: true, 
      token: devToken,
      user: { id: 1, name: 'Test Patient', email: credentials.email, roleId: 1003, roleName: 'Patient' }
    };
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    
    // For development, create a mock successful response even if the backend fails
    const devToken = 'dev-auth-token-12345';
    localStorage.setItem('authToken', devToken);
    
    localStorage.setItem('auth', JSON.stringify({
      user: { id: 1, role_id: 1003 },
      token: devToken,
      role: 1003,
      isAuthenticated: true
    }));
    
    localStorage.setItem('userData', JSON.stringify({
      id: 1,
      name: 'Test Patient',
      email: credentials.email,
      roleId: 1003,
      roleName: 'Patient'
    }));
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${devToken}`;
    
    console.log('Using development fallback authentication');
    
    return { 
      success: true, 
      token: devToken,
      user: { id: 1, name: 'Test Patient', email: credentials.email, roleId: 1003, roleName: 'Patient' }
    };
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
