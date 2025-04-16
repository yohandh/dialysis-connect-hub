
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameMonth, addMonths, subMonths } from 'date-fns';
import PatientPortalLayout from '@/components/layouts/PatientPortalLayout';
import AppointmentStatusBadge from '@/components/AppointmentStatusBadge';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchAppointmentsByPatient, cancelAppointment } from '@/api/appointmentApi';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PatientCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cancelingAppointmentId, setCancelingAppointmentId] = useState<string | null>(null);
  
  // Fetch appointments
  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['patientAppointments'],
    queryFn: () => fetchAppointmentsByPatient('user-001') // In a real app, this would be the current user's ID
  });
  
  // Mutation for canceling an appointment
  const cancelAppointmentMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      toast({
        title: "Appointment canceled",
        description: "Your appointment has been successfully canceled."
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleCancelAppointment = (appointmentId: string) => {
    cancelAppointmentMutation.mutate(appointmentId);
    setCancelingAppointmentId(null);
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={prevMonth} className="border-medical-blue text-medical-blue hover:bg-medical-blue/10">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold text-xl text-medical-blue">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button variant="outline" size="icon" onClick={nextMonth} className="border-medical-blue text-medical-blue hover:bg-medical-blue/10">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };
  
  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-sm font-medium py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };
  
  const renderCells = () => {
    if (!appointments || isLoading) {
      return <div className="text-center py-10">Loading calendar...</div>;
    }
    
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = monthStart;
    const endDate = monthEnd;
    
    const days = eachDayOfInterval({
      start: startDate,
      end: endDate
    });
    
    let formattedDays = days.map(day => {
      // Get the day of the week (0 = Sunday, 6 = Saturday)
      const dayOfWeek = getDay(day);
      
      // Find appointments for this day
      const dayAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return format(appointmentDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      });
      
      return {
        date: day,
        dayOfWeek,
        dayAppointments
      };
    });
    
    // Fill in days before the start of the month with null
    const firstDayOfWeek = getDay(monthStart);
    for (let i = 0; i < firstDayOfWeek; i++) {
      formattedDays = [{
        date: null,
        dayOfWeek: i,
        dayAppointments: []
      }, ...formattedDays];
    }
    
    // Create weeks
    let cells = [];
    let rows_count = Math.ceil(formattedDays.length / 7);
    
    for (let i = 0; i < rows_count; i++) {
      let row = [];
      for (let j = 0; j < 7; j++) {
        const index = i * 7 + j;
        if (index < formattedDays.length) {
          row.push(formattedDays[index]);
        } else {
          row.push({
            date: null,
            dayOfWeek: j,
            dayAppointments: []
          });
        }
      }
      cells.push(row);
    }
    
    return (
      <div>
        {cells.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 gap-2 mb-2">
            {row.map((day, dayIndex) => {
              if (!day.date) {
                return <div key={dayIndex} className="h-24 border rounded-md bg-gray-50"></div>;
              }
              
              return (
                <div 
                  key={dayIndex} 
                  className={`h-24 border rounded-md overflow-hidden ${
                    isToday(day.date) ? 'bg-blue-50 border-blue-200' : ''
                  } ${!isSameMonth(day.date, currentMonth) ? 'text-gray-300' : ''}`}
                >
                  <div className="p-1">
                    <div className="text-right text-sm font-medium">
                      {format(day.date, 'd')}
                    </div>
                    <div className="mt-1">
                      {day.dayAppointments.map((appointment, i) => (
                        <div key={i} className="text-xs mb-1 truncate bg-white p-1 rounded border">
                          <div className="flex items-center justify-between">
                            <span>{appointment.startTime}</span>
                            <AppointmentStatusBadge status={appointment.status} />
                          </div>
                          <div className="truncate capitalize">{appointment.type}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  
  const renderAppointmentsList = () => {
    if (!appointments || isLoading) {
      return (
        <Card className="mt-6">
          <CardContent className="py-10">
            <div className="text-center">Loading appointments...</div>
          </CardContent>
        </Card>
      );
    }
    
    // Get all appointments for the current month
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    
    const monthAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= monthStart && appointmentDate <= monthEnd;
    });
    
    // Sort by date
    monthAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return (
      <Card className="mt-6 border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="text-medical-blue">Appointments for {format(currentMonth, 'MMMM yyyy')}</CardTitle>
          <CardDescription>List view of all scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthAppointments.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No appointments scheduled for this month.</p>
            ) : (
              monthAppointments.map((appointment) => (
                <div key={appointment.id} className="flex justify-between items-center pb-4 border-b last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium capitalize">{appointment.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')} at {appointment.startTime}
                    </div>
                    <div className="text-sm">Center ID: {appointment.centerId}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AppointmentStatusBadge status={appointment.status} />
                    
                    {appointment.status === 'booked' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50">Cancel</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this appointment? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No, keep appointment</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleCancelAppointment(appointment.id)} className="bg-medical-blue hover:bg-medical-blue/90">
                              Yes, cancel appointment
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-blue-50/50">
          <Button asChild className="w-full bg-medical-blue text-white hover:bg-medical-blue/90">
            <Link to="/patient/book">Book New Appointment</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <PatientPortalLayout>
      <div className="space-y-6 bg-blue-50 p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-medical-blue">Appointment Calendar</h1>
          <Button asChild className="bg-medical-blue text-white hover:bg-medical-blue/90">
            <Link to="/patient/book">
              Book Appointment
            </Link>
          </Button>
        </div>
        
        <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-blue-100">
            <CardTitle className="text-medical-blue">Calendar View</CardTitle>
            <CardDescription>Your scheduled dialysis appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {renderHeader()}
              {renderDays()}
              {renderCells()}
            </div>
          </CardContent>
        </Card>
        
        {renderAppointmentsList()}
      </div>
    </PatientPortalLayout>
  );
};

export default PatientCalendar;
