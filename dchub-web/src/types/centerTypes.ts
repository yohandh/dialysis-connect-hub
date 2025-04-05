
import { z } from "zod";

// Center form schema
export const centerFormSchema = z.object({
  name: z.string().min(2, "Center name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  operatingHours: z.object({
    monday: z.string().optional(),
    tuesday: z.string().optional(),
    wednesday: z.string().optional(),
    thursday: z.string().optional(),
    friday: z.string().optional(),
    saturday: z.string().optional(),
    sunday: z.string().optional(),
  }).optional(),
  type: z.string().optional(),
});

export type CenterFormValues = z.infer<typeof centerFormSchema>;
