import { useMockApi, apiCall } from "@/config/api.config";

// Mock API delay
const API_DELAY = 300;

// Mock user data
const mockUsers = [
  {
    id: 1,
    email: "admin@dialysisconnecthub.org",
    password: "example.com", // In a real app, passwords would be hashed
    name: "Michael Adams",
    role_id: 1000, // Admin role
    is_active: true
  },
  {
    id: 2,
    email: "staff@dialysisconnecthub.org",
    password: "example.com",
    name: "Sarah Johnson",
    role_id: 1001, // Staff role
    is_active: true
  },
  {
    id: 3,
    email: "doctor@dialysisconnecthub.org",
    password: "example.com",
    name: "Dr. David Chen",
    role_id: 1002, // Doctor role
    is_active: true
  },
  {
    id: 4,
    email: "patient@dialysisconnecthub.org",
    password: "example.com",
    name: "Emma Williams",
    role_id: 1003, // Patient role
    is_active: true
  }
];

// Login function
export const login = async (credentials: { email: string; password: string }) => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      
      const user = mockUsers.find(u => 
        u.email === credentials.email && 
        u.password === credentials.password &&
        u.is_active
      );
      
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      // Create a mock token (in a real app, this would be a JWT)
      const token = `mock-token-${user.id}-${Date.now()}`;
      
      // Return user data without the password
      const { password, ...userWithoutPassword } = user;
      
      return {
        user: userWithoutPassword,
        token
      };
    } else {
      // Real API call
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      return response;
    }
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
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

// Logout function
export const logout = async () => {
  try {
    if (useMockApi()) {
      await new Promise(resolve => setTimeout(resolve, API_DELAY));
      return { success: true };
    } else {
      // Real API call
      const response = await apiCall('/auth/logout', {
        method: 'POST'
      });
      
      return response;
    }
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};
