
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// Form schema
const formSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  appointmentId: z.string().min(1, "Appointment ID is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  preWeight: z.coerce.number().min(20, "Weight must be at least 20kg"),
  postWeight: z.coerce.number().min(20, "Weight must be at least 20kg"),
  ultrafiltrationGoal: z.coerce.number().min(0, "UF goal must be positive"),
  actualUltrafiltration: z.coerce.number().min(0, "Actual UF must be positive"),
  bloodPressureBeforeSystolic: z.coerce.number().min(60, "Systolic BP must be at least 60"),
  bloodPressureBeforeDiastolic: z.coerce.number().min(30, "Diastolic BP must be at least 30"),
  bloodPressureAfterSystolic: z.coerce.number().min(60, "Systolic BP must be at least 60"),
  bloodPressureAfterDiastolic: z.coerce.number().min(30, "Diastolic BP must be at least 30"),
  heartRateBefore: z.coerce.number().min(40, "Heart rate must be at least 40"),
  heartRateAfter: z.coerce.number().min(40, "Heart rate must be at least 40"),
  complications: z.string().optional(),
  notes: z.string().optional(),
  staffId: z.string().min(1, "Staff ID is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface DialysisSessionFormProps {
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<FormValues>;
  onCancel: () => void;
}

const DialysisSessionForm: React.FC<DialysisSessionFormProps> = ({
  onSubmit,
  isSubmitting,
  defaultValues = {},
  onCancel,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      appointmentId: "",
      date: new Date().toISOString().split('T')[0],
      startTime: "",
      endTime: "",
      preWeight: 0,
      postWeight: 0,
      ultrafiltrationGoal: 0,
      actualUltrafiltration: 0,
      bloodPressureBeforeSystolic: 0,
      bloodPressureBeforeDiastolic: 0,
      bloodPressureAfterSystolic: 0,
      bloodPressureAfterDiastolic: 0,
      heartRateBefore: 0,
      heartRateAfter: 0,
      complications: "",
      notes: "",
      staffId: "staff-001", // Default to current staff ID
      ...defaultValues,
    },
  });

  const handleSubmit = (values: FormValues) => {
    // Transform form values to match API expectations
    const transformedData = {
      patientId: values.patientId,
      appointmentId: values.appointmentId,
      date: values.date,
      startTime: values.startTime,
      endTime: values.endTime,
      duration: calculateDuration(values.startTime, values.endTime),
      preWeight: values.preWeight,
      postWeight: values.postWeight,
      ultrafiltrationGoal: values.ultrafiltrationGoal,
      actualUltrafiltration: values.actualUltrafiltration,
      bloodPressureBefore: {
        systolic: values.bloodPressureBeforeSystolic,
        diastolic: values.bloodPressureBeforeDiastolic,
      },
      bloodPressureAfter: {
        systolic: values.bloodPressureAfterSystolic,
        diastolic: values.bloodPressureAfterDiastolic,
      },
      heartRateBefore: values.heartRateBefore,
      heartRateAfter: values.heartRateAfter,
      complications: values.complications ? values.complications.split(',').map(c => c.trim()) : [],
      notes: values.notes || "",
      staffId: values.staffId,
    };

    onSubmit(transformedData);
  };

  // Calculate duration in minutes between start and end time
  const calculateDuration = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    return (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Hidden fields */}
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => <input type="hidden" {...field} />}
        />
        <FormField
          control={form.control}
          name="appointmentId"
          render={({ field }) => <input type="hidden" {...field} />}
        />
        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-2">
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
        </div>

        <Separator />
        <h3 className="text-lg font-medium">Pre-Dialysis Measurements</h3>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="preWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pre Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ultrafiltrationGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UF Goal (L)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="bloodPressureBeforeSystolic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Systolic BP (mmHg)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bloodPressureBeforeDiastolic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diastolic BP (mmHg)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="heartRateBefore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heart Rate (bpm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />
        <h3 className="text-lg font-medium">Post-Dialysis Measurements</h3>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="postWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actualUltrafiltration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual UF (L)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="bloodPressureAfterSystolic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Systolic BP (mmHg)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bloodPressureAfterDiastolic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diastolic BP (mmHg)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="heartRateAfter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heart Rate (bpm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />
        <h3 className="text-lg font-medium">Notes & Complications</h3>

        <FormField
          control={form.control}
          name="complications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complications (comma separated)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Cramping, Hypotension, etc." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Add any additional notes about the dialysis session"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-medical-blue hover:bg-medical-blue/90"
          >
            {isSubmitting ? "Saving..." : "Save Record"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DialysisSessionForm;
