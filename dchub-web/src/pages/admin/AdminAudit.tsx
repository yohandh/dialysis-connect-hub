import React, { useState, useEffect } from 'react';
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
  ClipboardList
} from "lucide-react";
import { format } from "date-fns";
import PortalLayout from "@/components/layouts/PortalLayout";
import { AuditLog } from "@/types/adminTypes";

// Mock audit log data
const auditLogs: AuditLog[] = [
  {
    id: 1,
    tableName: "users",
    recordId: 101,
    action: "create",
    changedById: 1,
    changedByName: "Michael Adams",
    oldData: null,
    newData: { name: "John Smith", email: "john@example.com", role_id: 3 },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    createdAt: "2023-09-01T09:15:22Z"
  },
  {
    id: 2,
    tableName: "centers",
    recordId: 5,
    action: "update",
    changedById: 1,
    changedByName: "Michael Adams",
    oldData: { name: "Central Dialysis", total_capacity: 20 },
    newData: { name: "Central Dialysis Center", total_capacity: 25 },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    createdAt: "2023-09-02T10:45:30Z"
  },
  {
    id: 3,
    tableName: "appointment_slots",
    recordId: 15,
    action: "delete",
    changedById: 2,
    changedByName: "Sarah Johnson",
    oldData: { center_id: 2, slot_date: "2023-09-10", start_time: "09:00", end_time: "10:00" },
    newData: null,
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    createdAt: "2023-09-03T14:22:45Z"
  },
  {
    id: 4,
    tableName: "education_materials",
    recordId: 8,
    action: "update",
    changedById: 1,
    changedByName: "Michael Adams",
    oldData: { title: "Diet for CKD Stage 3", content: "Original content..." },
    newData: { title: "Diet Recommendations for CKD Stage 3", content: "Updated content..." },
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
    createdAt: "2023-09-04T16:10:05Z"
  },
  {
    id: 5,
    tableName: "center_users",
    recordId: 12,
    action: "create",
    changedById: 3,
    changedByName: "Robert Wilson",
    oldData: null,
    newData: { user_id: 22, center_id: 3, assigned_role: "doctor" },
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 14_7_1)",
    createdAt: "2023-09-05T08:35:18Z"
  }
];

const AdminAudit = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tableFilter, setTableFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Handling filters and search
  const filteredLogs = auditLogs.filter(log => {
    // Table name filter
    if (tableFilter !== 'all' && log.tableName !== tableFilter) return false;
    
    // Action type filter
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    
    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        log.tableName.toLowerCase().includes(searchLower) ||
        log.changedByName?.toLowerCase().includes(searchLower) ||
        log.ipAddress.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // View log details
  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDialogOpen(true);
  };

  // Get action icon and color
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

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      return dateString;
    }
  };

  // Format JSON for display
  const formatJsonDisplay = (data: any) => {
    if (!data) return 'null';
    
    try {
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
      userName="Michael Adams"
      userRole="System Administrator"
      userImage="https://randomuser.me/api/portraits/men/42.jpg"
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">System Audit Logs</h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={tableFilter} onValueChange={setTableFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Table</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tables</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="centers">Centers</SelectItem>
                  <SelectItem value="appointment_slots">Appointments</SelectItem>
                  <SelectItem value="education_materials">Education</SelectItem>
                  <SelectItem value="center_users">Center Users</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Action</span>
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
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Audit Log Records</CardTitle>
            <CardDescription>
              Showing {filteredLogs.length} of {auditLogs.length} records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full ${getActionDetails(log.action).color} text-white`}>
                          {getActionDetails(log.action).icon}
                        </div>
                        <span className="capitalize">{log.action}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {log.tableName.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.recordId}</TableCell>
                    <TableCell>{log.changedByName}</TableCell>
                    <TableCell>{formatDate(log.createdAt)}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {log.ipAddress}
                      </code>
                    </TableCell>
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
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No audit logs found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
                    {selectedLog?.action.toUpperCase()} operation on {selectedLog?.tableName} (ID: {selectedLog?.recordId})
                  </span>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {selectedLog && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Changed By</h3>
                    <p>{selectedLog.changedByName} (ID: {selectedLog.changedById})</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Timestamp</h3>
                    <p>{formatDate(selectedLog.createdAt)}</p>
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
