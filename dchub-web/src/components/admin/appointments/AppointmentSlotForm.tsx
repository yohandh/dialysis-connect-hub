
import React from 'react';
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
import { CreateAppointmentSlotRequest } from "@/api/appointmentApi";
import { dialysisCenters } from "@/data/centerData";

// Form schema
const appointmentSlotSchema = z.object({
  centerId: z.string().min(1, "Center is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  type: z.enum(["dialysis", "consultation", "checkup"])
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
  const form = useForm<AppointmentSlotFormValues>({
    resolver: zodResolver(appointmentSlotSchema),
    defaultValues: {
      centerId: defaultValues?.centerId || "",
      date: defaultValues?.date || "",
      startTime: defaultValues?.startTime || "",
      endTime: defaultValues?.endTime || "",
      type: defaultValues?.type || "dialysis"
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="centerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dialysis Center</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select center" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dialysisCenters.map((center) => (
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Appointment Slot"}
        </Button>
      </form>
    </Form>
  );
};

export default AppointmentSlotForm;
