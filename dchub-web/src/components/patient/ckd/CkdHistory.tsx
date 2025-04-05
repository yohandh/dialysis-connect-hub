
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CkdHistoryItem } from '@/api/patientApi';

interface CkdHistoryProps {
  ckdHistory: CkdHistoryItem[];
}

const CkdHistory: React.FC<CkdHistoryProps> = ({ ckdHistory }) => {
  if (!ckdHistory || ckdHistory.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your CKD History</CardTitle>
        <CardDescription>Track your kidney function over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Date</th>
                <th className="text-left py-2 px-4">eGFR</th>
                <th className="text-left py-2 px-4">Creatinine</th>
                <th className="text-left py-2 px-4">Stage</th>
              </tr>
            </thead>
            <tbody>
              {ckdHistory.map((record) => (
                <tr key={record.id} className="border-b last:border-0">
                  <td className="py-2 px-4">{record.date}</td>
                  <td className="py-2 px-4">{record.eGFR} mL/min</td>
                  <td className="py-2 px-4">{record.creatinine > 0 ? `${record.creatinine} mg/dL` : 'N/A'}</td>
                  <td className="py-2 px-4">
                    <Badge className={`kidney-stage-${record.stage} text-xs px-2 py-0.5 rounded-full font-medium`}>
                      Stage {record.stage}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CkdHistory;
