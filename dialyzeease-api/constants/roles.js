/**
 * Role definitions for the DialyzeEase application
 * These constants are used throughout the application to ensure consistency
 * between frontend and backend role management.
 */

const ROLES = {
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
const getRoleById = (roleId) => {
  return Object.values(ROLES).find(role => role.id === roleId) || null;
};

const getRoleByName = (roleName) => {
  return Object.values(ROLES).find(role => role.name === roleName.toLowerCase()) || null;
};

module.exports = {
  ROLES,
  getRoleById,
  getRoleByName
};
