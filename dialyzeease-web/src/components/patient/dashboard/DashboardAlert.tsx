
import React from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DashboardAlert: React.FC = () => {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Your next visit is scheduled</AlertTitle>
      <AlertDescription>
        Please remember to bring your medication list and arrive 15 minutes early.
      </AlertDescription>
    </Alert>
  );
};

export default DashboardAlert;
