
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AboutSection = () => {
  return (
    <section id="about" className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-slate mb-4">About DialyseEase</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering dialysis patients and healthcare providers through simplified appointment management, personalized education
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To transform the dialysis care experience by providing a comprehensive digital platform that empowers both patients and healthcare providers through streamlined appointment management, personalized education, and improved access to care. Our mission is to reduce the administrative burden on medical facilities while enhancing patient autonomy, knowledge, and quality of life by addressing the key challenges in dialysis management.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-medical-blue/10 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">For Patients</h3>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Easy appointment scheduling and management</li>
                  <li>Educational resources about CKD stages</li>
                  <li>Personalized recommendations</li>
                  <li>Calendar view of upcoming treatments</li>
                  <li>Direct communication with providers</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-medical-blue/10 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">For Healthcare Providers</h3>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Efficient patient management dashboard</li>
                  <li>Appointment tracking and scheduling</li>
                  <li>Patient history and records access</li>
                  <li>Treatment progress monitoring</li>
                  <li>Resource allocation optimization</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We take a holistic, patient-centered approach to kidney care management. Our platform integrates the three key components of effective CKD management:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-light-gray-bg p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Online Appointments</h3>
                  <p className="text-gray-600 text-sm">Schedule and manage dialysis appointments from anywhere</p>
                </div>
                <div className="bg-light-gray-bg p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Education</h3>
                  <p className="text-gray-600 text-sm">Comprehensive resources about CKD, its stages, and management strategies</p>
                </div>
                <div className="bg-light-gray-bg p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Lifestyle Support</h3>
                  <p className="text-gray-600 text-sm">Personalized recommendations for diet, exercise, and daily habits based on CKD stage</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
