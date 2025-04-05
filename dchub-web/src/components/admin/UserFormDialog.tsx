
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
  const [selectedRole, setSelectedRole] = useState<number>(defaultValues?.roleId || 0);
  
  // Initialize default values for the form
  const getInitialValues = (): FormValues => {
    if (mode === 'edit') {
      return {
        id: defaultValues?.id || 0,
        name: defaultValues?.name || "",
        email: defaultValues?.email || "",
        mobileNo: defaultValues?.mobileNo || "",
        roleId: defaultValues?.roleId || 0,
        status: defaultValues?.status || "active",
        // Patient fields
        gender: defaultValues?.patient?.gender || defaultValues?.doctor?.gender || "",
        dob: defaultValues?.patient?.dob ? new Date(defaultValues.patient.dob) : undefined,
        address: defaultValues?.patient?.address || defaultValues?.doctor?.address || "",
        bloodGroup: defaultValues?.patient?.bloodGroup || "",
        emergencyContactNo: defaultValues?.patient?.emergencyContactNo || defaultValues?.doctor?.emergencyContactNo || "",
        emergencyContact: defaultValues?.patient?.emergencyContact || "",
        insuranceProvider: defaultValues?.patient?.insuranceProvider || "",
        allergies: defaultValues?.patient?.allergies || "",
        chronicConditions: defaultValues?.patient?.chronicConditions || "",
        // Doctor fields
        specialization: defaultValues?.doctor?.specialization || "",
        // Staff fields
        designation: defaultValues?.staff?.designation || "",
      };
    } else {
      return {
        name: "",
        email: "",
        mobileNo: "",
        password: "",
        roleId: 0,
        status: "active",
      };
    }
  };
  
  // Create the form schema based on role
  const getFormSchema = () => {
    let schema;
    
    // Base schema depends on mode (create vs edit)
    const baseSchemaForMode = mode === 'create' ? createBaseSchema : updateBaseSchema;
    
    // Add role-specific fields
    switch (selectedRole) {
      case 1: // Admin
        schema = baseSchemaForMode;
        break;
      case 2: // Staff
        schema = baseSchemaForMode.merge(staffSchema);
        break;
      case 3: // Patient
        schema = baseSchemaForMode.merge(patientSchema);
        break;
      case 4: // Doctor
        schema = baseSchemaForMode.merge(doctorSchema);
        break;
      default:
        schema = baseSchemaForMode;
    }
    
    return schema;
  };
  
  // Initialize form with schema and values
  const form = useForm<FormValues>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: getInitialValues(),
    mode: "onChange"
  });
  
  // Update form when role changes
  useEffect(() => {
    // Reset validation when role changes
    form.reset(form.getValues());
  }, [selectedRole, form]);
  
  // Handle role change to update schema
  const handleRoleChange = (value: string) => {
    const roleId = Number(value);
    setSelectedRole(roleId);
    form.setValue("roleId", roleId);
  };
  
  // Handle form submission
  const onSubmit = (values: FormValues) => {
    onSave(values as any);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New User' : 'Edit User'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Base fields for all roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Input type="email" placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
              
              {(mode === 'create' || form.getValues('password')) && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{mode === 'edit' ? 'New Password (leave blank to keep current)' : 'Password'}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={handleRoleChange}
                      defaultValue={field.value?.toString() || ""}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
            
            {/* Role specific fields */}
            {selectedRole === 3 && ( // Patient
              <>
                <h3 className="text-lg font-medium pt-2">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                  "w-full pl-3 text-left font-normal",
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
                  
                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group</FormLabel>
                        <FormControl>
                          <Input placeholder="A+, B-, O+, etc." {...field} />
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
                          <Input placeholder="Provider name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact name" {...field} />
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
                          <Input placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Full address"
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
                    name="allergies"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
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
                      <FormItem className="col-span-2">
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
                <h3 className="text-lg font-medium pt-2">Doctor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <FormField
                    control={form.control}
                    name="emergencyContactNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Full address"
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
            
            {selectedRole === 2 && ( // Staff
              <>
                <h3 className="text-lg font-medium pt-2">Staff Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create User' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
