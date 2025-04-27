
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PublicLayout from '@/components/layouts/PublicLayout';
import { ExternalLink } from 'lucide-react';

const CkdResources = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">CKD Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General Resources</TabsTrigger>
                <TabsTrigger value="diet">Diet & Nutrition</TabsTrigger>
                <TabsTrigger value="treatment">Treatment Options</TabsTrigger>
                <TabsTrigger value="support">Support Groups</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Understanding CKD</h2>
                  <p className="text-gray-700">
                    Chronic Kidney Disease (CKD) is a condition characterized by a gradual loss of kidney function over time. 
                    These resources provide general information about CKD, its stages, and management.
                  </p>
                  
                  <div className="grid gap-4 mt-6">
                    <a 
                      href="https://www.kidney.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <h3 className="font-medium">National Kidney Foundation</h3>
                        <p className="text-sm text-gray-500">Comprehensive information on kidney disease and its treatment</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </a>
                    
                    <a 
                      href="https://www.niddk.nih.gov/health-information/kidney-disease" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <h3 className="font-medium">National Institute of Diabetes and Digestive and Kidney Diseases</h3>
                        <p className="text-sm text-gray-500">Government resources on kidney disease research and education</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </a>
                    
                    <a 
                      href="https://www.kidneyfund.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <h3 className="font-medium">American Kidney Fund</h3>
                        <p className="text-sm text-gray-500">Education, clinical research, and financial assistance for patients</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </a>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="diet" className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Diet & Nutrition for CKD Patients</h2>
                  <p className="text-gray-700">
                    Diet plays a crucial role in managing CKD. These resources focus on dietary recommendations and nutritional 
                    guidelines for different stages of kidney disease.
                  </p>
                  
                  <div className="grid gap-4 mt-6">
                    <a 
                      href="https://www.kidney.org/atoz/content/dietckd" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <h3 className="font-medium">Kidney-Friendly Diet</h3>
                        <p className="text-sm text-gray-500">National Kidney Foundation's guide to kidney-friendly eating</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </a>
                    
                    <a 
                      href="https://www.davita.com/diet-nutrition" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <h3 className="font-medium">DaVita Diet Helper</h3>
                        <p className="text-sm text-gray-500">Recipes, meal plans, and nutrition guides for kidney disease</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </a>
                    
                    <a 
                      href="https://www.kidney.org/content/kidney-kitchen" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <h3 className="font-medium">Kidney Kitchen</h3>
                        <p className="text-sm text-gray-500">Kidney-friendly recipes and meal planning tools</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </a>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="treatment" className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Treatment Options</h2>
                  <p className="text-gray-700">
                    Learn about different treatment options for kidney disease, including medication management, 
                    dialysis types, and transplantation.
                  </p>
                  
                  <div className="grid gap-4 mt-6">
                    <a 
                      href="https://www.kidney.org/atoz/content/dialysisinfo" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <h3 className="font-medium">Dialysis Information</h3>
                        <p className="text-sm text-gray-500">Understanding different types of dialysis treatments</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </a>
                    
                    <a 
                      href="https://www.kidney.org/transplantation" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <h3 className="font-medium">Kidney Transplantation</h3>
                        <p className="text-sm text-gray-500">Information about kidney transplant process and living with a transplant</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </a>
                    
                    <a 
                      href="https://www.kidney.org/patients/peers" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <h3 className="font-medium">NKF Peers Program</h3>
                        <p className="text-sm text-gray-500">Connect with someone who's been there to help navigate treatment options</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </a>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="support" className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Support Groups & Community Resources</h2>
                  <p className="text-gray-700">
                    Connect with others experiencing CKD and find emotional support through these resources and communities.
                  </p>
                  
                  <div className="grid gap-4 mt-6">
                    <a 
                      href="https://healthunlocked.com/nkf-patients" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <h3 className="font-medium">NKF Online Community</h3>
                        <p className="text-sm text-gray-500">Online forum for kidney patients, family members, and care partners</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </a>
                    
                    <a 
                      href="https://www.davita.com/treatment-options/patient-stories" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <h3 className="font-medium">Patient Stories</h3>
                        <p className="text-sm text-gray-500">Real-life experiences from people living with kidney disease</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </a>
                    
                    <a 
                      href="https://www.facebook.com/groups/kidneysupportgroup" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <h3 className="font-medium">Kidney Disease Support Groups</h3>
                        <p className="text-sm text-gray-500">Facebook community for kidney disease patients and caregivers</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </a>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default CkdResources;
