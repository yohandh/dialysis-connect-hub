
import React, { useState, useEffect } from 'react';
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
import { DialysisCenter } from '@/types/centerTypes';

const PatientBook = () => {
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [centerHours, setCenterHours] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get patient data
  const { data: patient } = useQuery({
    queryKey: ['patientData'],
    queryFn: getPatientData,
  });

  // Get all centers
  const { data: centers = [], isLoading: isLoadingCenters } = useQuery({
    queryKey: ['centers'],
    queryFn: getAllCenters,
  });
  
  // Set center hours when a center is selected
  useEffect(() => {
    if (selectedCenter && centers.length > 0) {
      const center = centers.find(c => c.id === selectedCenter);
      if (center) {
        // Check if center has hours in the new format
        if (center.hours) {
          const hoursMap: {[key: string]: string} = {};
          center.hours.forEach(hour => {
            hoursMap[hour.day] = `${hour.openTime} - ${hour.closeTime}`;
          });
          setCenterHours(hoursMap);
        } 
        // Check if center has hours in the centerHours format
        else if (center.centerHours && typeof center.centerHours === 'object' && !Array.isArray(center.centerHours)) {
          const centerHoursObj = center.centerHours as Record<string, string>;
          setCenterHours({
            'Monday': centerHoursObj.monday,
            'Tuesday': centerHoursObj.tuesday,
            'Wednesday': centerHoursObj.wednesday,
            'Thursday': centerHoursObj.thursday,
            'Friday': centerHoursObj.friday,
            'Saturday': centerHoursObj.saturday,
            'Sunday': centerHoursObj.sunday
          });
        }
      }
    }
  }, [selectedCenter, centers]);

  // Get available time slots for selected center and date
  const { 
    data: availableSlots = [], 
    isLoading: isLoadingSlots,
    refetch: refetchSlots
  } = useQuery({
    queryKey: ['availableSlots', selectedCenter, appointmentDate],
    queryFn: () => getAvailableTimeSlots(selectedCenter, appointmentDate),
    enabled: !!selectedCenter && !!appointmentDate,
  });
  
  // Refetch slots when date or center changes
  useEffect(() => {
    if (selectedCenter && appointmentDate) {
      refetchSlots();
      console.log('Fetching slots for center:', selectedCenter, 'and date:', appointmentDate);
    }
  }, [selectedCenter, appointmentDate, refetchSlots]);
  
  // Log available slots for debugging
  useEffect(() => {
    if (availableSlots.length > 0) {
      console.log('Available slots:', availableSlots);
    } else if (selectedCenter && appointmentDate) {
      console.log('No available slots found for the selected date and center');
    }
  }, [availableSlots, selectedCenter, appointmentDate]);

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
      <div className="space-y-6 bg-blue-50 p-6 rounded-lg">
        <h1 className="text-3xl font-bold tracking-tight text-medical-blue">Book an Appointment</h1>
        
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
                <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="border-b border-blue-100">
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
                          {isLoadingCenters ? (
                            <SelectItem value="loading" disabled>Loading centers...</SelectItem>
                          ) : centers && centers.length > 0 ? (
                            centers.map(center => (
                              <SelectItem key={center.id} value={center.id}>
                                {center.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No centers available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Appointment Date</label>
                      <Input 
                        type="date" 
                        value={appointmentDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          setAppointmentDate(e.target.value);
                          console.log('Date selected:', e.target.value);
                        }}
                      />
                    </div>
                    
                    {selectedCenter && (
                      <div className="pt-4">
                        <div className="bg-blue-50 border-l-4 border-medical-blue p-4 rounded">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <Clock className="h-5 w-5 text-medical-blue" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-medical-blue">Center Hours</h3>
                              <div className="mt-2 text-sm text-medical-blue/80">
                                {Object.keys(centerHours).length > 0 ? (
                                  <>
                                    <p>Monday: {centerHours['Monday'] || '6:00 AM - 8:00 PM'}</p>
                                    <p>Tuesday: {centerHours['Tuesday'] || '6:00 AM - 8:00 PM'}</p>
                                    <p>Wednesday: {centerHours['Wednesday'] || '6:00 AM - 8:00 PM'}</p>
                                    <p>Thursday: {centerHours['Thursday'] || '6:00 AM - 8:00 PM'}</p>
                                    <p>Friday: {centerHours['Friday'] || '6:00 AM - 8:00 PM'}</p>
                                    <p>Saturday: {centerHours['Saturday'] || '7:00 AM - 5:00 PM'}</p>
                                    <p>Sunday: {centerHours['Sunday'] || 'Closed'}</p>
                                  </>
                                ) : (
                                  <>
                                    <p>Monday: 6:00 AM - 10:00 PM</p>
                                    <p>Tuesday: 6:00 AM - 6:00 PM</p>
                                    <p>Wednesday: 6:00 AM - 10:00 PM</p>
                                    <p>Thursday: 6:00 AM - 6:00 PM</p>
                                    <p>Friday: 6:00 AM - 10:00 PM</p>
                                    <p>Saturday: 6:00 AM - 4:00 PM</p>
                                    <p>Sunday: 6:00 AM - 4:00 PM</p>
                                  </>
                                )}
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
                <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow h-full">
                  <CardHeader className="border-b border-blue-100">
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
            <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="border-b border-blue-100">
                <CardTitle className="text-medical-blue">Select Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-medical-blue">What to Bring</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Please arrive 15 minutes prior to your scheduled appointment time.</li>
                    <li>Bring your ID and insurance card to every appointment.</li>
                    <li>Continue to take your prescribed medications unless otherwise directed.</li>
                    <li>Wear comfortable, loose-fitting clothing that allows easy access to your dialysis access site.</li>
                    <li>Eat a light meal before your appointment unless your doctor has instructed otherwise.</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-medical-blue">Cancellation Policy</h3>
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
                      <Check className="h-5 w-5 text-medical-blue" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-medical-blue">Need assistance?</h3>
                      <div className="mt-2 text-sm text-medical-blue/80">
                        <p>
                          If you have any questions or need help with your appointment, please call our
                          patient support line at (94) 11 242 2335.
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
              <div className="bg-blue-50 p-4 rounded-md space-y-3 border border-blue-100">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-medical-blue/70">Date:</span>
                  <span className="text-sm">{selectedAppointment.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-medical-blue/70">Time:</span>
                  <span className="text-sm">{selectedAppointment.startTime} - {selectedAppointment.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-medical-blue/70">Type:</span>
                  <span className="text-sm capitalize">{selectedAppointment.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-medical-blue/70">Center:</span>
                  <span className="text-sm">
                    {centers && centers.find(c => c.id === selectedAppointment.centerId)?.name || 'Unknown Center'}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} className="border-medical-blue text-medical-blue hover:bg-medical-blue/10">
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
