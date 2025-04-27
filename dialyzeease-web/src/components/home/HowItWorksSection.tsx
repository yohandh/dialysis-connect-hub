
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      title: "Register & Access",
      description: "Registration to gain secure access to personalized portals",
      icon: "🔐"
    },
    {
      step: 2,
      title: "Schedule Appointments",
      description: "Book, manage, and track dialysis appointments with ease",
      icon: "📆"
    },
    {
      step: 3,
      title: "Learn & Improve",
      description: "Access personalized CKD education and improve kidney health",
      icon: "📊"
    }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-slate mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DialyzeEase simplifies dialysis management for everyone involved in the care process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <Card key={item.step} className="border border-subtle-gray hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-medical-blue/10 rounded-full flex items-center justify-center text-2xl mb-4">
                  {item.icon}
                </div>
                <CardTitle className="text-xl font-bold flex items-center">
                  <span className="bg-medical-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                    {item.step}
                  </span>
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
