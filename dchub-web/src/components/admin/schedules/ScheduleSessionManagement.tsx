import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { Calendar, Clock, Plus, Pencil, Trash2, RefreshCw, Search, Users, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ScheduledSession, ScheduledSessionFormValues, GenerateSessionsFormValues, statusOptions } from '@/types/scheduleSessionTypes';
import { fetchScheduledSessionsByCenter, createScheduledSession, updateScheduledSession, deleteScheduledSession, generateScheduledSessions } from '@/api/scheduleSessionApi';
import { fetchSessionsByCenter } from '@/api/sessionApi';
import { Session, timeOptions, formatTimeString } from '@/types/sessionTypes';
import { fetchCenterById } from '@/api/centerApi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Form schemas
const scheduleSessionFormSchema = z.object({
  session_id: z.number().nullable(),
  session_date: z.string().min(1, "Date is required"),
  available_beds: z.coerce.number().min(1, "Available beds must be at least 1"),
  notes: z.string().optional(),
  status: z.string().optional()
});

const generateSessionsFormSchema = z.object({
  start_date: z.string()
    .min(1, "Start date is required")
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date);
      return selectedDate >= today;
    }, "Start date must be today or in the future"),
  end_date: z.string()
    .min(1, "End date is required"),
  session_ids: z.array(z.number()).min(1, "Select at least one session template")
}).refine((data) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  return endDate >= startDate;
}, {
  message: "End date must be equal to or after start date",
  path: ["end_date"]
});

interface ScheduleSessionManagementProps {
  centerId: string;
}

