import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar,
  Edit,
  Trash,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAppointmentsByCenter,
  createAppointmentSlot,
  updateAppointmentSlot,
  cancelAppointment,
  CreateAppointmentSlotRequest
} from "@/api/appointmentApi";
import AppointmentSlotForm from './AppointmentSlotForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppointmentSlotManagementProps {
  centerId: string;
}

const AppointmentSlotManagement: React.FC<AppointmentSlotManagementProps> = ({ centerId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch appointment slots for the given center
  const { data: appointmentSlots, isLoading } = useQuery({
    queryKey: ['appointmentSlots', centerId],
    queryFn: () => fetchAppointmentsByCenter(centerId),
  });

  // Create new appointment slot mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAppointmentSlotRequest) => createAppointmentSlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointmentSlots', centerId] });
      toast({
        title: "Success",
        description: "Appointment created successfully",
      });
      setIsDialogOpen(false);
      setIsEditMode(false);
      setSelectedAppointment(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create appointment: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update appointment status mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, status, patientId, bedId, notes }: { id: string, status?: string, patientId?: string, bedId?: string, notes?: string }) =>
      updateAppointmentSlot(id, { status, patientId, bedId, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointmentSlots', centerId] });
      toast({
        title: "Success",
        description: "Appointment status updated successfully",
      });
      setIsDialogOpen(false);
      setIsEditMode(false);
      setSelectedAppointment(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update appointment status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleCreateAppointmentSlot = (data: CreateAppointmentSlotRequest) => {
    // No need to add centerId here as it's already in the scheduleSessionId
    createMutation.mutate(data);
  };

  // Handle edit appointment
  const handleEditAppointment = (data: any) => {
    if (selectedAppointment) {
      updateMutation.mutate({
        id: selectedAppointment.id,
        patientId: data.patientId,
        bedId: data.bedId,
        notes: data.notes
      });
    }
  };

  // Open edit dialog
  const openEditDialog = (appointment: any) => {
    console.log("Opening edit dialog for appointment:", appointment);
    
    // Make sure we have all the required data for the edit form
    const appointmentData = {
      id: appointment.id,
      schedule_session_id: appointment.schedule_session_id,
      patient_id: appointment.patient_id,
      bed_id: appointment.bed_id,
      notes: appointment.notes,
      date: appointment.date,
      startTime: appointment.start_time,
      endTime: appointment.end_time,
      status: appointment.status,
      centerId
    };
    
    console.log("Prepared appointment data for edit:", appointmentData);
    setSelectedAppointment(appointmentData);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Open create dialog
  const openCreateDialog = () => {
    setSelectedAppointment(null);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  // Format date from ISO to YYYY-MM-DD
  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Format time to remove seconds
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  // Format status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200">Scheduled</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-600 border-yellow-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-600 border-red-200">Cancelled</Badge>;
      case 'no-show':
        return <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">No Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>
            Manage appointments center
          </CardDescription>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Appointment
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Loading appointment slots...</div>
        ) : appointmentSlots && appointmentSlots.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointmentSlots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(slot.date)}
                    </div>
                  </TableCell>
                  <TableCell>{`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}</TableCell>
                  <TableCell>{getStatusBadge(slot.status)}</TableCell>
                  <TableCell>
                    {slot.patientName ? slot.patientName : <span className="text-muted-foreground">None</span>}
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
                            onClick={() => openEditDialog(slot)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Appointment
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />                          

                          {slot.status === 'scheduled' && (
                            <DropdownMenuItem
                              onClick={() => updateMutation.mutate({ id: slot.id, status: 'cancelled' })}
                              className="cursor-pointer text-red-600"
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Cancel Session
                            </DropdownMenuItem>
                          )}

                          {slot.status === 'scheduled' && (
                            <DropdownMenuItem
                              onClick={() => updateMutation.mutate({ id: slot.id, status: 'no-show' })}
                              className="cursor-pointer text-gray-600"
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              No Show
                            </DropdownMenuItem>
                          )}

                          {slot.status === 'in-progress' && (
                            <DropdownMenuItem
                              onClick={() => updateMutation.mutate({ id: slot.id, status: 'completed' })}
                              className="cursor-pointer text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Complete Session
                            </DropdownMenuItem>
                          )}

                          {slot.status === 'cancelled' && (
                            <DropdownMenuItem
                              onClick={() => updateMutation.mutate({ id: slot.id, status: 'scheduled' })}
                              className="cursor-pointer text-blue-600"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Session
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
            <h3 className="text-lg font-medium">No appointment slots</h3>
            <p className="text-sm text-muted-foreground mb-4">
              There are no appointment slots for this center yet.
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Slot
            </Button>
          </div>
        )}
      </CardContent>

      {/* Create/Edit Appointment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Appointment" : "Create Appointment"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Modify the appointment details." : "Add a new appointment for this center."}
            </DialogDescription>
          </DialogHeader>
          <AppointmentSlotForm
            onSubmit={isEditMode ? handleEditAppointment : handleCreateAppointmentSlot}
            defaultValues={isEditMode ? {
              scheduleSessionId: selectedAppointment?.schedule_session_id || '',
              patientId: selectedAppointment?.patient_id || '',
              bedId: selectedAppointment?.bed_id || '',
              notes: selectedAppointment?.notes || '',
              centerId,
              date: selectedAppointment?.date,
              startTime: selectedAppointment?.startTime,
              endTime: selectedAppointment?.endTime,
              status: selectedAppointment?.status
            } : { centerId }}
            isSubmitting={isEditMode ? updateMutation.isPending : createMutation.isPending}
            isEditMode={isEditMode}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AppointmentSlotManagement;
