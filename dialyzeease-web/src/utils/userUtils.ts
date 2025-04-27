
import { User } from "@/types/adminTypes";
import { convertToLegacyUser } from "@/data/userData";

// This function retrieves a name property or falls back to combining firstName and lastName
export function getUserName(user: any): string {
  if (user.name) {
    return user.name;
  }
  
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  return "Unknown User";
}

// This helper function can be used to get the first name from a user object
// regardless of the structure (name field or firstName field)
export function getUserFirstName(user: any): string {
  if (user.firstName) {
    return user.firstName;
  }
  
  if (user.name) {
    const parts = user.name.split(' ');
    return parts[0] || "";
  }
  
  return "";
}

// This helper function can be used to get the last name from a user object
// regardless of the structure (name field or lastName field)
export function getUserLastName(user: any): string {
  if (user.lastName) {
    return user.lastName;
  }
  
  if (user.name) {
    const parts = user.name.split(' ');
    return parts.slice(1).join(' ') || "";
  }
  
  return "";
}

// Use this function to normalize user objects for components that expect the legacy format
export function normalizeUser(user: User | any): any {
  // If it's already in the legacy format (with firstName/lastName), return as is
  if (user.firstName && user.lastName) {
    return user;
  }
  
  // If it's a new format user, convert it
  if (user.name) {
    return convertToLegacyUser(user);
  }
  
  // Default case, return original
  return user;
}

// Compare IDs as strings for compatibility with both string and number IDs
export function isSameId(id1: string | number, id2: string | number): boolean {
  return String(id1) === String(id2);
}

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
