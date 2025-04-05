
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PortalLayout from '@/components/layouts/PortalLayout';
import { Calendar, Clock, Users, Settings, Bell, Lock, User } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', path: '/staff/dashboard', icon: <Calendar className="h-5 w-5" /> },
  { name: 'Appointments', path: '/staff/appointments', icon: <Clock className="h-5 w-5" /> },
  { name: 'Patients', path: '/staff/patients', icon: <Users className="h-5 w-5" /> }
];

const StaffAccountSettings = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data: any) => {
    toast.success("Account settings updated successfully");
    console.log(data);
  };
  
  return (
    <PortalLayout 
      portalName="Staff Portal"
      navLinks={navLinks}
      userName="Sarah Johnson"
      userRole="Nephrologist"
      userImage="https://randomuser.me/api/portraits/women/44.jpg"
    >
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>
        
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Preferences
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah Johnson" />
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <Button type="button" variant="outline" size="sm">
                          Change Avatar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Sarah" {...register("firstName")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Johnson" {...register("lastName")} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="sarah.johnson@example.com" {...register("email")} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="(555) 987-6543" {...register("phone")} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" defaultValue="Nephrologist" disabled />
                    </div>
                    
                    <Button type="submit">Save Changes</Button>
                  </form>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="staffId">Staff ID</Label>
                      <Input id="staffId" defaultValue="STAFF-001" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input id="specialty" defaultValue="Nephrology" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Medical License Number</Label>
                      <Input id="licenseNumber" defaultValue="MED12345678" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedCenter">Primary Assigned Center</Label>
                      <Input id="assignedCenter" defaultValue="Westside Dialysis Center" disabled />
                    </div>
                    
                    <Button type="button" onClick={() => toast.success("Professional information updated")}>
                      Update Professional Info
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="font-medium">Account Active</p>
                        <p className="text-sm text-gray-500">Last login: Today at 8:15 AM</p>
                      </div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Active
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Email Notifications</h3>
                    <div className="space-y-2">
                      {["New patient assignments", "Appointment changes", "Critical lab results", "Patient messages", "Staff announcements"].map((item) => (
                        <div key={item} className="flex items-center justify-between py-2">
                          <span>{item}</span>
                          <Switch defaultChecked={true} />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">In-App Notifications</h3>
                    <div className="space-y-2">
                      {["Patient check-ins", "Upcoming appointments", "Task assignments", "Dialysis sessions", "Patient status changes"].map((item) => (
                        <div key={item} className="flex items-center justify-between py-2">
                          <span>{item}</span>
                          <Switch defaultChecked={true} />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button onClick={() => toast.success("Notification preferences saved")}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button type="button" onClick={() => toast.success("Password changed successfully")}>
                      Change Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-md">
                      <p className="text-sm">
                        Two-factor authentication is currently <span className="font-medium text-green-600">enabled</span>. 
                        Your account is secured with an authenticator app.
                      </p>
                    </div>
                    
                    <Button variant="outline" onClick={() => toast.info("This would reconfigure your 2FA setup")}>
                      Reconfigure 2FA
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Login Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <div className="flex flex-col sm:flex-row">
                        <div className="p-4 flex-1 border-b sm:border-b-0 sm:border-r">
                          <div className="font-medium">Current Session</div>
                          <div className="text-sm text-gray-500">Started Today at 8:15 AM</div>
                          <div className="text-sm text-gray-500">Chrome on Windows • Chicago, USA</div>
                        </div>
                        <div className="p-4 flex items-center justify-center">
                          <Button variant="outline" disabled>This Device</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-md border">
                      <div className="flex flex-col sm:flex-row">
                        <div className="p-4 flex-1 border-b sm:border-b-0 sm:border-r">
                          <div className="font-medium">Recent Session</div>
                          <div className="text-sm text-gray-500">Yesterday at 2:45 PM</div>
                          <div className="text-sm text-gray-500">Safari on iOS • Chicago, USA</div>
                        </div>
                        <div className="p-4 flex items-center justify-center">
                          <Button variant="outline" onClick={() => toast.success("Session terminated")}>Terminate</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={() => toast.success("All other sessions terminated")}>
                      Terminate All Other Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Display Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <span className="font-medium">Dark Mode</span>
                          <p className="text-sm text-gray-500">Switch between light and dark mode</p>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <span className="font-medium">Compact View</span>
                          <p className="text-sm text-gray-500">Reduce spacing in tables and lists</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Dashboard Customization</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <span className="font-medium">Show Today's Stats</span>
                          <p className="text-sm text-gray-500">Display today's appointment statistics</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <span className="font-medium">Show Patient Alerts</span>
                          <p className="text-sm text-gray-500">Display critical patient alerts</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Language & Region</h3>
                    <div className="space-y-2">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <select id="language" className="w-full p-2 border rounded-md">
                          <option value="en">English (US)</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Time Zone</Label>
                        <select id="timezone" className="w-full p-2 border rounded-md">
                          <option value="America/Chicago">Central Time (US & Canada)</option>
                          <option value="America/New_York">Eastern Time (US & Canada)</option>
                          <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={() => toast.success("Preferences saved successfully")}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
};

export default StaffAccountSettings;
