import axios from 'axios';

export const handleApiError = (error: any, defaultMessage: string = 'An error occurred') => {
  if (axios.isAxiosError(error)) {
    // Handle Axios errors
    const errorMessage = error.response?.data?.message || error.message || defaultMessage;
    console.error(`API Error: ${errorMessage}`, error);
    throw new Error(errorMessage);
  } else {
    // Handle other errors
    console.error(`Error: ${defaultMessage}`, error);
    throw new Error(defaultMessage);
  }
};
