// Application constants

// API URL for backend requests
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.example.com' 
  : 'http://localhost:5000/api';

// Date formats
export const DATE_FORMATS = {
  DEFAULT: 'yyyy-MM-dd',
  DISPLAY: 'MMM dd, yyyy',
  DATETIME: 'MMM dd, yyyy HH:mm:ss',
  TIME: 'HH:mm'
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

// Status colors
export const STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  'no-show': 'bg-amber-100 text-amber-800',
  pending: 'bg-gray-100 text-gray-800'
};

// Action colors
export const ACTION_COLORS = {
  create: 'bg-green-500',
  update: 'bg-blue-500',
  delete: 'bg-red-500'
};

// Export all constants
export default {
  API_URL,
  DATE_FORMATS,
  PAGINATION,
  STATUS_COLORS,
  ACTION_COLORS
};
