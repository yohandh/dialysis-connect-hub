
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ckdStages } from '@/data/ckdData';

const CkdStagesSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-light-gray-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-slate mb-4">Understanding CKD Stages</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chronic Kidney Disease progresses through five stages based on kidney function
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ckdStages.map((stage) => (
            <Card key={stage.stage} className={`border-t-4 border-kidney-stage-${stage.stage}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">
                  Stage {stage.stage}: {stage.name}
                </CardTitle>
                <CardDescription className="font-medium">
                  eGFR: {stage.egfrRange}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600">
                  {stage.description.substring(0, 100)}...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white"
            onClick={() => navigate('/ckd-awareness')}
          >
            Learn More About CKD
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CkdStagesSection;
