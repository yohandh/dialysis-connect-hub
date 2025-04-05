
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  BellRing, 
  Calendar, 
  Filter, 
  Mail, 
  MessageSquare, 
  Phone, 
  Search, 
  User, 
  Users 
} from "lucide-react";
import { format } from "date-fns";
import PortalLayout from "@/components/layouts/PortalLayout";
import { Notification } from '@/types/adminTypes';

// Mock notification data
const notifications: Notification[] = [
  {
    id: 1,
    recipientId: 101,
    recipientName: "John Smith",
    recipientRole: "patient",
    title: "Appointment Reminder",
    message: "This is a reminder for your dialysis appointment tomorrow at 10:00 AM.",
    type: "email",
    status: "sent",
    sentAt: "2023-09-01T09:15:22Z"
  },
  {
    id: 2,
    recipientId: 102,
    recipientName: "Emily Johnson",
    recipientRole: "patient",
    title: "Lab Results Ready",
    message: "Your recent lab results are now available. Please log in to view them.",
    type: "app",
    status: "read",
    sentAt: "2023-09-02T10:45:30Z"
  },
  {
    id: 3,
    recipientId: 5,
    recipientName: "Dr. Michael Chen",
    recipientRole: "doctor",
    title: "Urgent: Patient Status Change",
    message: "Patient #108 has reported adverse symptoms. Please review their case immediately.",
    type: "sms",
    status: "sent",
    sentAt: "2023-09-03T14:22:45Z"
  },
  {
    id: 4,
    recipientId: 12,
    recipientName: "Sarah Williams",
    recipientRole: "staff",
    title: "Staff Meeting Reminder",
    message: "This is a reminder for the staff meeting tomorrow at 9:00 AM in Room 301.",
    type: "email",
    status: "sent",
    sentAt: "2023-09-04T16:10:05Z"
  },
  {
    id: 5,
    recipientId: 2,
    recipientName: "Robert Davis",
    recipientRole: "admin",
    title: "System Update Complete",
    message: "The scheduled system maintenance has been completed successfully.",
    type: "app",
    status: "sent",
    sentAt: "2023-09-05T08:35:18Z"
  },
  {
    id: 6,
    recipientId: 103,
    recipientName: "Maria Garcia",
    recipientRole: "patient",
    title: "Medication Update",
    message: "Your medication regimen has been updated. Please review the changes.",
    type: "sms",
    status: "failed",
    sentAt: "2023-09-06T11:20:33Z"
  }
];

const AdminNotifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Handling filters and search
  const filteredNotifications = notifications.filter(notification => {
    // Role filter
    if (roleFilter !== 'all' && notification.recipientRole !== roleFilter) return false;
    
    // Type filter
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    
    // Status filter
    if (statusFilter !== 'all' && notification.status !== statusFilter) return false;
    
    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.recipientName?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  // Get icon by notification type
  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <Phone className="h-4 w-4" />;
      case 'app':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <BellRing className="h-4 w-4" />;
    }
  };

  // Get badge variant by status
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'sent':
        return "default";
      case 'read':
        return "secondary";
      case 'failed':
        return "destructive";
      default:
        return "outline";
    }
  };

  // Get badge variant by role
  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (role) {
      case 'admin':
        return "destructive";
      case 'doctor':
        return "default";
      case 'staff':
        return "secondary";
      case 'patient':
        return "outline";
      default:
        return "outline";
    }
  };

  // Summary counts
  const summaryCounts = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    read: notifications.filter(n => n.status === 'read').length,
    failed: notifications.filter(n => n.status === 'failed').length
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Users className="h-4 w-4" />;
      case 'doctor':
      case 'staff':
      case 'patient':
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <PortalLayout
      portalName="Admin Portal"
      navLinks={[
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Centers", path: "/admin/centers" },
        { name: "Users", path: "/admin/users" },
        { name: "Education", path: "/admin/education" },
        { name: "Notifications", path: "/admin/notifications" },
        { name: "Audit Logs", path: "/admin/audit-logs" },
        { name: "Reports", path: "/admin/reports" },
      ]}
      userName="Michael Adams"
      userRole="System Administrator"
      userImage="https://randomuser.me/api/portraits/men/42.jpg"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Notification Logs</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notifications..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
              <BellRing className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryCounts.total}</div>
              <p className="text-xs text-muted-foreground">
                All system notifications
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sent</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryCounts.sent}</div>
              <p className="text-xs text-muted-foreground">
                Successfully delivered
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Read</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryCounts.read}</div>
              <p className="text-xs text-muted-foreground">
                Opened by recipients
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryCounts.failed}</div>
              <p className="text-xs text-muted-foreground">
                Delivery failures
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-4 mb-4">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Role</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Type</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="app">App</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Status</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{notification.recipientName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(notification.recipientRole)}>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(notification.recipientRole)}
                          <span className="capitalize">{notification.recipientRole}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getNotificationTypeIcon(notification.type)}
                        <span className="capitalize">{notification.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(notification.status)}>
                        {notification.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(notification.sentAt)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredNotifications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No notifications found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Note: Message content is only shown for non-patient notifications for privacy reasons.</p>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminNotifications;