const ScheduleSessionManagement: React.FC<ScheduleSessionManagementProps> = ({ centerId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for dialogs
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ScheduledSession | null>(null);

  // State for date range
  const today = new Date();
  const [dateRange, setDateRange] = useState({
    from: new Date(today.getFullYear(), today.getMonth(), 1), // First day of current month
    to: new Date(today.getFullYear(), today.getMonth() + 1, 0) // Last day of current month
  });

  // Format dates for API
  const formattedStartDate = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : '';
  const formattedEndDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : '';

  // Fetch scheduled sessions
  const { data: scheduledSessions = [], isLoading } = useQuery({
    queryKey: ['scheduledSessions', centerId, formattedStartDate, formattedEndDate],
    queryFn: () => fetchScheduledSessionsByCenter(centerId, formattedStartDate, formattedEndDate),
  });

  // Fetch recurring sessions for the generate dialog
  const { data: recurringSessions = [] } = useQuery({
    queryKey: ['sessions', centerId],
    queryFn: () => fetchSessionsByCenter(centerId),
  });

  // Fetch center details to get active beds count
  const { data: centerData } = useQuery({
    queryKey: ['center', centerId],
    queryFn: () => fetchCenterById(centerId),
  });

  // Initialize forms
  const scheduleSessionForm = useForm<ScheduledSessionFormValues>({
    resolver: zodResolver(scheduleSessionFormSchema),
    defaultValues: {
      session_id: null,
      session_date: format(today, 'yyyy-MM-dd'),
      available_beds: 1,
      notes: '',
      status: 'scheduled'
    },
  });

  const generateSessionsForm = useForm<GenerateSessionsFormValues>({
    resolver: zodResolver(generateSessionsFormSchema),
    defaultValues: {
      start_date: format(addDays(today, 1), 'yyyy-MM-dd'),
      end_date: format(addDays(today, 7), 'yyyy-MM-dd'),
      session_ids: []
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: ScheduledSessionFormValues) => createScheduledSession({
      center_id: parseInt(centerId),
      ...data
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledSessions', centerId] });
      toast({
        title: "Success",
        description: "Scheduled session created successfully",
      });
      setIsAddEditDialogOpen(false);
      scheduleSessionForm.reset();
    },
    onError: (error: any) => {
      console.error('Error in createMutation:', error);
      toast({
        title: "Error",
        description: `Failed to create scheduled session: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ScheduledSessionFormValues }) =>
      updateScheduledSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledSessions', centerId] });
      toast({
        title: "Success",
        description: "Scheduled session updated successfully",
      });
      setIsAddEditDialogOpen(false);
      setEditingSession(null);
      scheduleSessionForm.reset();
    },
    onError: (error: any) => {
      console.error('Error in updateMutation:', error);
      toast({
        title: "Error",
        description: `Failed to update scheduled session: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteScheduledSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledSessions', centerId] });
      toast({
        title: "Success",
        description: "Scheduled session deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error in deleteMutation:', error);
      toast({
        title: "Error",
        description: `Failed to delete scheduled session: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const generateMutation = useMutation({
    mutationFn: (data: GenerateSessionsFormValues) => generateScheduledSessions({
      center_id: parseInt(centerId),
      ...data
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['scheduledSessions', centerId] });
      toast({
        title: "Success",
        description: `Generated ${data.length} scheduled sessions successfully`,
      });
      setIsGenerateDialogOpen(false);
      generateSessionsForm.reset();
    },
    onError: (error: any) => {
      console.error('Error in generateMutation:', error);
      toast({
        title: "Error",
        description: `Failed to generate scheduled sessions: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleNewSession = () => {
    scheduleSessionForm.reset({
      session_id: null,
      session_date: format(new Date(), 'yyyy-MM-dd'),
      available_beds: 1,
      notes: '',
      status: 'scheduled'
    });
    setEditingSession(null);
    setIsAddEditDialogOpen(true);
  };

  const handleEditSession = (session: ScheduledSession) => {
    console.log('Editing session:', session);
    setEditingSession(session);

    // Format the date correctly for the date input (YYYY-MM-DD)
    const formattedDate = format(new Date(session.session_date), 'yyyy-MM-dd');
    console.log('Formatted date for form:', formattedDate);

    scheduleSessionForm.reset({
      session_id: session.session_id,
      session_date: formattedDate,
      available_beds: session.available_beds,
      notes: session.notes || '',
      status: session.status
    });

    setIsAddEditDialogOpen(true);
  };

  const handleDeleteSession = (id: number) => {
    if (window.confirm("Are you sure you want to delete this scheduled session?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleOpenGenerateDialog = () => {
    generateSessionsForm.reset({
      start_date: format(addDays(today, 1), 'yyyy-MM-dd'),
      end_date: format(addDays(today, 7), 'yyyy-MM-dd'),
      session_ids: []
    });
    setIsGenerateDialogOpen(true);
  };

  // Form submission handlers
  const onSubmitScheduleSession = (data: ScheduledSessionFormValues) => {
    // Ensure date format is YYYY-MM-DD
    const formatDateValue = (date: string) => {
      if (!date) return date;

      // Check if date is already in YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(date)) return date;

      // Otherwise, try to parse and format
      try {
        const parsedDate = parseISO(date);
        return format(parsedDate, 'yyyy-MM-dd');
      } catch (error) {
        // If parsing fails, return as is (validation will catch this)
        return date;
      }
    };

    // Validate date is today or future
    const selectedDate = new Date(data.session_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast({
        title: "Invalid date",
        description: "Session date must be today or in the future",
        variant: "destructive"
      });
      return;
    }

    // Get session template details if selected
    const sessionId = data.session_id;
    let formattedData: any = {
      ...data,
      center_id: parseInt(centerId),
      session_date: formatDateValue(data.session_date)
    };

    // If a session template is selected, use its times
    if (sessionId) {
      const selectedTemplate = recurringSessions.find(s => s.id === sessionId);
      if (selectedTemplate) {
        formattedData.start_time = selectedTemplate.start_time;
        formattedData.end_time = selectedTemplate.end_time;
      }
    }

    if (editingSession) {
      updateMutation.mutate({
        id: editingSession.id,
        data: formattedData
      });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const onSubmitGenerateSessions = (data: GenerateSessionsFormValues) => {
    generateMutation.mutate(data);
  };

  // Helper functions
  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, 'MMM d, yyyy');
  };

  const formatTime = (timeStr: string) => {
    const option = timeOptions.find(opt => opt.value === timeStr);
    return option ? option.label : formatTimeString(timeStr);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200">
            Scheduled
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-600 border-yellow-200">
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200">
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-600 border-red-200">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Calculate active beds count (this will be the number of beds that are active)
  const getActiveBedCount = (center: any) => {
    if (!center) return 0;
    // For now, we'll use a percentage of total capacity as active beds
    // In a real implementation, you would get this from the beds table
    return Math.floor(center.totalCapacity * 0.8); // Assuming 80% of beds are active
  };

  // Function to get the weekdays included in a date range
  const getWeekdaysInDateRange = (startDate: string, endDate: string): string[] => {
    if (!startDate || !endDate) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const weekdays = new Set<string>();

    // Map day numbers to weekday codes
    const dayToWeekday = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    // Iterate through each day in the range
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      weekdays.add(dayToWeekday[dayOfWeek]);

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return Array.from(weekdays);
  };

  // Filter sessions based on selected date range
  const getFilteredSessions = (sessions: Session[], startDate: string, endDate: string): Session[] => {
    if (!startDate || !endDate || !sessions.length) return sessions;

    const weekdaysInRange = getWeekdaysInDateRange(startDate, endDate);

    return sessions.filter(session =>
      weekdaysInRange.includes(session.weekday.toLowerCase())
    );
  };

  // Watch for date changes to filter sessions
  const startDate = generateSessionsForm.watch("start_date");
  const endDate = generateSessionsForm.watch("end_date");

  // Filter sessions based on selected date range
  const filteredSessions = getFilteredSessions(recurringSessions, startDate, endDate);

  // Watch for date changes to filter sessions for the add dialog
  const selectedDate = scheduleSessionForm.watch("session_date");

  // Filter sessions based on selected date for the add dialog
  const filteredSessionTemplates = getFilteredSessions(
    recurringSessions,
    selectedDate,
    selectedDate
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Scheduled Sessions</CardTitle>
          <CardDescription>
            View and manage scheduled dialysis sessions
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleOpenGenerateDialog}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Sessions
          </Button>
          <Button onClick={handleNewSession}>
            <Plus className="mr-2 h-4 w-4" />
            Add Session
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Input
              type="date"
              value={formattedStartDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: new Date(e.target.value) }))}
              className="w-40"
            />
            <span className="self-center">to</span>
            <Input
              type="date"
              value={formattedEndDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: new Date(e.target.value) }))}
              className="w-40"
            />
            <Button
              variant="outline"
              onClick={() => {
                const today = new Date();
                setDateRange({
                  from: new Date(today.getFullYear(), today.getMonth(), 1),
                  to: new Date(today.getFullYear(), today.getMonth() + 1, 0)
                });
              }}
              className="ml-2"
            >
              Current Month
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const today = new Date();
                const prevMonth = today.getMonth() - 1;
                const year = prevMonth < 0 ? today.getFullYear() - 1 : today.getFullYear();
                const month = prevMonth < 0 ? 11 : prevMonth;

                setDateRange({
                  from: new Date(year, month, 1),
                  to: new Date(year, month + 1, 0)
                });
              }}
              className="ml-2"
            >
              Previous Month
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const today = new Date();
                const nextMonth = today.getMonth() + 1;
                const year = nextMonth > 11 ? today.getFullYear() + 1 : today.getFullYear();
                const month = nextMonth > 11 ? 0 : nextMonth;

                setDateRange({
                  from: new Date(year, month, 1),
                  to: new Date(year, month + 1, 0)
                });
              }}
              className="ml-2"
            >
              Next Month
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-4">Loading scheduled sessions...</div>
        ) : scheduledSessions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Available Beds</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(session.session_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {formatTime(session.start_time)} - {formatTime(session.end_time)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {session.available_beds}
                    </div>
                  </TableCell>
                  <TableCell>
                    {session.notes ? (
                      <div className="max-w-xs truncate" title={session.notes}>
                        {session.notes}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(session.status)}
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

                          {session.status === 'scheduled' && (
                            <DropdownMenuItem
                              onClick={() => {
                                updateMutation.mutate({
                                  id: session.id,
                                  data: {
                                    status: 'in-progress'
                                  }
                                });
                              }}
                              className="cursor-pointer text-yellow-600"
                            >
                              Mark In Progress
                            </DropdownMenuItem>
                          )}

                          {session.status === 'scheduled' && (
                            <DropdownMenuItem
                              onClick={() => {
                                updateMutation.mutate({
                                  id: session.id,
                                  data: {
                                    status: 'cancelled'
                                  }
                                });
                              }}
                              className="cursor-pointer text-red-600"
                            >
                              Cancel Session
                            </DropdownMenuItem>
                          )}

                          {session.status === 'cancelled' && (
                            <DropdownMenuItem
                              onClick={() => {
                                updateMutation.mutate({
                                  id: session.id,
                                  data: {
                                    status: 'scheduled'
                                  }
                                });
                              }}
                              className="cursor-pointer text-blue-600"
                            >
                              Schedule Session
                            </DropdownMenuItem>
                          )}

                          {session.status === 'in-progress' && (
                            <DropdownMenuItem
                              onClick={() => {
                                updateMutation.mutate({
                                  id: session.id,
                                  data: {
                                    status: 'completed'
                                  }
                                });
                              }}
                              className="cursor-pointer text-green-600"
                            >
                              Complete Session
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md border-dashed">
            <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No scheduled sessions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Schedule dialysis sessions for specific dates or generate them from templates.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleOpenGenerateDialog}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Sessions
              </Button>
              <Button onClick={handleNewSession}>
                <Plus className="mr-2 h-4 w-4" />
                Add Session
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Add/Edit Session Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSession ? "Edit Scheduled Session" : "Add New Scheduled Session"}</DialogTitle>
            <DialogDescription>
              {editingSession
                ? "Update the scheduled session information below."
                : "Schedule a new dialysis session for a specific date."}
            </DialogDescription>
          </DialogHeader>

          <Form {...scheduleSessionForm}>
            <form onSubmit={scheduleSessionForm.handleSubmit(onSubmitScheduleSession)} className="space-y-4">
              <FormField
                control={scheduleSessionForm.control}
                name="session_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        min={format(new Date(), 'yyyy-MM-dd')} // Set min to today
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={scheduleSessionForm.control}
                name="session_id"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Session Template</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const sessionId = value === "none" ? null : parseInt(value);
                        field.onChange(sessionId);

                        // If a session is selected, update the form with its values
                        if (sessionId) {
                          const selectedSession = recurringSessions.find(s => s.id === sessionId);
                          if (selectedSession) {
                            scheduleSessionForm.setValue("available_beds", selectedSession.default_capacity);
                          }
                        }
                      }}
                      value={field.value === null ? "none" : field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a session template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Custom Session</SelectItem>
                        {filteredSessionTemplates.length > 0 ? (
                          filteredSessionTemplates.map((session) => (
                            <SelectItem key={session.id} value={session.id.toString()}>
                              {session.weekday.toUpperCase()} {formatTime(session.start_time)} - {formatTime(session.end_time)}
                              {session.doctor_name && ` (Dr. ${session.doctor_name})`}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-sessions" disabled>
                            No templates for this day
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={scheduleSessionForm.control}
                name="available_beds"
                render={({ field }) => {
                  const activeBedCount = getActiveBedCount(centerData);

                  return (
                    <FormItem>
                      <FormLabel>Available Beds</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max={activeBedCount || centerData?.totalCapacity || undefined}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum available beds: {activeBedCount || centerData?.totalCapacity || 0}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={scheduleSessionForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {editingSession && (
                <FormField
                  control={scheduleSessionForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
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
                  onClick={() => setIsAddEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSession ? "Update Session" : "Schedule Session"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Generate Sessions Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Scheduled Sessions</DialogTitle>
            <DialogDescription>
              Automatically create scheduled sessions from recurring templates for a date range.
            </DialogDescription>
          </DialogHeader>

          <Form {...generateSessionsForm}>
            <form onSubmit={generateSessionsForm.handleSubmit(onSubmitGenerateSessions)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={generateSessionsForm.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          min={format(new Date(), 'yyyy-MM-dd')} // Set min to today
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={generateSessionsForm.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          min={generateSessionsForm.watch("start_date") || format(new Date(), 'yyyy-MM-dd')} // Set min to start date or today
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={generateSessionsForm.control}
                name="session_ids"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Select Session Templates</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Choose which recurring sessions to generate in the selected date range
                      </p>
                    </div>
                    {filteredSessions.length > 0 ? (
                      <div className="space-y-2">
                        {filteredSessions.map((session) => (
                          <FormField
                            key={session.id}
                            control={generateSessionsForm.control}
                            name="session_ids"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={session.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(session.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, session.id])
                                          : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== session.id
                                            )
                                          )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {session.weekday.toUpperCase()} {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                    {session.doctor_name && ` (Dr. ${session.doctor_name})`}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {startDate && endDate
                          ? "No recurring sessions available for the selected date range."
                          : "No recurring sessions available. Please create recurring sessions first."}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsGenerateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={recurringSessions.length === 0}
                >
                  Generate Sessions
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ScheduleSessionManagement;
