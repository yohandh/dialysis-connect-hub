import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  User, 
  Repeat, 
  Pencil, 
  Trash2,
  AlertCircle,
  Search,
  Check,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { 
  Session, 
  SessionFormValues, 
  weekdayOptions, 
  weekdayGroupOptions,
  timeOptions,
  isWeekdayGroup,
  getDaysFromWeekdayGroup,
  formatTimeString,
  parseTimeString
} from '@/types/sessionTypes';
import { 
  fetchSessionsByCenter, 
  createSession, 
  updateSession, 
  deleteSession 
} from '@/api/sessionApi';
import { fetchCenterById } from '@/api/centerApi';
import { fetchUsersByRole } from '@/api/userApi';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Form schema for session
const sessionFormSchema = z.object({
  doctor_id: z.number().nullable(),
  weekday: z.string().min(1, "Weekday is required"), // Changed min length to 1
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  default_capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  status: z.string().optional(),
  center_id: z.number().optional()
});

interface SessionManagementProps {
  centerId: string;
}

const SessionManagement: React.FC<SessionManagementProps> = ({ centerId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [selectedWeekday, setSelectedWeekday] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [overlapWarning, setOverlapWarning] = useState<string | null>(null);

  // Fetch sessions
  const { data: sessions = [], isLoading: isLoadingSessions } = useQuery({
    queryKey: ['sessions', centerId],
    queryFn: () => fetchSessionsByCenter(centerId),
  });

  // Fetch center details to get operating hours
  const { data: centerData, isLoading: isLoadingCenter } = useQuery({
    queryKey: ['center', centerId],
    queryFn: () => fetchCenterById(centerId),
  });

  // Fetch doctors for the dropdown
  const { data: doctors = [], isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => fetchUsersByRole('doctor'),
  });

  // Initialize form
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      doctor_id: null,
      weekday: "", // Empty string to not select anything by default
      start_time: "08:00:00",
      end_time: "10:00:00",
      default_capacity: 1,
      status: "active"
    },
  });

  // Watch form values for validation
  const watchedWeekday = form.watch("weekday");
  const watchedStartTime = form.watch("start_time");
  const watchedEndTime = form.watch("end_time");

  // Update selected weekday when form value changes
  useEffect(() => {
    if (watchedWeekday) {
      setSelectedWeekday(watchedWeekday);
    }
  }, [watchedWeekday]);

  // Validate session times against center hours and check for overlaps
  useEffect(() => {
    if (!centerData || !watchedWeekday || !watchedStartTime || !watchedEndTime) {
      return;
    }

    const errors: string[] = [];
    
    // Check if session times are within center operating hours
    const centerHours = getCenterHoursForDay(watchedWeekday);
    
    if (centerHours.openTime && centerHours.closeTime) {
      try {
        // Use the timeOptions to get the formatted times for comparison
        const sessionStartOption = timeOptions.find(opt => opt.value === watchedStartTime);
        const sessionEndOption = timeOptions.find(opt => opt.value === watchedEndTime);
        const centerOpenOption = timeOptions.find(opt => opt.value === centerHours.openTime);
        const centerCloseOption = timeOptions.find(opt => opt.value === centerHours.closeTime);
        
        if (sessionStartOption && sessionEndOption && centerOpenOption && centerCloseOption) {
          // Compare the time values directly since they're in the same format (HH:MM:SS)
          if (watchedStartTime < centerHours.openTime) {
            errors.push(`Session start time (${sessionStartOption.label}) is before center opening time (${centerOpenOption.label})`);
          }
          
          if (watchedEndTime > centerHours.closeTime) {
            errors.push(`Session end time (${sessionEndOption.label}) is after center closing time (${centerCloseOption.label})`);
          }
        }
      } catch (error) {
        console.error('Error comparing times:', error);
      }
    }
    
    setValidationErrors(errors);
    
    // Check for overlapping sessions
    if (sessions.length > 0 && watchedWeekday && watchedStartTime && watchedEndTime) {
      try {
        // If editing, exclude the current session from overlap check
        const sessionsToCheck = editingSession 
          ? sessions.filter(s => s.id !== editingSession.id)
          : sessions;
        
        // Get days to check based on weekday selection (could be a group)
        const daysToCheck = isWeekdayGroup(watchedWeekday) 
          ? getDaysFromWeekdayGroup(watchedWeekday)
          : [watchedWeekday];
        
        // Filter sessions that overlap with the current time range and weekday
        const overlappingSessions = sessionsToCheck.filter(session => {
          // Check if the session's weekday is in our days to check
          if (!daysToCheck.includes(session.weekday)) {
            return false;
          }
          
          // Compare the time values directly since they're in the same format (HH:MM:SS)
          return (
            (watchedStartTime < session.end_time && watchedEndTime > session.start_time) ||
            (session.start_time < watchedEndTime && session.end_time > watchedStartTime)
          );
        });
        
        if (overlappingSessions.length > 0) {
          setOverlapWarning(`Warning: This session overlaps with ${overlappingSessions.length} existing session(s)`);
        } else {
          setOverlapWarning(null);
        }
      } catch (error) {
        console.error('Error checking for overlaps:', error);
        setOverlapWarning(null);
      }
    } else {
      setOverlapWarning(null);
    }
  }, [watchedWeekday, watchedStartTime, watchedEndTime, centerData, sessions, editingSession]);

  // Create session mutation
  const createMutation = useMutation({
    mutationFn: (data: SessionFormValues) => {
      // For group weekday options, we need to create multiple sessions
      if (isWeekdayGroup(data.weekday)) {
        const days = getDaysFromWeekdayGroup(data.weekday);
        // Create a session for each day in the group
        const promises = days.map(day => 
          createSession({
            ...data,
            weekday: day,
            center_id: parseInt(centerId),
            recurrence_pattern: "weekly" // Always use weekly for individual days
          } as any) // Use type assertion to avoid TypeScript error
        );
        return Promise.all(promises).then(results => results[0]); // Return the first result
      } else {
        // For individual days, create a single session
        return createSession({
          ...data,
          center_id: parseInt(centerId),
          recurrence_pattern: "weekly"
        } as any); // Use type assertion to avoid TypeScript error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', centerId] });
      toast({
        title: "Success",
        description: "Session created successfully",
      });
      setIsDialogOpen(false);
      setValidationErrors([]);
      setOverlapWarning(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create session",
        variant: "destructive",
      });
    },
  });

  // Update session mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SessionFormValues }) => {
      // Add center_id and recurrence_pattern to the data
      return updateSession(id, {
        ...data,
        center_id: parseInt(centerId),
        recurrence_pattern: isWeekdayGroup(data.weekday) ? "daily" : "weekly"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', centerId] });
      toast({
        title: "Success",
        description: "Session updated successfully",
      });
      setIsDialogOpen(false);
      setEditingSession(null);
      setValidationErrors([]);
      setOverlapWarning(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update session: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete session mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', centerId] });
      toast({
        title: "Success",
        description: "Session deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete session: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle dialog open for new session
  const handleNewSession = () => {
    setEditingSession(null);
    form.reset({
      doctor_id: null,
      weekday: "", // Empty string to not select anything by default
      start_time: "08:00:00",
      end_time: "10:00:00",
      default_capacity: 1,
      status: "active"
    });
    setIsDialogOpen(true);
  };

  // Handle dialog open for editing
  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    form.reset({
      doctor_id: session.doctor_id,
      weekday: session.weekday,
      start_time: session.start_time,
      end_time: session.end_time,
      default_capacity: session.default_capacity,
      status: session.status
    });
    setIsDialogOpen(true);
  };

  // Handle session deletion
  const handleDeleteSession = (id: number) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      deleteMutation.mutate(id);
    }
  };

  // Form submission handler
  const onSubmit = (data: SessionFormValues) => {
    console.log("Form data:", data);
    
    if (editingSession) {
      updateMutation.mutate({ id: editingSession.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Format weekday for display
  const formatWeekday = (weekday: string) => {
    const option = weekdayOptions.find(opt => opt.value === weekday) || 
                  weekdayGroupOptions.find(opt => opt.value === weekday);
    return option ? option.label : weekday;
  };

  // Format time for display
  const formatTime = (time: string) => {
    return formatTimeString(time);
  };

  // Get center operating hours for a specific day
  const getCenterHoursForDay = (day: string) => {
    if (!centerData || !centerData.centerHours || !Array.isArray(centerData.centerHours)) {
      return { openTime: null, closeTime: null };
    }
    
    // If it's a weekday group, return null (can't determine specific hours)
    if (isWeekdayGroup(day)) {
      return { openTime: null, closeTime: null };
    }
    
    // Find the operating hours for the specific day
    const dayHours = centerData.centerHours.find(h => h && h.weekday === day);
    
    return {
      openTime: dayHours && dayHours.openTime ? dayHours.openTime : null,
      closeTime: dayHours && dayHours.closeTime ? dayHours.closeTime : null
    };
  };

  // Get center operating hours for a group of days or a single day
  const getCenterHoursDisplay = (weekday: string) => {
    if (!centerData || !centerData.centerHours || !Array.isArray(centerData.centerHours)) {
      return "No hours available";
    }
    
    // If it's a weekday group, show hours for all days in the group
    if (isWeekdayGroup(weekday)) {
      const days = getDaysFromWeekdayGroup(weekday);
      const formattedHours: string[] = [];
      
      // Get hours for each day in the group
      days.forEach(day => {
        const dayHours = centerData.centerHours?.find(h => h && h.weekday === day);
        const dayName = weekdayOptions.find(opt => opt.value === day)?.label || day;
        
        if (dayHours && dayHours.openTime && dayHours.closeTime) {
          const openOption = timeOptions.find(opt => opt.value === dayHours.openTime);
          const closeOption = timeOptions.find(opt => opt.value === dayHours.closeTime);
          formattedHours.push(`${dayName}: ${openOption?.label || dayHours.openTime} - ${closeOption?.label || dayHours.closeTime}`);
        } else {
          formattedHours.push(`${dayName}: Closed`);
        }
      });
      
      return formattedHours.join('\n');
    } else {
      // For a single day, just show that day's hours
      const dayHours = centerData.centerHours.find(h => h && h.weekday === weekday);
      if (!dayHours || !dayHours.openTime || !dayHours.closeTime) {
        return "Closed";
      }
      
      const openOption = timeOptions.find(opt => opt.value === dayHours.openTime);
      const closeOption = timeOptions.find(opt => opt.value === dayHours.closeTime);
      
      return `${openOption?.label || dayHours.openTime} - ${closeOption?.label || dayHours.closeTime}`;
    }
  };

  // Get status badge
  const getStatusBadge = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200">
          Active
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
          Inactive
        </Badge>
      );
    }
  };

  // Custom styled select item component to match the design
  const CustomSelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
  >(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  ));
  CustomSelectItem.displayName = "CustomSelectItem";

  // Get filtered time options based on center hours for the selected day
  const getFilteredTimeOptions = (type: 'start' | 'end', selectedDay: string, selectedStartTime?: string) => {
    if (!centerData || !centerData.centerHours || !Array.isArray(centerData.centerHours) || !selectedDay) {
      return timeOptions;
    }

    // If it's a weekday group, use the first day's hours as a fallback
    let dayToUse = selectedDay;
    if (isWeekdayGroup(selectedDay)) {
      const days = getDaysFromWeekdayGroup(selectedDay);
      if (days.length > 0) {
        dayToUse = days[0]; // Use the first day in the group
      }
    }

    // Find the center hours for the selected day
    const dayHours = centerData.centerHours.find(h => h && h.weekday === dayToUse);
    if (!dayHours || !dayHours.openTime || !dayHours.closeTime) {
      return timeOptions;
    }

    // Get the open and close time indices
    const openTimeIndex = timeOptions.findIndex(opt => opt.value === dayHours.openTime);
    const closeTimeIndex = timeOptions.findIndex(opt => opt.value === dayHours.closeTime);
    
    if (openTimeIndex === -1 || closeTimeIndex === -1) {
      return timeOptions;
    }

    // For start time: between open time and (close time - 1 hour)
    if (type === 'start') {
      // Allow selection from open time to (close time - 1 hour)
      const maxIndex = Math.max(openTimeIndex, closeTimeIndex - 1);
      return timeOptions.slice(openTimeIndex, maxIndex + 1);
    } 
    // For end time: between (start time + 1 hour) and close time
    else if (type === 'end' && selectedStartTime) {
      const startTimeIndex = timeOptions.findIndex(opt => opt.value === selectedStartTime);
      if (startTimeIndex === -1) {
        return timeOptions;
      }
      
      // Allow selection from (start time + 1 hour) to close time
      const minIndex = Math.min(startTimeIndex + 1, closeTimeIndex);
      return timeOptions.slice(minIndex, closeTimeIndex + 1);
    }
    
    return timeOptions;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>
            Manage dialysis sessions for {centerData?.name || 'this center'}
          </CardDescription>
        </div>
        <Button onClick={handleNewSession}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Session
        </Button>
      </CardHeader>
      <CardContent>
        {isLoadingSessions ? (
          <div className="flex justify-center p-4">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">No sessions found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add a new session to get started
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{formatWeekday(session.weekday)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {session.doctor_id ? 
                          doctors.find(d => d.id === session.doctor_id)?.firstName + ' ' + 
                          doctors.find(d => d.id === session.doctor_id)?.lastName : 
                          'Not assigned'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{session.default_capacity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(session.status as 'active' | 'inactive')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            Actions <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditSession(session)}
                            className="cursor-pointer"
                          >
                            Edit Session
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem
                            onClick={() => {
                              // Toggle session status
                              const newStatus = session.status === 'active' ? 'inactive' : 'active';
                              updateMutation.mutate({
                                id: session.id,
                                data: {
                                  ...session,
                                  status: newStatus
                                }
                              });
                            }}
                            className="cursor-pointer text-orange-600"
                          >
                            {session.status === 'active' ? 'Deactivate' : 'Activate'} Session
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => handleDeleteSession(session.id)}
                            className="cursor-pointer text-red-600"
                          >
                            Delete Session
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Session Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingSession ? "Edit Session" : "Add New Session"}</DialogTitle>
            <DialogDescription>
              {editingSession ? "Update the session information below." : "Define a new recurring dialysis session."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="weekday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Week</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedWeekday(value);
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day">
                            {field.value && (
                              <>
                                {weekdayOptions.find(opt => opt.value === field.value)?.label || 
                                 weekdayGroupOptions.find(opt => opt.value === field.value)?.label}
                              </>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="pl-2">Day Groups</SelectLabel>
                          {weekdayGroupOptions.map(option => (
                            <CustomSelectItem 
                              key={option.value} 
                              value={option.value}
                            >
                              {option.label}
                            </CustomSelectItem>
                          ))}
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel className="pl-2">Individual Days</SelectLabel>
                          {weekdayOptions.map(option => (
                            <CustomSelectItem 
                              key={option.value} 
                              value={option.value}
                            >
                              {option.label}
                            </CustomSelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!watchedWeekday}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getFilteredTimeOptions('start', watchedWeekday).map(option => (
                            <CustomSelectItem key={option.value} value={option.value}>
                              {option.label}
                            </CustomSelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Enter time in 12-hour format
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!watchedWeekday || !watchedStartTime}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getFilteredTimeOptions('end', watchedWeekday, watchedStartTime).map(option => (
                            <CustomSelectItem key={option.value} value={option.value}>
                              {option.label}
                            </CustomSelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Enter time in 12-hour format
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Display center hours for the selected day */}
              {watchedWeekday && (
                <div className="text-sm">
                  <div className="text-blue-600 font-medium">Center Hours:</div>
                  <div className="whitespace-pre-line text-blue-600">
                    {getCenterHoursDisplay(watchedWeekday)}
                  </div>
                </div>
              )}
              
              {/* Display validation errors */}
              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Validation Error</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Display overlap warning */}
              {overlapWarning && (
                <Alert variant="default" className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertTitle className="text-amber-700">Warning</AlertTitle>
                  <AlertDescription className="text-amber-600">{overlapWarning}</AlertDescription>
                </Alert>
              )}
              
              <FormField
                control={form.control}
                name="default_capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity (Number of Patients)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max={centerData?.totalCapacity || undefined} 
                        {...field} 
                      />
                    </FormControl>
                    {centerData?.totalCapacity && (
                      <FormDescription>
                        Maximum capacity: {centerData.totalCapacity}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {editingSession && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || "active"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="doctor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor (Optional)</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        // Handle the "none" value as null
                        field.onChange(value === "none" ? null : parseInt(value));
                      }}
                      value={field.value === null ? "none" : field.value?.toString() || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Not Assigned</SelectItem>
                        {isLoadingDoctors ? (
                          <SelectItem value="loading" disabled>Loading doctors...</SelectItem>
                        ) : (
                          doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id.toString()}>
                              {doctor.firstName} {doctor.lastName}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Assign a doctor to this session (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSession ? "Update Session" : "Add Session"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SessionManagement;
