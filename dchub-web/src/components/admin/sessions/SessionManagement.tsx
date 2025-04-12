import React, { useState } from 'react';
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
  Trash2 
} from 'lucide-react';
import { 
  Session, 
  SessionFormValues, 
  weekdayOptions, 
  timeOptions 
} from '@/types/sessionTypes';
import { 
  fetchSessionsByCenter, 
  createSession, 
  updateSession, 
  deleteSession 
} from '@/api/sessionApi';

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

  // Fetch sessions
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions', centerId],
    queryFn: () => fetchSessionsByCenter(centerId),
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

  // Create session mutation
  const createMutation = useMutation({
    mutationFn: (data: SessionFormValues) => createSession({
      center_id: parseInt(centerId),
      ...data
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', centerId] });
      toast({
        title: "Success",
        description: "Session created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
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
    if (editingSession) {
      // Update existing session
      updateMutation.mutate({
        id: editingSession.id,
        data
      });
    } else {
      // Create new session
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
    return option ? option.label : time;
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recurring Sessions</CardTitle>
          <CardDescription>
            Define weekly recurring dialysis sessions
          </CardDescription>
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
                <TableHead>Doctor</TableHead>
                <TableHead>Recurrence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session: Session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span className="font-medium">{formatWeekday(session.weekday)}</span>
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
                      <Users className="mr-2 h-4 w-4" />
                      {session.default_capacity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {session.doctor_name || 'Not assigned'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Repeat className="mr-2 h-4 w-4" />
                      {session.recurrence_pattern === 'daily' ? 'Daily' : 'Weekly'}
                    </div>
                  </TableCell>
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
            <h3 className="text-lg font-medium">No recurring sessions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Define recurring sessions to schedule dialysis treatments.
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
                ? "Update the recurring session information below." 
                : "Define a new recurring dialysis session."}
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
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {weekdayOptions.map(option => (
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
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map(option => (
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
                
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map(option => (
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
              </div>
              
              <FormField
                control={form.control}
                name="default_capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity (Number of Patients)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
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
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pattern" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
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
                        defaultValue={field.value}
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
