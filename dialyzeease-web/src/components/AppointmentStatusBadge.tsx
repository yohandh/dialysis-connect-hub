
import React from 'react';

interface AppointmentStatusBadgeProps {
  status: 'available' | 'booked' | 'canceled' | 'completed';
  className?: string; // Added className prop
}

const AppointmentStatusBadge: React.FC<AppointmentStatusBadgeProps> = ({ status, className = '' }) => {
  const getClassNames = () => {
    switch(status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'booked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`${getClassNames()} px-3 py-1 text-xs font-medium rounded-full border ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default AppointmentStatusBadge;
