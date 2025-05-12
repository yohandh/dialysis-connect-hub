import React from 'react';
import PortalLayout from '@/components/layouts/PortalLayout';
import SystemAuditLogs from '@/components/admin/audit/SystemAuditLogs';

const AdminAuditLogs = () => {
  return (
    <PortalLayout
      portalName="Admin Portal"
      navLinks={[
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Users", path: "/admin/users" },
        { name: "Centers", path: "/admin/centers" },
        { name: "Notifications", path: "/admin/notifications" },
        { name: "Audit", path: "/admin/audit-logs" },
        { name: "Education", path: "/admin/education" },
        { name: "Reports", path: "/admin/reports" },
      ]}
      userName="Suwan Ratnayake"
      userRole="Administrator"
      userImage="https://randomuser.me/api/portraits/women/42.jpg"
    >
      <SystemAuditLogs />
    </PortalLayout>
  );
};

export default AdminAuditLogs;
