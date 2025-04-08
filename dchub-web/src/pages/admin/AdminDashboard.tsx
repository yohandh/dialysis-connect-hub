
import React from 'react';
import { 
  CalendarIcon, 
  CircleUser, 
  CircleDot, 
  Building2, 
  Users, 
  BookOpen, 
  LayoutDashboard,
  FileBarChart2
} from "lucide-react";
import PortalLayout from "@/components/layouts/PortalLayout";
import { patients, users, centers, doctors } from '@/data/adminMockData';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import PatientStatusChart from '@/components/admin/dashboard/PatientStatusChart';
import CenterUtilizationChart from '@/components/admin/dashboard/CenterUtilizationChart';
import RecentAppointmentsTable from '@/components/admin/dashboard/RecentAppointmentsTable';
import QuickActionCards from '@/components/admin/dashboard/QuickActionCards';

// Mock dashboard data
const dashboardStats = [
  { 
    name: "Total Patients", 
    value: patients.length, 
    icon: <CircleUser className="h-6 w-6" />,
    detail: "+2 since last month"
  },
  { 
    name: "Dialysis Centers", 
    value: centers.length, 
    icon: <Building2 className="h-6 w-6" />,
    detail: "All centers operational"
  },
  { 
    name: "Staff Members", 
    value: users.filter(u => u.roleId === 2).length, 
    icon: <Users className="h-6 w-6" />,
    detail: "4 in training"
  },
  { 
    name: "Doctors", 
    value: doctors.length, 
    icon: <CircleDot className="h-6 w-6" />,
    detail: "2 specialists"
  },
];

const recentAppointments = [
  { id: 1, patient: "John Smith", center: "Metro Dialysis Center", date: "2023-05-20", time: "10:00 AM", status: "completed" },
  { id: 2, patient: "Maria Rodriguez", center: "Central Kidney Care", date: "2023-05-20", time: "2:30 PM", status: "completed" },
  { id: 3, patient: "Robert Johnson", center: "Riverside Renal Center", date: "2023-05-21", time: "9:15 AM", status: "booked" },
  { id: 4, patient: "Emily Chen", center: "Highland Dialysis", date: "2023-05-21", time: "11:45 AM", status: "booked" },
  { id: 5, patient: "Michael Brown", center: "Metro Dialysis Center", date: "2023-05-21", time: "3:00 PM", status: "rescheduled" },
];

const patientStatusData = [
  { id: "Active", label: "Active", value: 45 },
  { id: "New (< 30 days)", label: "New (< 30 days)", value: 12 },
  { id: "On Hold", label: "On Hold", value: 5 },
  { id: "Inactive", label: "Inactive", value: 8 },
];

const centerUtilizationData = [
  { center: "Metro", maxCapacity: 50, currentLoad: 42 },
  { center: "Central", maxCapacity: 40, currentLoad: 35 },
  { center: "Riverside", maxCapacity: 35, currentLoad: 28 },
  { center: "Highland", maxCapacity: 25, currentLoad: 21 },
  { center: "Eastside", maxCapacity: 30, currentLoad: 26 },
];

const AdminDashboard = () => {
  return (
    <PortalLayout
      portalName="Admin Portal"
      navLinks={[
        { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
        { name: "Centers", path: "/admin/centers", icon: <Building2 className="h-5 w-5" /> },
        { name: "Users", path: "/admin/users", icon: <Users className="h-5 w-5" /> },
        { name: "Education", path: "/admin/education", icon: <BookOpen className="h-5 w-5" /> },
        { name: "Reports", path: "/admin/reports", icon: <FileBarChart2 className="h-5 w-5" /> },
      ]}
      userName="Michael Adams"
      userRole="System Administrator"
      userImage="https://randomuser.me/api/portraits/men/42.jpg"
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        
        {/* Quick Stats */}
        <DashboardStats stats={dashboardStats} />
        
        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Patient Status Chart */}
          <PatientStatusChart data={patientStatusData} />
          
          {/* Center Utilization Chart */}
          <CenterUtilizationChart data={centerUtilizationData} />
        </div>
        
        {/* Recent Appointments Table */}
        <RecentAppointmentsTable appointments={recentAppointments} />

        {/* Quick Actions */}
        <QuickActionCards />
      </div>
    </PortalLayout>
  );
};

export default AdminDashboard;
