
import React from 'react';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/data/appointmentData';

interface AppointmentTimeslotGridProps {
  timeSlots: Appointment[];
  onSelect: (slotId: string) => void;
  isLoading?: boolean;
}

// Helper function to format date for display
const formatDisplayDate = (dateString: string): string => {
  try {
    // If it's already in a readable format or empty, return as is
    if (!dateString || dateString === '-') return dateString;
    
    // Handle ISO date format (with T)
    if (dateString.includes('T')) {
      dateString = dateString.split('T')[0];
    }
    
    // For YYYY-MM-DD format, parse and format as MM/DD/YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      
      // Important: When displaying the date, use the exact date from the string
      // without creating a Date object to avoid timezone issues
      return `${month}/${day}/${year}`;
    }
    
    // If it's already in MM/DD/YYYY format, return as is
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }
    
    // Last resort: try to parse as date and format
    // But be careful with timezone issues
    const dateParts = dateString.split(/[\s\/-]+/);
    if (dateParts.length >= 3) {
      let month, day, year;
      
      // Try to determine format based on part lengths
      if (dateParts[0].length === 4) {
        // Looks like YYYY-MM-DD
        [year, month, day] = dateParts;
      } else {
        // Assume MM/DD/YYYY
        [month, day, year] = dateParts;
      }
      
      return `${month}/${day}/${year}`;
    }
    
    return dateString;
  } catch (error) {
    console.error('Error formatting display date:', error);
    return dateString;
  }
};

const AppointmentTimeslotGrid: React.FC<AppointmentTimeslotGridProps> = ({
  timeSlots,
  onSelect,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No available time slots found for this date.</p>
        <p className="text-sm text-gray-400 mt-2">Try selecting a different date or center.</p>
      </div>
    );
  }

  // Group time slots by time range
  const timeGroups: Record<string, Appointment[]> = {};
  
  timeSlots.forEach(slot => {
    const timeKey = `${slot.startTime} - ${slot.endTime}`;
    if (!timeGroups[timeKey]) {
      timeGroups[timeKey] = [];
    }
    timeGroups[timeKey].push(slot);
  });

  return (
    <div className="space-y-4">
      {Object.entries(timeGroups).map(([timeRange, slots]) => (
        <div key={timeRange} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">{timeRange}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {slots.map(slot => (
              <Button
                key={slot.id}
                variant="outline"
                className="h-auto py-3 justify-between flex flex-col hover:border-medical-blue hover:text-medical-blue"
                onClick={() => onSelect(slot.id)}
              >
                <div className="capitalize text-xs font-medium bg-gray-100 px-2 py-1 rounded w-full text-center mb-2">
                  {slot.type}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDisplayDate(slot.date)}
                </div>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentTimeslotGrid;
