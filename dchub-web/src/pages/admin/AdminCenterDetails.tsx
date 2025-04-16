import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Clock,
  LayoutDashboard,
  Building2,
  Bell,
  ClipboardList,
  BookOpen,
  FileBarChart2
} from "lucide-react";
import PortalLayout from "@/components/layouts/PortalLayout";
import { fetchCenterById } from '@/api/centerApi';
import { formatOperatingHours } from '@/utils/centerUtils';
import AppointmentSlotManagement from '@/components/admin/appointments/AppointmentSlotManagement';
import BedManagement from '@/components/admin/equipments/BedManagement';
import SessionManagement from '@/components/admin/sessions/SessionManagement';
import ScheduleSessionManagement from '@/components/admin/schedules/ScheduleSessionManagement';

interface Center {
  id: number;
  name: string;
  address: string;
  contactNo: string;
  email: string;
  totalCapacity: number;
  centerHours: { [day: string]: string };
}

const AdminCenterDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const [formattedHours, setFormattedHours] = useState<Record<string, string>>({});

  // Fetch center details
  const { data: center, isLoading } = useQuery({
    queryKey: ['center', id],
    queryFn: () => fetchCenterById(id!),
    enabled: !!id,
  });

  // Format center hours when center data is loaded
  useEffect(() => {
    if (center && center.centerHours) {
      console.log('Center hours data:', center.centerHours);
      
      // Check if centerHours is an array (from API) or object (already formatted)
      if (Array.isArray(center.centerHours)) {
        // Format hours from array format to object format
        const hoursMap: Record<string, string> = {};
        
        // Create a mapping from short day names to full day names
        const dayMap: Record<string, string> = {
          'mon': 'monday',
          'tue': 'tuesday',
          'wed': 'wednesday',
          'thu': 'thursday',
          'fri': 'friday',
          'sat': 'saturday',
          'sun': 'sunday'
        };
        
        center.centerHours.forEach(hour => {
          const day = dayMap[hour.weekday] || hour.weekday;
          
          if (hour.openTime && hour.closeTime) {
            // Format time from 24-hour to 12-hour format
            const formatTime = (timeStr: string) => {
              const [hours, minutes] = timeStr.split(':');
              const hourNum = parseInt(hours, 10);
              const ampm = hourNum >= 12 ? 'PM' : 'AM';
              const hour12 = hourNum % 12 || 12; // Convert 0 to 12 for 12 AM
              return `${hour12}:${minutes} ${ampm}`;
            };
            
            const openTimeFormatted = formatTime(hour.openTime);
            const closeTimeFormatted = formatTime(hour.closeTime);
            
            hoursMap[day] = `${openTimeFormatted} - ${closeTimeFormatted}`;
          } else {
            hoursMap[day] = 'Closed';
          }
        });
        
        // Sort the hours by day of week
        const sortedHours = Object.fromEntries(
          Object.entries(hoursMap).sort(([dayA], [dayB]) => {
            const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            return daysOfWeek.indexOf(dayA) - daysOfWeek.indexOf(dayB);
          })
        );
        
        setFormattedHours(sortedHours);
      } else {
        // If centerHours is already an object, use it directly
        setFormattedHours(center.centerHours);
      }
    }
  }, [center]);

  if (isLoading) {
    return (
      <PortalLayout
        portalName="Admin Portal"
        navLinks={[
          { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
          { name: "Users", path: "/admin/users", icon: <Users className="h-5 w-5" /> },
          { name: "Centers", path: "/admin/centers", icon: <Building2 className="h-5 w-5" /> },
          { name: "Notifications", path: "/admin/notifications", icon: <Bell className="h-5 w-5" /> },
          { name: "Audit", path: "/admin/audit", icon: <ClipboardList className="h-5 w-5" /> },
          { name: "Education", path: "/admin/education", icon: <BookOpen className="h-5 w-5" /> },
          { name: "Reports", path: "/admin/reports", icon: <FileBarChart2 className="h-5 w-5" /> },
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
          { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
          { name: "Users", path: "/admin/users", icon: <Users className="h-5 w-5" /> },
          { name: "Centers", path: "/admin/centers", icon: <Building2 className="h-5 w-5" /> },
          { name: "Notifications", path: "/admin/notifications", icon: <Bell className="h-5 w-5" /> },
          { name: "Audit", path: "/admin/audit", icon: <ClipboardList className="h-5 w-5" /> },
          { name: "Education", path: "/admin/education", icon: <BookOpen className="h-5 w-5" /> },
          { name: "Reports", path: "/admin/reports", icon: <FileBarChart2 className="h-5 w-5" /> },
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
        { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
        { name: "Users", path: "/admin/users", icon: <Users className="h-5 w-5" /> },
        { name: "Centers", path: "/admin/centers", icon: <Building2 className="h-5 w-5" /> },
        { name: "Notifications", path: "/admin/notifications", icon: <Bell className="h-5 w-5" /> },
        { name: "Audit", path: "/admin/audit", icon: <ClipboardList className="h-5 w-5" /> },
        { name: "Education", path: "/admin/education", icon: <BookOpen className="h-5 w-5" /> },
        { name: "Reports", path: "/admin/reports", icon: <FileBarChart2 className="h-5 w-5" /> },
      ]}
      userName="Michael Adams"
      userRole="System Administrator"
      userImage="https://randomuser.me/api/portraits/men/42.jpg"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold tracking-tight ml-2">{center.name}</h1>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="equipments">Equipments</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="schedules">Schedule Sessions</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Center Information</CardTitle>
                    <CardDescription>Basic details about this dialysis center.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="mr-2 h-4 w-4 mt-1" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">{center.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-muted-foreground">{center.contactNo}</p>
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
                          <Badge variant="default">
                            {center.totalCapacity}
                          </Badge>
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
                        {Object.keys(formattedHours).length > 0 ? (
                          Object.entries(formattedHours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between w-full">
                              <p className="font-medium capitalize w-3/5  ">{day}</p>
                              <p className="text-muted-foreground text-left w-2/5">{hours}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground py-2">
                            No operating hours available
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="equipments">
              <Card>
                <CardHeader>
                  <CardTitle>Equipments</CardTitle>
                  <CardDescription>Manage dialysis beds, machines and other equipments.</CardDescription>
                </CardHeader>
                <CardContent>
                  <BedManagement centerId={center.id.toString()} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle>Recurring Sessions</CardTitle>
                  <CardDescription>Define and manage recurring dialysis sessions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SessionManagement centerId={center.id.toString()} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedules">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Sessions</CardTitle>
                  <CardDescription>Schedule dialysis sessions for specific dates.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScheduleSessionManagement centerId={center.id.toString()} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appointments">
              <AppointmentSlotManagement centerId={center.id.toString()} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PortalLayout>
  );
};

export default AdminCenterDetails;
