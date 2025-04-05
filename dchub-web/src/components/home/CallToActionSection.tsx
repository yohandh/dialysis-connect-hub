
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CallToActionSection = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = (portal: string) => {
    navigate(`/${portal}`);
  };

  return (
    <section className="py-16 bg-medical-blue text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          Join Dialysis Connect Hub today to access comprehensive dialysis management
          and kidney disease education tools.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="secondary"
            className="bg-white text-medical-blue hover:bg-gray-100 px-6 py-3 text-lg"
            onClick={() => handleGetStarted('patient')}
          >
            Patient Login
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white/20 px-6 py-3 text-lg"
            onClick={() => handleGetStarted('staff')}
          >
            Staff Login
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
