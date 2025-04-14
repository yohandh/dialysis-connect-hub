import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateAppointmentSlotRequest } from "@/api/appointmentApi";
import { dialysisCenters } from "@/data/centerData";
import { useQuery } from "@tanstack/react-query";
import { fetchUsersByRole } from "@/api/userApi";
import { fetchBedsByCenter } from "@/api/bedApi";
import { Search } from "lucide-react";

// Form schema
const appointmentSlotSchema = z.object({
  centerId: z.string().min(1, "Center is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  type: z.enum(["dialysis", "consultation", "checkup"]),
  staffId: z.string().optional(),
  doctorId: z.string().optional(),
  patientId: z.string().optional(),
  bedId: z.string().optional()
});

type AppointmentSlotFormValues = z.infer<typeof appointmentSlotSchema>;

interface AppointmentSlotFormProps {
  onSubmit: (data: CreateAppointmentSlotRequest) => void;
  defaultValues?: Partial<AppointmentSlotFormValues>;
  isSubmitting: boolean;
}

const AppointmentSlotForm: React.FC<AppointmentSlotFormProps> = ({
  onSubmit,
  defaultValues,
  isSubmitting
}) => {
  const { toast } = useToast();

  const form = useForm<AppointmentSlotFormValues>({
    resolver: zodResolver(appointmentSlotSchema),
    defaultValues: {
      centerId: defaultValues?.centerId || "",
      date: defaultValues?.date || "",
      startTime: defaultValues?.startTime || "",
      endTime: defaultValues?.endTime || "",
      type: defaultValues?.type || "dialysis",
      staffId: defaultValues?.staffId || "none",
      doctorId: defaultValues?.doctorId || "none",
      patientId: defaultValues?.patientId || "none",
      bedId: defaultValues?.bedId || "none"
    }
  });

  // Get the current centerId value from the form
  const centerId = form.watch("centerId");

  // Fetch staff members
  const { data: staffMembers = [] } = useQuery({
    queryKey: ['users', 'staff'],
    queryFn: () => fetchUsersByRole('staff'),
    enabled: true,
  });

  // Fetch doctors
  const { data: doctors = [] } = useQuery({
    queryKey: ['users', 'doctor'],
    queryFn: () => fetchUsersByRole('doctor'),
    enabled: true,
  });

  // Fetch patients
  const { data: patients = [] } = useQuery({
    queryKey: ['users', 'patient'],
    queryFn: () => fetchUsersByRole('patient'),
    enabled: true,
  });

  // Fetch beds for the selected center
  const { data: beds = [] } = useQuery({
    queryKey: ['beds', centerId],
    queryFn: () => fetchBedsByCenter(centerId),
    enabled: !!centerId,
  });

  // Auto-select center if it's provided in defaultValues
  useEffect(() => {
    if (defaultValues?.centerId) {
      form.setValue("centerId", defaultValues.centerId);
    }
  }, [defaultValues?.centerId, form]);

  // Handle form submission with "none" value conversion
  const handleSubmit = (data: AppointmentSlotFormValues) => {
    // Convert "none" values to null as needed by the API
    const formattedData = {
      ...data,
      staffId: data.staffId === "none" ? null : data.staffId,
      doctorId: data.doctorId === "none" ? null : data.doctorId,
      patientId: data.patientId === "none" ? null : data.patientId,
      bedId: data.bedId === "none" ? null : data.bedId
    };
    
    console.log("Submitting appointment data:", formattedData);
    onSubmit(formattedData as CreateAppointmentSlotRequest);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="centerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dialysis Center</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={!!defaultValues?.centerId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select center" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dialysisCenters.map((center) => (
                    <SelectItem key={center.id} value={center.id.toString()}>
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              {defaultValues?.centerId && (
                <FormDescription>
                  Center is pre-selected based on your navigation
                </FormDescription>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <div className="flex items-center px-3 pb-2">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Search times..."
                        id="appointment-time-search"
                        onChange={(e) => {
                          const searchTerm = e.target.value.toLowerCase();
                          const items = document.querySelectorAll('[data-appointment-time-item]');
                          
                          items.forEach(item => {
                            const text = item.textContent?.toLowerCase() || '';
                            if (text.includes(searchTerm)) {
                              item.classList.remove('hidden');
                            } else {
                              item.classList.add('hidden');
                            }
                          });
                        }}
                      />
                    </div>
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <SelectItem 
                        key={hour} 
                        value={`${hour.toString().padStart(2, '0')}:00:00`}
                        data-appointment-time-item
                      >
                        {hour === 0 ? '12:00 AM' : 
                         hour < 12 ? `${hour}:00 AM` : 
                         hour === 12 ? '12:00 PM' : 
                         `${hour - 12}:00 PM`}
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
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <div className="flex items-center px-3 pb-2">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Search times..."
                        id="appointment-end-time-search"
                        onChange={(e) => {
                          const searchTerm = e.target.value.toLowerCase();
                          const items = document.querySelectorAll('[data-appointment-end-time-item]');
                          
                          items.forEach(item => {
                            const text = item.textContent?.toLowerCase() || '';
                            if (text.includes(searchTerm)) {
                              item.classList.remove('hidden');
                            } else {
                              item.classList.add('hidden');
                            }
                          });
                        }}
                      />
                    </div>
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <SelectItem 
                        key={hour} 
                        value={`${hour.toString().padStart(2, '0')}:00:00`}
                        data-appointment-end-time-item
                      >
                        {hour === 0 ? '12:00 AM' : 
                         hour < 12 ? `${hour}:00 AM` : 
                         hour === 12 ? '12:00 PM' : 
                         `${hour - 12}:00 PM`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Appointment Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="dialysis">Dialysis</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="checkup">Checkup</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staff Member</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <div className="flex items-center px-3 pb-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Search staff..."
                      id="staff-search"
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const items = document.querySelectorAll('[data-staff-item]');
                        
                        items.forEach(item => {
                          const text = item.textContent?.toLowerCase() || '';
                          if (text.includes(searchTerm)) {
                            item.classList.remove('hidden');
                          } else {
                            item.classList.add('hidden');
                          }
                        });
                      }}
                    />
                  </div>
                  <SelectItem value="none">None</SelectItem>
                  {staffMembers.map((staff) => (
                    <SelectItem 
                      key={staff.id} 
                      value={staff.id.toString()}
                      data-staff-item
                    >
                      {staff.firstName} {staff.lastName}
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
          name="doctorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <div className="flex items-center px-3 pb-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Search doctors..."
                      id="doctor-search"
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const items = document.querySelectorAll('[data-doctor-item]');
                        
                        items.forEach(item => {
                          const text = item.textContent?.toLowerCase() || '';
                          if (text.includes(searchTerm)) {
                            item.classList.remove('hidden');
                          } else {
                            item.classList.add('hidden');
                          }
                        });
                      }}
                    />
                  </div>
                  <SelectItem value="none">None</SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem 
                      key={doctor.id} 
                      value={doctor.id.toString()}
                      data-doctor-item
                    >
                      Dr. {doctor.firstName} {doctor.lastName}
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
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <div className="flex items-center px-3 pb-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Search patients..."
                      id="patient-search"
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const items = document.querySelectorAll('[data-patient-item]');
                        
                        items.forEach(item => {
                          const text = item.textContent?.toLowerCase() || '';
                          if (text.includes(searchTerm)) {
                            item.classList.remove('hidden');
                          } else {
                            item.classList.add('hidden');
                          }
                        });
                      }}
                    />
                  </div>
                  <SelectItem value="none">None</SelectItem>
                  {patients.map((patient) => (
                    <SelectItem 
                      key={patient.id} 
                      value={patient.id.toString()}
                      data-patient-item
                    >
                      {patient.firstName} {patient.lastName}
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
          name="bedId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bed</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={!centerId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={centerId ? "Select bed" : "Select a center first"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <div className="flex items-center px-3 pb-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Search beds..."
                      id="bed-search"
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const items = document.querySelectorAll('[data-bed-item]');
                        
                        items.forEach(item => {
                          const text = item.textContent?.toLowerCase() || '';
                          if (text.includes(searchTerm)) {
                            item.classList.remove('hidden');
                          } else {
                            item.classList.add('hidden');
                          }
                        });
                      }}
                    />
                  </div>
                  <SelectItem value="none">None</SelectItem>
                  {beds.map((bed) => (
                    <SelectItem 
                      key={bed.id} 
                      value={bed.id.toString()}
                      data-bed-item
                    >
                      {bed.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              {!centerId && (
                <FormDescription>
                  You need to select a center to view available beds
                </FormDescription>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Appointment Slot"}
        </Button>
      </form>
    </Form>
  );
};

export default AppointmentSlotForm;
