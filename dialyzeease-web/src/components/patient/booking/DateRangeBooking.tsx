import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Calendar, AlertCircle, Check } from 'lucide-react';
import { getAvailableTimeSlots } from '@/api/staffApi';
import { DialysisCenter } from '@/types/centerTypes';
import { Appointment } from '@/data/appointmentData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DateRangeBookingProps {
  centers: DialysisCenter[];
  isLoadingCenters: boolean;
  selectedCenter: string;
  setSelectedCenter: (id: string) => void;
  appointmentDate?: string;
  setAppointmentDate?: (date: string) => void;
  centerHours?: { [key: string]: string };
  formatDateForApi?: (dateString: string) => string;
  onAppointmentSelect?: (appointmentData: any, appointments: { [date: string]: string }) => void;
}

interface DateSlot {
  date: string;
  formattedDate: string;
  slots: Appointment[];
  selectedSlotId: string | null;
}

const DateRangeBooking: React.FC<DateRangeBookingProps> = ({
  centers,
  isLoadingCenters,
  selectedCenter,
  setSelectedCenter,
  appointmentDate,
  setAppointmentDate,
  centerHours,
  formatDateForApi,
  onAppointmentSelect
}) => {
  const [endDate, setEndDate] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [dateSlots, setDateSlots] = useState<DateSlot[]>([]);
  const [isLoadingDateSlots, setIsLoadingDateSlots] = useState(false);

  // Get available time slots for the selected center and date range
  const fetchDateRangeSlots = async () => {
    if (!selectedCenter || !appointmentDate || !endDate) return;

    setIsLoadingDateSlots(true);

    try {
      // Generate array of dates between start and end date
      const dates: string[] = [];
      const start = new Date(appointmentDate);
      const end = new Date(endDate);

      // Validate date range
      if (end < start) {
        throw new Error('End date must be after start date');
      }

      // Generate dates
      const currentDate = new Date(start);
      while (currentDate <= end) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Fetch slots for each date
      const dateSlotPromises = dates.map(async (date) => {
        const slots = await getAvailableTimeSlots(selectedCenter, formatDateForApi(date));
        return {
          date,
          formattedDate: new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          }),
          slots,
          selectedSlotId: null
        };
      });

      const resolvedDateSlots = await Promise.all(dateSlotPromises);
      setDateSlots(resolvedDateSlots);
    } catch (error) {
      console.error('Error fetching date range slots:', error);
    } finally {
      setIsLoadingDateSlots(false);
    }
  };

  // Automatically load available sessions when center, start date, and end date are all selected
  useEffect(() => {
    if (selectedCenter && appointmentDate && endDate) {
      fetchDateRangeSlots();
    }
  }, [selectedCenter, appointmentDate, endDate]);

  // Handle date selection toggle
  const toggleDateSelection = (date: string) => {
    setSelectedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  // Handle slot selection for a specific date
  const handleSlotSelect = (date: string, slotId: string) => {
    setDateSlots(prev =>
      prev.map(dateSlot =>
        dateSlot.date === date
          ? { ...dateSlot, selectedSlotId: slotId }
          : dateSlot
      )
    );
  };

  // Handle booking multiple appointments
  const handleMultipleBookings = () => {
    // In a real implementation, we would call an API to book multiple appointments
    const appointments: { [date: string]: string } = {};

    dateSlots.forEach(dateSlot => {
      if (selectedDates.includes(dateSlot.date) && dateSlot.selectedSlotId) {
        appointments[dateSlot.date] = dateSlot.selectedSlotId;
      }
    });

    if (Object.keys(appointments).length > 0 && onAppointmentSelect) {
      const firstDate = Object.keys(appointments)[0];
      const firstSlot = dateSlots.find(ds => ds.date === firstDate)?.slots.find(s => s.id === appointments[firstDate]);
      
      if (firstSlot) {
        onAppointmentSelect({
          slotId: firstSlot.id,
          date: firstDate,
          startTime: firstSlot.startTime,
          endTime: firstSlot.endTime,
          centerId: selectedCenter,
          type: firstSlot.type || 'dialysis'
        }, appointments);
      }
    }
  };

  // Calculate the number of selected appointments
  const selectedAppointmentsCount = dateSlots.reduce((count, dateSlot) => {
    if (selectedDates.includes(dateSlot.date) && dateSlot.selectedSlotId) {
      return count + 1;
    }
    return count;
  }, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <MapPin className="h-4 w-4 text-medical-blue" />
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-medical-blue" />
                  Start Date
                </label>
                <Input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={!selectedCenter}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-medical-blue" />
                  End Date
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={appointmentDate || new Date().toISOString().split('T')[0]}
                  disabled={!appointmentDate}
                />
              </div>
            </div>

            {isLoadingDateSlots && (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-medical-blue"></div>
                <span className="ml-2 text-sm text-gray-600">Loading available slots...</span>
              </div>
            )}

            {selectedCenter && appointmentDate && endDate && !isLoadingDateSlots && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-sm text-blue-700">
                  Available slots will load automatically when all fields are filled.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {dateSlots.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-medical-blue" />
              Date Selection
            </h3>

            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Select dates and time slots for your appointments.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-2">
                {dateSlots.map((dateSlot) => (
                  <div
                    key={dateSlot.date}
                    className={`p-2 border rounded cursor-pointer transition-colors ${
                      selectedDates.includes(dateSlot.date)
                        ? 'border-medical-blue bg-blue-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => toggleDateSelection(dateSlot.date)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{dateSlot.formattedDate}</span>
                      {dateSlot.selectedSlotId && (
                        <Check className="h-4 w-4 text-medical-blue" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {dateSlot.slots.length} available slots
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {dateSlots.length > 0 && selectedDates.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-medical-blue" />
              Available Time Slots
            </h3>
            
            <div className="space-y-6">
              {selectedDates.map((date) => {
                const dateSlot = dateSlots.find((ds) => ds.date === date);
                if (!dateSlot) return null;

                return (
                  <div key={date} className="border-b pb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{dateSlot.formattedDate}</h4>
                      <Badge
                        variant="outline"
                        className={
                          dateSlot.selectedSlotId
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : ''
                        }
                      >
                        {dateSlot.selectedSlotId ? 'Slot Selected' : 'No Slot Selected'}
                      </Badge>
                    </div>

                    {dateSlot.slots.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No available slots for this date.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {dateSlot.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className={`p-2 border rounded text-center cursor-pointer transition-colors ${
                              dateSlot.selectedSlotId === slot.id
                                ? 'border-medical-blue bg-medical-blue text-white'
                                : 'border-gray-200 hover:border-medical-blue/50'
                            }`}
                            onClick={() => handleSlotSelect(date, slot.id)}
                          >
                            <div className="text-sm">{slot.startTime} - {slot.endTime}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <Button
                className="w-full bg-medical-blue hover:bg-medical-blue/90"
                disabled={selectedAppointmentsCount === 0}
                onClick={handleMultipleBookings}
              >
                Book {selectedAppointmentsCount} Appointment{selectedAppointmentsCount !== 1 ? 's' : ''}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DateRangeBooking;
