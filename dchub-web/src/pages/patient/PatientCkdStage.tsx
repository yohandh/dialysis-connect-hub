
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCkdHistory } from '@/api/patientApi';
import PatientPortalLayout from '@/components/layouts/PatientPortalLayout';
import { ckdStages } from '@/data/ckdData';
import CkdCalculatorForm from '@/components/patient/ckd/CkdCalculatorForm';
import CkdStageResult from '@/components/patient/ckd/CkdStageResult';
import CkdHistory from '@/components/patient/ckd/CkdHistory';
import CkdStagesInfo from '@/components/patient/ckd/CkdStagesInfo';
import CkdInfoAlert from '@/components/patient/ckd/CkdInfoAlert';

const PatientCkdStage = () => {
  const [calculatedStage, setCalculatedStage] = useState<number | null>(null);
  
  // Get CKD history
  const { 
    data: ckdHistory = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['ckdHistory'],
    queryFn: getCkdHistory
  });
  
  // Calculate current stage from the most recent record
  const currentStage = ckdHistory.length > 0 
    ? ckdHistory[0].stage 
    : calculatedStage || 3; // Default to stage 3 if no data
  
  const handleCalculate = (stage: number) => {
    setCalculatedStage(stage);
    // Refetch the CKD history to show the new record
    refetch();
  };
  
  const ckdStageInfo = ckdStages.find(s => s.stage === currentStage);
  
  return (
    <PatientPortalLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold tracking-tight mb-6">CKD Stage Calculator & Information</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <CkdCalculatorForm onCalculate={handleCalculate} refetchHistory={refetch} />
          </div>
          
          <div className="md:col-span-2">
            {(calculatedStage || ckdHistory.length > 0) && ckdStageInfo && (
              <CkdStageResult 
                stage={currentStage} 
                stageInfo={ckdStageInfo}
              />
            )}
            
            {!calculatedStage && ckdHistory.length === 0 && (
              <CkdInfoAlert />
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <CkdHistory ckdHistory={ckdHistory} />
        </div>
        
        <div className="mt-8">
          <CkdStagesInfo currentStage={currentStage} />
        </div>
      </div>
    </PatientPortalLayout>
  );
};

export default PatientCkdStage;
