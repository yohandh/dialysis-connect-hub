
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'patient' | 'staff' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

export const users: User[] = [
  {
    id: 'user-001',
    email: 'john.smith@example.com',
    name: 'John Smith',
    role: 'patient',
    createdAt: '2023-01-10T08:15:00Z',
    lastLogin: '2023-06-20T14:30:00Z'
  },
  {
    id: 'user-002',
    email: 'maria.rodriguez@example.com',
    name: 'Maria Rodriguez',
    role: 'patient',
    createdAt: '2023-02-15T10:20:00Z',
    lastLogin: '2023-06-18T09:45:00Z'
  },
  {
    id: 'user-003',
    email: 'robert.johnson@example.com',
    name: 'Robert Johnson',
    role: 'patient',
    createdAt: '2023-03-05T11:30:00Z',
    lastLogin: '2023-06-19T16:10:00Z'
  },
  {
    id: 'user-004',
    email: 'emily.chen@example.com',
    name: 'Emily Chen',
    role: 'patient',
    createdAt: '2023-03-20T09:40:00Z',
    lastLogin: '2023-06-17T13:25:00Z'
  },
  {
    id: 'staff-001',
    email: 'sarah.johnson@example.com',
    name: 'Dr. Sarah Johnson',
    role: 'staff',
    createdAt: '2022-11-15T08:00:00Z',
    lastLogin: '2023-06-20T08:30:00Z'
  },
  {
    id: 'staff-002',
    email: 'david.chen@example.com',
    name: 'Dr. David Chen',
    role: 'staff',
    createdAt: '2022-10-20T09:15:00Z',
    lastLogin: '2023-06-19T10:45:00Z'
  },
  {
    id: 'admin-001',
    email: 'admin@diacare.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2022-01-01T00:00:00Z',
    lastLogin: '2023-06-20T07:15:00Z'
  }
];

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

// Add missing functions for legacy user conversion
export interface LegacyUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'staff' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

// Function to extract first name from a full name
export const extractFirstName = (fullName: string): string => {
  if (!fullName) return '';
  return fullName.split(' ')[0];
};

// Function to extract last name from a full name
export const extractLastName = (fullName: string): string => {
  if (!fullName) return '';
  const parts = fullName.split(' ');
  if (parts.length <= 1) return '';
  return parts.slice(1).join(' ');
};

// Convert a user with a name field to legacy format with firstName and lastName
export const convertToLegacyUser = (user: User): LegacyUser => {
  const firstName = user.name ? extractFirstName(user.name) : '';
  const lastName = user.name ? extractLastName(user.name) : '';
  
  return {
    ...user,
    firstName,
    lastName
  };
};

// Normalize user to match expected format in various components
export const normalizeUser = (user: any): any => {
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
};
