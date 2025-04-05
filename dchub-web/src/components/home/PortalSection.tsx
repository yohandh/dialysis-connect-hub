
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PortalSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-slate mb-4">Explore Our Portals</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dialysis Connect Hub offers specialized portals for each user type
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-2 border-patient-green-border hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-patient-green-light rounded-full mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-patient-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <CardTitle className="text-xl text-center">Patient Portal</CardTitle>
              <CardDescription className="text-center">
                For patients receiving dialysis treatment
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Book dialysis appointments</li>
                <li>• View upcoming treatments</li>
                <li>• Check CKD stage</li>
                <li>• Get personalized recommendations</li>
              </ul>
              <Button 
                className="bg-patient-green hover:bg-patient-green/90" 
                onClick={() => navigate('/patient/login')}
              >
                Access Patient Portal
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-medical-blue hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-medical-blue/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <CardTitle className="text-xl text-center">Staff Portal</CardTitle>
              <CardDescription className="text-center">
                For healthcare providers and center staff
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Manage appointment slots</li>
                <li>• View patient records</li>
                <li>• Track dialysis history</li>
                <li>• Update patient information</li>
              </ul>
              <Button 
                className="bg-medical-blue hover:bg-medical-blue/90" 
                onClick={() => navigate('/staff/login')}
              >
                Access Staff Portal
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-kidney-red hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-kidney-red/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-kidney-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <CardTitle className="text-xl text-center">Admin Portal</CardTitle>
              <CardDescription className="text-center">
                For system administrators
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Manage dialysis centers</li>
                <li>• Admin user accounts</li>
                <li>• View analytics & reports</li>
                <li>• System configuration</li>
              </ul>
              <Button 
                className="bg-kidney-red hover:bg-kidney-red/90" 
                onClick={() => navigate('/admin/login')}
              >
                Access Admin Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PortalSection;
