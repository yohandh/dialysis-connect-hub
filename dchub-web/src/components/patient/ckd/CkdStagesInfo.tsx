
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ckdStages } from '@/data/ckdData';

interface CkdStagesInfoProps {
  currentStage: number;
}

const CkdStagesInfo: React.FC<CkdStagesInfoProps> = ({ currentStage }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CKD Stages Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={currentStage.toString()}>
          <TabsList className="grid grid-cols-5 w-full">
            {ckdStages.map(stage => (
              <TabsTrigger 
                key={stage.stage} 
                value={stage.stage.toString()}
                className={currentStage === stage.stage ? 'text-primary' : ''}
              >
                Stage {stage.stage}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {ckdStages.map(stage => (
            <TabsContent key={stage.stage} value={stage.stage.toString()} className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{stage.name}</h3>
                  <p className="text-muted-foreground">eGFR: {stage.egfrRange} mL/min/1.73m²</p>
                </div>
                
                <div>
                  <p>{stage.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Key Points:</h4>
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
