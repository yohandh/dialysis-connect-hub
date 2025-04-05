
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Check, ClipboardList, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import PatientPortalLayout from '@/components/layouts/PatientPortalLayout';
import { getAllCenters } from '@/api/centerApi';
import { getPatientData } from '@/api/patientApi';
import { getAvailableTimeSlots, bookAppointmentForPatient } from '@/api/staffApi';
import { Appointment } from '@/data/appointmentData';
import AppointmentTimeslotGrid from '@/components/patient/AppointmentTimeslotGrid';

const PatientBook = () => {
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get patient data
  const { data: patient } = useQuery({
    queryKey: ['patientData'],
    queryFn: getPatientData,
  });

  // Get all centers
  const { data: centers = [] } = useQuery({
    queryKey: ['centers'],
    queryFn: getAllCenters,
  });

  // Get available time slots for selected center and date
  const { 
    data: availableSlots = [], 
    isLoading: isLoadingSlots 
  } = useQuery({
    queryKey: ['availableSlots', selectedCenter, appointmentDate],
    queryFn: () => getAvailableTimeSlots(selectedCenter, appointmentDate),
    enabled: !!selectedCenter && !!appointmentDate,
  });

  // Book appointment mutation
  const bookMutation = useMutation({
    mutationFn: (appointmentId: string) => 
      bookAppointmentForPatient(appointmentId, patient?.userId || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientAppointments'] });
      toast("Appointment booked successfully");
      setIsConfirmDialogOpen(false);
      // Navigate to calendar page after successful booking
      setTimeout(() => navigate('/patient/calendar'), 1000);
    },
    onError: (error: any) => {
      toast(`Failed to book appointment: ${error.message}`);
    }
  });

  const handleAppointmentSelect = (appointmentId: string) => {
    const appointment = availableSlots.find(slot => slot.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsConfirmDialogOpen(true);
    }
  };

  const confirmBooking = () => {
    if (selectedAppointment) {
      bookMutation.mutate(selectedAppointment.id);
    }
  };

  return (
    <PatientPortalLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h1>
        
        <Tabs defaultValue="appointment" className="mb-6">
          <TabsList className="bg-medical-blue/10">
            <TabsTrigger value="appointment" className="data-[state=active]:bg-medical-blue data-[state=active]:text-white">
              Book Appointment
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-medical-blue data-[state=active]:text-white">
              Appointment Information
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointment">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card className="border-medical-blue/20">
                  <CardHeader className="bg-medical-blue/5 pb-4">
                    <CardTitle className="text-lg text-medical-blue flex items-center">
                      <MapPin className="h-5 w-5 mr-2" /> Select Location & Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Dialysis Center</label>
                      <Select
                        value={selectedCenter}
                        onValueChange={setSelectedCenter}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a center" />
                        </SelectTrigger>
                        <SelectContent>
                          {centers && centers.map(center => (
                            <SelectItem key={center.id} value={center.id}>
                              {center.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Appointment Date</label>
                      <Input 
                        type="date" 
                        value={appointmentDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                      />
                    </div>
                    
                    {selectedCenter && (
                      <div className="pt-4">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <Clock className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-blue-800">Center Hours</h3>
                              <div className="mt-2 text-sm text-blue-700">
                                <p>Monday - Friday: 6:00 AM - 8:00 PM</p>
                                <p>Saturday: 7:00 AM - 5:00 PM</p>
                                <p>Sunday: Closed</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card className="border-medical-blue/20 h-full">
                  <CardHeader className="bg-medical-blue/5 pb-4">
                    <CardTitle className="text-lg text-medical-blue flex items-center">
                      <Clock className="h-5 w-5 mr-2" /> Available Time Slots
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {selectedCenter ? (
                      <AppointmentTimeslotGrid
                        timeSlots={availableSlots}
                        onSelect={handleAppointmentSelect}
                        isLoading={isLoadingSlots}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">No Center Selected</h3>
                        <p className="text-gray-500 mt-2">
                          Please select a dialysis center to view available appointment times.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info">
            <Card>
              <CardHeader className="bg-medical-blue/5">
                <CardTitle className="text-medical-blue flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2" /> Appointment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Before Your Appointment</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Please arrive 15 minutes prior to your scheduled appointment time.</li>
                    <li>Bring your ID and insurance card to every appointment.</li>
                    <li>Continue to take your prescribed medications unless otherwise directed.</li>
                    <li>Wear comfortable, loose-fitting clothing that allows easy access to your dialysis access site.</li>
                    <li>Eat a light meal before your appointment unless your doctor has instructed otherwise.</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Cancellation Policy</h3>
                  <p>
                    If you need to cancel or reschedule your appointment, please do so at least 24 hours in advance.
                    This allows us to offer the time slot to another patient in need.
                  </p>
                  <p>
                    Repeated no-shows may affect your ability to schedule future appointments.
                  </p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Need assistance?</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          If you have any questions or need help with your appointment, please call our
                          patient support line at (555) 123-4567.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Booking Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>
              Please confirm that you would like to book this appointment.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-4 rounded-md space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Date:</span>
                  <span className="text-sm">{selectedAppointment.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Time:</span>
                  <span className="text-sm">{selectedAppointment.startTime} - {selectedAppointment.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Type:</span>
                  <span className="text-sm capitalize">{selectedAppointment.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Center:</span>
                  <span className="text-sm">
                    {centers && centers.find(c => c.id === selectedAppointment.centerId)?.name || 'Unknown Center'}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-medical-blue hover:bg-medical-blue/90"
                  onClick={confirmBooking}
                  disabled={bookMutation.isPending}
                >
                  {bookMutation.isPending ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PatientPortalLayout>
  );
};

export default PatientBook;
