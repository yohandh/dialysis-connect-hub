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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ChevronDown, UserPlus, Settings, User, Users, Search, Filter, LayoutDashboard, Building2, BookOpen, FileBarChart2, Bell, ClipboardList, UserCog } from "lucide-react";
import PortalLayout from "@/components/layouts/PortalLayout";
import { useUserManagement } from '@/hooks/useUserManagement';
import UserFormDialog from '@/components/admin/UserFormDialog';
import UserDetailsDialog from '@/components/admin/UserDetailsDialog';
import { fetchUsers } from '@/api/userApi';
import { User as UserType } from '@/types/adminTypes';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch users with React Query
  const navigate = useNavigate();
  const { 
    data: users = [], 
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        return await fetchUsers();
      } catch (error: any) {
        // If authentication error, redirect to login
        if (error.message === 'Authentication required. Please log in.') {
          toast({
            title: "Authentication Required",
            description: "Please log in to view users.",
            variant: "destructive",
          });
          
          // Redirect to login page after a short delay
          setTimeout(() => navigate('/admin/login'), 1000);
        }
        throw error;
      }
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
    retry: 1 // Try once more before failing
  });
  
  // Force refetch on component mount to ensure we have the latest data
  useEffect(() => {
    refetchUsers();
  }, [refetchUsers]);
  
  // Use our custom hook for user management
  const userManagement = useUserManagement();
  
  // Filter users by role name
  const filterUsersByRoleName = (roleName: string | null) => {
    if (!roleName) return users;
    return users.filter(user => 
      user.roleName && user.roleName.toLowerCase() === roleName.toLowerCase()
    );
  };
  
  // Get users by role
  const adminUsers = filterUsersByRoleName("Admin");
  const staffUsers = filterUsersByRoleName("Staff");
  const patientUsers = filterUsersByRoleName("Patient");
  const doctorUsers = filterUsersByRoleName("Doctor");
  
  const getFilteredUsers = (): UserType[] => {
    let filteredUsers: UserType[] = [];
    
    // Filter by role first
    switch (activeTab) {
      case 'admins':
        filteredUsers = adminUsers;
        break;
      case 'staff':
        filteredUsers = staffUsers;
        break;
      case 'patients':
        filteredUsers = patientUsers;
        break;
      case 'doctors':
        filteredUsers = doctorUsers;
        break;
      default:
        filteredUsers = users;
    }
    
    // Then filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) || 
        user.mobileNo.toLowerCase().includes(query)
      );
    }
    
    return filteredUsers;
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Get role badge variant based on role name
  const getRoleBadgeVariant = (roleName: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (roleName.toLowerCase()) {
      case 'admin': return "destructive"; // Admin - Red
      case 'staff': return "secondary";   // Staff - Purple
      case 'patient': return "outline";   // Patient - Green (using className for color)
      case 'doctor': return "default";    // Doctor - Blue (using className for color)
      default: return "outline";
    }
  };

  // Log the user counts for debugging
  console.log('User counts:', {
    total: users.length,
    admin: adminUsers.length,
    staff: staffUsers.length,
    patient: patientUsers.length,
    doctor: doctorUsers.length
  });

  if (error) {
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
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <h2 className="text-2xl font-bold">Error loading users</h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <Button onClick={() => refetchUsers()}>Try Again</Button>
        </div>
      </PortalLayout>
    );
  }

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
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
          <Button onClick={userManagement.openAddUserDialog}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Card 1: Total Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                All registered accounts
              </p>
            </CardContent>
          </Card>
          
          {/* Card 2: Patients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <User className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered patients
              </p>
            </CardContent>
          </Card>
          
          {/* Card 3: Doctors */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doctors</CardTitle>
              <User className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctorUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                Medical professionals
              </p>
            </CardContent>
          </Card>
          
          {/* Card 4: Staff */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff</CardTitle>
              <UserCog className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                Support staff
              </p>
            </CardContent>
          </Card>
          
          {/* Card 5: Admins */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Settings className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                System administrators
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value={activeTab} className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                {isLoadingUsers ? (
                  <div className="flex justify-center items-center h-32">
                    <p>Loading users...</p>
                  </div>
                ) : getFilteredUsers().length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <p>No users found.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        {activeTab === "all" && (
                          <TableHead>Role</TableHead>
                        )}
                        <TableHead>Email</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredUsers().map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          {activeTab === "all" && (
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(user.roleName || '')}>
                                {user.roleName}
                              </Badge>
                            </TableCell>
                          )}
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.mobileNo}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.status === 'Active' ? 'default' : 'outline'}
                              className={user.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : ''}
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <span>Actions</span>
                                  <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Options</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => userManagement.handleUserAction('view', user)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => userManagement.handleUserAction('edit', user)}>
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === 'Active' ? (
                                  <DropdownMenuItem onClick={() => userManagement.handleUserAction('deactivate', user)}>
                                    Deactivate User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => userManagement.handleUserAction('activate', user)}>
                                    Activate User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={() => userManagement.handleUserAction('deactivate', user)}
                                  className="text-red-500"
                                >
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add User Dialog */}
      <UserFormDialog
        isOpen={userManagement.isAddUserDialogOpen}
        onClose={userManagement.closeAddUserDialog}
        onSave={userManagement.createUser}
        mode="create"
        isSubmitting={userManagement.isCreatingUser}
      />
      
      {/* Edit User Dialog */}
      <UserFormDialog
        isOpen={userManagement.isEditUserDialogOpen}
        onClose={userManagement.closeEditUserDialog}
        onSave={userManagement.updateUser}
        defaultValues={userManagement.selectedUserData?.user || {}}
        mode="edit"
        isSubmitting={userManagement.isUpdatingUser}
      />
      
      {/* User Details Dialog */}
      <UserDetailsDialog
        isOpen={userManagement.isUserDetailsDialogOpen}
        onClose={userManagement.closeUserDetailsDialog}
        userId={userManagement.selectedUserId || null}
      />
    </PortalLayout>
  );
};

export default AdminUsers;
