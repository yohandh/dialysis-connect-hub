import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, AlertCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '@/api/userApi';
import { useQuery } from '@tanstack/react-query';
import { fetchRoles } from '@/api/userApi';
import { fetchUserById } from '@/api/userApi';
import { roles } from '@/data/adminMockData';
import { cn } from "@/lib/utils";

// Define type for form values to fix the type issues
type FormValues = {
  id?: number;
  name: string;
  email: string;
  mobileNo: string;
  password?: string;
  roleId: number;
  status: 'active' | 'inactive';
  gender?: 'male' | 'female' | 'other';
  dob?: Date;
  address?: string;
  bloodGroup?: string;
  emergencyContactNo?: string;
  emergencyContact?: string;
  insuranceProvider?: string;
  allergies?: string;
  chronicConditions?: string;
  specialization?: string;
  designation?: string;
};

// Form schemas for different roles
const baseSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  mobileNo: z.string().min(10, { message: "Mobile number must be at least 10 characters" }),
  status: z.enum(["active", "inactive"]).default("active"),
  roleId: z.coerce.number(),
});

// Create user schema adds password requirement
const createBaseSchema = baseSchema.extend({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

// Update user schema makes password optional
const updateBaseSchema = baseSchema.extend({
  id: z.number(),
  // Allow empty string for password to keep current password
  password: z.union([
    z.string().min(8, { message: "Password must be at least 8 characters" }),
    z.string().length(0) // Allow empty string
  ]).optional(),
});

// Role-specific schemas
const patientSchema = z.object({
  gender: z.enum(["male", "female", "other"]),
  dob: z.date().optional(),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
  emergencyContactNo: z.string().optional(),
  emergencyContact: z.string().optional(),
  insuranceProvider: z.string().optional(),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
});

const doctorSchema = z.object({
  gender: z.enum(["male", "female", "other"]),
  specialization: z.string().min(2, { message: "Specialization is required" }),
  address: z.string().optional(),
  emergencyContactNo: z.string().optional(),
});

const staffSchema = z.object({
  gender: z.enum(["male", "female", "other"]).optional(),
  designation: z.string().optional(),
});

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: CreateUserRequest | UpdateUserRequest) => Promise<UserResponse>;
  userId?: number | null;
  mode: 'create' | 'edit';
  isSubmitting?: boolean;
}

