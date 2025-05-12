
import React from 'react';
import { Info, Calendar, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Appointment } from '@/data/appointmentData';
import { format } from 'date-fns';

interface DashboardAlertProps {
  nextAppointment: Appointment | null;
}

const DashboardAlert: React.FC<DashboardAlertProps> = ({ nextAppointment }) => {
  // Don't show the alert if there's no upcoming appointment
  if (!nextAppointment) {
    return null;
  }
  
  // Format date and time for display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch (e) {
      return dateStr; // Fallback to original string if parsing fails
    }
  };
  
  const formatTime = (timeStr: string) => {
    try {
      // Handle time format like "09:00:00"
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return format(date, 'h:mm a');
    } catch (e) {
      return timeStr; // Fallback to original string if parsing fails
    }
  };
  
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-medical-blue" />
      <AlertTitle className="text-medical-blue font-semibold">Your next visit is scheduled</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{formatDate(nextAppointment.date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{formatTime(nextAppointment.startTime)} - {formatTime(nextAppointment.endTime)}</span>
          </div>
          <p className="text-sm mt-1">
            Please remember to bring your medication list and arrive 15 minutes early.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DashboardAlert;
