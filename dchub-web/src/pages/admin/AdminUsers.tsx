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
import { ChevronDown, UserPlus, Settings, User, Users, Search, Filter, LayoutDashboard, Building2, BookOpen, FileBarChart2 } from "lucide-react";
import PortalLayout from "@/components/layouts/PortalLayout";
import { useUserManagement } from '@/hooks/useUserManagement';
import UserFormDialog from '@/components/admin/UserFormDialog';
import UserDetailsDialog from '@/components/admin/UserDetailsDialog';
import { fetchUsers } from '@/api/userApi';
import { User as UserType } from '@/types/adminTypes';

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch users with React Query
  const { 
    data: users = [], 
    isLoading: isLoadingUsers
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });
  
  // Use our custom hook for user management
  const userManagement = useUserManagement();
  
  // Filter users by role and search query
  const filterUsersByRole = (roleId: number | null) => {
    return roleId ? users.filter(user => user.roleId === roleId) : users;
  };
  
  const adminUsers = filterUsersByRole(1);
  const staffUsers = filterUsersByRole(2);
  const patientUsers = filterUsersByRole(3);
  const doctorUsers = filterUsersByRole(4);
  
  const getFilteredUsers = (): UserType[] => {
    let filteredUsers: UserType[] = [];
    
    // Filter by role first
    switch (activeTab) {
      case 'admin':
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

  // Get role badge variant
  const getRoleBadgeVariant = (roleId: number): "default" | "secondary" | "outline" | "destructive" => {
    switch (roleId) {
      case 1: return "destructive"; // Admin
      case 2: return "secondary";   // Staff
      case 3: return "outline";     // Patient
      case 4: return "default";     // Doctor
      default: return "outline";
    }
  };

  return (
    <PortalLayout
      portalName="Admin Portal"
      navLinks={[
        { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
        { name: "Centers", path: "/admin/centers", icon: <Building2 className="h-5 w-5" /> },
        { name: "Users", path: "/admin/users", icon: <Users className="h-5 w-5" /> },
        { name: "Education", path: "/admin/education", icon: <BookOpen className="h-5 w-5" /> },
        { name: "Reports", path: "/admin/reports", icon: <FileBarChart2 className="h-5 w-5" /> },
      ]}
      userName="Michael Adams"
      userRole="System Administrator"
      userImage="https://randomuser.me/api/portraits/men/42.jpg"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <Button onClick={userManagement.openAddUserDialog}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                Current patient accounts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                Staff and personnel
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doctors</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctorUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                Medical practitioners
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
          
          {/* We'll use just one tab content and apply filtering */}
          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {isLoadingUsers ? (
                  <div className="flex justify-center items-center p-8">
                    <p>Loading users...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        {activeTab === 'all' && <TableHead>Role</TableHead>}
                        <TableHead>Email</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredUsers().length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={activeTab === 'all' ? 6 : 5} className="text-center py-8">
                            No users found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        getFilteredUsers().map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                              </div>
                            </TableCell>
                            {activeTab === 'all' && (
                              <TableCell>
                                <Badge variant={getRoleBadgeVariant(user.roleId)}>
                                  {user.roleName}
                                </Badge>
                              </TableCell>
                            )}
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.mobileNo}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={user.status === 'active' ? 'default' : 'outline'}
                                className={user.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
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
                                  {user.status === 'active' ? (
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
                        ))
                      )}
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
