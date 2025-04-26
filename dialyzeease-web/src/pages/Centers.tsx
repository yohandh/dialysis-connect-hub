
import React, { useState } from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import { dialysisCenters } from '@/data/centerData';
import { DialysisCenter } from '@/types/centerTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Type guard to check if centerHours is the weekday object format
const isWeekdayHoursObject = (centerHours: DialysisCenter['centerHours']): centerHours is {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
} => {
  if (!centerHours) return false;
  return 'monday' in centerHours;
};

const Centers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('grid');
  
  const filteredCenters = dialysisCenters.filter(center => 
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Dialysis Centers</h1>
          <p className="text-lg text-gray-600 mb-8">
            Find comprehensive information about our network of dialysis centers across the country.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <Input 
              className="max-w-sm" 
              placeholder="Search centers by name, city, or state..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Tabs value={activeView} onValueChange={setActiveView} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Tabs value={activeView} className="w-full">
            <TabsContent value="grid" className="mt-0">
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCenters.map((center) => (
                  <Card key={center.id} className="overflow-hidden">
                    <CardHeader className="bg-medical-blue/5 pb-2">
                      <CardTitle>{center.name}</CardTitle>
                      <CardDescription>
                        {center.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <p><span className="font-medium">Address:</span> {center.address}</p>
                        <p><span className="font-medium">Phone:</span> {center.contactNo}</p>
                        <p><span className="font-medium">Email:</span> {center.email}</p>
                        <p><span className="font-medium">Capacity:</span> {center.totalCapacity} patients</p>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-1">Operating Hours:</h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div>Monday:</div>
                            <div>{isWeekdayHoursObject(center.centerHours) ? center.centerHours.monday : 'N/A'}</div>
                            <div>Tuesday:</div>
                            <div>{isWeekdayHoursObject(center.centerHours) ? center.centerHours.tuesday : 'N/A'}</div>
                            <div>Wednesday:</div>
                            <div>{isWeekdayHoursObject(center.centerHours) ? center.centerHours.wednesday : 'N/A'}</div>
                            <div>Thursday:</div>
                            <div>{isWeekdayHoursObject(center.centerHours) ? center.centerHours.thursday : 'N/A'}</div>
                            <div>Friday:</div>
                            <div>{isWeekdayHoursObject(center.centerHours) ? center.centerHours.friday : 'N/A'}</div>
                            <div>Saturday:</div>
                            <div>{isWeekdayHoursObject(center.centerHours) ? center.centerHours.saturday : 'N/A'}</div>
                            <div>Sunday:</div>
                            <div>{isWeekdayHoursObject(center.centerHours) ? center.centerHours.sunday : 'N/A'}</div>
                          </div>
                        </div>
                        

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="table" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Mon-Fri</TableHead>
                        <TableHead>Weekend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCenters.map((center) => (
                        <TableRow key={center.id}>
                          <TableCell className="font-medium">{center.name}</TableCell>
                          <TableCell>{center.address}</TableCell>
                          <TableCell>{center.contactNo}</TableCell>
                          <TableCell>{center.totalCapacity}</TableCell>
                          <TableCell className="text-xs">{isWeekdayHoursObject(center.centerHours) ? center.centerHours.monday : 'N/A'}</TableCell>
                          <TableCell className="text-xs">
                            Sat: {isWeekdayHoursObject(center.centerHours) ? center.centerHours.saturday : 'N/A'}<br />
                            Sun: {isWeekdayHoursObject(center.centerHours) ? center.centerHours.sunday : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {filteredCenters.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No centers found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Centers;
