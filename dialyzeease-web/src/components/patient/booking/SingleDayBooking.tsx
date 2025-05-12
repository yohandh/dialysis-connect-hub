import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin, Clock } from 'lucide-react';
import { getAvailableTimeSlots } from '@/api/staffApi';
import AppointmentTimeslotGrid from '@/components/patient/AppointmentTimeslotGrid';
import { DialysisCenter } from '@/types/centerTypes';
import { Appointment } from '@/data/appointmentData';

interface SingleDayBookingProps {
  centers: DialysisCenter[];
  isLoadingCenters: boolean;
  selectedCenter: string;
  setSelectedCenter: (id: string) => void;
  appointmentDate: string;
  setAppointmentDate: (date: string) => void;
  centerHours?: {[key: string]: string};
  handleAppointmentSelect: (appointmentId: string) => void;
  formatDateForApi: (dateString: string) => string;
  onAppointmentSelect?: (appointmentData: any) => void;
}

const SingleDayBooking: React.FC<SingleDayBookingProps> = ({
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

  const dayOfWeek = getDayOfWeek(appointmentDate);

  return (
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
                Appointment Date
              </label>
              <Input
                id="appointmentDate"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {selectedCenter && centerHours && Object.keys(centerHours).length > 0 && (
              <div className="mt-4 border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="text-sm font-medium flex items-center gap-2 text-medical-blue">
                  <Clock className="h-4 w-4" /> Center Hours
                </h4>
                <div className="mt-2 space-y-1 text-sm">
                  {Object.entries(centerHours).map(([day, hours]) => (
                    <div key={day} className={`flex justify-between ${day === dayOfWeek ? 'font-semibold text-medical-blue' : ''}`}>
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
            <AppointmentTimeslotGrid 
              timeSlots={availableSlots} 
              onSelect={handleAppointmentSelect} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleDayBooking;
