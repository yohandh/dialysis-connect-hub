import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { roles } from '@/data/adminMockData';
import { cn } from "@/lib/utils";
import { CreateUserRequest, UpdateUserRequest } from '@/api/userApi';
import { useQuery } from '@tanstack/react-query';
import { fetchRoles } from '@/api/userApi';

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
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
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
  onSave: (values: CreateUserRequest | UpdateUserRequest) => void;
  defaultValues?: any;
  mode: 'create' | 'edit';
  isSubmitting?: boolean;
}

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

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultValues,
  mode,
  isSubmitting = false
}) => {
  // Fetch roles from API
  const { data: roleOptions = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
    initialData: roles
  });

  // State to track the selected role
  const [selectedRole, setSelectedRole] = useState<number | null>(defaultValues?.roleId || null);
  
  // State to track the current step (1: Basic Info, 2: Role-specific Info)
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Function to determine if the selected role requires a second step
  const requiresSecondStep = (roleId: number | null): boolean => {
    if (!roleId) return false;
    // Admin is role ID 1, others require a second step
    return roleId !== 1;
  };

  // Function to get role name by ID
  const getRoleNameById = (roleId: number | null): string => {
    if (!roleId) return "";
    const role = roleOptions.find(r => r.id === roleId);
    return role ? role.name : "";
  };

  // Initialize default values for the form
  const getInitialValues = (): FormValues => {
    if (mode === 'edit' && defaultValues) {
      return {
        id: defaultValues.id,
        name: defaultValues.name || '',
        email: defaultValues.email || '',
        mobileNo: defaultValues.mobileNo || '',
        password: '',
        roleId: defaultValues.roleId || null as unknown as number,
        status: defaultValues.status?.toLowerCase() as 'active' | 'inactive' || 'active',
        gender: defaultValues.gender || undefined,
        dob: defaultValues.dob ? new Date(defaultValues.dob) : undefined,
        address: defaultValues.address || '',
        bloodGroup: defaultValues.bloodGroup || '',
        emergencyContactNo: defaultValues.emergencyContactNo || '',
        emergencyContact: defaultValues.emergencyContact || '',
        insuranceProvider: defaultValues.insuranceProvider || '',
        allergies: defaultValues.allergies || '',
        chronicConditions: defaultValues.chronicConditions || '',
        specialization: defaultValues.specialization || '',
        designation: defaultValues.designation || '',
      };
    }
    
    return {
      name: '',
      email: '',
      mobileNo: '',
      password: '',
      roleId: null as unknown as number,
      status: 'active',
    };
  };
  
  // Create the form schema based on role
  const getFormSchema = () => {
    // Base schema depends on mode (create or edit)
    const baseFormSchema = mode === 'create' ? createBaseSchema : updateBaseSchema;
    
    // Add role-specific schema if a role is selected
    if (selectedRole) {
      switch (selectedRole) {
        case 3: // Patient
          return baseFormSchema.merge(patientSchema);
        case 4: // Doctor
          return baseFormSchema.merge(doctorSchema);
        case 2: // Staff
          return baseFormSchema.merge(staffSchema);
        default:
          return baseFormSchema;
      }
    }
    
    return baseFormSchema;
  };
  
  // Create form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: getInitialValues(),
    mode: "onChange"
  });
  
  // Update form schema when role changes
  useEffect(() => {
    form.reset(undefined, { 
      keepValues: true,
      keepDirty: true,
      keepErrors: false,
      keepTouched: false,
      keepIsSubmitted: false,
      keepSubmitCount: false,
    });
  }, [selectedRole, form]);
  
  // Handle role change to update schema
  const handleRoleChange = (value: string) => {
    if (value === "placeholder") {
      setSelectedRole(null);
      form.setValue('roleId', null as unknown as number);
      return;
    }
    
    const roleId = parseInt(value, 10);
    setSelectedRole(roleId);
    form.setValue('roleId', roleId);
    
    // Reset to step 1 when role changes
    setCurrentStep(1);
  };
  
  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Convert form values to API request format
    if (mode === 'edit') {
      // For edit mode, ensure id is included and required
      const updateData: UpdateUserRequest = {
        ...values,
        id: values.id!,  // Assert that id exists for edit mode
        // Status is already lowercase in the form values
        dob: values.dob ? values.dob.toISOString().split('T')[0] : undefined,
      };
      onSave(updateData);
    } else {
      // For create mode
      const createData: CreateUserRequest = {
        ...values,
        // Status is already lowercase in the form values
        dob: values.dob ? values.dob.toISOString().split('T')[0] : undefined,
      };
      onSave(createData);
    }
  };
  
  // Get the title for the second step based on role
  const getSecondStepTitle = (): string => {
    const roleName = getRoleNameById(selectedRole);
    return `${roleName} Information`;
  };

  // Determine if the form is valid for the current step
  const isCurrentStepValid = async (): Promise<boolean> => {
    if (currentStep === 1) {
      const result = await form.trigger(['name', 'email', 'mobileNo', 'roleId', 'status', 'password']);
      return result;
    } else {
      // For step 2, validate based on role
      if (selectedRole === 3) { // Patient
        return await form.trigger(['gender', 'dob', 'address', 'bloodGroup', 'emergencyContactNo', 'emergencyContact', 'insuranceProvider', 'allergies', 'chronicConditions']);
      } else if (selectedRole === 4) { // Doctor
        return await form.trigger(['gender', 'specialization', 'address', 'emergencyContactNo']);
      } else if (selectedRole === 2) { // Staff
        return await form.trigger(['gender', 'designation']);
      }
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
      // Always show "Save" on first step, regardless of role
      return 'Save';
    }
    
    return 'Save';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 1 
              ? `${mode === 'create' ? 'Add' : 'Edit'} User` 
              : getSecondStepTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 ? (
              // Step 1: Basic User Information
              <>
                <div className="grid grid-cols-2 gap-4">
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
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mobileNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{mode === 'create' ? 'Password' : 'New Password (Optional)'}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={mode === 'create' ? 'Enter password' : 'Leave blank to keep current'} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select 
                          onValueChange={handleRoleChange}
                          value={field.value?.toString() || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="placeholder">Select a role</SelectItem>
                            {roleOptions.map(role => (
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
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
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
              </>
            ) : (
              // Step 2: Role-specific Information
              <>
                {selectedRole === 3 && ( // Patient
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              value={field.value || ''}
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
                      
                      <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter address" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bloodGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Group</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., A+" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="insuranceProvider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Provider</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Blue Cross" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="emergencyContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Jane Doe" {...field} />
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
                              <Input placeholder="e.g., +1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="allergies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allergies</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List any allergies" 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="chronicConditions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chronic Conditions</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List any chronic conditions" 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
                
                {selectedRole === 4 && ( // Doctor
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              value={field.value || ''}
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
                      
                      <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specialization</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Nephrologist" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter address" 
                              className="resize-none" 
                              {...field} 
                            />
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
                            <Input placeholder="e.g., +1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                {selectedRole === 2 && ( // Staff
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              value={field.value || ''}
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
                      
                      <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Designation (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Head Nurse" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={currentStep === 1 ? onClose : () => setCurrentStep(1)}
                disabled={isSubmitting}
              >
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>
              
              {currentStep === 1 ? (
                <Button 
                  type={requiresSecondStep(selectedRole) ? "button" : "submit"}
                  onClick={requiresSecondStep(selectedRole) ? async () => {
                    const isValid = await isCurrentStepValid();
                    if (isValid) setCurrentStep(2);
                  } : undefined}
                  disabled={isNextButtonDisabled()}
                >
                  {selectedRole === 1 ? 'Save' : 'Next'}
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {getActionButtonText()}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
