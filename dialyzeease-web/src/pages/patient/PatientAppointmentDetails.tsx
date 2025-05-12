
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Phone, Mail, User, FileText, AlertTriangle } from 'lucide-react';
import PatientPortalLayout from '@/components/layouts/PatientPortalLayout';
import { Separator } from '@/components/ui/separator';
import AppointmentStatusBadge from '@/components/AppointmentStatusBadge';
import { getAppointmentById } from '@/data/appointmentData';
import { getCenterById } from '@/data/centerData';

// Updated to use Record<string, string> to satisfy the constraint
interface ParamTypes extends Record<string, string> {
  id: string;
}

const PatientAppointmentDetails = () => {
  const { id } = useParams<ParamTypes>();
  const [appointmentId, setAppointmentId] = useState<string | undefined>(id);
  
  useEffect(() => {
    if (id && id !== ':id') {
      setAppointmentId(id);
    }
  }, [id]);
  
  const {
    data: appointment,
    isLoading,
    error
  } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => appointmentId ? getAppointmentById(appointmentId) : undefined,
    enabled: !!appointmentId && appointmentId !== ':id'
  });
  
  const center = appointment?.centerId 
    ? getCenterById(appointment.centerId) 
    : undefined;
  
  if (isLoading) {
    return (
      <PatientPortalLayout>
        <div className="container max-w-4xl mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading appointment details...</p>
            </div>
          </div>
        </div>
      </PatientPortalLayout>
    );
  }
  
  if (error || !appointmentId || appointmentId === ':id') {
    return (
      <PatientPortalLayout>
        <div className="container max-w-4xl mx-auto p-4">
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-destructive">Error</h3>
                <div className="mt-2 text-sm text-destructive/80">
                  <p>Unable to find appointment details. The appointment may not exist or has been removed.</p>
                </div>
                <div className="mt-4">
                  <Link to="/patient/calendar">
                    <Button variant="outline" size="sm">Return to Calendar</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PatientPortalLayout>
    );
  }
  
  if (!appointment) {
    return (
      <PatientPortalLayout>
        <div className="container max-w-4xl mx-auto p-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Not Found</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>We couldn't find the appointment you're looking for.</p>
                </div>
                <div className="mt-4">
                  <Link to="/patient/calendar">
                    <Button variant="outline" size="sm">Return to Calendar</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PatientPortalLayout>
    );
  }

  const handleCancelAppointment = () => {
    toast("This is a demo: Appointment would be canceled here");
  };
  
  const handleRescheduleAppointment = () => {
    toast("This is a demo: Appointment would be rescheduled here");
  };

  return (
    <PatientPortalLayout>
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link to="/patient/calendar">
              <Button variant="ghost" size="sm" className="mb-2">
                ← Back to Calendar
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Appointment Details</h1>
          </div>
          <AppointmentStatusBadge status={appointment.status} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-muted-foreground">
                      {appointment.date}, {appointment.startTime} - {appointment.endTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Appointment Type</p>
                    <p className="text-muted-foreground capitalize">{appointment.type}</p>
                  </div>
                </div>
                
                {appointment.notes && (
                  <div className="bg-muted/50 p-4 rounded-md">
                    <p className="font-medium mb-2">Notes</p>
                    <p className="text-sm">{appointment.notes}</p>
                  </div>
                )}
                
                {appointment.status === 'booked' && (
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1" onClick={handleRescheduleAppointment}>
                      Reschedule
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={handleCancelAppointment}>
                      Cancel Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            {center && (
              <Card>
                <CardHeader>
                  <CardTitle>Facility Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">{center.name}</p>
                    <Badge variant="outline" className="mt-1">{center.type || "Dialysis Center"}</Badge>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p>{center.address.street}</p>
                      <p>{center.address.city}, {center.address.state} {center.address.zipCode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{center.phone}</p>
                  </div>
                  
                  {center.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{center.email}</p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div>
                    <p className="font-medium text-sm mb-2">Primary Staff</p>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">Dr. Sarah Johnson</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Link to={`/centers/${center.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Center Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PatientPortalLayout>
  );
};

export default PatientAppointmentDetails;
