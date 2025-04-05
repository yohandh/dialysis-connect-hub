
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserById } from '@/api/userApi';
import { format } from 'date-fns';
import { UserCog, Calendar, Building2, MapPin, Phone, Mail, HeartPulse, AlertCircle, FileText, Award, Users } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { centerUsers } from '@/data/adminMockData';

interface UserDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({ isOpen, onClose, userId }) => {
  // Fetch user details
  const { 
    data: userData,
    isLoading,
    error 
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userId ? fetchUserById(userId) : null,
    enabled: !!userId && isOpen,
  });

  // Get assigned centers for this user
  const userCenters = centerUsers.filter(cu => cu.userId === userId);

  // Get initials for avatar
  const getInitials = (name: string = '') => {
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

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex justify-center items-center h-48">
            <p>Loading user details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !userData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex justify-center items-center h-48 text-red-500">
            <p>Error loading user details. Please try again.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const { user, patient, doctor } = userData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">User Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row items-start gap-6 py-4">
          {/* User Avatar & Basic Info */}
          <div className="flex flex-col items-center space-y-2 w-full md:w-1/3">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
            
            <Badge variant={getRoleBadgeVariant(user.roleId)} className="mt-1">
              {user.roleName}
            </Badge>
            
            <Badge 
              variant={user.status === 'active' ? 'default' : 'outline'}
              className={user.status === 'active' ? 'bg-green-500 hover:bg-green-600 mt-1' : 'mt-1'}
            >
              {user.status}
            </Badge>

            <div className="w-full mt-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{user.email}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.mobileNo}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex items-center space-x-2">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">ID: {user.id}</span>
              </div>
            </div>
          </div>
          
          {/* Tabs with User Details */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="centers">Assigned Centers</TabsTrigger>
                {user.roleId === 4 && <TabsTrigger value="specialization">Specialization</TabsTrigger>}
                {user.roleId === 3 && <TabsTrigger value="medical">Medical Info</TabsTrigger>}
                {user.roleId === 2 && <TabsTrigger value="appointments">Appointments</TabsTrigger>}
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                {/* Patient Information */}
                {user.roleId === 3 && patient && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Patient Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Gender</p>
                        <p>{patient.gender}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                        <p>{patient.dob ? format(new Date(patient.dob), 'PPP') : 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
                        <p>{patient.bloodGroup || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Insurance</p>
                        <p>{patient.insuranceProvider || 'Not provided'}</p>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p>{patient.address || 'Not provided'}</p>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                        <p>{patient.emergencyContact || 'Not provided'} {patient.emergencyContactNo && `(${patient.emergencyContactNo})`}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Doctor Information */}
                {user.roleId === 4 && doctor && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Doctor Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Gender</p>
                        <p>{doctor.gender}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Specialization</p>
                        <p>{doctor.specialization}</p>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p>{doctor.address || 'Not provided'}</p>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Emergency Contact Number</p>
                        <p>{doctor.emergencyContactNo || 'Not provided'}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Staff Information */}
                {user.roleId === 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <UserCog className="h-5 w-5 mr-2" />
                        Staff Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                      <p>Additional staff-specific information can be found in the Appointments tab.</p>
                    </CardContent>
                  </Card>
                )}
                
                {/* Admin Information */}
                {user.roleId === 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <UserCog className="h-5 w-5 mr-2" />
                        Admin Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                      <p>Administrator has full access to system functions.</p>
                      <p className="mt-2">Contact this user for system-level assistance.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Centers Tab */}
              <TabsContent value="centers">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      Assigned Centers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userCenters.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Center Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userCenters.map((center) => (
                            <TableRow key={center.id}>
                              <TableCell>{center.centerName}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{center.assignedRole}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={center.status === 'active' ? 'default' : 'outline'}
                                  className={center.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
                                >
                                  {center.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{format(new Date(center.assignedAt), 'PP')}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>This user is not assigned to any centers.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Specialization Tab (For Doctors) */}
              {user.roleId === 4 && (
                <TabsContent value="specialization">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Medical Specialization
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {doctor ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium">Primary Specialization</h3>
                            <p className="mt-1">{doctor.specialization}</p>
                          </div>
                          
                          <div>
                            <h3 className="font-medium">Practice Areas</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Dialysis</Badge>
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Nephrology</Badge>
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Kidney Care</Badge>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium">Certifications</h3>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>Board Certified in Nephrology</li>
                              <li>American Society of Nephrology Member</li>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <p>Specialization details not available.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              {/* Medical Tab (For Patients) */}
              {user.roleId === 3 && (
                <TabsContent value="medical">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <HeartPulse className="h-5 w-5 mr-2" />
                        Medical Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {patient ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">Allergies</p>
                              <p>{patient.allergies || 'None reported'}</p>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">Chronic Conditions</p>
                              <p>{patient.chronicConditions || 'None reported'}</p>
                            </div>
                          </div>
                          
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-yellow-400" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                  <span className="font-medium">Privacy Note:</span> Detailed medical records, CKD readings, and appointment history with personal treatment details are only accessible through the Staff Portal with appropriate permissions.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <p>Medical information not available.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              
              {/* Appointments Tab (For Staff) */}
              {user.roleId === 2 && (
                <TabsContent value="appointments">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Appointment Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-md">
                            <h3 className="font-medium text-blue-800">Total Managed</h3>
                            <p className="text-2xl font-bold text-blue-900">142</p>
                            <p className="text-sm text-blue-600">All time</p>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-md">
                            <h3 className="font-medium text-green-800">Completed</h3>
                            <p className="text-2xl font-bold text-green-900">126</p>
                            <p className="text-sm text-green-600">88.7% completion rate</p>
                          </div>
                          
                          <div className="bg-purple-50 p-4 rounded-md">
                            <h3 className="font-medium text-purple-800">Upcoming</h3>
                            <p className="text-2xl font-bold text-purple-900">8</p>
                            <p className="text-sm text-purple-600">Next 7 days</p>
                          </div>
                        </div>
                        
                        <div className="border p-4 rounded-md">
                          <h3 className="font-medium mb-2">Assigned Centers & Shifts</h3>
                          {userCenters.length > 0 ? (
                            <ul className="space-y-2">
                              {userCenters.map((center) => (
                                <li key={center.id} className="flex items-start space-x-2">
                                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                  <div>
                                    <p className="font-medium">{center.centerName}</p>
                                    <p className="text-sm text-muted-foreground">Mon/Wed/Fri: Morning Shift</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground">Not assigned to any centers</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
