
import React, { useState, useRef } from 'react';
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
  const [showDetailedRecommendations, setShowDetailedRecommendations] = useState<boolean>(false);
  const [autoExpandDetails, setAutoExpandDetails] = useState<boolean>(false);
  const detailedRecommendationsRef = useRef<HTMLDivElement>(null);
  
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
  
  const handleViewDetailedRecommendations = () => {
    setShowDetailedRecommendations(true);
    setAutoExpandDetails(true);
    
    // Wait for the state to update and the component to render
    setTimeout(() => {
      if (detailedRecommendationsRef.current) {
        detailedRecommendationsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };
  
  const ckdStageInfo = ckdStages.find(s => s.stage === currentStage);
  
  return (
    <PatientPortalLayout>
      <div className="space-y-6 bg-blue-50 p-6 rounded-lg">
        <h1 className="text-3xl font-bold tracking-tight text-medical-blue">CKD Stage Calculator & Information</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <CkdCalculatorForm 
              onCalculate={handleCalculate} 
              refetchHistory={refetch} 
              onViewDetailedRecommendations={handleViewDetailedRecommendations}
            />
          </div>
          
          <div>
            {(calculatedStage || ckdHistory.length > 0) && ckdStageInfo && (
              <div ref={detailedRecommendationsRef}>
                <CkdStageResult 
                  stage={currentStage} 
                  stageInfo={ckdStageInfo}
                  onViewDetailedRecommendations={handleViewDetailedRecommendations}
                  autoExpandDetails={autoExpandDetails}
                />
              </div>
            )}
            
            {!calculatedStage && ckdHistory.length === 0 && (
              <CkdInfoAlert />
            )}
          </div>
        </div>
        
        {/* CKD History and CKD Stages Information cards are hidden */}
      </div>
    </PatientPortalLayout>
  );
};

export default PatientCkdStage;
