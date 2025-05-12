import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CKDStage } from '@/data/ckdData';
import CkdStageBadge from '@/components/CkdStageBadge';

interface CkdStageResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stage: number;
  stageInfo: CKDStage;
  egfrValue: number;
  onViewDetailedInfo: () => void;
}

const CkdStageResultDialog: React.FC<CkdStageResultDialogProps> = ({
  isOpen,
  onClose,
  stage,
  stageInfo,
  egfrValue,
  onViewDetailedInfo,
}) => {
  // Get color class based on stage for dialog background
  const getStageColorClass = () => {
    switch (stage) {
      case 1:
        return 'bg-green-50 border-green-300';
      case 2:
        return 'bg-green-100 border-green-400';
      case 3:
        return 'bg-yellow-50 border-yellow-400';
      case 4:
        return 'bg-orange-50 border-orange-400';
      case 5:
        return 'bg-red-50 border-red-400';
      default:
        return 'bg-blue-50 border-blue-300';
    }
  };
  
  // Get solid background color for the badge
  const getStageBadgeColorClass = () => {
    switch (stage) {
      case 1:
        return 'bg-green-500 text-white';
      case 2:
        return 'bg-green-600 text-white';
      case 3:
        return 'bg-yellow-500 text-white';
      case 4:
        return 'bg-orange-500 text-white';
      case 5:
        return 'bg-red-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-2xl w-full ${getStageColorClass()} border-2`}>
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className={`rounded-full h-24 w-24 flex flex-col items-center justify-center mx-auto ${getStageBadgeColorClass()} border-2 border-white shadow-lg`}>
              <span className="text-xl font-bold text-center">Stage</span>
              <span className="text-2xl font-bold text-center">{stage}</span>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Your CKD Stage: {stage}
          </DialogTitle>
          <DialogDescription className="text-lg font-medium mt-2 text-center">
            {stageInfo.name}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
            <span className="font-medium text-lg">eGFR Value:</span>
            <span className="text-xl font-semibold">{egfrValue} mL/min/1.73m²</span>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-lg mb-2">What this means:</h4>
            <p className="text-base text-gray-700">{stageInfo.description}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-lg mb-2">Key Recommendations:</h4>
            <ul className="text-base space-y-3">
              {stageInfo.recommendations.monitoring[0] && (
                <li className="flex items-start space-x-2">
                  <div className="bg-blue-100 p-1 rounded-full mt-0.5 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{stageInfo.recommendations.monitoring[0]}</span>
                </li>
              )}
              {stageInfo.recommendations.diet[0] && (
                <li className="flex items-start space-x-2">
                  <div className="bg-green-100 p-1 rounded-full mt-0.5 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{stageInfo.recommendations.diet[0]}</span>
                </li>
              )}
              {stageInfo.recommendations.lifestyle[0] && (
                <li className="flex items-start space-x-2">
                  <div className="bg-purple-100 p-1 rounded-full mt-0.5 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{stageInfo.recommendations.lifestyle[0]}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={() => {
              onClose();
              onViewDetailedInfo();
            }} 
            className="w-full bg-medical-blue hover:bg-medical-blue/90 text-lg py-6"
          >
            View Detailed Information
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CkdStageResultDialog;
