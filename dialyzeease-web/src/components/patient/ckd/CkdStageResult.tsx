
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CKDStage } from '@/data/ckdData';
import CkdStageBadge from '@/components/CkdStageBadge';

interface CkdStageResultProps {
  stage: number;
  stageInfo: CKDStage;
  onViewDetailedRecommendations?: () => void;
  autoExpandDetails?: boolean;
}

const CkdStageResult: React.FC<CkdStageResultProps> = ({ stage, stageInfo, onViewDetailedRecommendations, autoExpandDetails = false }) => {
  const [showDetailedRecommendations, setShowDetailedRecommendations] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'diet' | 'lifestyle' | 'monitoring'>('diet');
  const detailedRecommendationsRef = useRef<HTMLDivElement>(null);
  
  // Check if we should auto-expand the detailed recommendations
  useEffect(() => {
    if (autoExpandDetails) {
      setShowDetailedRecommendations(true);
    }
  }, [autoExpandDetails]);
  
  const toggleDetailedRecommendations = () => {
    const newState = !showDetailedRecommendations;
    setShowDetailedRecommendations(newState);
    
    // If opening detailed recommendations and there's a callback, call it
    if (newState && onViewDetailedRecommendations) {
      onViewDetailedRecommendations();
    }
  };
  
  // Scroll to detailed recommendations when they become visible
  useEffect(() => {
    if (showDetailedRecommendations && detailedRecommendationsRef.current) {
      setTimeout(() => {
        detailedRecommendationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showDetailedRecommendations]);
  
  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="flex items-center justify-between text-medical-blue">
            <span>CKD Stage {stageInfo.stage}: {stageInfo.name}</span>
            <CkdStageBadge stage={stageInfo.stage} />
          </CardTitle>
          <CardDescription>
            eGFR Range: {stageInfo.egfrRange} mL/min/1.73m²
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>{stageInfo.description}</p>
            
            <div>
              <h4 className="font-medium mb-2 text-medical-blue">Recommended Actions:</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="bg-medical-blue/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Regular check-ups with your nephrologist</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="bg-medical-blue/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Follow dietary and lifestyle recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="bg-medical-blue/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            className="w-full flex items-center justify-center bg-medical-blue text-white hover:bg-medical-blue/90"
            variant="default"
          >
            {showDetailedRecommendations ? (
              <>View Detailed Recommendations <ChevronUp className="ml-2 h-4 w-4" /></>
            ) : (
              <>View Detailed Recommendations <ChevronDown className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {showDetailedRecommendations && (
        <Card 
          ref={detailedRecommendationsRef}
          className="mt-6 border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow animate-fade-in"
        >
          <CardHeader className="border-b border-blue-100 flex justify-between items-start pb-4">
            <div>
              <CardTitle className="text-medical-blue">Detailed Recommendations for Stage {stageInfo.stage}</CardTitle>
              <CardDescription>
                These recommendations are tailored for your CKD stage. Always consult with your healthcare provider.
              </CardDescription>
            </div>
            <Button 
              onClick={toggleDetailedRecommendations} 
              variant="ghost" 
              size="sm" 
              className="p-1 h-8 w-8 rounded-full"
            >
              <ChevronUp className="h-5 w-5 text-medical-blue" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="diet" onValueChange={(v) => setActiveTab(v as 'diet' | 'lifestyle' | 'monitoring')}>
              <TabsList className="grid w-full grid-cols-3 rounded-none">
                <TabsTrigger value="diet" onClick={() => setActiveTab('diet')} className="data-[state=active]:bg-medical-blue data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-medical-blue">Diet</TabsTrigger>
                <TabsTrigger value="lifestyle" onClick={() => setActiveTab('lifestyle')} className="data-[state=active]:bg-medical-blue data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-medical-blue">Lifestyle</TabsTrigger>
                <TabsTrigger value="monitoring" onClick={() => setActiveTab('monitoring')} className="data-[state=active]:bg-medical-blue data-[state=active]:text-white rounded-none border-b-2 border-transparent data-[state=active]:border-medical-blue">Monitoring</TabsTrigger>
              </TabsList>
              
              <TabsContent value="diet" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-medical-blue">Diet Recommendations</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Following these dietary guidelines can help manage your kidney disease and improve your overall health.
                    </p>
                    
                    <ul className="space-y-2">
                      {stageInfo.recommendations.diet.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="bg-blue-100 p-1 rounded-full mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              
              <TabsContent value="lifestyle" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-medical-blue">Lifestyle Recommendations</h3>
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
              
              <TabsContent value="monitoring" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-medical-blue">Monitoring Recommendations</h3>
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
