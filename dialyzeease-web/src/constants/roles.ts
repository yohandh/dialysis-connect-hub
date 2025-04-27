/**
 * Role definitions for the DialyzeEase application
 * These constants are used throughout the application to ensure consistency
 * between frontend and backend role management.
 */

export const ROLES = {
  ADMIN: {
    id: 1000,
    name: 'admin',
    label: 'Admin'
  },
  STAFF: {
    id: 1001,
    name: 'staff',
    label: 'Staff'
  },
  DOCTOR: {
    id: 1002,
    name: 'doctor',
    label: 'Doctor'
  },
  PATIENT: {
    id: 1003,
    name: 'patient',
    label: 'Patient'
  }
};

// Helper functions for role management
export const getRoleById = (roleId: number) => {
  return Object.values(ROLES).find(role => role.id === roleId) || null;
};

export const getRoleByName = (roleName: string) => {
  return Object.values(ROLES).find(role => role.name === roleName.toLowerCase()) || null;
};

// Type definitions for TypeScript
export type RoleId = 1000 | 1001 | 1002 | 1003;
export type RoleName = 'admin' | 'staff' | 'doctor' | 'patient';

export interface Role {
  id: RoleId;
  name: RoleName;
  label: string;
}
