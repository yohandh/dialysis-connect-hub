import React, { useState, useEffect } from 'react';
import PatientPortalLayout from '@/components/layouts/PatientPortalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Utensils, Heart, Activity, Info, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ckdStages, CKDStage } from '@/data/ckdData';

const PatientRecommendations = () => {
  const [selectedStage, setSelectedStage] = useState<string>("3");
  const [stageData, setStageData] = useState<CKDStage | null>(null);
  
  useEffect(() => {
    // Check if there's a selected stage from the CKD calculator
    const savedStage = localStorage.getItem("selectedCkdStage");
    if (savedStage) {
      const parsedStage = JSON.parse(savedStage) as CKDStage;
      setSelectedStage(parsedStage.stage.toString());
      localStorage.removeItem("selectedCkdStage"); // Clear after use
    }
    
    // Set the initial stage data based on selection
    updateStageData(selectedStage);
  }, []);
  
  useEffect(() => {
    updateStageData(selectedStage);
  }, [selectedStage]);
  
  const updateStageData = (stageNumber: string) => {
    const stage = ckdStages.find(s => s.stage === parseInt(stageNumber));
    if (stage) {
      setStageData(stage);
    }
  };
  
  return (
    <PatientPortalLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Health Recommendations</h1>
        </div>
        
        <Alert className="bg-gray-900 text-white border-none">
          <Info className="h-4 w-4 text-white" />
          <AlertTitle className="text-white">Personalized Guidance</AlertTitle>
          <AlertDescription className="text-gray-200">
            These recommendations are tailored for your CKD stage. Always consult with your healthcare 
            provider before making significant changes to your diet, medications, or lifestyle.
          </AlertDescription>
        </Alert>
        
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recommendations for CKD Stage:</span>
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {ckdStages.map((stage) => (
                    <SelectItem key={stage.stage} value={stage.stage.toString()}>
                      <div className="flex items-center">
                        Stage {stage.stage}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardTitle>
            {stageData && (
              <CardDescription className="flex items-center mt-4">
                <span className="bg-amber-500/20 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium mr-2">
                  Stage {stageData.stage}
                </span>
                <span>{stageData.description}</span>
              </CardDescription>
            )}
          </CardHeader>
          
          {stageData && (
            <CardContent>
              <Tabs defaultValue="diet">
                <TabsList className="grid grid-cols-3 mb-6 bg-gray-100">
                  <TabsTrigger value="diet" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                    <Utensils className="h-4 w-4 mr-2" /> Diet
                  </TabsTrigger>
                  <TabsTrigger value="lifestyle" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                    <Activity className="h-4 w-4 mr-2" /> Lifestyle
                  </TabsTrigger>
                  <TabsTrigger value="monitoring" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                    <Heart className="h-4 w-4 mr-2" /> Monitoring
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="diet" className="space-y-4">
                  <div className="bg-teal-900/10 border border-teal-900/20 rounded-lg p-4">
                    <h3 className="font-semibold text-teal-900 mb-2">Diet Recommendations</h3>
                    <p className="text-sm text-teal-700 mb-4">
                      Following these dietary guidelines can help manage your kidney disease and improve your overall health.
                    </p>
                    <ul className="space-y-3">
                      {stageData.recommendations.diet.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-teal-600 mt-0.5 mr-2 shrink-0" />
                          <span className="text-teal-900">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Foods to Monitor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Sodium</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {stageData.stage < 3 ? "Moderate intake" : "Limit intake"}
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>Processed foods</li>
                            <li>Canned soups</li>
                            <li>Deli meats</li>
                            <li>Fast food</li>
                            <li>Salty snacks</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Potassium</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {stageData.stage < 4 ? "Monitor intake" : "Restrict intake"}
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>Bananas</li>
                            <li>Potatoes</li>
                            <li>Tomatoes</li>
                            <li>Oranges</li>
                            <li>Spinach</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Phosphorus</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {stageData.stage < 3 ? "Normal intake" : "Limit intake"}
                          </p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>Dairy products</li>
                            <li>Nuts and seeds</li>
                            <li>Whole grains</li>
                            <li>Processed meats</li>
                            <li>Cola drinks</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="lifestyle" className="space-y-4">
                  <div className="bg-blue-900/10 border border-blue-900/20 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Lifestyle Recommendations</h3>
                    <p className="text-sm text-blue-700 mb-4">
                      These lifestyle adjustments can help slow the progression of kidney disease and improve your quality of life.
                    </p>
                    <ul className="space-y-3">
                      {stageData.recommendations.lifestyle.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-blue-600 mt-0.5 mr-2 shrink-0" />
                          <span className="text-blue-900">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Activity Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Recommended Activities</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>Walking</li>
                            <li>Swimming</li>
                            <li>Cycling</li>
                            <li>Light yoga</li>
                            <li>Gardening</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Exercise Guidelines</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>{stageData.stage < 4 ? "Aim for 30 minutes daily" : "Start with 10-15 minutes daily"}</li>
                            <li>Exercise during dialysis if applicable</li>
                            <li>Stay hydrated appropriately</li>
                            <li>Stop if feeling dizzy or unwell</li>
                            <li>Consult with healthcare provider first</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="monitoring" className="space-y-4">
                  <div className="bg-purple-900/10 border border-purple-900/20 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 mb-2">Health Monitoring</h3>
                    <p className="text-sm text-purple-700 mb-4">
                      Regular monitoring is essential to track your kidney health and adjust treatment as needed.
                    </p>
                    <ul className="space-y-3">
                      {stageData.recommendations.monitoring.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-purple-600 mt-0.5 mr-2 shrink-0" />
                          <span className="text-purple-900">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Track These Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Daily</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>Blood pressure</li>
                            <li>Weight</li>
                            <li>Fluid intake/output</li>
                            <li>Medication adherence</li>
                            <li>Symptoms journal</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Monthly</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>eGFR levels</li>
                            <li>Creatinine levels</li>
                            <li>Electrolyte balance</li>
                            <li>Hemoglobin levels</li>
                            <li>Urine protein</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">When to Contact a Doctor</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>Sudden weight gain</li>
                            <li>Increased swelling</li>
                            <li>Shortness of breath</li>
                            <li>Severe fatigue</li>
                            <li>Changes in urination</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          )}
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
            <CardDescription>Helpful information for managing your kidney health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start p-4 border rounded-lg">
                <div className="bg-primary/10 p-2 rounded mr-4">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">CKD Diet Guide</h3>
                  <p className="text-sm text-gray-600 mb-2">Comprehensive guide to managing your diet with kidney disease.</p>
                  <a href="#" className="text-sm text-primary hover:underline">Download PDF</a>
                </div>
              </div>
              
              <div className="flex items-start p-4 border rounded-lg">
                <div className="bg-primary/10 p-2 rounded mr-4">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Medication Tracker</h3>
                  <p className="text-sm text-gray-600 mb-2">Template to help you track your medications and schedule.</p>
                  <a href="#" className="text-sm text-primary hover:underline">Download PDF</a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientPortalLayout>
  );
};

export default PatientRecommendations;
