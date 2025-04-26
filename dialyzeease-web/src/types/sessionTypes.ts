export interface Session {
  id: number;
  center_id: number;
  doctor_id: number | null;
  weekday: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | 'weekdays' | 'weekends' | 'alldays';
  start_time: string;
  end_time: string;
  default_capacity: number;
  recurrence_pattern: 'daily' | 'weekly';
  status: 'active' | 'inactive';
  created_by_id: number;
  created_at: string;
  doctor_name?: string; // For display purposes
}

// Session form values
export type SessionFormValues = {
  doctor_id: number | null;
  weekday: string;
  start_time: string;
  end_time: string;
  default_capacity: number;
  recurrence_pattern?: string;
  status?: string;
  center_id?: number;
};

// Individual weekday options
export const weekdayOptions = [
  { value: 'mon', label: 'Monday', description: 'Weekly (every Monday)' },
  { value: 'tue', label: 'Tuesday', description: 'Weekly (every Tuesday)' },
  { value: 'wed', label: 'Wednesday', description: 'Weekly (every Wednesday)' },
  { value: 'thu', label: 'Thursday', description: 'Weekly (every Thursday)' },
  { value: 'fri', label: 'Friday', description: 'Weekly (every Friday)' },
  { value: 'sat', label: 'Saturday', description: 'Weekly (every Saturday)' },
  { value: 'sun', label: 'Sunday', description: 'Weekly (every Sunday)' }
];

// Group weekday options
export const weekdayGroupOptions = [
  { value: 'weekdays', label: 'Weekdays (Mon-Fri)', description: 'Daily (Mon to Fri)', days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
  { value: 'weekends', label: 'Weekends (Sat-Sun)', description: 'Daily (Sat and Sun)', days: ['sat', 'sun'] },
  { value: 'alldays', label: 'All Days (Mon-Sun)', description: 'Daily (All 7 days)', days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] }
];

// Check if a weekday option is a group
export const isWeekdayGroup = (value: string): boolean => {
  return ['weekdays', 'weekends', 'alldays'].includes(value);
};

// Get days from a weekday group
export const getDaysFromWeekdayGroup = (value: string): string[] => {
  const group = weekdayGroupOptions.find(option => option.value === value);
  return group ? group.days : [];
};

export const timeOptions = [
  { value: '00:00:00', label: '12:00 AM' },
  { value: '01:00:00', label: '1:00 AM' },
  { value: '02:00:00', label: '2:00 AM' },
  { value: '03:00:00', label: '3:00 AM' },
  { value: '04:00:00', label: '4:00 AM' },
  { value: '05:00:00', label: '5:00 AM' },
  { value: '06:00:00', label: '6:00 AM' },
  { value: '07:00:00', label: '7:00 AM' },
  { value: '08:00:00', label: '8:00 AM' },
  { value: '09:00:00', label: '9:00 AM' },
  { value: '10:00:00', label: '10:00 AM' },
  { value: '11:00:00', label: '11:00 AM' },
  { value: '12:00:00', label: '12:00 PM' },
  { value: '13:00:00', label: '1:00 PM' },
  { value: '14:00:00', label: '2:00 PM' },
  { value: '15:00:00', label: '3:00 PM' },
  { value: '16:00:00', label: '4:00 PM' },
  { value: '17:00:00', label: '5:00 PM' },
  { value: '18:00:00', label: '6:00 PM' },
  { value: '19:00:00', label: '7:00 PM' },
  { value: '20:00:00', label: '8:00 PM' },
  { value: '21:00:00', label: '9:00 PM' },
  { value: '22:00:00', label: '10:00 PM' },
  { value: '23:00:00', label: '11:00 PM' }
];

// Helper function to convert time string to 12-hour format
export const formatTimeString = (timeString: string): string => {
  // Handle empty or invalid time
  if (!timeString) return '';
  
  try {
    // Parse the time string (expected format: HH:MM:SS)
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    // Format the time string
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

// Helper function to convert 12-hour format to time string
export const parseTimeString = (timeString: string): string => {
  // Handle empty or invalid time
  if (!timeString) return '';
  
  try {
    // Parse the time string (expected format: h:mm AM/PM)
    const [timePart, period] = timeString.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    
    // Convert to 24-hour format
    let hours24 = hours;
    if (period.toUpperCase() === 'PM' && hours < 12) {
      hours24 = hours + 12;
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
      hours24 = 0;
    }
    
    // Format the time string
    return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  } catch (error) {
    console.error('Error parsing time:', error);
    return timeString;
  }
};
