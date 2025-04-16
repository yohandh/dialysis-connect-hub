
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
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
import { Plus, Calendar, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAppointmentSlotsByCenter,
  createAppointmentSlot,
  deleteAppointmentSlot,
  CreateAppointmentSlotRequest,
  AppointmentSlot
} from "@/api/staffDialysisApi";
import AppointmentSlotForm from './AppointmentSlotForm';

interface AppointmentSlotManagerProps {
  centerId: string;
}

const AppointmentSlotManager: React.FC<AppointmentSlotManagerProps> = ({ centerId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch appointment slots for the given center
  const { data: appointmentSlots, isLoading } = useQuery({
    queryKey: ['appointmentSlots', centerId],
    queryFn: () => getAppointmentSlotsByCenter(centerId),
  });

  // Create new appointment slot mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAppointmentSlotRequest) => createAppointmentSlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointmentSlots', centerId] });
      toast({
        title: "Success",
        description: "Appointment slot created successfully",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create appointment slot: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete appointment slot mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAppointmentSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointmentSlots', centerId] });
      toast({
        title: "Success",
        description: "Appointment slot deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete appointment slot: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleCreateAppointmentSlot = (data: CreateAppointmentSlotRequest) => {
    createMutation.mutate({ ...data, centerId });
  };

  // Handle delete button click
  const handleDeleteAppointmentSlot = (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment slot?")) {
      deleteMutation.mutate(id);
    }
  };

  // Format status badge
  const getStatusBadge = (status: AppointmentSlot['status']) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline">Available</Badge>;
      case 'booked':
        return <Badge>Booked</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'canceled':
        return <Badge variant="destructive">Canceled</Badge>;
      default:
        return null;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
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
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Slot
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
                <TableHead>Type</TableHead>
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
                  <TableCell>{`${slot.startTime} - ${slot.endTime}`}</TableCell>
                  <TableCell className="capitalize">{slot.type}</TableCell>
                  <TableCell>{getStatusBadge(slot.status)}</TableCell>
                  <TableCell>
                    {slot.patientId ? slot.patientId : <span className="text-muted-foreground">None</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    {slot.status === 'available' && (
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAppointmentSlot(slot.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
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
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Slot
            </Button>
          </div>
        )}
      </CardContent>

      {/* Create Appointment Slot Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Appointment Slot</DialogTitle>
            <DialogDescription>
              Add a new appointment slot for this center.
            </DialogDescription>
          </DialogHeader>
          <AppointmentSlotForm
            onSubmit={handleCreateAppointmentSlot}
            defaultValues={{ centerId }}
            isSubmitting={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AppointmentSlotManager;
