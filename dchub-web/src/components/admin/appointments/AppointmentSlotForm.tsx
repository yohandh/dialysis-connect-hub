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
import { fetchBedsByCenter, fetchAvailableBedsForSession } from "@/api/bedApi";
import { Search, CalendarIcon, Loader2, ChevronsUpDown, Check } from "lucide-react";
import { fetchScheduledSessionsByCenter } from "@/api/scheduleSessionApi";
import { format, isPast } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Form schema
const appointmentSlotSchema = z.object({
  centerId: z.string().min(1, "Center is required"),
  scheduleSessionId: z.string().min(1, "Schedule session is required"),
  patientId: z.string().optional(),
  bedId: z.string().optional(),
  notes: z.string().optional()
});

type AppointmentSlotFormValues = z.infer<typeof appointmentSlotSchema>;

interface AppointmentSlotFormProps {
  onSubmit: (data: any) => void;
  defaultValues: any;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

const AppointmentSlotForm: React.FC<AppointmentSlotFormProps> = ({
  onSubmit,
  defaultValues,
  isSubmitting,
  isEditMode = false
}) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [scheduledSessions, setScheduledSessions] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isLoadingBeds, setIsLoadingBeds] = useState(false);
  const [openPatientCombobox, setOpenPatientCombobox] = useState(false);
  const [openBedCombobox, setOpenBedCombobox] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [isDatePast, setIsDatePast] = useState(false);
  
  console.log("AppointmentSlotForm defaultValues:", defaultValues);

  const form = useForm({
    resolver: zodResolver(appointmentSlotSchema),
    defaultValues: {
      scheduleSessionId: defaultValues.scheduleSessionId || '',
      patientId: defaultValues.patientId || '',
      bedId: defaultValues.bedId || '',
      notes: defaultValues.notes || '',
      centerId: defaultValues.centerId || ''
    }
  });

  // Load sessions for the selected date
  const loadSessionsForDate = async (selectedDate: Date) => {
    if (!selectedDate || !defaultValues.centerId) return;
    
    setIsLoadingSessions(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const sessions = await fetchScheduledSessionsByCenter(defaultValues.centerId, formattedDate, formattedDate);
      console.log('Loaded sessions for date:', sessions);
      setScheduledSessions(sessions);
      
      // If in edit mode and we have a scheduleSessionId, pre-select it
      if (isEditMode && defaultValues.scheduleSessionId) {
        console.log("Setting schedule session ID from loadSessionsForDate:", defaultValues.scheduleSessionId);
        
        // Check if the session exists in the loaded sessions
        const sessionExists = sessions.some((session: any) => 
          session.id.toString() === defaultValues.scheduleSessionId.toString()
        );
        
        if (sessionExists) {
          form.setValue("scheduleSessionId", defaultValues.scheduleSessionId.toString());
        } else {
          console.warn("Schedule session not found in loaded sessions:", defaultValues.scheduleSessionId);
        }
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Load patients
  const loadPatients = async () => {
    if (!defaultValues.centerId) return;
    
    setIsLoadingPatients(true);
    try {
      const patients = await fetchUsersByRole('patient');
      console.log('Loaded patients:', patients);
      
      // Ensure patients have the expected structure
      const formattedPatients = Array.isArray(patients) ? patients.map(p => ({
        id: p.id,
        first_name: p.firstName || p.first_name || '',
        last_name: p.lastName || p.last_name || '',
        email: p.email || '',
        status: p.status || 'active'
      })) : [];
      
      setPatients(formattedPatients);
      
      // If in edit mode and we have a patientId, pre-select it
      if (isEditMode && defaultValues.patientId) {
        console.log("Setting patient ID from loadPatients:", defaultValues.patientId);
        
        // Check if the patient exists in the loaded patients
        const patientExists = formattedPatients.some((patient: any) => 
          patient.id.toString() === defaultValues.patientId.toString()
        );
        
        if (patientExists) {
          form.setValue("patientId", defaultValues.patientId.toString());
        } else {
          console.warn("Patient not found in loaded patients:", defaultValues.patientId);
        }
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      // Use mock data for testing
      setPatients([
        { id: 1, first_name: 'John', last_name: 'Doe' },
        { id: 2, first_name: 'Jane', last_name: 'Smith' },
      ]);
      
      if (isEditMode && defaultValues.patientId) {
        form.setValue("patientId", defaultValues.patientId.toString());
      }
    } finally {
      setIsLoadingPatients(false);
    }
  };

  // Load beds for the center
  const loadBeds = async () => {
    if (!defaultValues.centerId) return;
    
    setIsLoadingBeds(true);
    try {
      const bedsData = await fetchBedsByCenter(defaultValues.centerId);
      console.log('Loaded beds:', bedsData);
      // Only show active beds
      const activeBeds = bedsData.filter((bed: any) => bed.status === 'active');
      setBeds(activeBeds);
      
      // If in edit mode and we have a bedId, pre-select it
      if (isEditMode && defaultValues.bedId) {
        console.log("Setting bed ID from loadBeds:", defaultValues.bedId);
        form.setValue('bedId', defaultValues.bedId.toString());
      }
    } catch (error) {
      console.error('Error loading beds:', error);
      toast({
        title: "Error",
        description: "Failed to load beds. Please try again.",
        variant: "destructive",
      });
      setBeds([]);
    } finally {
      setIsLoadingBeds(false);
    }
  };

  // Load available beds for the selected session
  const loadAvailableBedsForSession = async (sessionId: string) => {
    if (!sessionId) return;
    
    setIsLoadingBeds(true);
    try {
      const availableBeds = await fetchAvailableBedsForSession(sessionId);
      console.log('Loaded available beds for session:', availableBeds);
      setBeds(availableBeds);
      
      // If in edit mode and we have a bedId, check if it's still available
      if (isEditMode && defaultValues.bedId) {
        const bedStillAvailable = availableBeds.some((bed: any) => bed.id.toString() === defaultValues.bedId.toString());
        if (bedStillAvailable) {
          form.setValue('bedId', defaultValues.bedId.toString());
        } else {
          // If the bed is no longer available, clear the selection
          form.setValue('bedId', '');
          toast({
            title: "Bed Unavailable",
            description: "The previously selected bed is no longer available for this session.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error('Error loading available beds for session:', error);
      toast({
        title: "Error",
        description: "Failed to load available beds. Please try again.",
        variant: "destructive",
      });
      setBeds([]);
    } finally {
      setIsLoadingBeds(false);
    }
  };

  // Watch for changes in the centerId field
  useEffect(() => {
    if (defaultValues.centerId) {
      loadBeds();
    }
  }, [defaultValues.centerId]);

  // Watch for changes in the scheduleSessionId field
  useEffect(() => {
    const scheduleSessionId = form.watch('scheduleSessionId');
    if (scheduleSessionId) {
      loadAvailableBedsForSession(scheduleSessionId);
    }
  }, [form.watch('scheduleSessionId')]);

  // Initialize data on component mount
  useEffect(() => {
    if (defaultValues.centerId) {
      loadPatients();
      loadBeds();
    }
    
    // If in edit mode and we have a date, load sessions for that date
    if (isEditMode && defaultValues.date) {
      const appointmentDate = new Date(defaultValues.date);
      setDate(appointmentDate);
      setIsDatePast(isPast(appointmentDate));
      loadSessionsForDate(appointmentDate);
    }
  }, [defaultValues.centerId, isEditMode, defaultValues.date]);

  // When date changes, load sessions for that date
  useEffect(() => {
    if (date) {
      loadSessionsForDate(date);
      setIsDatePast(isPast(date));
    } else {
      setScheduledSessions([]);
    }
  }, [date]);

  // Directly set form values in edit mode
  useEffect(() => {
    if (isEditMode) {
      // Set form values directly without checking for existence
      if (defaultValues.patientId) {
        console.log("Setting patient ID directly:", defaultValues.patientId);
        setTimeout(() => {
          form.setValue("patientId", defaultValues.patientId.toString());
        }, 500); // Small delay to ensure the form is ready
      }
      
      if (defaultValues.bedId) {
        console.log("Setting bed ID directly:", defaultValues.bedId);
        setTimeout(() => {
          form.setValue("bedId", defaultValues.bedId.toString());
        }, 500); // Small delay to ensure the form is ready
      }
    }
  }, [isEditMode, defaultValues.patientId, defaultValues.bedId, form]);

  // Handle form submission
  const onFormSubmit = (data: any) => {
    // Convert patient ID to number if it's a string
    if (data.patientId) {
      data.patientId = Number(data.patientId);
    }
    
    // Convert bed ID to number if it's a string
    if (data.bedId) {
      data.bedId = Number(data.bedId);
    }
    
    console.log('Submitting form data:', data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Date field - editable in edit mode only if date is not past */}
        {isEditMode ? (
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Date</label>
            {isDatePast ? (
              // Read-only if date is in the past
              <div className="p-2 border rounded-md bg-muted/30">
                {date ? format(date, "PPP") : "Date not available"}
              </div>
            ) : (
              // Editable if date is in the future
              <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full pl-3 text-left font-normal"
                    disabled={isSubmitting}
                  >
                    {date ? (
                      format(date, "PPP")
                    ) : (
                      <span>Select a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setOpenDatePicker(false);
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full pl-3 text-left font-normal"
                  disabled={isSubmitting}
                >
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>Select a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    setOpenDatePicker(false);
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Schedule Session field - always show dropdown in edit mode if date is not past */}
        {(isEditMode && !isDatePast) || !isEditMode ? (
          <FormField
            control={form.control}
            name="scheduleSessionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule Session</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    console.log("Schedule session selected:", value);
                    field.onChange(value);
                  }}
                  value={field.value}
                  disabled={!date || scheduledSessions.length === 0 || isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={date ? (scheduledSessions.length === 0 ? "No sessions available for this date" : "Select session") : "Select a date first"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {scheduledSessions.map((session: any) => (
                      <SelectItem key={session.id} value={session.id.toString()}>
                        {`${session.start_time.substring(0, 5)} - ${session.end_time.substring(0, 5)} (${session.available_beds} beds available)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                {!date && (
                  <FormDescription>
                    You need to select a date to view available sessions
                  </FormDescription>
                )}
                {date && scheduledSessions.length === 0 && (
                  <FormDescription>
                    No sessions available for the selected date
                  </FormDescription>
                )}
              </FormItem>
            )}
          />
        ) : (
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Schedule Session</label>
            <div className="p-2 border rounded-md bg-muted/30">
              {defaultValues.startTime && defaultValues.endTime 
                ? `${defaultValues.startTime.substring(0, 5)} - ${defaultValues.endTime.substring(0, 5)}`
                : "Session time not available"}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Patient</FormLabel>
              <div className="relative">
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <div className="px-2 py-1.5">
                      <Input
                        type="text"
                        placeholder="Search patients..."
                        className="h-8 mb-2"
                        onChange={(e) => {
                          const searchTerm = e.target.value.toLowerCase();
                          const patientItems = document.querySelectorAll('[data-patient-item]');
                          
                          patientItems.forEach((item) => {
                            const text = item.textContent?.toLowerCase() || '';
                            if (text.includes(searchTerm)) {
                              (item as HTMLElement).style.display = 'block';
                            } else {
                              (item as HTMLElement).style.display = 'none';
                            }
                          });
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-[200px] overflow-auto">
                      {isLoadingPatients ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading patients...
                        </div>
                      ) : patients.length === 0 ? (
                        <div className="flex items-center justify-center p-2">
                          No patients available
                        </div>
                      ) : (
                        patients.map((patient: any) => (
                          <SelectItem 
                            key={patient.id} 
                            value={patient.id.toString()}
                            data-patient-item
                          >
                            {`${patient.first_name} ${patient.last_name}`}
                          </SelectItem>
                        ))
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bedId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Bed</FormLabel>
              <div className="relative">
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bed" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <div className="px-2 py-1.5">
                      <Input
                        type="text"
                        placeholder="Search beds..."
                        className="h-8 mb-2"
                        onChange={(e) => {
                          const searchTerm = e.target.value.toLowerCase();
                          const bedItems = document.querySelectorAll('[data-bed-item]');
                          
                          bedItems.forEach((item) => {
                            const text = item.textContent?.toLowerCase() || '';
                            if (text.includes(searchTerm)) {
                              (item as HTMLElement).style.display = 'block';
                            } else {
                              (item as HTMLElement).style.display = 'none';
                            }
                          });
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-[200px] overflow-auto">
                      {isLoadingBeds ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading beds...
                        </div>
                      ) : beds.length === 0 ? (
                        <div className="flex items-center justify-center p-2">
                          No beds available
                        </div>
                      ) : (
                        beds.map((bed: any) => (
                          <SelectItem 
                            key={bed.id} 
                            value={bed.id.toString()}
                            data-bed-item
                          >
                            {bed.code}
                          </SelectItem>
                        ))
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any additional notes here" 
                  {...field} 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Appointment" : "Create Appointment"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AppointmentSlotForm;
