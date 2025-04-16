
import React from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Map from '@/components/Map';

const Contact = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Find Us</CardTitle>
                <CardDescription>Visit our main office or one of our dialysis centers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-medical-blue mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Main Office - Dialysis Connect Hub</h3>
                    <p className="text-gray-600">123 Healthcare Avenue</p>
                    <p className="text-gray-600">San Francisco, CA 94158</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-medical-blue mr-2" />
                  <div>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-medical-blue mr-2" />
                  <div>
                    <p className="text-gray-600">dialyzeease@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-medical-blue mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Office Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Need Assistance?</CardTitle>
                <CardDescription>Our team is here to help with all your dialysis needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-medical-blue">Emergency Support</h3>
                  <p className="text-gray-600">Call our 24/7 hotline: (555) 999-8888</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-medical-blue">Patient Services</h3>
                  <p className="text-gray-600">For appointment scheduling and general inquiries</p>
                  <p className="text-gray-600">Email: patients@dialysisconnect.example</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-medical-blue">Provider Relations</h3>
                  <p className="text-gray-600">For healthcare professionals and facility partnerships</p>
                  <p className="text-gray-600">Email: providers@dialysisconnect.example</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Our Location</CardTitle>
                <CardDescription>Find us on the map</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <Map className="h-[400px] rounded-md" /> */}
                <Map />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Regional Dialysis Centers</CardTitle>
                <CardDescription>Find a center near you</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 text-kidney-red mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Metro Dialysis Center</h4>
                      <p className="text-gray-600">123 Healthcare Blvd, Metropolis, NY 10001</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 text-kidney-red mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Central Kidney Care</h4>
                      <p className="text-gray-600">456 Medical Drive, Centerville, CA 90210</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 text-kidney-red mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Riverside Renal Center</h4>
                      <p className="text-gray-600">789 River Road, Riverside, TX 77001</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 text-kidney-red mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Highland Dialysis</h4>
                      <p className="text-gray-600">101 Highland Ave, Highland, IL 60035</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Contact;
