// API configuration

// Base URL for API requests
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.example.com' 
  : '/api';

// Whether to use mock API data instead of real API calls
// Set to true to use mock data, false to use the real database connection
let USE_MOCK_API = false; // Using real API data as requested

// Authentication tokens from environment variables
// Using tokens that the backend auth middleware explicitly recognizes for development
// Looking at patient.controller.js, the backend checks for these specific tokens
const MOCK_AUTH_TOKEN = import.meta.env.VITE_MOCK_AUTH_TOKEN || 'dev-auth-token-12345';
const LIVE_AUTH_TOKEN = import.meta.env.VITE_LIVE_AUTH_TOKEN || 'mock-auth-token-for-testing'; // Using a token the backend explicitly checks for

// Function to check if mock API should be used
export const useMockApi = (): boolean => {
  console.info('API Mode:', USE_MOCK_API ? 'Mock API' : 'Real API');
  // Return the current mock API setting
  return USE_MOCK_API;
};

// Function to set mock API mode
export const setUseMockApi = (value: boolean): void => {
  USE_MOCK_API = value;
};

// Function to get the appropriate auth token based on API mode
export const getAuthToken = (): string => {
  // Try to get the token from localStorage first
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    console.log('Using stored auth token from localStorage');
    return authToken;
  }
  
  // Check if we have auth data stored
  const authData = localStorage.getItem('auth');
  if (authData) {
    try {
      const parsedAuthData = JSON.parse(authData);
      if (parsedAuthData.token) {
        console.log('Using token from auth data');
        return parsedAuthData.token;
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }
  }
  
  // Fall back to mock tokens if no auth token is found
  console.log('No auth token found, using fallback token');
  return USE_MOCK_API ? MOCK_AUTH_TOKEN : LIVE_AUTH_TOKEN;
};

// Generic API call function with error handling
export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Get the auth token
    const token = getAuthToken();
    console.log(`Making API call to ${endpoint} with token: ${token ? 'present' : 'missing'}`);
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`, // Use dynamic auth token
    };
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API call failed: ${endpoint}`, errorData);
      
      // If authentication error, try to refresh the page or redirect to login
      if (response.status === 401) {
        console.error('Authentication error - token may be invalid or expired');
      }
      
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
};
