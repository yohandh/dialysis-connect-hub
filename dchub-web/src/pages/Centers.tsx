
import React, { useState } from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import { dialysisCenters } from '@/data/centerData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Centers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('grid');
  
  const filteredCenters = dialysisCenters.filter(center => 
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.address.state.toLowerCase().includes(searchTerm.toLowerCase())
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
                        {center.address.city}, {center.address.state} {center.address.zipCode}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <p><span className="font-medium">Address:</span> {center.address.street}</p>
                        <p><span className="font-medium">Phone:</span> {center.phone}</p>
                        <p><span className="font-medium">Email:</span> {center.email}</p>
                        <p><span className="font-medium">Capacity:</span> {center.currentPatients} / {center.capacity} patients</p>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-1">Operating Hours:</h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div>Monday:</div>
                            <div>{center.centerHours.monday}</div>
                            <div>Tuesday:</div>
                            <div>{center.centerHours.tuesday}</div>
                            <div>Wednesday:</div>
                            <div>{center.centerHours.wednesday}</div>
                            <div>Thursday:</div>
                            <div>{center.centerHours.thursday}</div>
                            <div>Friday:</div>
                            <div>{center.centerHours.friday}</div>
                            <div>Saturday:</div>
                            <div>{center.centerHours.saturday}</div>
                            <div>Sunday:</div>
                            <div>{center.centerHours.sunday}</div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-1">Nephrologists:</h4>
                          <ul className="list-disc list-inside text-sm">
                            {center.nephrologists.map((doctor, i) => (
                              <li key={i}>{doctor}</li>
                            ))}
                          </ul>
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
                          <TableCell>{center.address.city}, {center.address.state}</TableCell>
                          <TableCell>{center.phone}</TableCell>
                          <TableCell>{center.currentPatients}/{center.capacity}</TableCell>
                          <TableCell className="text-xs">{center.centerHours.monday}</TableCell>
                          <TableCell className="text-xs">
                            Sat: {center.centerHours.saturday}<br />
                            Sun: {center.centerHours.sunday}
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
