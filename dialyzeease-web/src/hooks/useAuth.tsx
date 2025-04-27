import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
interface User {
  id: number;
  role_id: number;
  first_name: string;
  last_name: string;
  email: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  role: number | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (data: { user: User; token: string; role: number }) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isStaff: () => boolean;
  isDoctor: () => boolean;
  isPatient: () => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Initialize auth state from localStorage if available
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        return JSON.parse(storedAuth);
      } catch (error) {
        console.error('Failed to parse stored auth data:', error);
      }
    }
    
    // Default state if nothing in localStorage
    return {
      user: null,
      token: null,
      role: null,
      isAuthenticated: false
    };
  });

  // Update localStorage when auth state changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify(authState));
    } else {
      localStorage.removeItem('auth');
      localStorage.removeItem('authToken');
    }
  }, [authState]);

  // Login function
  const login = (data: { user: User; token: string; role: number }) => {
    // Store token directly in localStorage for API calls
    localStorage.setItem('authToken', data.token);
    
    // Update auth state
    setAuthState({
      user: data.user,
      token: data.token,
      role: data.role,
      isAuthenticated: true
    });
    
    console.log('Auth token stored:', data.token);
  };

  // Logout function
  const logout = () => {
    setAuthState({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false
    });
  };

  // Role check functions
  const isAdmin = () => authState.role === 1000;
  const isStaff = () => authState.role === 1001;
  const isDoctor = () => authState.role === 1002;
  const isPatient = () => authState.role === 1003;

  // Context value
  const value = {
    ...authState,
    login,
    logout,
    isAdmin,
    isStaff,
    isDoctor,
    isPatient
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
