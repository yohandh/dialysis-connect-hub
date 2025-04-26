import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";

// Public Website Routes
import Index from "./pages/Index";
import Centers from "./pages/Centers";
import CkdAwareness from "./pages/CkdAwareness";
import Contact from "./pages/Contact";

// Staff Portal Routes
import StaffLogin from "./pages/staff/StaffLogin";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffAppointments from "./pages/staff/StaffAppointments";
import StaffPatients from "./pages/staff/StaffPatients";
import StaffPatientDetails from "./pages/staff/StaffPatientDetails";
import StaffAccountSettings from "./pages/staff/StaffAccountSettings";

// Patient Portal Routes
import PatientLogin from "./pages/patient/PatientLogin";
import PatientRegister from "./pages/patient/PatientRegister";
import PatientVerifyEmail from "./pages/patient/PatientVerifyEmail";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientCalendar from "./pages/patient/PatientCalendar";
import PatientBook from "./pages/patient/PatientBook";
import PatientCkdStage from "./pages/patient/PatientCkdStage";
import PatientRecommendations from "./pages/patient/PatientRecommendations";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientNotifications from "./pages/patient/PatientNotifications";
import PatientEducation from "./pages/patient/PatientEducation";
import PatientAppointmentDetails from "./pages/patient/PatientAppointmentDetails";

// Admin Portal Routes
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCenters from "./pages/admin/AdminCenters";
import AdminCenterDetails from "./pages/admin/AdminCenterDetails";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEducation from "./pages/admin/AdminEducation";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminReports from "./pages/admin/AdminReports";
import AdminAccountSettings from "./pages/admin/AdminAccountSettings";


// Resources Pages
import UserGuide from "./pages/resources/UserGuide";
import Faq from "./pages/resources/Faq";
import CkdResources from "./pages/resources/CkdResources";
import Support from "./pages/resources/Support";

// Other
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/centers" element={<Centers />} />
          <Route path="/ckd-awareness" element={<CkdAwareness />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Redirect routes for portal entry points */}
          <Route path="/patient" element={<Navigate to="/patient/login" replace />} />
          <Route path="/staff" element={<Navigate to="/staff/login" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          
          {/* Patient Portal Routes */}
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/register" element={<PatientRegister />} />
          <Route path="/patient/verify-email" element={<PatientVerifyEmail />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/calendar" element={<PatientCalendar />} />
          <Route path="/patient/book" element={<PatientBook />} />
          <Route path="/patient/ckd-stage" element={<PatientCkdStage />} />
          <Route path="/patient/recommendations" element={<PatientRecommendations />} />
          <Route path="/patient/notifications" element={<PatientNotifications />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          <Route path="/patient/education" element={<PatientEducation />} />
          <Route path="/patient/education/:id" element={<PatientEducation />} />
          <Route path="/patient/appointments/:id" element={<PatientAppointmentDetails />} />
          
          {/* Staff Portal Routes */}
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/patients" element={<StaffPatients />} />
          <Route path="/staff/patient/:id" element={<StaffPatientDetails />} />
          <Route path="/staff/patient/:id/records" element={<StaffPatientDetails />} />
          <Route path="/staff/appointments" element={<StaffAppointments />} />
          <Route path="/staff/account-settings" element={<StaffAccountSettings />} />
          
          {/* Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/centers" element={<AdminCenters />} />
          <Route path="/admin/centers/:id" element={<AdminCenterDetails />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/education" element={<AdminEducation />} />
          <Route path="/admin/audit" element={<AdminAudit />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />

          <Route path="/admin/account-settings" element={<AdminAccountSettings />} />
          
          {/* Resource Routes */}
          <Route path="/resources/guide" element={<UserGuide />} />
          <Route path="/resources/faq" element={<Faq />} />
          <Route path="/resources/ckd" element={<CkdResources />} />
          <Route path="/support" element={<Support />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
