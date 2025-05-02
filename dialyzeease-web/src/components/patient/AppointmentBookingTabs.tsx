import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/card';
import { Calendar, Clock, Repeat } from 'lucide-react';
import SingleDayBooking from './booking/SingleDayBooking';
import RecurringBooking from './booking/RecurringBooking';
import DateRangeBooking from './booking/DateRangeBooking';
import { DialysisCenter } from '@/types/centerTypes';
import { Appointment } from '@/data/appointmentData';

interface AppointmentBookingTabsProps {
  centers: DialysisCenter[];
  isLoadingCenters: boolean;
  selectedCenter: string;
  setSelectedCenter: (id: string) => void;
  appointmentDate: string;
  setAppointmentDate: (date: string) => void;
  centerHours: {[key: string]: string};
  handleAppointmentSelect: (appointmentId: string) => void;
  formatDateForApi: (dateString: string) => string;
}

const AppointmentBookingTabs: React.FC<AppointmentBookingTabsProps> = ({
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
  return (
    <Tabs defaultValue="single-day" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="single-day" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>One Day</span>
        </TabsTrigger>
        <TabsTrigger value="recurring" className="flex items-center gap-2">
          <Repeat className="h-4 w-4" />
          <span>Recurring</span>
        </TabsTrigger>
        <TabsTrigger value="date-range" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Date Range</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="single-day">
        <SingleDayBooking 
          centers={centers}
          isLoadingCenters={isLoadingCenters}
          selectedCenter={selectedCenter}
          setSelectedCenter={setSelectedCenter}
          appointmentDate={appointmentDate}
          setAppointmentDate={setAppointmentDate}
          centerHours={centerHours}
          handleAppointmentSelect={handleAppointmentSelect}
          formatDateForApi={formatDateForApi}
        />
      </TabsContent>

      <TabsContent value="recurring">
        <RecurringBooking 
          centers={centers}
          isLoadingCenters={isLoadingCenters}
          selectedCenter={selectedCenter}
          setSelectedCenter={setSelectedCenter}
          appointmentDate={appointmentDate}
          setAppointmentDate={setAppointmentDate}
          centerHours={centerHours}
          handleAppointmentSelect={handleAppointmentSelect}
          formatDateForApi={formatDateForApi}
        />
      </TabsContent>

      <TabsContent value="date-range">
        <DateRangeBooking 
          centers={centers}
          isLoadingCenters={isLoadingCenters}
          selectedCenter={selectedCenter}
          setSelectedCenter={setSelectedCenter}
          appointmentDate={appointmentDate}
          setAppointmentDate={setAppointmentDate}
          centerHours={centerHours}
          handleAppointmentSelect={handleAppointmentSelect}
          formatDateForApi={formatDateForApi}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AppointmentBookingTabs;
