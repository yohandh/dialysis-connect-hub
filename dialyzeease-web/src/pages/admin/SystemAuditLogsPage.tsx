import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/layouts/AdminLayout';
import SystemAuditLogs from '@/components/admin/audit/SystemAuditLogs';

const SystemAuditLogsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>System Audit Logs | DialyzeEase</title>
      </Helmet>
      <AdminLayout>
        <SystemAuditLogs />
      </AdminLayout>
    </>
  );
};

export default SystemAuditLogsPage;
