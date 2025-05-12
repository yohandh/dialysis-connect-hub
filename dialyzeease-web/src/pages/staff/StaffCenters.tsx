
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PortalLayout from '@/components/layouts/PortalLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Users,
  Building2,
  MapPin,
  Users as UsersIcon
} from "lucide-react";
import { getStaffAssignedCenters, StaffCenter } from '@/api/staffDialysisApi';
import AppointmentSlotManager from '@/components/staff/AppointmentSlotManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Dashboard navigation links
const navLinks = [
  { name: 'Dashboard', path: '/staff/dashboard', icon: <Calendar className="h-5 w-5" /> },
  { name: 'Appointments', path: '/staff/appointments', icon: <Clock className="h-5 w-5" /> },
  { name: 'Patients', path: '/staff/patients', icon: <Users className="h-5 w-5" /> },
  { name: 'Centers', path: '/staff/centers', icon: <Building2 className="h-5 w-5" /> }
];

const StaffCenters = () => {
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  
  // Fetch centers assigned to staff
  const { data: centers = [], isLoading } = useQuery({
    queryKey: ['staffCenters'],
    queryFn: () => getStaffAssignedCenters('staff-001'), // In a real app, this would come from auth context
  });

  // Find selected center data
  const selectedCenter = centers.find(center => center.id === selectedCenterId);

  return (
    <PortalLayout 
      portalName="Staff Portal"
      navLinks={navLinks}
      userName="Sarah Johnson"
      userRole="Nephrologist"
      userImage="https://randomuser.me/api/portraits/women/44.jpg"
    >
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Assigned Centers</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : centers && centers.length > 0 ? (
            centers.map(center => (
              <Card 
                key={center.id} 
                className={`cursor-pointer transition-colors hover:border-primary ${
                  selectedCenterId === center.id ? 'border-2 border-primary' : ''
                }`}
                onClick={() => setSelectedCenterId(center.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{center.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {center.address}, {center.city}, {center.state}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Capacity Utilization</span>
                      <span className="text-sm text-muted-foreground">
                        {center.currentPatients} / {center.totalCapacity} patients
                      </span>
                    </div>
                    <Progress 
                      value={(center.currentPatients / center.totalCapacity) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <UsersIcon className="h-4 w-4 mr-1" />
                    <span>{center.currentPatients} active patients</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Building2 className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No Centers Assigned</h3>
                <p className="text-sm text-muted-foreground">
                  You are not currently assigned to any dialysis centers.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {selectedCenter && (
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="appointments" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Appointment Slots
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Center Details
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments">
              <AppointmentSlotManager centerId={selectedCenter.id} />
            </TabsContent>
            
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Center Details</CardTitle>
                  <CardDescription>
                    Additional information about {selectedCenter.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Location</h3>
                      <p className="mb-1"><span className="font-medium">Address:</span> {selectedCenter.address}</p>
                      <p className="mb-1"><span className="font-medium">City:</span> {selectedCenter.city}</p>
                      <p><span className="font-medium">State:</span> {selectedCenter.state}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Capacity</h3>
                      <p className="mb-1"><span className="font-medium">Total Stations:</span> {selectedCenter.totalCapacity}</p>
                      <p className="mb-1"><span className="font-medium">Current Patients:</span> {selectedCenter.currentPatients}</p>
                      <p><span className="font-medium">Utilization:</span> {Math.round((selectedCenter.currentPatients / selectedCenter.totalCapacity) * 100)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PortalLayout>
  );
};

export default StaffCenters;
