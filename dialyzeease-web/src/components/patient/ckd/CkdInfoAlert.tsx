
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const CkdInfoAlert: React.FC = () => {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>About CKD Stages</AlertTitle>
      <AlertDescription>
        Chronic Kidney Disease (CKD) is classified into 5 stages based on your kidney function. 
        Use this calculator to determine your stage based on eGFR or creatinine levels from your lab results.
      </AlertDescription>
    </Alert>
  );
};

export default CkdInfoAlert;
