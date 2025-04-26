
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ckdStages } from '@/data/ckdData';

interface CkdStagesInfoProps {
  currentStage: number;
}

const CkdStagesInfo: React.FC<CkdStagesInfoProps> = ({ currentStage }) => {
  return (
    <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="border-b border-blue-100">
        <CardTitle className="text-medical-blue">CKD Stages Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={currentStage.toString()}>
          <TabsList className="grid grid-cols-5 w-full bg-medical-blue/10">
            {ckdStages.map(stage => (
              <TabsTrigger 
                key={stage.stage} 
                value={stage.stage.toString()}
                className={`data-[state=active]:bg-medical-blue data-[state=active]:text-white ${currentStage === stage.stage ? 'ring-2 ring-medical-blue' : ''}`}
              >
                Stage {stage.stage}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {ckdStages.map(stage => (
            <TabsContent key={stage.stage} value={stage.stage.toString()} className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-medical-blue">{stage.name}</h3>
                  <p className="text-muted-foreground">eGFR: {stage.egfrRange} mL/min/1.73m²</p>
                </div>
                
                <div>
                  <p>{stage.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-medical-blue">Key Points:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {stage.recommendations.monitoring.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CkdStagesInfo;
