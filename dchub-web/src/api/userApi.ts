import { Role, User, Staff, Doctor, Patient } from "@/types/adminTypes";
import axios from 'axios'; // Import axios

// Types for API requests and responses
export interface CreateUserRequest {
  name: string;
  email: string;
  mobileNo: string;
  password?: string;
  roleId: number;
  status: 'active' | 'inactive';
  // Extended fields based on role
  gender?: 'male' | 'female' | 'other';
  dob?: Date | string;
  address?: string;
  bloodGroup?: string;
  emergencyContactNo?: string;
  emergencyContact?: string;
  insuranceProvider?: string;
  allergies?: string;
  chronicConditions?: string;
  specialization?: string;
  designation?: string;
}

export interface UpdateUserRequest extends Omit<CreateUserRequest, 'password'> {
  id: number;
  password?: string; // Optional for updates
}

export interface UserResponse {
  id?: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNo?: string;
  roleId?: number;
  roleName?: string;
  status?: string;
  lastLogin?: string;
  patient?: Patient;
  doctor?: Doctor;
  staff?: Staff;
  // For backward compatibility with nested responses
  user?: {
    id: number;
    name: string;
    email: string;
    mobileNo: string;
    roleId: number;
    roleName: string;
    status: string;
    lastLogin?: string;
  };
}

// Mock API functions
export const fetchUsers = async (): Promise<User[]> => {
  try {
    // Get authentication token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    const response = await axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Map the response data to ensure consistent structure
    return response.data.map((user: any) => ({
      id: user.id,
      name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email,
      mobileNo: user.mobileNo || user.mobile_no || '',
      roleId: user.roleId || user.role_id,
      roleName: user.roleName || getRoleName(user.roleId || user.role_id),
      status: user.status || 'active',
      createdAt: user.createdAt || user.created_at,
      updatedAt: user.updatedAt || user.updated_at
    }));
  } catch (error: any) {
    console.error('Error fetching users:', error.response?.data || error.message);
    throw error;
  }
};

// Helper function to get role name from role ID
const getRoleName = (roleId: number) => {
  switch (roleId) {
    case 1000: return 'admin';
    case 1001: return 'staff';
    case 1002: return 'doctor';
    case 1003: return 'patient';
    default: return 'unknown';
  }
};

