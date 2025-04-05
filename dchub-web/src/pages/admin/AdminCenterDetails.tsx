
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, Mail, Users, Clock } from "lucide-react";
import PortalLayout from "@/components/layouts/PortalLayout";
import { fetchCenterById } from '@/api/centerApi';
import { formatOperatingHours } from '@/utils/centerUtils';
import AppointmentSlotManagement from '@/components/admin/appointments/AppointmentSlotManagement';

const AdminCenterDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch center details
  const { data: center, isLoading } = useQuery({
    queryKey: ['center', id],
    queryFn: () => fetchCenterById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <PortalLayout
        portalName="Admin Portal"
        navLinks={[
          { name: "Dashboard", path: "/admin/dashboard" },
          { name: "Centers", path: "/admin/centers" },
          { name: "Users", path: "/admin/users" },
          { name: "Reports", path: "/admin/reports" },
        ]}
        userName="Michael Adams"
        userRole="System Administrator"
        userImage="https://randomuser.me/api/portraits/men/42.jpg"
      >
        <div className="flex justify-center items-center h-64">
          Loading center details...
        </div>
      </PortalLayout>
    );
  }

  if (!center) {
    return (
      <PortalLayout
        portalName="Admin Portal"
        navLinks={[
          { name: "Dashboard", path: "/admin/dashboard" },
          { name: "Centers", path: "/admin/centers" },
          { name: "Users", path: "/admin/users" },
          { name: "Reports", path: "/admin/reports" },
        ]}
        userName="Michael Adams"
        userRole="System Administrator"
        userImage="https://randomuser.me/api/portraits/men/42.jpg"
      >
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-bold mb-4">Center not found</h2>
          <Link to="/admin/centers">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Centers
            </Button>
          </Link>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout
      portalName="Admin Portal"
      navLinks={[
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Centers", path: "/admin/centers" },
        { name: "Users", path: "/admin/users" },
        { name: "Reports", path: "/admin/reports" },
      ]}
      userName="Michael Adams"
      userRole="System Administrator"
      userImage="https://randomuser.me/api/portraits/men/42.jpg"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin/centers">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight ml-2">{center.name}</h1>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Center Information</CardTitle>
                    <CardDescription>Details about this dialysis center.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="mr-2 h-4 w-4 mt-1" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">{center.address.street}</p>
                        <p className="text-muted-foreground">{center.address.city}, {center.address.state} {center.address.zipCode}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-muted-foreground">{center.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">{center.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <div>
                        <p className="font-medium">Capacity</p>
                        <div>
                          <Badge variant={center.currentPatients / center.capacity > 0.9 ? "destructive" : "default"}>
                            {center.currentPatients} / {center.capacity}
                          </Badge>
                          <span className="ml-2 text-muted-foreground">
                            ({Math.round((center.currentPatients / center.capacity) * 100)}% occupied)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Operating Hours</CardTitle>
                    <CardDescription>When this center is open for appointments.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <Clock className="mr-2 h-4 w-4 mt-1" />
                      <div className="space-y-2 w-full">
                        {Object.entries(center.operatingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between w-full">
                            <p className="font-medium capitalize">{day}</p>
                            <p className="text-muted-foreground">{hours}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="appointments">
              <AppointmentSlotManagement centerId={center.id} />
            </TabsContent>
            
            <TabsContent value="staff">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Management</CardTitle>
                  <CardDescription>Manage staff members assigned to this center.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Staff management UI will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="equipment">
              <Card>
                <CardHeader>
                  <CardTitle>Equipment</CardTitle>
                  <CardDescription>Manage dialysis machines and other equipment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Equipment management UI will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PortalLayout>
  );
};

export default AdminCenterDetails;
