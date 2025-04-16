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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Eye, 
  Edit, 
  Trash, 
  Clock, 
  User, 
  UserRound, 
  Bed 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchAppointmentsByCenter,
  deleteAppointmentSlot,
  Appointment
} from "@/api/appointmentApi";
import { fetchUserById } from "@/api/userApi";
import { fetchCenterById } from "@/api/centerApi";

interface AppointmentListProps {
  centerId?: string;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ centerId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch appointments
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', centerId],
    queryFn: () => centerId 
      ? fetchAppointmentsByCenter(centerId)
      : fetchAppointmentsByCenter('all'),
  });

  // Delete appointment mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAppointmentSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete appointment: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle delete button click
  const handleDeleteAppointment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      deleteMutation.mutate(id);
    }
  };

  // Format status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'no-show':
        return <Badge variant="destructive">No Show</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // View appointment details
  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsDialogOpen(true);
  };

  // Edit appointment
  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
        <CardDescription>
          View and manage all appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Loading appointments...</div>
        ) : appointments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Bed Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {appointment.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(parseISO(appointment.date), 'EEEE')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {`${appointment.startTime} - ${appointment.endTime}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {appointment.patientId || 'None'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <UserRound className="mr-2 h-4 w-4" />
                      {appointment.staffId || 'None'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <UserRound className="mr-2 h-4 w-4" />
                      {appointment.doctorId || 'None'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Bed className="mr-2 h-4 w-4" />
                      {appointment.bedCode || 'Not assigned'}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewDetails(appointment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditAppointment(appointment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md border-dashed">
            <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No appointments found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              There are no appointments to display.
            </p>
          </div>
        )}
      </CardContent>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>
                View detailed information about this appointment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Date:</h3>
                  <p>{selectedAppointment.date}</p>
                </div>
                <div>
                  <h3 className="font-medium">Day:</h3>
                  <p>{format(parseISO(selectedAppointment.date), 'EEEE')}</p>
                </div>
                <div>
                  <h3 className="font-medium">Time:</h3>
                  <p>{`${selectedAppointment.startTime} - ${selectedAppointment.endTime}`}</p>
                </div>
                <div>
                  <h3 className="font-medium">Patient:</h3>
                  <p>{selectedAppointment.patientId || 'None'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Staff:</h3>
                  <p>{selectedAppointment.staffId || 'None'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Doctor:</h3>
                  <p>{selectedAppointment.doctorId || 'None'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Bed Code:</h3>
                  <p>{selectedAppointment.bedCode || 'None'}</p>
                </div>
                <div>
                  <h3 className="font-medium">Status:</h3>
                  <p>{selectedAppointment.status}</p>
                </div>
                <div>
                  <h3 className="font-medium">Type:</h3>
                  <p className="capitalize">{selectedAppointment.type}</p>
                </div>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <h3 className="font-medium">Notes:</h3>
                  <p>{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDetailsDialogOpen(false);
                  handleEditAppointment(selectedAppointment);
                }}
              >
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog would go here */}
      {/* We'll implement this in a separate component */}
    </Card>
  );
};

export default AppointmentList;
