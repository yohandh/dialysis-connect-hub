
import React from 'react';
import { useForm, Controller, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Form schema for operating hours
export const operatingHoursSchema = z.object({
  monday: z.string().optional(),
  tuesday: z.string().optional(),
  wednesday: z.string().optional(),
  thursday: z.string().optional(),
  friday: z.string().optional(),
  saturday: z.string().optional(),
  sunday: z.string().optional(),
});

export type OperatingHoursFormValues = z.infer<typeof operatingHoursSchema>;

interface CenterOperatingHoursFormProps {
  form: UseFormReturn<any>;
}

const CenterOperatingHoursForm: React.FC<CenterOperatingHoursFormProps> = ({ form }) => {
  const days = [
    { name: 'monday', label: 'Monday' },
    { name: 'tuesday', label: 'Tuesday' },
    { name: 'wednesday', label: 'Wednesday' },
    { name: 'thursday', label: 'Thursday' },
    { name: 'friday', label: 'Friday' },
    { name: 'saturday', label: 'Saturday' },
    { name: 'sunday', label: 'Sunday' },
  ];

  // Common hours to select from
  const commonHours = [
    "6:00 AM - 9:00 PM",
    "7:00 AM - 8:00 PM",
    "6:30 AM - 7:30 PM",
    "8:00 AM - 4:00 PM",
    "7:00 AM - 5:00 PM",
    "Closed",
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Operating Hours</h3>
      <div className="space-y-3">
        {days.map((day) => (
          <FormField
            key={day.name}
            control={form.control}
            name={`operatingHours.${day.name}`}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="w-24">{day.label}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {commonHours.map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {field.value === "custom" && (
                  <div className="ml-24 mt-2">
                    <Input
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                      onChange={(e) => form.setValue(`operatingHours.${day.name}`, e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default CenterOperatingHoursForm;
