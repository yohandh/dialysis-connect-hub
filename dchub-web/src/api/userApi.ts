import { User, Patient, Doctor, Role } from "@/types/adminTypes";
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
  user: User;
  patient?: Patient;
  doctor?: Doctor;
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
    case 1: return 'admin';
    case 2: return 'staff';
    case 3: return 'patient';
    case 4: return 'doctor';
    default: return 'unknown';
  }
};

export const fetchUserById = async (userId: number): Promise<UserResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const response = await axios.get(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    const user = response.data;
    
    let patient;
    let doctor;
    
    if (user.roleId === 3) { // Patient
      const patientResponse = await axios.get(`/api/patients/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      patient = patientResponse.data;
    } else if (user.roleId === 4) { // Doctor
      const doctorResponse = await axios.get(`/api/doctors/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      doctor = doctorResponse.data;
    }
    
    return { user, patient, doctor };
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
    
    if (data.roleId === 3) { // Patient
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
    } else if (data.roleId === 4) { // Doctor
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
    }
    
    console.log("Created new user:", { user: newUser, patient: newPatient, doctor: newDoctor });
    
    return {
      user: newUser,
      patient: newPatient,
      doctor: newDoctor
    };
  } catch (error: any) {
    console.error('Error creating user:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (data: UpdateUserRequest): Promise<UserResponse> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  try {
    const response = await axios.put(`/api/users/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    
    const updatedUser = response.data;
    
    let updatedPatient: Patient | undefined;
    let updatedDoctor: Doctor | undefined;
    
    if (data.roleId === 3) { // Patient
      const patientResponse = await axios.put(`/api/patients/${data.id}`, {
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
      updatedPatient = patientResponse.data;
    } else if (data.roleId === 4) { // Doctor
      const doctorResponse = await axios.put(`/api/doctors/${data.id}`, {
        gender: data.gender,
        specialization: data.specialization,
        address: data.address,
        emergencyContactNo: data.emergencyContactNo,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      updatedDoctor = doctorResponse.data;
    }
    
    console.log("Updated user:", { user: updatedUser, patient: updatedPatient, doctor: updatedDoctor });
    
    return {
      user: updatedUser,
      patient: updatedPatient,
      doctor: updatedDoctor
    };
  } catch (error: any) {
    console.error('Error updating user:', error.response?.data || error.message);
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
    
    console.log(`User ${userId} deleted/deactivated`);
    
    return true;
  } catch (error: any) {
    console.error('Error deleting user:', error.response?.data || error.message);
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
