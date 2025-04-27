
/**
 * Utility functions for user data normalization and formatting
 */

import { User } from "@/types/adminTypes";

// Extract first name from full name
export const extractFirstName = (fullName: string): string => {
  if (!fullName) return '';
  return fullName.split(' ')[0];
};

// Extract last name from full name
export const extractLastName = (fullName: string): string => {
  if (!fullName) return '';
  const parts = fullName.split(' ');
  if (parts.length <= 1) return '';
  return parts.slice(1).join(' ');
};

// Normalize a patient record with first and last name
export const normalizePatientRecord = (patient: any): any => {
  if (!patient) return null;
  
  // If record already has firstName and lastName, return it as is
  if (patient.firstName && patient.lastName) {
    return patient;
  }
  
  // Extract from primary nephrologist field which is often stored as a name
  let firstName = '';
  let lastName = '';
  
  if (patient.primaryNephrologist) {
    // Use the patient's doctor name as a fallback to extract name components
    const parts = patient.primaryNephrologist.replace('Dr. ', '').split(' ');
    firstName = parts[0] || '';
    lastName = parts.slice(1).join(' ') || '';
  }
  
  // Return enhanced patient record
  return {
    ...patient,
    firstName: firstName || 'Patient',
    lastName: lastName || patient.id?.substring(0, 5) || '',
    email: `patient${patient.id}@example.com`
  };
};

// Format a date string to a more readable format
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Normalize user data for consistent access
export const getUserName = (user: any): string => {
  if (user.name) {
    return user.name;
  }
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  return "Unknown User";
};

// Get first name from user object regardless of structure
export const getUserFirstName = (user: any): string => {
  if (user.firstName) {
    return user.firstName;
  }
  
  if (user.name) {
    const parts = user.name.split(' ');
    return parts[0] || "";
  }
  
  return "";
};

// Get last name from user object regardless of structure
export const getUserLastName = (user: any): string => {
  if (user.lastName) {
    return user.lastName;
  }
  
  if (user.name) {
    const parts = user.name.split(' ');
    return parts.slice(1).join(' ') || "";
  }
  
  return "";
};

// Compare IDs safely as strings for compatibility
export const isSameId = (id1: string | number, id2: string | number): boolean => {
  return String(id1) === String(id2);
};
