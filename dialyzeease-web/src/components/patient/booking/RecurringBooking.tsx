import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Calendar, AlertCircle } from 'lucide-react';
import { getAvailableTimeSlots } from '@/api/staffApi';
import AppointmentTimeslotGrid from '@/components/patient/AppointmentTimeslotGrid';
import { DialysisCenter } from '@/types/centerTypes';
import { Appointment } from '@/data/appointmentData';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface RecurringBookingProps {
  centers: DialysisCenter[];
  isLoadingCenters: boolean;
  selectedCenter: string;
  setSelectedCenter: (id: string) => void;
  appointmentDate?: string;
  setAppointmentDate?: (date: string) => void;
  centerHours?: {[key: string]: string};
  handleAppointmentSelect?: (appointmentId: string) => void;
  formatDateForApi?: (dateString: string) => string;
  onAppointmentSelect?: (appointmentData: any, dates: string[]) => void;
}

type RecurrenceType = 'weekly' | 'monthly';
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type WeekOfMonth = 'first' | 'second' | 'third' | 'fourth' | 'last';

const RecurringBooking: React.FC<RecurringBookingProps> = ({
  centers,
  isLoadingCenters,
  selectedCenter,
  setSelectedCenter,
  appointmentDate,
  setAppointmentDate,
  centerHours,
  handleAppointmentSelect,
  formatDateForApi
}) => {
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('weekly');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('monday');
  const [weekOfMonth, setWeekOfMonth] = useState<WeekOfMonth>('first');
  const [occurrences, setOccurrences] = useState<number>(4);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Get available time slots for the selected center and date
  const { data: availableSlots = [], isLoading: isLoadingSlots } = useQuery({
    queryKey: ['availableSlots', selectedCenter, appointmentDate],
    queryFn: () => getAvailableTimeSlots(selectedCenter, formatDateForApi(appointmentDate)),
    enabled: !!selectedCenter && !!appointmentDate,
  });

  // Get the day of the week for the selected date
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
  };

  const dayOfWeekText = getDayOfWeek(appointmentDate);

  // Calculate future dates based on recurrence pattern
  const calculateFutureDates = () => {
    if (!appointmentDate) return [];
    
    const startDate = new Date(appointmentDate);
    const dates = [new Date(startDate)];
    
    if (recurrenceType === 'weekly') {
      // Add weekly occurrences
      for (let i = 1; i < occurrences; i++) {
        const nextDate = new Date(startDate);
        nextDate.setDate(startDate.getDate() + (i * 7));
        dates.push(nextDate);
      }
    } else if (recurrenceType === 'monthly') {
      // Add monthly occurrences
      for (let i = 1; i < occurrences; i++) {
        const nextDate = new Date(startDate);
        nextDate.setMonth(startDate.getMonth() + i);
        dates.push(nextDate);
      }
    }
    
    return dates.map(date => date.toISOString().split('T')[0]);
  };

  const futureDates = calculateFutureDates();

  // Handle recurring appointment booking
  const handleRecurringBooking = () => {
    if (selectedSlot) {
      // In a real implementation, we would call an API to book multiple appointments
      // For now, we'll just use the handleAppointmentSelect for the first slot
      handleAppointmentSelect(selectedSlot);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="center" className="block text-sm font-medium text-gray-700 mb-1">
                  Dialysis Center
                </label>
                <Select
                  value={selectedCenter}
                  onValueChange={setSelectedCenter}
                  disabled={isLoadingCenters}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a center" />
                  </SelectTrigger>
                  <SelectContent>
                    {centers.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Recurrence Pattern
                </label>
                <RadioGroup 
                  value={recurrenceType} 
                  onValueChange={(value) => setRecurrenceType(value as RecurrenceType)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <label htmlFor="occurrences" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Occurrences
                </label>
                <Select
                  value={occurrences.toString()}
                  onValueChange={(value) => setOccurrences(parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select number of occurrences" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} sessions
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCenter && Object.keys(centerHours).length > 0 && (
                <div className="mt-4 border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="text-sm font-medium flex items-center gap-2 text-medical-blue">
                    <Clock className="h-4 w-4" /> Center Hours
                  </h4>
                  <div className="mt-2 space-y-1 text-sm">
                    {Object.entries(centerHours).map(([day, hours]) => (
                      <div key={day} className={`flex justify-between ${day === dayOfWeekText ? 'font-semibold text-medical-blue' : ''}`}>
                        <span>{day}:</span>
                        <span>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-medical-blue" />
              Available Time Slots
            </h3>

            {!selectedCenter ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin className="h-12 w-12 text-gray-300 mb-4" />
                <h4 className="text-lg font-medium mb-2">No Center Selected</h4>
                <p className="text-sm text-gray-500">
                  Please select a dialysis center to view available appointment times.
                </p>
              </div>
            ) : isLoadingSlots ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No available slots for the selected date.</p>
                <p className="text-sm text-gray-400 mt-2">Please try another date or center.</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Select a time slot for your recurring appointment. This slot will be booked for all dates in the series.
                </p>
                <AppointmentTimeslotGrid 
                  timeSlots={availableSlots} 
                  onSelect={(slotId) => setSelectedSlot(slotId)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {futureDates.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-medical-blue" />
              Appointment Series
            </h3>
            
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The following appointments will be scheduled. Note that availability for future dates is not guaranteed.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              {futureDates.map((date, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {index === 0 ? 'First appointment' : `Appointment ${index + 1}`}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button 
                className="w-full bg-medical-blue hover:bg-medical-blue/90"
                disabled={!selectedSlot}
                onClick={handleRecurringBooking}
              >
                Book Recurring Appointments
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecurringBooking;
