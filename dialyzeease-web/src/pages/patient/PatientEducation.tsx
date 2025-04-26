import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PatientPortalLayout from '@/components/layouts/PatientPortalLayout';
import { fetchEducationContent, getPatientData, EducationContent } from '@/api/patientApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const PatientEducation = () => {
  const [selectedStage, setSelectedStage] = useState<number>(3);
  
  // Get patient profile
  const { data: profile } = useQuery({
    queryKey: ['patientProfile'],
    queryFn: getPatientData
  });
  
  // Get education content for selected CKD stage
  const { data: educationContent = [] } = useQuery({
    queryKey: ['educationContent', selectedStage],
    queryFn: () => fetchEducationContent(selectedStage)
  });
  
  const handleStageChange = (stage: number) => {
    setSelectedStage(stage);
  };
  
  return (
    <PatientPortalLayout>
      <div className="space-y-6 bg-blue-50 p-6 rounded-lg">
        <h1 className="text-3xl font-bold tracking-tight text-medical-blue">CKD Education</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="border-b border-blue-100">
                <CardTitle className="text-medical-blue">Select CKD Stage</CardTitle>
                <CardDescription>
                  Choose a stage to view relevant education materials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[1, 2, 3, 4, 5].map(stage => (
                  <button
                    key={stage}
                    className={`w-full py-2 px-4 rounded-md text-sm font-medium 
                                ${selectedStage === stage ? 'bg-medical-blue text-white hover:bg-medical-blue/90' : 'bg-blue-50 text-medical-blue hover:bg-blue-100'}`}
                    onClick={() => handleStageChange(stage)}
                  >
                    Stage {stage}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            {educationContent.length > 0 ? (
              <Tabs defaultValue={educationContent[0].id}>
                <TabsList className="bg-medical-blue/10">
                  {educationContent.map(content => (
                    <TabsTrigger key={content.id} value={content.id} className="data-[state=active]:bg-medical-blue data-[state=active]:text-white">
                      {content.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {educationContent.map(content => (
                  <TabsContent key={content.id} value={content.id}>
                    <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader className="border-b border-blue-100">
                        <CardTitle className="text-medical-blue">{content.title}</CardTitle>
                        <CardDescription>{content.summary}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {content.content ? (
                          <div dangerouslySetInnerHTML={{ __html: content.content }} />
                        ) : (
                          <p>No content available for this topic.</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <Card className="border-t-4 border-medical-blue shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="border-b border-blue-100">
                  <CardTitle className="text-medical-blue">Stage {selectedStage} Content</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No education content available for Stage {selectedStage}.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PatientPortalLayout>
  );
};

export default PatientEducation;
