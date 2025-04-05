
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = (portal: string) => {
    navigate(`/${portal}`);
  };

  return (
    <section className="bg-gradient-to-b from-medical-blue/10 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-dark-slate mb-4">
              Manage Dialysis Appointments & Enhance CKD Care
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              A comprehensive platform connecting patients, healthcare providers, and administrators 
              to streamline dialysis management and improve kidney health outcomes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                className="bg-medical-blue hover:bg-medical-blue/90 text-white px-6 py-3 text-lg"
                onClick={() => handleGetStarted('patient')}
              >
                Patient Portal
              </Button>
              <Button
                variant="outline"
                className="border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white px-6 py-3 text-lg"
                onClick={() => handleGetStarted('staff')}
              >
                Staff Portal
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?q=80&w=600&auto=format&fit=crop"
              alt="Kidney Care Illustration"
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
