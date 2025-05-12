
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PortalLayout from '@/components/layouts/PortalLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  User,
  Activity,
  FileText
} from "lucide-react";
import { getStaffPatientDetail } from '@/api/staffDialysisApi';
import DialysisSessionRecorder from '@/components/staff/DialysisSessionRecorder';
import CkdMeasurementRecorder from '@/components/staff/CkdMeasurementRecorder';
import { Separator } from '@/components/ui/separator';

// Dashboard navigation links
const navLinks = [
  { name: 'Dashboard', path: '/staff/dashboard', icon: <Calendar className="h-5 w-5" /> },
  { name: 'Appointments', path: '/staff/appointments', icon: <Clock className="h-5 w-5" /> },
  { name: 'Patients', path: '/staff/patients', icon: <Users className="h-5 w-5" /> }
];

const StaffPatientRecords = () => {
  const { patientId } = useParams<{ patientId: string }>();
  
  // Fetch patient details
  const { data: patient, isLoading } = useQuery({
    queryKey: ['staffPatient', patientId],
    queryFn: () => patientId ? getStaffPatientDetail(patientId) : Promise.reject('No patient ID provided'),
    enabled: !!patientId,
  });

  if (isLoading) {
    return (
      <PortalLayout 
        portalName="Staff Portal"
        navLinks={navLinks}
        userName="Sarah Johnson"
        userRole="Nephrologist"
        userImage="https://randomuser.me/api/portraits/women/44.jpg"
      >
        <div className="container mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-40 bg-gray-200 rounded mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </PortalLayout>
    );
  }

  if (!patient) {
    return (
      <PortalLayout 
        portalName="Staff Portal"
        navLinks={navLinks}
        userName="Sarah Johnson"
        userRole="Nephrologist"
        userImage="https://randomuser.me/api/portraits/women/44.jpg"
      >
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-lg font-medium">Patient Not Found</h3>
            <p className="mt-1 text-gray-500">The requested patient could not be found.</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const patientName = `${patient.firstName} ${patient.lastName}`;

  return (
    <PortalLayout 
      portalName="Staff Portal"
      navLinks={navLinks}
      userName="Sarah Johnson"
      userRole="Nephrologist"
      userImage="https://randomuser.me/api/portraits/women/44.jpg"
    >
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold">Patient Records: {patientName}</h1>
          <div className="text-sm text-muted-foreground mt-2 md:mt-0">
            Patient ID: {patient.id}
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Basic patient details and medical information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Demographics</h3>
                <p><span className="font-medium">Date of Birth:</span> {patient.dateOfBirth}</p>
                <p><span className="font-medium">Gender:</span> {patient.gender}</p>
                <p><span className="font-medium">Blood Type:</span> {patient.bloodType}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact</h3>
                <p><span className="font-medium">Phone:</span> {patient.contactPhone}</p>
                <p><span className="font-medium">Email:</span> {patient.contactEmail}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Clinical</h3>
                <p><span className="font-medium">CKD Stage:</span> Stage {patient.ckdStage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="dialysis" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dialysis" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Dialysis History
            </TabsTrigger>
            <TabsTrigger value="ckd" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              CKD Measurements
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dialysis">
            <DialysisSessionRecorder patientId={patient.id} patientName={patientName} />
          </TabsContent>
          
          <TabsContent value="ckd">
            <CkdMeasurementRecorder patientId={patient.id} patientName={patientName} />
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
};

export default StaffPatientRecords;