export const fetchUserById = async (userId: number): Promise<UserResponse> => {
  try {
    const response = await axios.get(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    // Extract data from the response
    const data = response.data;
    
    // Check if the response has a nested user structure
    if (data && data.user) {
      // If it's nested, flatten it
      const { user, patient, doctor, staff } = data;
      return { ...user, patient, doctor, staff };
    }
    
    // If it's already flattened, return as is
    return data;
  } catch (error: any) {
    console.error('Error fetching user:', error.response?.data || error.message);
    throw error;
  }
};

export const createUser = async (data: CreateUserRequest): Promise<UserResponse> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  try {
    const response = await axios.post('/api/users', data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    const newUser = response.data;
    
    let newPatient: Patient | undefined;
    let newDoctor: Doctor | undefined;
    let newStaff: Staff | undefined;
    
    if (data.roleId === 1003) { // Patient
      const patientResponse = await axios.post('/api/patients', {
        userId: newUser.id,
        gender: data.gender,
        dob: data.dob,
        address: data.address,
        bloodGroup: data.bloodGroup,
        emergencyContactNo: data.emergencyContactNo,
        emergencyContact: data.emergencyContact,
        insuranceProvider: data.insuranceProvider,
        allergies: data.allergies,
        chronicConditions: data.chronicConditions,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      newPatient = patientResponse.data;
    } else if (data.roleId === 1002) { // Doctor
      const doctorResponse = await axios.post('/api/doctors', {
        userId: newUser.id,
        gender: data.gender,
        specialization: data.specialization,
        address: data.address,
        emergencyContactNo: data.emergencyContactNo,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      newDoctor = doctorResponse.data;
    } else if (data.roleId === 1001) { // Staff
      const staffResponse = await axios.post('/api/staff', {
        userId: newUser.id,
        gender: data.gender,
        designation: data.designation,
        address: data.address,
        emergencyContactNo: data.emergencyContactNo,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      newStaff = staffResponse.data;
    }
    
    console.log("Created new user:", { ...newUser, patient: newPatient, doctor: newDoctor, staff: newStaff });
    
    return { ...newUser, patient: newPatient, doctor: newDoctor, staff: newStaff };
  } catch (error: any) {
    console.error('Error creating user:', error.response?.data || error.message);
    
    // Handle validation errors (422 status code)
    if (error.response?.status === 422) {
      const validationError = new Error(error.response.data.message || 'Validation error');
      validationError.name = 'ValidationError';
      // Add the specific field errors to the error object
      (validationError as any).errors = error.response.data.errors;
      throw validationError;
    }
    
    // For other errors, throw with the message
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const updateUser = async (data: UpdateUserRequest): Promise<UserResponse> => {
  try {
    // Split the name into firstName and lastName for the backend
    const nameParts = data.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Convert status from 'active'/'inactive' to boolean for is_active
    const isActive = data.status === 'active';
    
    // Prepare the request body with the correct field names for the backend
    const requestBody = {
      firstName,
      lastName,
      email: data.email,
      mobileNo: data.mobileNo,
      // Only include password if it's not empty
      ...(data.password ? { password: data.password } : {}),
      roleId: data.roleId,
      status: isActive, // Backend expects a boolean
      
      // Role-specific fields
      gender: data.gender,
      dob: data.dob,
      address: data.address,
      bloodGroup: data.bloodGroup,
      emergencyContactNo: data.emergencyContactNo,
      emergencyContact: data.emergencyContact,
      insuranceProvider: data.insuranceProvider,
      allergies: data.allergies,
      chronicConditions: data.chronicConditions,
      specialization: data.specialization,
      designation: data.designation
    };
    
    console.log("Sending update request with data:", requestBody);
    
    const response = await axios.put(`/api/users/${data.id}`, requestBody, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    console.log("Update response:", response.data);
    
    // Return the response data directly
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: number): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    await axios.delete(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    console.log(`User ${userId} deleted`);
    
    return true;
  } catch (error: any) {
    console.error('Error deleting user:', error.response?.data || error.message);
    throw error;
  }
};

export const deactivateUser = async (userId: number): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    await axios.put(`/api/users/${userId}/deactivate`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    console.log(`User ${userId} deactivated`);
    
    return true;
  } catch (error: any) {
    console.error('Error deactivating user:', error.response?.data || error.message);
    throw error;
  }
};

export const activateUser = async (userId: number): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    await axios.put(`/api/users/${userId}/activate`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    console.log(`User ${userId} activated`);
    
    return true;
  } catch (error: any) {
    console.error('Error activating user:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchRoles = async (): Promise<Role[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const response = await axios.get('/api/roles', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching roles:', error.response?.data || error.message);
    throw error;
  }
};

// Get users by roles (admin or staff)
export const getUsersByRoles = async (roles: string[] = ['admin', 'staff']) => {
  try {
    const response = await axios.get(`/api/users/by-roles?roles=${roles.join(',')}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching managers:', error);
    return [];
  }
};

// Fetch users by a specific role
export const fetchUsersByRole = async (role: string) => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    const response = await axios.get(`/api/users/by-role/${role}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data.map((user: any) => ({
      id: user.id,
      firstName: user.firstName || user.first_name || '',
      lastName: user.lastName || user.last_name || '',
      email: user.email,
      mobileNo: user.mobileNo || user.mobile_no || '',
      roleId: user.roleId || user.role_id,
      roleName: user.roleName || getRoleName(user.roleId || user.role_id),
      status: user.status || 'active'
    }));
  } catch (error: any) {
    console.error(`Error fetching ${role} users:`, error.response?.data || error.message);
    // Return an empty array instead of throwing to prevent form loading issues
    return [];
  }
};
