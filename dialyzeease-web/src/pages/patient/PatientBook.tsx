import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Check, ClipboardList, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import PatientPortalLayout from '@/components/layouts/PatientPortalLayout';
import { getAllCenters } from '@/api/centerApi';
import { getPatientData } from '@/api/patientApi';
import { bookAppointmentForPatient, getAvailableTimeSlots } from '@/api/staffApi';
import { bookRecurringAppointments, bookMultipleAppointments } from '@/api/appointmentApi';
import { sendAppointmentConfirmationEmails } from '@/api/notificationApi';
import SingleDayBooking from '@/components/patient/booking/SingleDayBooking';
import RecurringBooking from '@/components/patient/booking/RecurringBooking';
import DateRangeBooking from '@/components/patient/booking/DateRangeBooking';

// Import PatientProfile from patientApi.ts
import { PatientProfile } from '@/api/patientApi';

interface AppointmentData {
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  centerId: string;
  type: string;
}

const PatientBook = () => {
  // State for appointment data
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [singleDayDate, setSingleDayDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [recurringDates, setRecurringDates] = useState<string[]>([]);
  const [selectedAppointments, setSelectedAppointments] = useState<{date: string, slotId: string}[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isMultipleAppointments, setIsMultipleAppointments] = useState(false);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch patient data
  const { data: patient, isLoading: isLoadingPatient } = useQuery({
    queryKey: ['patientData'],
    queryFn: () => getPatientData(),
  });

  // Get all centers
  const { data: centers = [], isLoading: isLoadingCenters } = useQuery({
    queryKey: ['centers'],
    queryFn: getAllCenters,
  });

  // Mock center hours data for now
  const centerHours = {
    monday: '9:00 AM - 5:00 PM',
    tuesday: '9:00 AM - 5:00 PM',
    wednesday: '9:00 AM - 5:00 PM',
    thursday: '9:00 AM - 5:00 PM',
    friday: '9:00 AM - 5:00 PM',
    saturday: '9:00 AM - 1:00 PM',
    sunday: 'Closed'
  };
  const isLoadingHours = false;
  
  // Book single appointment mutation
  // Helper function to format date for display (e.g., May 1, 2025)
  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const bookMutation = useMutation({
    mutationFn: (appointmentId: string) => {
      if (!patient) throw new Error('Patient data not available');
      // Use the userId property from the PatientProfile interface
      return bookAppointmentForPatient(appointmentId, patient.userId);
    },
    onSuccess: async (_, appointmentId) => {
      toast.success('Appointment booked successfully!');
      
      // Get the selected center from the centers list
      const center = centers.find(c => c.id === selectedCenter);
      if (!center || !patient) {
        console.error('Missing center or patient data for email notification');
      } else {
        try {
          // Get time slot details from the appointmentId
          // In a real implementation, you would fetch the appointment details from the API
          const availableSlots = await getAvailableTimeSlots(center.id, formatDateForApi(singleDayDate));
          const timeSlot = availableSlots.find(slot => slot.id === appointmentId);
          
          // If we can't find the time slot, use default values
          const startTime = timeSlot?.startTime || '09:00';
          const endTime = timeSlot?.endTime || '12:00';
          
          // Fetch center manager email from the database
          // In a real app, you might need to fetch this from a separate API call
          // For now, we'll use a placeholder email
          const managerEmail = 'DialyzeEase" <dialyzeease@gmail.com>'; // Placeholder
          
          // Send email notifications
          await sendAppointmentConfirmationEmails({
            patientId: patient.userId,
            patientName: `${patient.firstName} ${patient.lastName}`,
            patientEmail: patient.email,
            centerId: center.id,
            centerName: center.name,
            centerManagerEmail: managerEmail,
            date: formatDateForDisplay(singleDayDate),
            startTime: startTime,
            endTime: endTime,
            bedCode: 'Assigned at center'
          });
          console.log('Email notifications sent successfully');
        } catch (error) {
          console.error('Failed to send email notifications:', error);
          // Don't show error to user since the booking was successful
        }
      }
      
      setIsConfirmDialogOpen(false);
      navigate('/patient/calendar'); // Redirect to calendar instead of appointments
    },
    onError: (error: any) => {
      toast.error(`Error booking appointment: ${error.message || 'Unknown error'}`);
    }
  });
  
  // Book recurring appointments mutation
  const bookRecurringMutation = useMutation({
    mutationFn: (data: { slotId: string, dates: string[] }) => {
      if (!patient) throw new Error('Patient data not available');
      // Use the userId property from the PatientProfile interface
      return bookRecurringAppointments(data.slotId, patient.userId, data.dates);
    },
    onSuccess: async (_, data) => {
      toast.success('Recurring appointments booked successfully!');
      
      // Get the selected center from the centers list
      const center = centers.find(c => c.id === selectedCenter);
      if (!center || !patient) {
        console.error('Missing center or patient data for email notification');
      } else {
        try {
          // For recurring appointments, we'll send an email for the first date
          // In a real app, you might want to include all dates in the email
          const firstDate = data.dates[0];
          
          // Get time slot details
          const availableSlots = await getAvailableTimeSlots(center.id, formatDateForApi(firstDate));
          const timeSlot = availableSlots.find(slot => slot.id === data.slotId);
          
          // If we can't find the time slot, use default values
          const startTime = timeSlot?.startTime || '09:00';
          const endTime = timeSlot?.endTime || '12:00';
          
          // Fetch center manager email (placeholder for now)
          const managerEmail = 'DialyzeEase" <dialyzeease@gmail.com>';
          
          // Send email notifications for the first appointment
          await sendAppointmentConfirmationEmails({
            patientId: patient.userId,
            patientName: `${patient.firstName} ${patient.lastName}`,
            patientEmail: patient.email,
            centerId: center.id,
            centerName: center.name,
            centerManagerEmail: managerEmail,
            date: formatDateForDisplay(firstDate) + ' (Recurring)',
            startTime: startTime,
            endTime: endTime,
            bedCode: 'Assigned at center'
          });
          console.log('Email notifications sent for recurring appointment');
        } catch (error) {
          console.error('Failed to send email notifications for recurring appointment:', error);
          // Don't show error to user since the booking was successful
        }
      }
      
      setIsConfirmDialogOpen(false);
      navigate('/patient/calendar'); // Redirect to calendar instead of appointments
    },
    onError: (error: any) => {
      toast.error(`Error booking recurring appointments: ${error.message || 'Unknown error'}`);
    }
  });
  
  // Book multiple appointments mutation
  const bookMultipleMutation = useMutation({
    mutationFn: (data: { appointments: {date: string, slotId: string}[] }) => {
      if (!patient) throw new Error('Patient data not available');
      // Use the userId property from the PatientProfile interface
      return bookMultipleAppointments(data.appointments, patient.userId);
    },
    onSuccess: async (_, data) => {
      toast.success('Multiple appointments booked successfully!');
      
      // Get the selected center from the centers list
      const center = centers.find(c => c.id === selectedCenter);
      if (!center || !patient) {
        console.error('Missing center or patient data for email notification');
      } else {
        try {
          // For multiple appointments, we'll send an email for the first appointment
          // In a real app, you might want to include all appointments in the email
          if (data.appointments.length > 0) {
            const firstAppointment = data.appointments[0];
            
            // Get time slot details
            const availableSlots = await getAvailableTimeSlots(center.id, formatDateForApi(firstAppointment.date));
            const timeSlot = availableSlots.find(slot => slot.id === firstAppointment.slotId);
            
            // If we can't find the time slot, use default values
            const startTime = timeSlot?.startTime || '09:00';
            const endTime = timeSlot?.endTime || '12:00';
            
            // Fetch center manager email (placeholder for now)
            const managerEmail = 'DialyzeEase" <dialyzeease@gmail.com>';
            
            // Send email notifications for the first appointment
            await sendAppointmentConfirmationEmails({
              patientId: patient.userId,
              patientName: `${patient.firstName} ${patient.lastName}`,
              patientEmail: patient.email,
              centerId: center.id,
              centerName: center.name,
              centerManagerEmail: managerEmail,
              date: formatDateForDisplay(firstAppointment.date) + 
                   (data.appointments.length > 1 ? ` (+ ${data.appointments.length - 1} more)` : ''),
              startTime: startTime,
              endTime: endTime,
              bedCode: 'Assigned at center'
            });
            console.log('Email notifications sent for multiple appointments');
          }
        } catch (error) {
          console.error('Failed to send email notifications for multiple appointments:', error);
          // Don't show error to user since the booking was successful
        }
      }
      
      setIsConfirmDialogOpen(false);
      navigate('/patient/calendar'); // Redirect to calendar instead of appointments
    },
    onError: (error: any) => {
      toast.error(`Error booking multiple appointments: ${error.message || 'Unknown error'}`);
    }
  });
  
  // Helper function to format date for API
  const formatDateForApi = (dateString: string): string => {
    // Simple date formatter for API
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  // Handle single appointment selection
  const handleAppointmentSelect = (appointmentData: AppointmentData) => {
    setSelectedAppointment(appointmentData);
    setIsRecurring(false);
    setIsMultipleAppointments(false);
    setIsConfirmDialogOpen(true);
  };
  
  // Handle recurring appointment selection
  const handleRecurringAppointmentSelect = (appointmentData: AppointmentData, dates: string[]) => {
    setSelectedAppointment(appointmentData);
    setRecurringDates(dates);
    setIsConfirmDialogOpen(true);
    setIsRecurring(true);
    setIsMultipleAppointments(false);
  };
  
  // Handle multiple appointments selection
  const handleMultipleAppointmentsSelect = (appointmentData: AppointmentData, appointments: {[date: string]: string}) => {
    setSelectedAppointment(appointmentData);
    // Convert appointments object to array format required by API
    const appointmentsArray = Object.entries(appointments).map(([date, slotId]) => ({
      date,
      slotId
    }));
    setSelectedAppointments(appointmentsArray);
    setIsConfirmDialogOpen(true);
    setIsRecurring(false);
    setIsMultipleAppointments(true);
  };
  
  // Confirm booking based on type
  const confirmBooking = () => {
    if (!selectedAppointment || !patient) return;
    
    if (isRecurring) {
      bookRecurringMutation.mutate({
        slotId: selectedAppointment.slotId,
        dates: recurringDates
      });
    } else if (isMultipleAppointments) {
      bookMultipleMutation.mutate({
        appointments: selectedAppointments
      });
    } else {
      // Single appointment
      bookMutation.mutate(selectedAppointment.slotId);
    }
  };

  return (
    <PatientPortalLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-medical-blue">Book an Appointment</h1>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-medical-blue text-medical-blue"
            onClick={() => navigate('/patient/appointments')}
          >
            <ClipboardList className="h-4 w-4" />
            View My Appointments
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Appointment Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="single" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Single Day
                </TabsTrigger>
                <TabsTrigger value="recurring" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recurring
                </TabsTrigger>
                <TabsTrigger value="range" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Range
                </TabsTrigger>
              </TabsList>

              <TabsContent value="single">
                <SingleDayBooking 
                  centers={centers} 
                  isLoadingCenters={isLoadingCenters}
                  selectedCenter={selectedCenter}
                  setSelectedCenter={setSelectedCenter}
                  appointmentDate={singleDayDate}
                  setAppointmentDate={setSingleDayDate}
                  centerHours={{}}
                  handleAppointmentSelect={(appointmentId) => {
                    // Find the appointment data from the ID and pass it to the handler
                    const appointmentData = {
                      slotId: appointmentId,
                      date: singleDayDate, // Use the current selected date
                      startTime: '09:00',
                      endTime: '11:00',
                      centerId: selectedCenter,
                      type: 'dialysis'
                    };
                    handleAppointmentSelect(appointmentData);
                  }}
                  formatDateForApi={formatDateForApi}
                />
              </TabsContent>

              <TabsContent value="recurring">
                <RecurringBooking 
                  centers={centers} 
                  isLoadingCenters={isLoadingCenters}
                  selectedCenter={selectedCenter}
                  setSelectedCenter={setSelectedCenter}
                  appointmentDate={new Date().toISOString().split('T')[0]}
                  setAppointmentDate={(date) => console.log('Date selected:', date)}
                  centerHours={{}}
                  formatDateForApi={formatDateForApi}
                  onAppointmentSelect={(appointmentData, dates) => {
                    handleRecurringAppointmentSelect(appointmentData, dates);
                  }}
                />
              </TabsContent>

              <TabsContent value="range">
                <DateRangeBooking 
                  centers={centers} 
                  isLoadingCenters={isLoadingCenters}
                  selectedCenter={selectedCenter}
                  setSelectedCenter={setSelectedCenter}
                  appointmentDate={new Date().toISOString().split('T')[0]}
                  setAppointmentDate={(date) => console.log('Date selected:', date)}
                  centerHours={{}}
                  formatDateForApi={formatDateForApi}
                  onAppointmentSelect={(appointmentData, appointments) => {
                    handleMultipleAppointmentsSelect(appointmentData, appointments);
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
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
                {isRecurring && (
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mb-4">
                    <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Recurring Appointment
                    </h4>
                    <p className="text-sm text-yellow-700 mb-2">
                      You are booking a recurring appointment for {recurringDates.length} sessions.
                    </p>
                    <div className="text-xs text-yellow-600">
                      First session: {new Date(recurringDates[0]).toLocaleDateString()}<br />
                      Last session: {new Date(recurringDates[recurringDates.length - 1]).toLocaleDateString()}
                    </div>
                  </div>
                )}
                
                {isMultipleAppointments && (
                  <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mb-4">
                    <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Multiple Appointments
                    </h4>
                    <p className="text-sm text-yellow-700">
                      You are booking {Object.keys(selectedAppointments).length} separate appointments.
                    </p>
                  </div>
                )}
                
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
      </div>
    </PatientPortalLayout>
  );
};

export default PatientBook;
