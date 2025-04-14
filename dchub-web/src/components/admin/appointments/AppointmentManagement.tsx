import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentSlotManagement from './AppointmentSlotManagement';
import AppointmentList from './AppointmentList';
import { useParams } from 'react-router-dom';

interface AppointmentManagementProps {
  centerId?: string;
}

const AppointmentManagement: React.FC<AppointmentManagementProps> = ({ centerId: propCenterId }) => {
  const { centerId: routeCenterId } = useParams<{ centerId: string }>();
  const [activeTab, setActiveTab] = useState("appointments");
  
  // Use centerId from props if provided, otherwise use from route params
  const centerId = propCenterId || routeCenterId;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Management</CardTitle>
          <CardDescription>
            Manage appointments and appointment slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="slots">Appointment Slots</TabsTrigger>
            </TabsList>
            <TabsContent value="appointments" className="mt-4">
              <AppointmentList centerId={centerId} />
            </TabsContent>
            <TabsContent value="slots" className="mt-4">
              <AppointmentSlotManagement centerId={centerId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentManagement;
