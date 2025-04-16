import { z } from "zod";

// Updated DialysisCenter interface to match the frontend naming convention
export interface DialysisCenter {
  id: number;
  name: string;
  address: string;
  contactNo: string;
  email: string;
  totalCapacity: number;
  isActive: boolean;
  manageById?: number;
  type?: string;
  centerHours?: {
    id?: number;
    weekday: string;
    openTime: string;
    closeTime: string;
  }[] | {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

// Center form schema
export const centerFormSchema = z.object({
  name: z.string().min(2, "Center name is required"),
  address: z.string().min(5, "Address is required"),
  contactNo: z.string().min(10, "Contact number is required"),
  email: z.string().email("Invalid email address"),
  totalCapacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  manageById: z.coerce.number().optional(),
  centerHours: z.object({
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
