import { useMockApi, apiCall } from '@/config/api.config';

export interface AuditLog {
  id: number;
  table: string;
  recordId: number;
  action: 'create' | 'update' | 'delete';
  changedBy: string;
  changedById: number | null;
  oldData: any;
  newData: any;
  ipAddress: string;
  userAgent: string;
  dateTime: string;
}

export interface AuditLogDetail extends Omit<AuditLog, 'changedBy'> {
  changedBy: {
    id: number | null;
    name: string;
    email: string | null;
  };
}

export interface AuditLogsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: AuditLogsPagination;
}

// Get all audit logs with pagination and filtering
export const fetchAuditLogs = async (
  page = 1,
  limit = 10,
  filters?: {
    table?: string;
    action?: 'create' | 'update' | 'delete';
    startDate?: string;
    endDate?: string;
  }
): Promise<AuditLogsResponse> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (filters) {
      if (filters.table) {
        queryParams.append('table', filters.table);
      }
      if (filters.action) {
        queryParams.append('action', filters.action);
      }
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate);
      }
    }
    
    // Use the common apiCall function
    const response = await apiCall<AuditLogsResponse>(`/audit-logs?${queryParams.toString()}`);
    console.log('API Response - Audit Logs:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    throw error;
  }
};

// Get distinct table names from audit logs
export const fetchAuditTables = async (): Promise<string[]> => {
  try {
    // Use the common apiCall function
    const response = await apiCall<string[]>('/audit-logs/tables');
    console.log('API Response - Audit Tables:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch audit tables:', error);
    throw error;
  }
};

// Get audit log details by ID
export const fetchAuditLogById = async (id: number): Promise<AuditLog> => {
  try {
    // Use the common apiCall function
    const response = await apiCall<AuditLog>(`/audit-logs/${id}`);
    console.log('API Response - Audit Log Details:', response);
    return response;
  } catch (error) {
    console.error(`Failed to fetch audit log with ID ${id}:`, error);
    throw error;
  }
};
