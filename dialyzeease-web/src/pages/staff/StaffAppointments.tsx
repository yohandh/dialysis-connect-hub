import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Filter, Plus, Search, Users, CheckCircle2, X, Calendar as CalendarIcon, UserPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppointmentStatusBadge from '@/components/AppointmentStatusBadge';
import PortalLayout from '@/components/layouts/PortalLayout';
import { 
  getAppointmentsByCenter, 
  createAppointmentSlot, 
  completeAppointment, 
  cancelAppointment, 
  getAssignedCenters,
  getPatientName,
  CreateAppointmentSlotRequest,
  bookAppointmentForPatient,
  getAllPatients
} from '@/api/staffApi';
import AppointmentSlotForm, { AppointmentSlotFormValues } from '@/components/staff/AppointmentSlotForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const navLinks = [
  { name: 'Dashboard', path: '/staff/dashboard', icon: <Calendar className="h-5 w-5" /> },
  { name: 'Appointments', path: '/staff/appointments', icon: <Clock className="h-5 w-5" /> },
  { name: 'Patients', path: '/staff/patients', icon: <Users className="h-5 w-5" /> }
];

const StaffAppointments = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: centers = [] } = useQuery({
    queryKey: ['assignedCenters'],
    queryFn: () => getAssignedCenters('staff-001'),
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['allPatients'],
    queryFn: getAllPatients,
  });

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['staffAppointments', selectedCenter, selectedDate],
    queryFn: () => getAppointmentsByCenter(selectedCenter),
    enabled: !!selectedCenter,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAppointmentSlotRequest) => createAppointmentSlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffAppointments', selectedCenter] });
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

  const bookMutation = useMutation({
    mutationFn: ({ appointmentId, patientId }: { appointmentId: string, patientId: string }) => 
      bookAppointmentForPatient(appointmentId, patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffAppointments', selectedCenter] });
      toast({
        title: "Success",
        description: "Appointment booked successfully for patient",
      });
      setIsBookingDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to book appointment: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (appointmentId: string) => completeAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffAppointments', selectedCenter] });
      toast({
        title: "Success",
        description: "Appointment marked as completed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to complete appointment: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: string) => cancelAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffAppointments', selectedCenter] });
      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to cancel appointment: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateAppointment = (data: CreateAppointmentSlotRequest) => {
    const appointmentData = {
      ...data,
      centerId: data.centerId || selectedCenter
    };
    
    createMutation.mutate(appointmentData);
  };

  const handleBookForPatient = (patientId: string) => {
    if (selectedAppointment && patientId) {
      bookMutation.mutate({ appointmentId: selectedAppointment, patientId });
    }
  };

  const openBookingDialog = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setIsBookingDialogOpen(true);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const patientName = appointment.patientId ? getPatientName(appointment.patientId).toLowerCase() : "";
    const matchesSearch = patientName.includes(search.toLowerCase()) || 
                          appointment.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesDate = appointment.date === selectedDate;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <PortalLayout 
      portalName="Staff Portal"
      navLinks={navLinks}
      userName="Sarah Johnson"
      userRole="Nephrologist"
      userImage="https://randomuser.me/api/portraits/women/44.jpg"
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-dark-slate">Appointments</h1>
          <Button 
            className="bg-medical-blue hover:bg-medical-blue/90"
            onClick={() => setIsDialogOpen(true)}
            disabled={!selectedCenter}
          >
            <Plus className="mr-2 h-4 w-4" /> New Appointment
          </Button>
        </div>
        
        <Card className="mb-6 border-medical-blue/20">
          <CardHeader className="bg-medical-blue/5">
            <CardTitle className="text-medical-blue">Select Dialysis Center</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full md:w-[300px]">
                <Select
                  value={selectedCenter}
                  onValueChange={setSelectedCenter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a center" />
                  </SelectTrigger>
                  <SelectContent>
                    {centers.map(center => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-[300px]">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {selectedCenter ? (
          <Card className="border-medical-blue/20">
            <CardHeader className="bg-medical-blue/5">
              <CardTitle className="text-medical-blue">Manage Appointments</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="upcoming">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="available">Available Slots</TabsTrigger>
                </TabsList>
                
                <div className="flex flex-col md:flex-row gap-4 my-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search appointments"
                      className="pl-8"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="booked">Booked</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" /> Filters
                    </Button>
                  </div>
                </div>
                
                <TabsContent value="upcoming">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Loading appointments...
                          </TableCell>
                        </TableRow>
                      ) : filteredAppointments.filter(apt => 
                          apt.status === 'booked' && 
                          new Date(apt.date) >= new Date()
                        ).length > 0 ? (
                        filteredAppointments
                          .filter(apt => 
                            apt.status === 'booked' && 
                            new Date(apt.date) >= new Date()
                          )
                          .map(appointment => (
                            <TableRow key={appointment.id}>
                              <TableCell>{appointment.date}</TableCell>
                              <TableCell>
                                {appointment.startTime} - {appointment.endTime}
                              </TableCell>
                              <TableCell className="font-medium">
                                {appointment.patientId ? getPatientName(appointment.patientId) : "Available Slot"}
                              </TableCell>
                              <TableCell className="capitalize">{appointment.type}</TableCell>
                              <TableCell>
                                <AppointmentStatusBadge status={appointment.status} />
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => completeMutation.mutate(appointment.id)}
                                    title="Mark as completed"
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => cancelMutation.mutate(appointment.id)}
                                    title="Cancel appointment"
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No upcoming appointments found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="past">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Loading appointments...
                          </TableCell>
                        </TableRow>
                      ) : filteredAppointments.filter(apt => 
                          (apt.status === 'completed' || apt.status === 'canceled') ||
                          (new Date(apt.date) < new Date())
                        ).length > 0 ? (
                        filteredAppointments
                          .filter(apt => 
                            (apt.status === 'completed' || apt.status === 'canceled') ||
                            (new Date(apt.date) < new Date())
                          )
                          .map(appointment => (
                            <TableRow key={appointment.id}>
                              <TableCell>{appointment.date}</TableCell>
                              <TableCell>
                                {appointment.startTime} - {appointment.endTime}
                              </TableCell>
                              <TableCell className="font-medium">
                                {appointment.patientId ? getPatientName(appointment.patientId) : "No Patient"}
                              </TableCell>
                              <TableCell className="capitalize">{appointment.type}</TableCell>
                              <TableCell>
                                <AppointmentStatusBadge status={appointment.status} />
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No past appointments found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="available">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Loading appointments...
                          </TableCell>
                        </TableRow>
                      ) : filteredAppointments.filter(apt => apt.status === 'available').length > 0 ? (
                        filteredAppointments
                          .filter(apt => apt.status === 'available')
                          .map(appointment => (
                            <TableRow key={appointment.id}>
                              <TableCell>{appointment.date}</TableCell>
                              <TableCell>
                                {appointment.startTime} - {appointment.endTime}
                              </TableCell>
                              <TableCell className="capitalize">{appointment.type}</TableCell>
                              <TableCell>
                                <AppointmentStatusBadge status={appointment.status} />
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openBookingDialog(appointment.id)}
                                >
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Book for Patient
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No available slots found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No Center Selected</h3>
                <p className="mt-1 text-gray-500">Please select a center to view and manage appointments.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Appointment Slot</DialogTitle>
            <DialogDescription>
              Create a new appointment slot for patients to book or assign it directly to a patient.
            </DialogDescription>
          </DialogHeader>
          <AppointmentSlotForm
            onSubmit={handleCreateAppointment}
            defaultValues={{ centerId: selectedCenter, date: selectedDate }}
            isSubmitting={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Appointment for Patient</DialogTitle>
            <DialogDescription>
              Select a patient to book this appointment slot.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select
              onValueChange={handleBookForPatient}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.userId} value={patient.userId}>
                    {patient.firstName && patient.lastName 
                      ? `${patient.firstName} ${patient.lastName}`
                      : `Patient ${patient.userId}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
};

export default StaffAppointments;
