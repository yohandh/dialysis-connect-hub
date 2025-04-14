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
  Search
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form schema for session
const sessionFormSchema = z.object({
  doctor_id: z.number().nullable(),
  weekday: z.string().min(3, "Weekday is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  default_capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  recurrence_pattern: z.string().default("weekly"),
  status: z.string().optional()
});

interface SessionManagementProps {
  centerId: string;
}

const SessionManagement: React.FC<SessionManagementProps> = ({ centerId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [selectedWeekday, setSelectedWeekday] = useState<string>("mon");
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

  // Initialize form
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      doctor_id: null,
      weekday: "mon",
      start_time: "08:00:00",
      end_time: "10:00:00",
      default_capacity: 1,
      recurrence_pattern: "weekly",
      status: "active"
    },
  });

  // Watch form values for validation
  const watchedWeekday = form.watch("weekday");
  const watchedStartTime = form.watch("start_time");
  const watchedEndTime = form.watch("end_time");
  const watchedRecurrencePattern = form.watch("recurrence_pattern");

  // Update selected weekday when form value changes
  useEffect(() => {
    setSelectedWeekday(watchedWeekday);
  }, [watchedWeekday]);

  // Validate session times against center hours and check for overlaps
  useEffect(() => {
    if (!centerData || !watchedWeekday || !watchedStartTime || !watchedEndTime) return;

    const errors: string[] = [];
    
    // Get the days to validate based on weekday selection
    const daysToValidate = isWeekdayGroup(watchedWeekday) 
      ? getDaysFromWeekdayGroup(watchedWeekday)
      : [watchedWeekday];
    
    // Validate against center hours
    if (centerData.centerHours && Array.isArray(centerData.centerHours)) {
      for (const day of daysToValidate) {
        const centerHour = centerData.centerHours.find(h => h.weekday === day);
        
        if (centerHour) {
          const { openTime, closeTime } = centerHour;
          
          if (openTime && closeTime) {
            if (watchedStartTime < openTime || watchedEndTime > closeTime) {
              errors.push(`Session time for ${formatWeekday(day)} is outside center hours (${formatTime(openTime)} - ${formatTime(closeTime)})`);
            }
          }
        }
      }
    }
    
    // Validate capacity against center total capacity
    const watchedCapacity = form.watch("default_capacity");
    if (centerData.totalCapacity && watchedCapacity > centerData.totalCapacity) {
      errors.push(`Capacity (${watchedCapacity}) exceeds center total capacity (${centerData.totalCapacity})`);
    }
    
    setValidationErrors(errors);
    
    // Check for overlaps with existing sessions
    if (sessions.length > 0) {
      const overlappingSessions = sessions.filter(session => {
        // Skip the current session being edited
        if (editingSession && session.id === editingSession.id) return false;
        
        // For group weekdays, check if any day in the group overlaps
        if (isWeekdayGroup(watchedWeekday)) {
          const groupDays = getDaysFromWeekdayGroup(watchedWeekday);
          if (!groupDays.includes(session.weekday)) return false;
        } else if (session.weekday !== watchedWeekday) {
          return false;
        }
        
        // Check time overlap
        return (
          (watchedStartTime >= session.start_time && watchedStartTime < session.end_time) ||
          (watchedEndTime > session.start_time && watchedEndTime <= session.end_time) ||
          (watchedStartTime <= session.start_time && watchedEndTime >= session.end_time)
        );
      });
      
      if (overlappingSessions.length > 0) {
        setOverlapWarning(`This session overlaps with ${overlappingSessions.length} existing session(s)`);
      } else {
        setOverlapWarning(null);
      }
    }
  }, [centerData, watchedWeekday, watchedStartTime, watchedEndTime, form, sessions, editingSession]);

  // Update recurrence pattern based on weekday selection
  useEffect(() => {
    const selectedWeekday = form.watch("weekday");
    
    if (isWeekdayGroup(selectedWeekday)) {
      // For weekday groups, automatically set recurrence pattern to daily
      form.setValue("recurrence_pattern", "daily");
    } else {
      // For individual days, set to weekly
      form.setValue("recurrence_pattern", "weekly");
    }
  }, [form.watch("weekday"), form]);

  // Create session mutation
  const createMutation = useMutation({
    mutationFn: async (data: SessionFormValues) => {
      // If weekday is a group, create multiple sessions
      if (isWeekdayGroup(data.weekday)) {
        const days = getDaysFromWeekdayGroup(data.weekday);
        const promises = days.map(day => 
          createSession({
            center_id: parseInt(centerId),
            ...data,
            weekday: day,
            // Only allow daily recurrence for group weekdays
            recurrence_pattern: "daily"
          })
        );
        return Promise.all(promises);
      } else {
        // Create a single session
        return createSession({
          center_id: parseInt(centerId),
          ...data
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', centerId] });
      toast({
        title: "Success",
        description: "Session(s) created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
      setValidationErrors([]);
      setOverlapWarning(null);
    },
    onError: (error: any) => {
      console.error('Error in createMutation:', error);
      toast({
        title: "Error",
        description: `Failed to create session: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update session mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SessionFormValues }) => 
      updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', centerId] });
      toast({
        title: "Success",
        description: "Session updated successfully",
      });
      setIsDialogOpen(false);
      setEditingSession(null);
      form.reset();
      setValidationErrors([]);
      setOverlapWarning(null);
    },
    onError: (error: any) => {
      console.error('Error in updateMutation:', error);
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
      console.error('Error in deleteMutation:', error);
      toast({
        title: "Error",
        description: `Failed to delete session: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle dialog open for new session
  const handleNewSession = () => {
    form.reset({
      doctor_id: null,
      weekday: "mon",
      start_time: "08:00:00",
      end_time: "10:00:00",
      default_capacity: 1,
      recurrence_pattern: "weekly",
      status: "active"
    });
    setEditingSession(null);
    setValidationErrors([]);
    setOverlapWarning(null);
    setIsDialogOpen(true);
  };

  // Handle dialog open for editing
  const handleEditSession = (session: Session) => {
    form.reset({
      doctor_id: session.doctor_id,
      weekday: session.weekday,
      start_time: session.start_time,
      end_time: session.end_time,
      default_capacity: session.default_capacity,
      recurrence_pattern: session.recurrence_pattern,
      status: session.status
    });
    setEditingSession(session);
    setValidationErrors([]);
    setOverlapWarning(null);
    setIsDialogOpen(true);
  };

  // Handle session deletion
  const handleDeleteSession = (id: number) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      deleteMutation.mutate(id);
    }
  };

  // Form submission handler
  const onSubmit = (data: SessionFormValues) => {
    // If there are validation errors, show a toast and prevent submission
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the validation errors before submitting",
        variant: "destructive",
      });
      return;
    }
    
    if (editingSession) {
      updateMutation.mutate({ id: editingSession.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // Format weekday for display
  const formatWeekday = (weekday: string) => {
    const option = weekdayOptions.find(opt => opt.value === weekday);
    return option ? option.label : weekday;
  };

  // Format time for display
  const formatTime = (time: string) => {
    const option = timeOptions.find(opt => opt.value === time);
    return option ? option.label : formatTimeString(time);
  };

  // Get center operating hours for a specific day
  const getCenterHoursForDay = (day: string) => {
    if (!centerData || !centerData.centerHours || !Array.isArray(centerData.centerHours)) {
      return null;
    }
    
    const centerHour = centerData.centerHours.find(h => h.weekday === day);
    if (!centerHour || !centerHour.openTime || !centerHour.closeTime) {
      return null;
    }
    
    return `${formatTime(centerHour.openTime)} - ${formatTime(centerHour.closeTime)}`;
  };

  // Get center operating hours for a group of days or a single day
  const getCenterHoursDisplay = (weekday: string) => {
    if (isWeekdayGroup(weekday)) {
      const days = getDaysFromWeekdayGroup(weekday);
      const hoursMap: Record<string, string> = {};
      
      // Collect hours for each day in the group
      days.forEach(day => {
        const hours = getCenterHoursForDay(day);
        if (hours) {
          hoursMap[day] = hours;
        }
      });
      
      // If we have hours for any days, display them
      if (Object.keys(hoursMap).length > 0) {
        return (
          <div className="text-sm text-blue-600 mt-1">
            <div className="font-medium">Center Hours:</div>
            {Object.entries(hoursMap).map(([day, hours]) => (
              <div key={day} className="flex justify-between">
                <span>{formatWeekday(day)}:</span>
                <span>{hours}</span>
              </div>
            ))}
          </div>
        );
      }
    } else {
      const hours = getCenterHoursForDay(weekday);
      if (hours) {
        return (
          <div className="text-sm text-blue-600 mt-1">
            <div className="font-medium">Center Hours:</div>
            <div className="flex justify-between">
              <span>{formatWeekday(weekday)}:</span>
              <span>{hours}</span>
            </div>
          </div>
        );
      }
    }
    
    return null;
  };

  // Get status badge
  const getStatusBadge = (status: 'active' | 'inactive') => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      default:
        return null;
    }
  };

  const isLoading = isLoadingSessions || isLoadingCenter;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recurring Sessions</CardTitle>
          <CardDescription>Define and manage recurring dialysis sessions.</CardDescription>
        </div>
        <Button onClick={handleNewSession}>
          <Plus className="mr-2 h-4 w-4" />
          Add Session
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Loading sessions...</div>
        ) : sessions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Recurrence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatWeekday(session.weekday)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatTime(session.start_time)} - {formatTime(session.end_time)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      {session.default_capacity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Repeat className="h-4 w-4 mr-2 text-muted-foreground" />
                      {session.recurrence_pattern === 'daily' ? 'Daily' : 'Weekly'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(session.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditSession(session)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteSession(session.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md border-dashed">
            <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No sessions available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Define recurring dialysis sessions for this center.
            </p>
            <Button onClick={handleNewSession}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Session
            </Button>
          </div>
        )}
      </CardContent>

      {/* Session Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSession ? "Edit Session" : "Add New Session"}</DialogTitle>
            <DialogDescription>
              {editingSession 
                ? "Update the session information below." 
                : "Define a new recurring dialysis session."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Validation Errors</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Overlap Warning */}
              {overlapWarning && (
                <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">Session Overlap Warning</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    {overlapWarning}
                  </AlertDescription>
                </Alert>
              )}
              
              <FormField
                control={form.control}
                name="weekday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Week</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        // If selecting a group, set recurrence to daily
                        if (isWeekdayGroup(value)) {
                          form.setValue("recurrence_pattern", "daily");
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Groups</SelectLabel>
                          {weekdayGroupOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Individual Days</SelectLabel>
                          {weekdayOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
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
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div className="flex items-center px-3 pb-2">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search times..."
                              id="time-search"
                              onChange={(e) => {
                                const searchBox = document.getElementById('time-search');
                                const searchTerm = e.target.value.toLowerCase();
                                const items = document.querySelectorAll('[data-time-item]');
                                
                                items.forEach(item => {
                                  const text = item.textContent?.toLowerCase() || '';
                                  if (text.includes(searchTerm)) {
                                    item.classList.remove('hidden');
                                  } else {
                                    item.classList.add('hidden');
                                  }
                                });
                              }}
                            />
                          </div>
                          {timeOptions.map(option => (
                            <SelectItem 
                              key={option.value} 
                              value={option.value}
                              data-time-item
                            >
                              {option.label}
                            </SelectItem>
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
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div className="flex items-center px-3 pb-2">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search times..."
                              id="end-time-search"
                              onChange={(e) => {
                                const searchTerm = e.target.value.toLowerCase();
                                const items = document.querySelectorAll('[data-end-time-item]');
                                
                                items.forEach(item => {
                                  const text = item.textContent?.toLowerCase() || '';
                                  if (text.includes(searchTerm)) {
                                    item.classList.remove('hidden');
                                  } else {
                                    item.classList.add('hidden');
                                  }
                                });
                              }}
                            />
                          </div>
                          {timeOptions.map(option => (
                            <SelectItem 
                              key={option.value} 
                              value={option.value}
                              data-end-time-item
                            >
                              {option.label}
                            </SelectItem>
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
              
              {/* Display center hours */}
              {getCenterHoursDisplay(selectedWeekday) && (
                <div className="-mt-2 mb-2">
                  {getCenterHoursDisplay(selectedWeekday)}
                </div>
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
              
              <FormField
                control={form.control}
                name="recurrence_pattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurrence Pattern</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={true} // Always disable selection
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pattern" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isWeekdayGroup(selectedWeekday) ? (
                          <SelectItem value="daily">Daily</SelectItem>
                        ) : (
                          <SelectItem value="weekly">Weekly</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {isWeekdayGroup(selectedWeekday) ? (
                      <FormDescription>
                        Daily recurrence is automatically selected for day groups
                      </FormDescription>
                    ) : (
                      <FormDescription>
                        Weekly recurrence is automatically selected for individual days
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
