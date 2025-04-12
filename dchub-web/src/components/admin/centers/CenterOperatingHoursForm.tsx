import React, { useState, useEffect } from 'react';
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
export const centerHoursSchema = z.object({
  monday: z.string().optional(),
  tuesday: z.string().optional(),
  wednesday: z.string().optional(),
  thursday: z.string().optional(),
  friday: z.string().optional(),
  saturday: z.string().optional(),
  sunday: z.string().optional(),
});

export type CenterHoursFormValues = z.infer<typeof centerHoursSchema>;

interface CenterHoursFormProps {
  form: UseFormReturn<any>;
}

const CenterHoursForm: React.FC<CenterHoursFormProps> = ({ form }) => {
  // Track custom input values separately
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  
  // Add state to track if the form has been initialized
  const [isInitialized, setIsInitialized] = useState(false);

  // Common hours to select from
  const commonHours = [
    "6:00 AM - 6:00 PM",
    "6:00 AM - 4:00 PM",    
    "Closed",
  ];

  // Reorganized days to group them as requested
  const dayGroups = [
    // First row: Monday and Tuesday
    [
      { name: 'monday', label: 'Monday' },
      { name: 'tuesday', label: 'Tuesday' },
    ],
    // Second row: Wednesday and Thursday
    [
      { name: 'wednesday', label: 'Wednesday' },
      { name: 'thursday', label: 'Thursday' },
    ],
    // Third row: Friday (alone)
    [
      { name: 'friday', label: 'Friday' },
    ],
    // Fourth row: Saturday and Sunday together
    [
      { name: 'saturday', label: 'Saturday' },
      { name: 'sunday', label: 'Sunday' },
    ],
  ];

  // Initialize custom values from form values on component mount
  useEffect(() => {
    const centerHours = form.getValues('centerHours');
    if (centerHours) {
      console.log('Center hours on mount:', centerHours);
      const newCustomValues: Record<string, string> = {};
      
      // For each day, check if it has a custom value
      dayGroups.flat().forEach(day => {
        const value = centerHours[day.name];
        if (value && !commonHours.includes(value) && value !== 'custom') {
          newCustomValues[day.name] = value;
        }
      });
      
      // Only update state if we found custom values
      if (Object.keys(newCustomValues).length > 0) {
        setCustomValues(newCustomValues);
      }
      
      // Set Sunday to "Closed" by default if it's empty
      if (!centerHours.sunday) {
        form.setValue('centerHours.sunday', 'Closed');
      }
      
      setIsInitialized(true);
    }
  }, [form, commonHours]);

  // Handle custom input change
  const handleCustomInputChange = (day: string, value: string) => {
    // Store the custom value
    setCustomValues(prev => ({
      ...prev,
      [day]: value
    }));
    
    // Update the form value
    form.setValue(`centerHours.${day}`, value);
  };

  // Check if a value is custom (not in predefined list)
  const isCustomValue = (value: string | undefined): boolean => {
    return !!value && !commonHours.includes(value) && value !== 'custom';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Operating Hours</h3>
      <div className="space-y-3">
        {dayGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex gap-4">
            {group.map((day) => (
              <FormField
                key={day.name}
                control={form.control}
                name={`centerHours.${day.name}`}
                render={({ field }) => {
                  // Check if this is a custom value
                  const customValueFlag = isCustomValue(field.value);
                  
                  return (
                    <FormItem className="flex-1">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center mb-1">
                          <FormLabel className="w-24 text-sm min-w-[80px] font-medium">{day.label}</FormLabel>
                          <div className="w-[180px]">
                            <Select
                              onValueChange={(value) => {
                                if (value === "custom") {
                                  // When switching to custom, use any existing custom value
                                  const customValue = customValues[day.name] || '';
                                  if (customValue) {
                                    field.onChange(customValue);
                                  } else {
                                    field.onChange('custom');
                                  }
                                } else {
                                  // For standard options, just use the selected value
                                  field.onChange(value);
                                }
                              }}
                              value={customValueFlag ? 'custom' : field.value}
                              defaultValue={day.name === 'sunday' ? 'Closed' : ''}
                            >
                              <FormControl>
                                <SelectTrigger className="h-9 text-sm w-full px-2 border border-input">
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
                        </div>
                        {(field.value === "custom" || customValueFlag) && (
                          <div className="flex items-center mt-1">
                            <div className="w-24 min-w-[80px]"></div>
                            <Input
                              placeholder="E.g.: 9:00 AM - 5:00 PM"
                              value={customValueFlag ? field.value : customValues[day.name] || ''}
                              onChange={(e) => handleCustomInputChange(day.name, e.target.value)}
                              className="h-9 text-sm w-[180px] px-2"
                            />
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            ))}
            {/* Add empty placeholder for Friday row to maintain layout */}
            {group.length === 1 && groupIndex === 2 && (
              <div className="flex-1"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CenterHoursForm;
