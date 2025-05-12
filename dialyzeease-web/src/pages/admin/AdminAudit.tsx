import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Calendar,
  Eye,
  Filter,
  FilePlus,
  FileText,
  FileMinus,
  Search,
  LayoutDashboard,
  Building2,
  Users,
  BookOpen,
  FileBarChart2,
  Bell,
  ClipboardList,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import PortalLayout from "@/components/layouts/PortalLayout";
import { fetchAuditLogs, fetchAuditTables, fetchAuditLogById, AuditLog } from "@/api/auditApi";



const AdminAudit = () => {
  // Set auth token for development environment
  useEffect(() => {
    // Only set this in development environment
    if (process.env.NODE_ENV !== 'production') {
      localStorage.setItem('authToken', 'test-token-for-audit-api');
      console.log('Set test token for audit API');
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [tableFilter, setTableFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch audit logs
  const { data: auditLogsData, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['auditLogs', page, limit, tableFilter, actionFilter, searchTerm],
    queryFn: () => fetchAuditLogs(
      page, 
      limit, 
      {
        table: tableFilter !== 'all' ? tableFilter : undefined,
        action: actionFilter !== 'all' ? actionFilter as any : undefined,
      }
    ),
    staleTime: 60000, // 1 minute
  });

  // Fetch table names for filtering
  const { data: tables = [] } = useQuery({
    queryKey: ['auditTables'],
    queryFn: () => fetchAuditTables(),
    staleTime: 300000, // 5 minutes
  });

  // Fetch log details when a log is selected
  const { data: logDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['auditLogDetails', selectedLog?.id],
    queryFn: () => selectedLog ? fetchAuditLogById(selectedLog.id) : null,
    enabled: !!selectedLog && isDialogOpen,
  });

  // Filter logs based on search term
  const filteredLogs = auditLogsData?.logs?.filter(log => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      log.table.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      (log.changedBy && log.changedBy.toLowerCase().includes(searchLower)) ||
      log.recordId.toString().includes(searchLower)
    );
  }) || [];

  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDialogOpen(true);
    console.log('Viewing log details:', log);
  };

  const getActionDetails = (action: string) => {
    switch (action) {
      case 'create':
        return { icon: <FilePlus className="h-4 w-4" />, color: 'bg-green-500' };
      case 'update':
        return { icon: <FileText className="h-4 w-4" />, color: 'bg-blue-500' };
      case 'delete':
        return { icon: <FileMinus className="h-4 w-4" />, color: 'bg-red-500' };
      default:
        return { icon: <AlertCircle className="h-4 w-4" />, color: 'bg-gray-500' };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      return dateString;
    }
  };

  const formatJsonDisplay = (data: any) => {
    if (!data) return 'No data';
    try {
      if (typeof data === 'string') {
        return JSON.stringify(JSON.parse(data), null, 2);
      }
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  };

  return (
    <PortalLayout
      portalName="Admin Portal"
      navLinks={[
        { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
        { name: "Users", path: "/admin/users", icon: <Users className="h-5 w-5" /> },
        { name: "Centers", path: "/admin/centers", icon: <Building2 className="h-5 w-5" /> },
        { name: "Notifications", path: "/admin/notifications", icon: <Bell className="h-5 w-5" /> },
        { name: "Audit", path: "/admin/audit", icon: <ClipboardList className="h-5 w-5" /> },
        { name: "Education", path: "/admin/education", icon: <BookOpen className="h-5 w-5" /> },
        { name: "Reports", path: "/admin/reports", icon: <FileBarChart2 className="h-5 w-5" /> },
      ]}
      userName="Suwan Ratnayake"
      userRole="Administrator"
      userImage="https://randomuser.me/api/portraits/women/42.jpg"
    >
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">System Audit Logs</h1>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter audit logs by table, action type, or search term
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative w-full sm:w-auto flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={tableFilter} onValueChange={setTableFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by table" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tables</SelectItem>
                    {tables.map((table) => (
                      <SelectItem key={table} value={table}>{table}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Audit Log Records</CardTitle>
            <CardDescription>
              Showing {filteredLogs.length} of {auditLogsData?.pagination?.total || 0} records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingLogs ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading audit logs...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Record ID</TableHead>
                    <TableHead>Changed By</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead className="text-right">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className={`p-1 rounded-full ${getActionDetails(log.action).color} text-white`}>
                            {getActionDetails(log.action).icon}
                          </div>
                          <span className="capitalize">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>{log.table}</TableCell>
                      <TableCell>{log.recordId}</TableCell>
                      <TableCell>{log.changedBy}</TableCell>
                      <TableCell>{formatDate(log.dateTime)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleViewLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No audit logs found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Log Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-full ${selectedLog ? getActionDetails(selectedLog.action).color : ''} text-white`}>
                    {selectedLog && getActionDetails(selectedLog.action).icon}
                  </div>
                  <span>
                    {selectedLog?.action.toUpperCase()} operation on {selectedLog?.table} (ID: {selectedLog?.recordId})
                  </span>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {selectedLog && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Changed By</h3>
                    <p>{selectedLog && selectedLog.changedBy ? (typeof selectedLog.changedBy === 'object' && selectedLog.changedBy !== null && 'name' in selectedLog.changedBy ? selectedLog.changedBy.name : String(selectedLog.changedBy)) : ''}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Timestamp</h3>
                    <p>{formatDate(selectedLog.dateTime)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">IP Address</h3>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{selectedLog.ipAddress}</code>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">User Agent</h3>
                    <p className="text-xs text-muted-foreground truncate">{selectedLog.userAgent}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold mb-2">Data Changes</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs uppercase text-muted-foreground mb-1">Previous Data</h4>
                      <div className="bg-muted rounded-md p-3 overflow-auto max-h-[300px]">
                        <pre className="text-xs whitespace-pre-wrap">{formatJsonDisplay(selectedLog.oldData)}</pre>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase text-muted-foreground mb-1">New Data</h4>
                      <div className="bg-muted rounded-md p-3 overflow-auto max-h-[300px]">
                        <pre className="text-xs whitespace-pre-wrap">{formatJsonDisplay(selectedLog.newData)}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PortalLayout>
  );
};

export default AdminAudit;
