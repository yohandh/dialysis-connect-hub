import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, Calendar, Filter, Download } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Pagination } from "@/components/ui/custom-pagination";
import { useToast } from "@/hooks/use-toast";
import { fetchAuditLogs, fetchAuditTables, fetchAuditLogById, AuditLog, AuditLogDetail } from "@/api/auditApi";

interface SystemAuditLogsProps {
  // No props needed for now
}

const SystemAuditLogs: React.FC<SystemAuditLogsProps> = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedLog, setSelectedLog] = useState<AuditLogDetail | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<{
    table: string;
    action: string;
    dateRange: { from?: Date; to?: Date } | undefined;
  }>({
    table: '',
    action: '',
    dateRange: undefined
  });

  // Fetch audit logs
  const { 
    data: auditLogsData, 
    isLoading: isLoadingLogs,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ['auditLogs', page, limit, filters],
    queryFn: () => fetchAuditLogs(
      page, 
      limit, 
      {
        table: filters.table || undefined,
        action: filters.action as any || undefined,
        startDate: filters.dateRange?.from ? format(filters.dateRange.from, 'yyyy-MM-dd') : undefined,
        endDate: filters.dateRange?.to ? format(filters.dateRange.to, 'yyyy-MM-dd') : undefined
      }
    )
  });

  // Fetch table names for filtering
  const { data: tables = [] } = useQuery({
    queryKey: ['auditTables'],
    queryFn: () => fetchAuditTables()
  });

  // Fetch log details
  const { 
    data: logDetails,
    isLoading: isLoadingDetails,
    refetch: refetchDetails
  } = useQuery({
    queryKey: ['auditLogDetails', selectedLog?.id],
    queryFn: () => selectedLog ? fetchAuditLogById(selectedLog.id) : null,
    enabled: !!selectedLog,
    onSuccess: (data) => {
      if (data) {
        setSelectedLog(data);
      }
    }
  });

  // Handle view details
  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log as any);
    setIsDetailsDialogOpen(true);
    // Fetch details if needed
    if (log.id) {
      refetchDetails();
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  };

  // Handle export
  const handleExport = () => {
    // Implementation for exporting logs
    toast({
      title: "Export started",
      description: "Your audit logs export is being prepared."
    });
  };

  // Format action badge
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Create</Badge>;
      case 'update':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Update</Badge>;
      case 'delete':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Delete</Badge>;
      default:
        return <Badge>{action}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>System Audit Logs</CardTitle>
          <CardDescription>
            View and monitor all system activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Select 
                value={filters.table} 
                onValueChange={(value) => handleFilterChange('table', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Table" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Tables</SelectItem>
                  {tables.map((table) => (
                    <SelectItem key={table} value={table}>{table}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <Select 
                value={filters.action} 
                onValueChange={(value) => handleFilterChange('action', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[300px]">
              <DateRangePicker
                value={filters.dateRange}
                onChange={(range) => handleFilterChange('dateRange', range)}
                placeholder="Filter by Date Range"
              />
            </div>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => refetchLogs()}
            >
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
          
          {/* Audit Log Records */}
          <div>
            <h3 className="text-lg font-medium mb-2">Audit Log Records</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {auditLogsData?.pagination ? 
                `Showing ${(page - 1) * limit + 1} to ${Math.min(page * limit, auditLogsData.pagination.total)} of ${auditLogsData.pagination.total} records` : 
                'Loading records...'}
            </p>
            
            {isLoadingLogs ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : auditLogsData?.logs && auditLogsData.logs.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Action</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Record ID</TableHead>
                      <TableHead>Changed By</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogsData.logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell className="font-medium">{log.table}</TableCell>
                        <TableCell>{log.recordId}</TableCell>
                        <TableCell>{log.changedBy}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {format(new Date(log.dateTime), 'MMM dd, yyyy HH:mm:ss')}
                          </div>
                        </TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Pagination */}
                {auditLogsData.pagination && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">
                        Rows per page:
                      </p>
                      <Select
                        value={limit.toString()}
                        onValueChange={(value) => {
                          setLimit(Number(value));
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="h-8 w-[70px]">
                          <SelectValue placeholder={limit.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Pagination
                      currentPage={page}
                      totalPages={auditLogsData.pagination.totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md border-dashed">
                <Filter className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No audit logs found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No audit logs match your current filters.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilters({ table: '', action: '', dateRange: undefined });
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Log Details Dialog */}
      {selectedLog && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Audit Log Details</DialogTitle>
              <DialogDescription>
                Detailed information about this audit log entry.
              </DialogDescription>
            </DialogHeader>
            
            {isLoadingDetails ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Action:</h3>
                    <p>{getActionBadge(selectedLog.action)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Date & Time:</h3>
                    <p>{format(new Date(selectedLog.dateTime), 'MMM dd, yyyy HH:mm:ss')}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Table:</h3>
                    <p>{selectedLog.table}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Record ID:</h3>
                    <p>{selectedLog.recordId}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Changed By:</h3>
                    <p>
                      {logDetails?.changedBy.name || selectedLog.changedBy}
                      {logDetails?.changedBy.email && ` (${logDetails.changedBy.email})`}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">IP Address:</h3>
                    <p>{selectedLog.ipAddress}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">User Agent:</h3>
                  <p className="text-sm bg-muted p-2 rounded">{selectedLog.userAgent}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h3 className="font-medium mb-2">Previous Data:</h3>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-[300px]">
                      {selectedLog.oldData ? JSON.stringify(selectedLog.oldData, null, 2) : 'No previous data'}
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">New Data:</h3>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-[300px]">
                      {selectedLog.newData ? JSON.stringify(selectedLog.newData, null, 2) : 'No new data'}
                    </pre>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SystemAuditLogs;
