import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { Calendar, Clock, Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { Session } from '@/types/sessionTypes';

// Form schemas
const scheduleSessionFormSchema = z.object({
  session_id: z.number().nullable(),
  session_date: z.string().min(1, "Date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  available_beds: z.coerce.number().min(1, "Available beds must be at least 1"),
  notes: z.string().optional(),
  status: z.string().optional()
});

const generateSessionsFormSchema = z.object({
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  session_ids: z.array(z.number()).min(1, "Select at least one session template")
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
  
  // Initialize forms
  const scheduleSessionForm = useForm<ScheduledSessionFormValues>({
    resolver: zodResolver(scheduleSessionFormSchema),
    defaultValues: {
      session_id: null,
      session_date: format(today, 'yyyy-MM-dd'),
      start_time: '08:00:00',
      end_time: '10:00:00',
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
    setEditingSession(null);
    const today = new Date();
    scheduleSessionForm.reset({
      session_id: null,
      session_date: format(today, 'yyyy-MM-dd'),
      start_time: '08:00:00',
      end_time: '10:00:00',
      available_beds: 1,
      notes: '',
      status: 'scheduled'
    });
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
      start_time: session.start_time,
      end_time: session.end_time,
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
    console.log('Submitting scheduled session form with data:', data);
    
    // Ensure time format is correct (HH:MM:SS)
    const formatTimeValue = (time: string) => {
      if (!time.includes(':')) return time;
      
      // If time is in HH:MM format, add seconds
      if (time.split(':').length === 2) {
        return `${time}:00`;
      }
      return time;
    };
    
    // Ensure date format is YYYY-MM-DD
    const formatDateValue = (date: string) => {
      // Check if date is already in correct format
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      
      // Try to parse and format the date
      try {
        const parsedDate = new Date(date);
        return format(parsedDate, 'yyyy-MM-dd');
      } catch (e) {
        console.error('Error formatting date:', e);
        return date;
      }
    };
    
    const formattedData = {
      ...data,
      session_date: formatDateValue(data.session_date),
      start_time: formatTimeValue(data.start_time),
      end_time: formatTimeValue(data.end_time)
    };
    
    if (editingSession) {
      console.log('Updating existing session:', editingSession.id);
      console.log('Formatted data for update:', formattedData);
      updateMutation.mutate({
        id: editingSession.id,
        data: formattedData
      });
    } else {
      console.log('Creating new session with center_id:', centerId);
      const newSessionData = {
        center_id: parseInt(centerId),
        ...formattedData
      };
      console.log('Full data being sent to API:', newSessionData);
      createMutation.mutate(newSessionData);
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
    const [hours, minutes] = timeStr.split(':');
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return null;
    }
  };
  
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
                <TableHead>Template</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledSessions.map((session: ScheduledSession) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span className="font-medium">{formatDate(session.session_date)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {formatTime(session.start_time)} - {formatTime(session.end_time)}
                    </div>
                  </TableCell>
                  <TableCell>{session.available_beds}</TableCell>
                  <TableCell>{session.session_name || 'Custom'}</TableCell>
                  <TableCell className="max-w-xs truncate">{session.notes || '-'}</TableCell>
                  <TableCell>{getStatusBadge(session.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditSession(session)}
                      className="h-8 w-8 p-0 mr-1"
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
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={scheduleSessionForm.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={scheduleSessionForm.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={scheduleSessionForm.control}
                name="available_beds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Beds</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={scheduleSessionForm.control}
                name="session_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Template (Optional)</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === "null" ? null : parseInt(value))} 
                      value={field.value?.toString() || "null"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template or leave empty for custom" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">Custom Session</SelectItem>
                        {recurringSessions.map((session: Session) => (
                          <SelectItem key={session.id} value={session.id.toString()}>
                            {session.weekday.toUpperCase()} {formatTime(session.start_time)} - {formatTime(session.end_time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={scheduleSessionForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
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
                        <Input type="date" {...field} />
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
                        <Input type="date" {...field} />
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
                    {recurringSessions.length > 0 ? (
                      <div className="space-y-2">
                        {recurringSessions.map((session) => (
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
                        No recurring sessions available. Please create recurring sessions first.
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
