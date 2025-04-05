
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CKDStage } from '@/data/ckdData';

interface CkdStageResultProps {
  stage: number;
  stageInfo: CKDStage;
}

const CkdStageResult: React.FC<CkdStageResultProps> = ({ stage, stageInfo }) => {
  const [showDetailedRecommendations, setShowDetailedRecommendations] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'diet' | 'lifestyle' | 'monitoring'>('diet');
  
  const toggleDetailedRecommendations = () => {
    setShowDetailedRecommendations(!showDetailedRecommendations);
  };
  
  return (
    <div className="space-y-6">
      <Card className={`border-l-4 border-l-kidney-stage-${stageInfo.stage}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>CKD Stage {stageInfo.stage}: {stageInfo.name}</span>
            <Badge className={`kidney-stage-${stageInfo.stage} text-xs px-3 py-1 rounded-full font-medium`}>
              Stage {stageInfo.stage}
            </Badge>
          </CardTitle>
          <CardDescription>
            eGFR Range: {stageInfo.egfrRange} mL/min/1.73m²
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>{stageInfo.description}</p>
            
            <div>
              <h4 className="font-medium mb-2">Recommended Actions:</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Regular check-ups with your nephrologist</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Follow dietary and lifestyle recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Monitor blood pressure and blood sugar regularly</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={toggleDetailedRecommendations} 
            className="w-full flex items-center justify-center"
            variant="default"
          >
            {showDetailedRecommendations ? (
              <>Hide Detailed Recommendations <ChevronUp className="ml-2 h-4 w-4" /></>
            ) : (
              <>View Detailed Recommendations <ChevronDown className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {showDetailedRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Recommendations for Stage {stageInfo.stage}</CardTitle>
            <CardDescription>
              These recommendations are tailored for your CKD stage. Always consult with your healthcare provider.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="diet" onValueChange={(v) => setActiveTab(v as 'diet' | 'lifestyle' | 'monitoring')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="diet">Diet</TabsTrigger>
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              </TabsList>
              
              <TabsContent value="diet" className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Diet Recommendations</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Following these dietary guidelines can help manage your kidney disease and improve your overall health.
                    </p>
                    
                    <ul className="space-y-2">
                      {stageInfo.recommendations.diet.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="bg-blue-100 p-1 rounded-full mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="lifestyle" className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Lifestyle Recommendations</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      These lifestyle changes can help slow the progression of kidney disease.
                    </p>
                    
                    <ul className="space-y-2">
                      {stageInfo.recommendations.lifestyle.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="bg-green-100 p-1 rounded-full mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="monitoring" className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Monitoring Recommendations</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Regular monitoring is important to track your kidney function and adjust treatment as needed.
                    </p>
                    
                    <ul className="space-y-2">
                      {stageInfo.recommendations.monitoring.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="bg-purple-100 p-1 rounded-full mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CkdStageResult;
