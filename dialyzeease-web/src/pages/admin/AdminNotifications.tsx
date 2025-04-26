import React, { useState } from 'react';
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
  Bell, 
  Calendar, 
  Filter, 
  Mail, 
  MessageSquare, 
  Phone, 
  Search, 
  User, 
  Users,
  Building2,
  BookOpen,
  FileBarChart2,
  LayoutDashboard,
  ClipboardList,
  UserCog,
  Stethoscope,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import PortalLayout from "@/components/layouts/PortalLayout";
import { fetchNotifications, Notification } from '@/api/notificationApi';

const AdminNotifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch notifications using React Query
  const { data: notifications = [], isLoading, isError, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        // Try to fetch from API
        const data = await fetchNotifications();
        console.log('Fetched notifications:', data);
        return data;
      } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }
    },
    retry: 1, // Only retry once to avoid too many failed API calls
  });

  // Handling filters and search
  const filteredNotifications = notifications.filter(notification => {
    // Role filter
    if (roleFilter !== 'all' && notification.recipient_role !== roleFilter) return false;
    
    // Type filter
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    
    // Status filter
    if (statusFilter !== 'all' && notification.status !== statusFilter) return false;
    
    // Search term (case insensitive)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower) ||
        notification.recipient_name.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Format date
  const formatDate = (dateString: string) => {
    try {
      // Handle different date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return as is if invalid
      }
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  // Get icon by notification type
  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'sms':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'app':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Get badge class for role (matching the users section)
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return "bg-red-100 text-red-600 border-red-200";
      case 'staff':
        return "bg-purple-100 text-purple-600 border-purple-200";
      case 'doctor':
        return "bg-blue-100 text-blue-600 border-blue-200";
      case 'patient':
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "";
    }
  };

  // Get badge class for status (matching the users section)
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'sent':
        return "bg-green-100 text-green-600 border-green-200";
      case 'read':
        return "bg-blue-100 text-blue-600 border-blue-200";
      case 'failed':
        return "bg-red-100 text-red-600 border-red-200";
      case 'pending':
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "";
    }
  };

  // Get badge variant by status with consistent colors
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'sent':
        return "success"; // Green
      case 'read':
        return "info"; // Blue
      case 'failed':
        return "destructive"; // Red
      case 'pending':
        return "outline";
      default:
        return "default";
    }
  };

  // Format status text with proper capitalization
  const formatStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return "Sent";
      case 'read':
        return "Read";
      case 'failed':
        return "Failed";
      case 'pending':
        return "Pending";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Get badge variant by role with consistent colors
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return "destructive"; // Red
      case 'staff':
        return "purple"; // Purple
      case 'doctor':
        return "info"; // Blue
      case 'patient':
        return "success"; // Green
      default:
        return "default";
    }
  };

  // Get role icon with consistent colors
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <UserCog className="h-4 w-4 text-red-500" />;
      case 'staff':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'doctor':
        return <Stethoscope className="h-4 w-4 text-blue-500" />;
      case 'patient':
        return <User className="h-4 w-4 text-green-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  // Count notifications by status
  const totalNotifications = notifications.length;
  const sentNotifications = notifications.filter(n => n.status === 'sent').length;
  const readNotifications = notifications.filter(n => n.status === 'read').length;
  const failedNotifications = notifications.filter(n => n.status === 'failed').length;

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
        <h1 className="text-3xl font-bold tracking-tight">Notification Logs</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Notifications</p>
                  <h2 className="text-3xl font-bold">{totalNotifications}</h2>
                  <p className="text-xs text-muted-foreground mt-1">All system notifications</p>
                </div>
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sent</p>
                  <h2 className="text-3xl font-bold">{sentNotifications}</h2>
                  <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
                </div>
                <Mail className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Read</p>
                  <h2 className="text-3xl font-bold">{readNotifications}</h2>
                  <p className="text-xs text-muted-foreground mt-1">Opened by recipients</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Failed</p>
                  <h2 className="text-3xl font-bold">{failedNotifications}</h2>
                  <p className="text-xs text-muted-foreground mt-1">Delivery failures</p>
                </div>
                <Phone className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[120px]">
              <span>Role</span>
              <ChevronDown className="ml-2 h-4 w-4" />
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
            <SelectTrigger className="w-[120px]">
              <span>Type</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="app">App</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <span>Status</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                Loading notifications...
              </div>
            ) : isError ? (
              <div className="flex justify-center items-center h-64">
                Error loading notifications: {error.message}
              </div>
            ) : (
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
                          <span>{notification.recipient_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={`rounded-full px-2 py-1 ${getRoleBadgeClass(notification.recipient_role)}`}
                        >
                          <span className="capitalize">{notification.recipient_role}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getNotificationTypeIcon(notification.type)}
                          <span className="capitalize">{notification.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={`rounded-full px-2 py-1 ${getStatusBadgeClass(notification.status)}`}
                        >
                          {formatStatusText(notification.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(notification.sent_at)}
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
            )}
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
