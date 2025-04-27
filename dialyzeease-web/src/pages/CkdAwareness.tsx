
import React, { useState, useEffect } from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ckdStages } from '@/data/ckdData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CkdAwareness = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', 'diet', 'lifestyle', 'monitoring'];
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Chronic Kidney Disease (CKD) Awareness</h1>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">What is CKD?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Chronic Kidney Disease (CKD) is a condition characterized by a gradual loss of kidney function over time. 
                Your kidneys filter wastes and excess fluids from your blood, which are then excreted in your urine. 
                When chronic kidney disease reaches an advanced stage, dangerous levels of fluid, electrolytes and wastes can build up in your body.
              </p>
              <p className="text-gray-700 leading-relaxed">
                CKD is often caused by diabetes or high blood pressure, which slowly damage the kidneys and diminish their function. 
                Early detection and treatment can often prevent chronic kidney disease from progressing to kidney failure.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Educational Materials by CKD Stage</CardTitle>
              <CardDescription>
                Browse through our comprehensive educational materials for each CKD stage
              </CardDescription>
              <div className="flex justify-end mt-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="diet">Diet</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stage1" className="w-full">
                <TabsList className="grid grid-cols-5 mb-8">
                  {ckdStages.map((stage) => (
                    <TabsTrigger key={stage.stage} value={`stage${stage.stage}`}>
                      Stage {stage.stage}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {ckdStages.map((stage) => (
                  <TabsContent key={stage.stage} value={`stage${stage.stage}`} className="p-4 border rounded-md">
                    <div className={`h-2 bg-kidney-stage-${stage.stage} mb-4 rounded-full`}></div>
                    <h3 className="text-xl font-semibold mb-2">
                      Stage {stage.stage}: {stage.name}
                    </h3>
                    <p className="text-sm font-medium mb-4">eGFR: {stage.egfrRange} mL/min/1.73m²</p>
                    
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Description:</h4>
                      <p className="text-gray-700">{stage.description}</p>
                    </div>

                    {(selectedCategory === 'all' || selectedCategory === 'diet') && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-2 text-kidney-red">Diet Recommendations:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {stage.recommendations.diet.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {(selectedCategory === 'all' || selectedCategory === 'lifestyle') && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-2 text-kidney-blue">Lifestyle Recommendations:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {stage.recommendations.lifestyle.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {(selectedCategory === 'all' || selectedCategory === 'monitoring') && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-2 text-kidney-green">Monitoring Recommendations:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {stage.recommendations.monitoring.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Risk Factors for CKD</CardTitle>
              <CardDescription>
                Several factors can increase your risk of developing chronic kidney disease
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Medical Conditions</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Diabetes</li>
                    <li>High blood pressure</li>
                    <li>Heart disease</li>
                    <li>Family history of kidney disease</li>
                    <li>Previous kidney damage or inflammation</li>
                    <li>Autoimmune diseases</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Lifestyle Factors</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Smoking</li>
                    <li>Obesity</li>
                    <li>Advanced age (over 60 years)</li>
                    <li>Long-term use of certain medications</li>
                    <li>Inadequate hydration</li>
                    <li>High-sodium or high-protein diet</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-10 flex justify-center">
            <Link to="/">
              <Button variant="outline" className="mr-4">Return to Home</Button>
            </Link>
            <Link to="/patient">
              <Button>Access Patient Portal</Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CkdAwareness;
