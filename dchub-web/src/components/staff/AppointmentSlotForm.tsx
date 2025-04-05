
import React, { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
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
import { CreateAppointmentSlotRequest } from "@/api/staffApi";
import { useQuery } from '@tanstack/react-query';
import { getAssignedCenters } from '@/api/staffApi';
import { getAllPatients } from '@/api/staffApi';

// Form schema
const appointmentSlotSchema = z.object({
  centerId: z.string().min(1, "Center is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  type: z.enum(["dialysis", "consultation", "checkup"], {
    required_error: "Appointment type is required"
  }),
  patientId: z.string().optional()
});

export type AppointmentSlotFormValues = z.infer<typeof appointmentSlotSchema>;

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
  // Fetch centers
  const { data: centers = [] } = useQuery({
    queryKey: ['assignedCenters'],
    queryFn: () => getAssignedCenters('staff-001'), // Hardcoded staff ID for now
  });

  // Fetch patients
  const { data: patients = [] } = useQuery({
    queryKey: ['allPatients'],
    queryFn: getAllPatients,
  });

  const form = useForm<AppointmentSlotFormValues>({
    resolver: zodResolver(appointmentSlotSchema),
    defaultValues: {
      centerId: defaultValues?.centerId || "",
      date: defaultValues?.date || new Date().toISOString().split('T')[0],
      startTime: defaultValues?.startTime || "",
      endTime: defaultValues?.endTime || "",
      type: defaultValues?.type || "dialysis",
      patientId: defaultValues?.patientId || "none" // Changed from empty string to "none"
    }
  });

  const handleSubmit = (values: AppointmentSlotFormValues) => {
    // Ensure all required fields are present before submitting
    onSubmit({
      centerId: values.centerId,
      date: values.date,
      startTime: values.startTime,
      endTime: values.endTime,
      type: values.type,
      patientId: values.patientId === "none" ? undefined : values.patientId // Convert "none" back to undefined
    });
  };

  // Update center dropdown when defaultValues change
  useEffect(() => {
    if (defaultValues?.centerId) {
      form.setValue('centerId', defaultValues.centerId);
    }
  }, [defaultValues?.centerId, form]);

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
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a center" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {centers.map(center => (
                    <SelectItem key={center.id} value={center.id}>
                      {center.name}
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
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
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
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
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
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign to Patient (optional)</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Leave empty for available slot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Available Slot (No Patient)</SelectItem>
                  {patients.map(patient => (
                    <SelectItem key={patient.userId} value={patient.userId}>
                      {patient.firstName && patient.lastName 
                        ? `${patient.firstName} ${patient.lastName}`
                        : `Patient ${patient.userId}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
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
