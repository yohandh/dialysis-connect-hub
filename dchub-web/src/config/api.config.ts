
// API configuration

// Base URL for API requests
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.example.com' 
  : 'http://localhost:5000/api';

// Whether to use mock API data instead of real API calls
// Set to false to use the real backend API
let USE_MOCK_API = false;

// Function to check if mock API should be used
export const useMockApi = (): boolean => {
  console.info('API Mode:', USE_MOCK_API ? 'Mock API' : 'Real API');
  return USE_MOCK_API;
};

// Function to set mock API mode
export const setUseMockApi = (value: boolean): void => {
  USE_MOCK_API = value;
};

// Generic API call function with error handling
export const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
};
