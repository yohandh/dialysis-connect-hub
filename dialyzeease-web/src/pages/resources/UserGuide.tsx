
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicLayout from '@/components/layouts/PublicLayout';

const UserGuide = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">User Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <p className="text-gray-700">
                Welcome to our dialysis care platform! This guide will help you navigate through the features and functionalities available to you.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Navigating the Platform</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Dashboard: Your main hub for quick access to important information</li>
                <li>Appointments: View, schedule, or cancel your appointments</li>
                <li>Education: Access educational resources about kidney health</li>
                <li>Profile: Update your personal information and preferences</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Patient Features</h2>
              <p className="text-gray-700 mb-4">
                As a patient, you can:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Track your CKD stage and history</li>
                <li>Book appointments at your preferred dialysis center</li>
                <li>Access personalized recommendations</li>
                <li>Communicate with your healthcare providers</li>
                <li>Set notification preferences</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Staff Features</h2>
              <p className="text-gray-700 mb-4">
                As a healthcare provider, you can:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Manage patient records</li>
                <li>Record dialysis sessions</li>
                <li>Track CKD measurements</li>
                <li>Manage appointments and schedules</li>
                <li>Access patient medical information</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Technical Support</h2>
              <p className="text-gray-700">
                If you encounter any issues or have questions about using the platform, please contact our support team at support@example.com or call our helpline at 1-800-123-4567.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default UserGuide;
