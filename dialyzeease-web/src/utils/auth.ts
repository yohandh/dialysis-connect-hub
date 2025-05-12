// Authentication utilities

/**
 * Set authentication token in localStorage
 * @param token JWT token
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * Get authentication token from localStorage
 * @returns JWT token or null if not found
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * Check if user is authenticated (token exists)
 * @returns boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Initialize development authentication
 * This should only be used in development mode
 */
export const initDevAuth = (): void => {
  if (process.env.NODE_ENV !== 'production' && !getAuthToken()) {
    setAuthToken('test-token');
    console.log('Development authentication initialized');
  }
};
