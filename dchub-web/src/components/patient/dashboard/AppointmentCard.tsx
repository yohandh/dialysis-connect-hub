
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppointmentStatusBadge from '@/components/AppointmentStatusBadge';
import { Appointment } from '@/data/appointmentData';

interface AppointmentCardProps {
  nextAppointment: Appointment | null;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ nextAppointment }) => {
  return (
    <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-blue-100">
        <CardTitle className="text-sm font-medium text-medical-blue">
          Next Appointment
        </CardTitle>
        <Calendar className="h-4 w-4 text-medical-blue" />
      </CardHeader>
      <CardContent>
        {nextAppointment ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Date:</span>
              <span className="font-medium">{nextAppointment.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Time:</span>
              <span className="font-medium">{nextAppointment.startTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Type:</span>
              <span className="font-medium capitalize">{nextAppointment.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status:</span>
              <AppointmentStatusBadge status={nextAppointment.status} />
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">No upcoming appointments</p>
            <Button asChild size="sm" className="mt-2 bg-medical-blue text-white hover:bg-medical-blue/90">
              <Link to="/patient/book">Book Now</Link>
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 bg-blue-50/50">
        <Link to="/patient/calendar" className="text-xs text-center w-full text-medical-blue hover:underline">
          View all appointments
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AppointmentCard;
