
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HealthMetricsCardProps {
  ckdHistory: any[] | undefined;
  patient: any | undefined;
}

const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({ ckdHistory, patient }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Health Metrics</CardTitle>
        <CardDescription>Recent test results and measurements</CardDescription>
      </CardHeader>
      <CardContent>
        {ckdHistory && ckdHistory.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="font-medium">Latest eGFR</span>
              <span>{ckdHistory[0].eGFR} mL/min <span className="text-xs text-muted-foreground">({ckdHistory[0].date})</span></span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="font-medium">Latest Creatinine</span>
              <span>{ckdHistory[0].creatinine} mg/dL <span className="text-xs text-muted-foreground">({ckdHistory[0].date})</span></span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="font-medium">Blood Pressure</span>
              <span>120/80 mmHg <span className="text-xs text-muted-foreground">(May 25, 2023)</span></span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="font-medium">Weight</span>
              <span>{patient?.weight} kg <span className="text-xs text-muted-foreground">(May 25, 2023)</span></span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No recent health metrics available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthMetricsCard;
