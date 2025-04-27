import { 
  CircleUser, 
  Hospital, 
  Users, 
  UserPlus,
  UserLock,
  BookOpen, 
  LayoutDashboard,
  FileBarChart2,
  Bell,
  ClipboardList
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
    name: "Dialysis Centers", 
    value: centers.length, 
    icon: <Hospital className="h-6 w-6" />,
    detail: "All centers operational"
  },
  { 
    name: "Total Patients", 
    value: patients.length, 
    icon: <Users className="h-6 w-6 text-green-500" />,
    detail: "+2 since last month"
  },  
  { 
    name: "Doctors", 
    value: doctors.length, 
    icon: <Users className="h-6 w-6 text-blue-500" />,
    detail: "2 specialists"
  },
  { 
    name: "Staff Members", 
    value: users.filter(u => u.roleId === 2).length, 
    icon: <Users className="h-6 w-6 text-purple-500" />,
    detail: "4 in training"
  }  
];

const recentAppointments = [
  { id: 1, patient: "Amal Perera", center: "Asiri Surgical Hospital", date: "2025-05-05", time: "09:00 AM", status: "Booked" },
  { id: 2, patient: "Sanduni Wickramasinghe", center: "The National Institute For Nephrology Dialysis & Transplantation (NINDT)", date: "2025-05-07", time: "10:00 AM", status: "Rescheduled" },
  { id: 3, patient: "Supun Perera", center: "Lanka Hospital", date: "2023-05-28", time: "3:00 PM", status: "Completed" },
  { id: 4, patient: "Nimal Silva", center: "Kings Hospital", date: "2023-05-21", time: "7:00 AM", status: "Cancelled" },
  
  { id: 5, patient: "Dilshan Perera", center: "Nawaloka Hospital", date: "2023-05-21", time: "3:00 PM", status: "Completed" },
];

const patientStatusData = [
  { id: "Active", label: "Active", value: 45 },
  { id: "New (< 30 days)", label: "New (< 30 days)", value: 12 },
  { id: "On Hold", label: "On Hold", value: 5 },
  { id: "Inactive", label: "Inactive", value: 8 },
];

const centerUtilizationData = [
  { center: "NINDT", "Max Capacity": 40, "Current Load": 35 },
  { center: "Surgical", "Max Capacity": 40, "Current Load": 30 },
  { center: "Central", "Max Capacity": 50, "Current Load": 35 },
  { center: "Nawaloka", "Max Capacity": 35, "Current Load": 25 },
  { center: "Kings", "Max Capacity": 25, "Current Load": 20 },
  { center: "Lanka", "Max Capacity": 30, "Current Load": 15 },  
];

const AdminDashboard = () => {
  return (
    <PortalLayout
      portalName="Admin Portal"
      navLinks={[
        { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
        { name: "Users", path: "/admin/users", icon: <Users className="h-5 w-5" /> },
        { name: "Centers", path: "/admin/centers", icon: <Hospital className="h-5 w-5" /> },
        { name: "Notifications", path: "/admin/notifications", icon: <Bell className="h-5 w-5" /> },
        { name: "Audit", path: "/admin/audit", icon: <ClipboardList className="h-5 w-5" /> },
        { name: "Education", path: "/admin/education", icon: <BookOpen className="h-5 w-5" /> },
        { name: "Reports", path: "/admin/reports", icon: <FileBarChart2 className="h-5 w-5" /> },
      ]}
      userName="Suwan Ratnayake"
      userRole="Administrator"
      userImage="https://randomuser.me/api/portraits/women/42.jpg"
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
        {/* <QuickActionCards /> */}
      </div>
    </PortalLayout>
  );
};

export default AdminDashboard;