export function UserFormDialog({
  isOpen,
  onClose,
  onSave,
  userId = null,
  mode = 'create',
  isSubmitting = false,
}: UserFormDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch roles from API
  const { data: roleOptions = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
    initialData: roles
  });

  // Fetch user data directly in the component when in edit mode
  const { 
    data: userData,
    isLoading: isLoadingUserData,
    error: userDataError
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userId ? fetchUserById(userId) : null,
    enabled: !!userId && mode === 'edit',
  });

  // Create the form schema based on role
  const getFormSchema = (selectedRole: number | null, mode: 'create' | 'edit') => {
    // Base schema depends on mode (create vs edit)
    const baseSchemaForMode = mode === 'create' ? createBaseSchema : updateBaseSchema;
    
    // Return schema based on role
    if (selectedRole === 1003) { // Patient
      return baseSchemaForMode.merge(patientSchema);
    } else if (selectedRole === 1002) { // Doctor
      return baseSchemaForMode.merge(doctorSchema);
    } else if (selectedRole === 1001) { // Staff
      return baseSchemaForMode.merge(staffSchema);
    } else {
      return baseSchemaForMode;
    }
  };

  // Create form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(getFormSchema(selectedRole, mode)),
    defaultValues: {
      name: '',
      email: '',
      mobileNo: '',
      password: mode === 'edit' ? undefined : '',
      roleId: selectedRole || 0,
      status: 'active',
    },
  });

  // Update form schema when role changes
  useEffect(() => {
    form.clearErrors();
  }, [selectedRole, form]);

  // Set form values when editing an existing user
  useEffect(() => {
    if (mode === 'edit' && userData && !isLoadingUserData) {
      console.log("Setting form values from user data:", userData);
      
      try {
        // Extract user data - handle both nested and flattened structures
        const userObj = userData.hasOwnProperty('user') ? (userData as any).user : userData;
        
        if (userObj && userObj.id) {
          // Prepare form values
          const formValues: FormValues = {
            id: userObj.id,
            name: userObj.name || '',
            email: userObj.email || '',
            mobileNo: userObj.mobileNo || '',
            password: '', // Leave blank to keep current password
            roleId: userObj.roleId || 1000,
            status: (userObj.status?.toLowerCase() === 'active') ? 'active' : 'inactive',
          };
          
          // Add patient-specific fields if available
          const patient = userData.hasOwnProperty('patient') ? (userData as any).patient : null;
          if (patient) {
            Object.assign(formValues, {
              gender: patient.gender,
              dob: patient.dob ? new Date(patient.dob) : undefined,
              address: patient.address,
              bloodGroup: patient.bloodGroup,
              emergencyContactNo: patient.emergencyContactNo,
              emergencyContact: patient.emergencyContact,
              insuranceProvider: patient.insuranceProvider,
              allergies: patient.allergies,
              chronicConditions: patient.chronicConditions,
            });
          }
          
          // Add doctor-specific fields if available
          const doctor = userData.hasOwnProperty('doctor') ? (userData as any).doctor : null;
          if (doctor) {
            Object.assign(formValues, {
              gender: doctor.gender,
              specialization: doctor.specialization,
              address: doctor.address,
              emergencyContactNo: doctor.emergencyContactNo,
            });
          }
          
          // Add staff-specific fields if available
          const staff = userData.hasOwnProperty('staff') ? (userData as any).staff : null;
          if (staff) {
            Object.assign(formValues, {
              gender: staff.gender,
              designation: staff.designation,
            });
          }
          
          console.log("Setting form values in edit mode:", formValues);
          
          // Reset form with the user data
          form.reset(formValues);
          
          // Update selected role
          if (userObj.roleId) {
            setSelectedRole(userObj.roleId);
          }
          
          // Force a re-render to ensure the form is updated
          setTimeout(() => {
            console.log("Form values after reset:", form.getValues());
          }, 100);
        } else {
          console.error("Invalid user data structure:", userObj);
          setFormError("Failed to load user data. Please try again.");
        }
      } catch (error) {
        console.error("Error setting form values:", error);
        setFormError("Failed to load user data. Please try again.");
      }
    }
  }, [userData, isLoadingUserData, mode, form]);

  // Reset form when opening/closing dialog or changing mode
  useEffect(() => {
    if (isOpen) {
      if (mode === 'create') {
        // Reset to default values for create mode
        form.reset({
          name: '',
          email: '',
          mobileNo: '',
          status: 'active',
          roleId: undefined,
          password: '',
        });
        setSelectedRole(null);
        setCurrentStep(1);
      }
    }
  }, [isOpen, mode, form]);

  // Function to determine if the selected role requires a second step
  const requiresSecondStep = (roleId: number | null): boolean => {
    if (!roleId) return false;
    
    // Patient, Doctor, and Staff roles require a second step
    return [1001, 1002, 1003].includes(roleId);
  };

  // Function to get role name by ID
  const getRoleNameById = (roleId: number | null): string => {
    const role = roleOptions.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  // Function to determine if the form is valid for the current step
  const isCurrentStepValid = async (): Promise<boolean> => {
    // For step 1, validate only the base fields
    if (currentStep === 1) {
      const result = await form.trigger(['name', 'email', 'mobileNo', 'password', 'roleId', 'status']);
      return result;
    }
    
    // For step 2, validate role-specific fields
    if (selectedRole === 1001) { // Staff
      return await form.trigger(['gender', 'designation']);
    } else if (selectedRole === 1003) { // Patient
      return await form.trigger(['gender', 'dob', 'address', 'bloodGroup', 'emergencyContact', 'emergencyContactNo', 'insuranceProvider', 'allergies', 'chronicConditions']);
    } else if (selectedRole === 1002) { // Doctor
      return await form.trigger(['gender', 'specialization', 'address', 'emergencyContactNo']);
    }
    
    return true;
  };

  // Determine if the Next/Save button should be disabled
  const isNextButtonDisabled = (): boolean => {
    if (currentStep === 1) {
      // Disable button if no role is selected
      return !selectedRole;
    }
    return isSubmitting;
  };

  // Get the text for the action button based on current state
  const getActionButtonText = (): string => {
    if (isSubmitting) return 'Saving...';
    
    if (currentStep === 1) {
      // For first step, show different text based on role
      if (!selectedRole || selectedRole === 1000) return mode === 'create' ? 'Create User' : 'Update User';
      return 'Next';
    }
    
    // For second step
    return mode === 'create' ? 'Create User' : 'Update User';
  };

  // Handle role change to update schema
  const handleRoleChange = (value: string) => {
    if (value === "placeholder") {
      setSelectedRole(null);
      return;
    }
    
    const roleId = parseInt(value);
    setSelectedRole(roleId);
    
    // Reset to step 1 when changing roles
    setCurrentStep(1);
    
    // Update roleId in the form
    form.setValue('roleId', roleId);
    
    // Clear any form errors when changing roles
    setFormError(null);
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      // If we're on step 1 and the selected role requires a second step, go to step 2
      if (currentStep === 1 && requiresSecondStep(selectedRole)) {
        const isValid = await isCurrentStepValid();
        if (isValid) {
          setCurrentStep(2);
        }
        return;
      }
      
      // Clear any previous errors
      setFormError(null);
      
      // Log the form values for debugging
      console.log("Submitting form with values:", values);
      
      // Create a complete data object for the API
      const userData = {
        ...values,
        // Ensure roleId is included and is a number
        roleId: Number(values.roleId),
        // For edit mode, if password is empty string, set it to undefined so it's excluded from request
        ...(mode === 'edit' && (!values.password || values.password.trim() === '') 
          ? { password: undefined } 
          : {})
      };
      
      // Submit the form data to the API
      await onSave(userData as any);
      
      // Reset form and close dialog on success
      form.reset();
      setCurrentStep(1);
      setSelectedRole(null);
      onClose();
      
    } catch (error: any) {
      console.error('Form submission error:', error);
      
      // Handle validation errors
      if (error.message === 'Email already in use') {
        form.setError('email', { 
          type: 'manual',
          message: 'Email already in use'
        });
      } else {
        // Set generic form error
        setFormError(error.message || 'An error occurred while saving the user');
      }
    }
  };

  // Handle next button click
  const handleNextClick = async () => {
    // Validate current step
    const isValid = await isCurrentStepValid();
    
    if (isValid) {
      // If we're on step 1 and the selected role requires a second step, go to step 2
      if (currentStep === 1 && requiresSecondStep(selectedRole)) {
        setCurrentStep(2);
      }
    }
  };

  // Get the title for the second step based on role
  const getSecondStepTitle = (): string => {
    if (selectedRole === 1001) return "Staff Information"; // Staff
    if (selectedRole === 1002) return "Doctor Information"; // Doctor
    if (selectedRole === 1003) return "Patient Information"; // Patient
    return "Additional Information";
  };

  // Format role name with proper capitalization
  const formatRoleName = (roleName: string) => {
    if (!roleName) return '';
    return roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase();
  };

  // Format status with proper capitalization
  const formatStatus = (status: string) => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add User' : 'Edit User'}
            {currentStep === 2 && ` - ${getSecondStepTitle()}`}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1 
              ? 'Enter the basic user information below.' 
              : `Enter the ${getRoleNameById(selectedRole).toLowerCase()} specific information below.`}
          </DialogDescription>
        </DialogHeader>
        
        {isLoadingUserData && mode === 'edit' ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Form {...form}>
            {/* Remove the onSubmit handler from the form element */}
            <form className="space-y-6">
              {/* Show error message if present */}
              {formError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}
              
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Email Field */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="user@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{mode === 'edit' ? 'Password (Optional)' : 'Password'}</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder={mode === 'edit' ? "Leave blank to keep current" : "Enter password"} 
                              {...field} 
                              value={field.value || ''}
                            />
                          </FormControl>
                          {mode === 'edit' && (
                            <FormDescription>
                              Password must be at least 8 characters
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Mobile Number and Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mobileNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="94-77-727-8824" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Status Field */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Role Selection */}
                  <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            handleRoleChange(value);
                            field.onChange(parseInt(value));
                          }}
                          value={field.value?.toString() || "placeholder"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="placeholder" disabled>Select a role</SelectItem>
                            {roleOptions.map((role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {/* Step 2: Role-specific Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {/* Patient Fields */}
                  {selectedRole === 1003 && (
                    <>
                      {/* Gender */}
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Date of Birth */}
                      <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="date"
                                  placeholder="Date of Birth"
                                  value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                  onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : undefined;
                                    field.onChange(date);
                                  }}
                                  max={format(new Date(), 'yyyy-MM-dd')}
                                  className="w-full pr-10"
                                />
                                <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Select your date of birth using the calendar
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Address */}
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter address" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Blood Group */}
                      <FormField
                        control={form.control}
                        name="bloodGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Group</FormLabel>
                            <FormControl>
                              <Input placeholder="A+, B-, O+, etc." {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Emergency Contact */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="emergencyContact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Emergency Contact Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Contact name" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="emergencyContactNo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Emergency Contact Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Contact number" {...field} value={field.value || ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Insurance Provider */}
                      <FormField
                        control={form.control}
                        name="insuranceProvider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Provider</FormLabel>
                            <FormControl>
                              <Input placeholder="Insurance provider name" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Allergies */}
                      <FormField
                        control={form.control}
                        name="allergies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allergies</FormLabel>
                            <FormControl>
                              <Textarea placeholder="List any allergies" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Chronic Conditions */}
                      <FormField
                        control={form.control}
                        name="chronicConditions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chronic Conditions</FormLabel>
                            <FormControl>
                              <Textarea placeholder="List any chronic conditions" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  
                  {/* Doctor Fields */}
                  {selectedRole === 1002 && (
                    <>
                      {/* Gender */}
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Specialization */}
                      <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specialization</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., Nephrology, Cardiology" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Address */}
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter address" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Emergency Contact Number */}
                      <FormField
                        control={form.control}
                        name="emergencyContactNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Contact number" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  
                  {/* Staff Fields */}
                  {selectedRole === 1001 && (
                    <>
                      {/* Gender */}
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Designation */}
                      <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Designation</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., Nurse, Receptionist" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              )}
              
              {/* Dialog Footer */}
              <DialogFooter className="flex justify-between">
                {currentStep === 2 ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                )}
                
                {/* Action button - Next or Submit */}
                {currentStep === 1 && requiresSecondStep(selectedRole) ? (
                  <Button 
                    type="button"
                    onClick={handleNextClick}
                    disabled={isNextButtonDisabled() || isSubmitting}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="button"
                    onClick={() => form.handleSubmit(onSubmit)()}
                    disabled={isNextButtonDisabled() || isSubmitting}
                  >
                    {mode === 'create' ? 'Create User' : 'Update User'}
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default UserFormDialog;
