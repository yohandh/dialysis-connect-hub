
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { appointments } from '@/data/appointmentData';
import { patients } from '@/data/patientData';
import { users } from '@/data/userData';
import { isSameId, getUserName } from '@/utils/userUtils';
import AppointmentStatusBadge from '@/components/AppointmentStatusBadge';
import PortalLayout from '@/components/layouts/PortalLayout';

// Get today's date in YYYY-MM-DD format for filtering
const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// Dashboard navigation links
const navLinks = [
  { name: 'Dashboard', path: '/staff/dashboard', icon: <Calendar className="h-5 w-5" /> },
  { name: 'Appointments', path: '/staff/appointments', icon: <Clock className="h-5 w-5" /> },
  { name: 'Patients', path: '/staff/patients', icon: <Users className="h-5 w-5" /> }
];

const StaffDashboard = () => {
  // Get today's appointments
  const todayAppointments = appointments.filter(app => app.date === getTodayDate());
  
  // Get patient names for today's appointments
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => isSameId(p.userId, patientId));
    if (!patient) return "Unknown Patient";
    
    const user = users.find(u => isSameId(u.id, patientId));
    return user ? getUserName(user) : "Unknown Patient";
  };

  return (
    <PortalLayout 
      portalName="Staff Portal"
      navLinks={navLinks}
      userName="Sarah Johnson"
      userRole="Nephrologist"
      userImage="https://randomuser.me/api/portraits/women/44.jpg"
    >
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="bg-medical-blue/5 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-medical-blue text-lg">Today's Stats</CardTitle>
              <Calendar className="h-5 w-5 text-medical-blue" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-medical-blue">
                    {todayAppointments.length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Appointments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-medical-blue">
                    {todayAppointments.filter(a => a.status === 'booked').length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Confirmed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-medical-blue/5 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-medical-blue text-lg">Dialysis Center</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-xl font-bold">Westside Dialysis Center</div>
                <div className="text-sm text-gray-500 mt-1">15 Dialysis Stations</div>
                <Badge className="mt-2 bg-success-green">Fully Operational</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-medical-blue/5 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-medical-blue text-lg">Patients</CardTitle>
              <Users className="h-5 w-5 text-medical-blue" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-medical-blue">
                    {patients.length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Total Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-danger-red">
                    {patients.filter(p => p.ckdStage >= 4).length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Critical Cases</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="bg-medical-blue/5">
            <CardTitle className="text-medical-blue">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayAppointments.length > 0 ? (
                  todayAppointments.map(appointment => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {appointment.startTime} - {appointment.endTime}
                      </TableCell>
                      <TableCell className="font-medium">
                        {appointment.patientId ? getPatientName(appointment.patientId) : "Available Slot"}
                      </TableCell>
                      <TableCell className="capitalize">{appointment.type}</TableCell>
                      <TableCell>
                        <AppointmentStatusBadge status={appointment.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No appointments scheduled for today
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default StaffDashboard;
