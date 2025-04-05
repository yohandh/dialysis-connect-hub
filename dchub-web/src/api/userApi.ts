
import { User, Patient, Doctor, Role } from "@/types/adminTypes";
import { users, patients, doctors, roles } from "@/data/adminMockData";

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
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return users;
};

export const fetchUserById = async (userId: number): Promise<UserResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error("User not found");
  
  let patient;
  let doctor;
  
  if (user.roleId === 3) { // Patient
    patient = patients.find(p => p.userId === user.id);
  } else if (user.roleId === 4) { // Doctor
    doctor = doctors.find(d => d.userId === user.id);
  }
  
  return { user, patient, doctor };
};

export const createUser = async (data: CreateUserRequest): Promise<UserResponse> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real API this would create the user in the database
  // For now, we'll simulate a successful response
  
  const newId = Math.max(...users.map(u => u.id)) + 1;
  
  const newUser: User = {
    id: newId,
    roleId: data.roleId,
    name: data.name,
    email: data.email,
    mobileNo: data.mobileNo,
    status: data.status,
    roleName: roles.find(r => r.id === data.roleId)?.name
  };
  
  // Simulate creating role-specific records
  let newPatient: Patient | undefined;
  let newDoctor: Doctor | undefined;
  
  if (data.roleId === 3) { // Patient
    newPatient = {
      id: patients.length + 1,
      userId: newId,
      gender: data.gender as 'male' | 'female' | 'other',
      dob: data.dob as string,
      address: data.address || '',
      bloodGroup: data.bloodGroup || '',
      emergencyContactNo: data.emergencyContactNo || '',
      emergencyContact: data.emergencyContact || '',
      insuranceProvider: data.insuranceProvider || '',
      allergies: data.allergies || '',
      chronicConditions: data.chronicConditions || '',
    };
  } else if (data.roleId === 4) { // Doctor
    newDoctor = {
      id: doctors.length + 1,
      userId: newId,
      gender: data.gender as 'male' | 'female' | 'other',
      specialization: data.specialization || '',
      address: data.address || '',
      emergencyContactNo: data.emergencyContactNo || '',
    };
  }
  
  console.log("Created new user:", { user: newUser, patient: newPatient, doctor: newDoctor });
  
  return {
    user: newUser,
    patient: newPatient,
    doctor: newDoctor
  };
};

export const updateUser = async (data: UpdateUserRequest): Promise<UserResponse> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real API this would update the user in the database
  // For now, we'll simulate a successful response
  const existingUser = users.find(u => u.id === data.id);
  if (!existingUser) throw new Error("User not found");
  
  const updatedUser: User = {
    ...existingUser,
    name: data.name,
    email: data.email,
    mobileNo: data.mobileNo,
    status: data.status,
    roleId: data.roleId,
    roleName: roles.find(r => r.id === data.roleId)?.name
  };
  
  // Simulate updating role-specific records
  let updatedPatient: Patient | undefined;
  let updatedDoctor: Doctor | undefined;
  
  if (data.roleId === 3) { // Patient
    const existingPatient = patients.find(p => p.userId === data.id);
    
    updatedPatient = {
      id: existingPatient?.id || patients.length + 1,
      userId: data.id,
      gender: data.gender as 'male' | 'female' | 'other',
      dob: data.dob as string,
      address: data.address || '',
      bloodGroup: data.bloodGroup || '',
      emergencyContactNo: data.emergencyContactNo || '',
      emergencyContact: data.emergencyContact || '',
      insuranceProvider: data.insuranceProvider || '',
      allergies: data.allergies || '',
      chronicConditions: data.chronicConditions || '',
    };
  } else if (data.roleId === 4) { // Doctor
    const existingDoctor = doctors.find(d => d.userId === data.id);
    
    updatedDoctor = {
      id: existingDoctor?.id || doctors.length + 1,
      userId: data.id,
      gender: data.gender as 'male' | 'female' | 'other',
      specialization: data.specialization || '',
      address: data.address || '',
      emergencyContactNo: data.emergencyContactNo || '',
    };
  }
  
  console.log("Updated user:", { user: updatedUser, patient: updatedPatient, doctor: updatedDoctor });
  
  return {
    user: updatedUser,
    patient: updatedPatient,
    doctor: updatedDoctor
  };
};

export const deleteUser = async (userId: number): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real API this would delete or deactivate the user
  console.log(`User ${userId} deleted/deactivated`);
  
  return true;
};

export const fetchRoles = async (): Promise<Role[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return roles;
};
