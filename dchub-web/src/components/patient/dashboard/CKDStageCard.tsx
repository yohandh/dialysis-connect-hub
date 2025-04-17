
import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CKDStage } from '@/data/ckdData';

interface CKDStageCardProps {
  patientCkdStage: number;
  ckdStageInfo: CKDStage | undefined;
}

const CKDStageCard: React.FC<CKDStageCardProps> = ({ patientCkdStage, ckdStageInfo }) => {
  return (
    <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-blue-100">
        <CardTitle className="text-sm font-medium text-medical-blue">
          CKD Stage Overview
        </CardTitle>
        <Activity className="h-4 w-4 text-medical-blue" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Current Stage:</span>
            <span className={`bg-amber-500/20 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium`}>
              Stage {patientCkdStage}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">eGFR Range:</span>
            <span className="font-medium">{ckdStageInfo?.egfrRange || "N/A"}</span>
          </div>
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">
              {ckdStageInfo?.description.substring(0, 100)}...
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-2 bg-blue-50/50">
        <Link to="/patient/ckd-stage" className="text-xs text-medical-blue hover:underline">
          Check your CKD Stage
        </Link>
        <Link to="/patient/recommendations" className="text-xs text-medical-blue hover:underline">
          View Recommendations
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CKDStageCard;
