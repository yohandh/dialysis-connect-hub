import React from 'react';
import { ROLES } from '@/constants/roles';
import { useQuery } from '@tanstack/react-query';
import { fetchUserById } from '@/api/userApi';
import { fetchPatientAppointments, fetchPatientAppointmentStats, PatientAppointmentStats as PatientAppointmentStatsType, PatientAppointment } from '@/api/appointmentApi';
import { format, addDays, parseISO } from 'date-fns';
import { UserCog, Calendar, Building2, MapPin, User, Mail, Phone, HeartPulse, AlertCircle, FileText, Award, Users, Clock } from 'lucide-react';

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
import { fetchUserCenters } from '@/api/centerApi';

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

  // Fetch assigned centers for this user
  const { data: userCenters = [] } = useQuery<any[]>({
    queryKey: ['userCenters', userId],
    queryFn: () => fetchUserCenters(userId),
    enabled: !!userId && isOpen,
  });

  // Get initials for avatar
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Get role badge variant

  const getRoleBadgeVariant = (roleId: number): string => {
    switch (roleId) {
      case ROLES.ADMIN.id:
        return "bg-red-100 text-red-600";   // Admin - light red
      case ROLES.STAFF.id:
        return "bg-purple-100 text-purple-600"; // Staff - light purple
      case ROLES.DOCTOR.id:
        return "bg-blue-100 text-blue-600";  // Doctor - light blue
      case ROLES.PATIENT.id:
        return "bg-green-100 text-green-600"; // Patient - light green
      default:
        return "bg-gray-100 text-gray-600";   // Others - light gray
    }
  };

  const getStatusBadgeVariant = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active':
        return "bg-green-100 text-green-600";   // Active - light green
      case 'inactive':
        return "bg-gray-100 text-gray-600";   // Inactive - light gray
      default:
        return "bg-gray-100 text-gray-600";   // Default - light gray
    }
  };

  const ucfirst = (str: string) => str ? str[0].toUpperCase() + str.slice(1) : '';

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

  // Handle both nested and flattened data structures
  const userObj = userData.hasOwnProperty('user') ? (userData as any).user : userData;
  const patientObj = userData.patient;
  const doctorObj = userData.doctor;
  const staffObj = userData.staff;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">User Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row items-start gap-6 py-4">
          {/* User Avatar & Basic Info */}
          <div className="flex flex-col items-center space-y-2 w-full md:w-1/3">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">{getInitials(userObj.name)}</AvatarFallback>
            </Avatar>

            <h2 className="text-xl font-semibold mt-4">{userObj.name}</h2>

            <Badge variant="outline" className={`mt-1 ${getRoleBadgeVariant(userObj.roleId)}`}>
              {userObj.roleName}
            </Badge>

            <Badge variant="outline" className={`mt-1 ${getStatusBadgeVariant(userObj.status)}`}>
              {userObj.status}
            </Badge>
            <Separator className="my-2" />
            <div className="w-full mt-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{userObj.email}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{userObj.mobileNo}</p>
              </div>

              {userObj.lastLogin && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">Last login: {format(new Date(userObj.lastLogin), 'PPP')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tabs with User Details */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="profile" className="w-full">
              {userObj.roleId !== ROLES.ADMIN.id ? (
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  {userObj.roleId === ROLES.STAFF.id && <TabsTrigger value="centers">Assigned Centers</TabsTrigger>}
                  {userObj.roleId === ROLES.DOCTOR.id && <TabsTrigger value="specialization">Specialization</TabsTrigger>}      
                  {userObj.roleId === ROLES.PATIENT.id && <TabsTrigger value="medical">Medical Info</TabsTrigger>}            
                  {userObj.roleId === ROLES.STAFF.id || userObj.roleId === ROLES.PATIENT.id && <TabsTrigger value="appointments">Appointments</TabsTrigger>}
                </TabsList>
              ) : null}

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                {/* Admin Information */}
                {userObj.roleId === ROLES.ADMIN.id && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <UserCog className="h-5 w-5 mr-2" />
                        Admin Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p>{userObj.name}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {/* Staff Information */}
                {userObj.roleId === ROLES.STAFF.id && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <UserCog className="h-5 w-5 mr-2" />
                        Staff Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p>{userObj.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Designation</p>
                        <p>{staffObj.designation}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Gender</p>
                        <p>{ucfirst(staffObj.gender)}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {/* Doctor Information */}
                {userObj.roleId === ROLES.DOCTOR.id && doctorObj && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Doctor Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p>{userObj.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Emergency Contact Number</p>
                        <p>{doctorObj.emergencyContactNo || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Specialization</p>
                        <p>{doctorObj.specialization}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Gender</p>
                        <p>{ucfirst(doctorObj.gender)}</p>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p>{doctorObj.address || 'Not provided'}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {/* Patient Information */}
                {userObj.roleId === ROLES.PATIENT.id && patientObj && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Patient Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p>{userObj.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
                        <p>{patientObj.bloodGroup || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                        <p>{patientObj.dob ? format(new Date(patientObj.dob), 'PPP') : 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                        <p>{patientObj.emergencyContact || 'Not provided'} {patientObj.emergencyContactNo && `(${patientObj.emergencyContactNo})`}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Insurance</p>
                        <p>{patientObj.insuranceProvider || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Gender</p>
                        <p>{ucfirst(patientObj.gender)}</p>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p>{patientObj.address || 'Not provided'}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Centers Tab - Not shown for Admin users */}
              {userObj.roleId !== ROLES.ADMIN.id && userObj.roleId !== ROLES.PATIENT.id ? (
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
                              {/* <TableHead>Role</TableHead> */}
                              <TableHead>Status</TableHead>
                              <TableHead>Assigned Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {userCenters.map((center) => (
                              <TableRow key={center.id}>
                                <TableCell>{center.centerName}</TableCell>
                                {/* 
                                <TableCell>
                                  <Badge variant="outline">{center.assignedRole}</Badge>
                                </TableCell> 
                                */}
                                <TableCell>
                                  <Badge
                                    variant={center.status === 'active' ? 'default' : 'outline'}
                                    className={center.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
                                  >
                                    {ucfirst(center.status)}
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
              ) : null}

              {/* Specialization Tab (For Doctors) */}
              {userObj.roleId === ROLES.DOCTOR.id && userObj.roleId !== ROLES.ADMIN.id ? (
                <TabsContent value="specialization">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Medical Specialization
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {doctorObj ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium">Primary Specialization</h3>
                            <p className="mt-1">{doctorObj.specialization}</p>
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
              ) : null}              

              {/* Appointments Tab (For Staff and Patients) */}
              {userObj.roleId === ROLES.STAFF.id || userObj.roleId === ROLES.PATIENT.id ? (
                <TabsContent value="appointments">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        {userObj.roleId === ROLES.STAFF.id ? "Appointment Management" : "Appointments"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userObj.roleId === ROLES.STAFF.id ? (
                        // Staff view
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
                      ) : (
                        // Patient view
                        <div className="space-y-4">
                          {/* Fetch patient appointment stats */}
                          <PatientAppointmentStats patientId={userObj.id || 1006} />

                          <div className="border rounded-md overflow-hidden">
                            <div className="bg-muted p-3">
                              <h3 className="font-medium">Upcoming Appointments</h3>
                            </div>
                            {/* Fetch patient upcoming appointments */}
                            <PatientUpcomingAppointments patientId={userObj.id || 1006} />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ) : null}

              {/* Medical Tab (For Patients) */}
              {userObj.roleId === ROLES.PATIENT.id && userObj.roleId !== ROLES.ADMIN.id ? (
                <TabsContent value="medical">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <HeartPulse className="h-5 w-5 mr-2" />
                        Medical Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {patientObj ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Allergies</p>
                            <div className="whitespace-pre-line">
                              {patientObj.allergies ? patientObj.allergies.split('\n').map((line, i) => (
                                <p key={i} className="text-sm">{line}</p>
                              )) : 'Not provided'}
                            </div>
                            </div>

                            <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Chronic Conditions</p>
                            <div className="whitespace-pre-line">
                              {patientObj.chronicConditions ? patientObj.chronicConditions.split('\n').map((line, i) => (
                                <p key={i} className="text-sm">{line}</p>
                              )) : 'Not provided'}
                            </div>
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
              ) : null}
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

// Component to display patient appointment statistics
const PatientAppointmentStats = ({ patientId }: { patientId: number }) => {
  const { data: stats, isLoading, error } = useQuery<PatientAppointmentStatsType>({
    queryKey: ['patientAppointmentStats', patientId],
    queryFn: () => fetchPatientAppointmentStats(patientId),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted p-4 rounded-md animate-pulse h-24"></div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium text-blue-800">Total Sessions</h3>
          <p className="text-2xl font-bold text-blue-900">--</p>
          <p className="text-sm text-blue-600">All time</p>
        </div>
        <div className="bg-green-50 p-4 rounded-md">
          <h3 className="font-medium text-green-800">Completed</h3>
          <p className="text-2xl font-bold text-green-900">--</p>
          <p className="text-sm text-green-600">No data available</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-md">
          <h3 className="font-medium text-purple-800">Next Session</h3>
          <p className="text-2xl font-bold text-purple-900">--</p>
          <p className="text-sm text-purple-600">No upcoming sessions</p>
        </div>
      </div>
    );
  }

  // Format the next appointment date if available
  const nextAppointmentDate = stats?.nextAppointment ? 
    parseISO(stats.nextAppointment.sessionDate) : null;
  const nextAppointmentTime = stats?.nextAppointment ? 
    stats.nextAppointment.startTime : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="font-medium text-blue-800">Total Sessions</h3>
        <p className="text-2xl font-bold text-blue-900">{stats?.totalAppointments || '--'}</p>
        <p className="text-sm text-blue-600">All time</p>
      </div>

      <div className="bg-green-50 p-4 rounded-md">
        <h3 className="font-medium text-green-800">Completed</h3>
        <p className="text-2xl font-bold text-green-900">{stats?.completedAppointments || '--'}</p>
        <p className="text-sm text-green-600">
          {stats?.lastSessionDaysAgo ? 
            `Last session: ${stats.lastSessionDaysAgo} days ago` : 
            'No previous sessions'}
        </p>
      </div>

      <div className="bg-purple-50 p-4 rounded-md">
        <h3 className="font-medium text-purple-800">Next Session</h3>
        <p className="text-2xl font-bold text-purple-900">
          {nextAppointmentDate ? format(nextAppointmentDate, 'MMM d') : '--'}
        </p>
        <p className="text-sm text-purple-600">
          {nextAppointmentTime || 'No upcoming sessions'}
        </p>
      </div>
    </div>
  );
};

// Component to display patient upcoming appointments
const PatientUpcomingAppointments = ({ patientId }: { patientId: number }) => {
  const { data: appointments, isLoading, error } = useQuery<PatientAppointment[]>({
    queryKey: ['patientUpcomingAppointments', patientId],
    queryFn: () => fetchPatientAppointments(patientId, { status: 'scheduled', limit: 5 }),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-primary rounded-full" aria-hidden="true"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading appointments...</p>
      </div>
    );
  }

  if (error || !appointments || appointments.length === 0) {
    return (
      <div className="p-8 text-center">
        <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No upcoming appointments found.</p>
      </div>
    );
  }

  // Helper function to get badge variant based on appointment status
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return "bg-gray-50 text-gray-700 hover:bg-gray-50";
      case 'confirmed':
        return "bg-blue-50 text-blue-700 hover:bg-blue-50";
      case 'completed':
        return "bg-green-50 text-green-700 hover:bg-green-50";
      case 'cancelled':
        return "bg-red-50 text-red-700 hover:bg-red-50";
      case 'no-show':
        return "bg-amber-50 text-amber-700 hover:bg-amber-50";
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-50";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date & Time</TableHead>
          <TableHead>Center</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments && appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell className="font-medium">
              {format(parseISO(appointment.sessionDate), 'PPP')}
              <div className="text-sm text-muted-foreground">{appointment.startTime}</div>
            </TableCell>
            <TableCell>{appointment.centerName}</TableCell>
            <TableCell>{appointment.doctorName || 'Not assigned'}</TableCell>
            <TableCell>
              <Badge 
                variant="outline" 
                className={getStatusBadgeVariant(appointment.status)}
              >
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserDetailsDialog;
