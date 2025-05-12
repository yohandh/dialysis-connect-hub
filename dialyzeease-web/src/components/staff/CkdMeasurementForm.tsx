
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { calculateCkdStage } from '@/api/staffApi';

// Form schema
const formSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  date: z.string().min(1, "Date is required"),
  eGFR: z.coerce
    .number()
    .min(0, "eGFR must be positive")
    .max(150, "eGFR cannot exceed 150"),
  creatinine: z.coerce
    .number()
    .min(0.1, "Creatinine must be positive")
    .max(15, "Creatinine cannot exceed 15"),
  notes: z.string().optional(),
  staffId: z.string().min(1, "Staff ID is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CkdMeasurementFormProps {
  patientId: string;
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const CkdMeasurementForm: React.FC<CkdMeasurementFormProps> = ({
  patientId,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId,
      date: new Date().toISOString().split('T')[0],
      eGFR: 0,
      creatinine: 0,
      notes: "",
      staffId: "staff-001", // Default to current staff ID
    },
  });

  // Get current eGFR value for CKD stage calculation
  const eGFR = form.watch("eGFR");
  const calculatedStage = calculateCkdStage(eGFR);

  // Custom submit handler to add calculated stage
  const handleSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      calculatedStage,
    });
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
          name="staffId"
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Measurement Date</FormLabel>
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
            name="eGFR"
            render={({ field }) => (
              <FormItem>
                <FormLabel>eGFR (mL/min/1.73m²)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormDescription>
                  Calculated CKD Stage: <strong>Stage {calculatedStage}</strong>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creatinine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Creatinine (mg/dL)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Add any additional notes about this measurement"
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
            {isSubmitting ? "Saving..." : "Save Measurement"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CkdMeasurementForm;
