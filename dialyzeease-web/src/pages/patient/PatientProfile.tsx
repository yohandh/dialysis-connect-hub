import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PatientPortalLayout from '@/components/layouts/PatientPortalLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  fetchPatientProfile, 
  updatePatientProfile, 
  updateNotificationPreferences, 
  PatientProfile, 
  NotificationPreference 
} from '@/api/patientApi';

interface PatientProfileExtended {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  ckdStage: number;
  contactPhone: string;
  contactEmail: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceProvider: string;
  insuranceNumber: string;
  primaryNephrologist: string;
  dialysisStartDate?: string;
  preferredCenter: string;
  allergies: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  notificationPreferences: NotificationPreference;
  height: number;
  weight: number;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  diagnosisDate: string;
  accessType?: 'fistula' | 'graft' | 'catheter';
  comorbidities: string[];
}

const defaultNotificationPreferences: NotificationPreference = {
  email: true,
  sms: false,
  push: true,
  appointmentReminders: true,
  labResults: true,
  treatmentUpdates: true,
  medicationReminders: true
};

const PatientProfilePage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [profile, setProfile] = useState<PatientProfileExtended>({
    id: '',
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    bloodType: 'O+',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    ckdStage: 1,
    diagnosisDate: '',
    primaryNephrologist: '',
    dialysisStartDate: '',
    accessType: 'fistula',
    comorbidities: [],
    allergies: [],
    medications: [],
    height: 0,
    weight: 0,
    notificationPreferences: defaultNotificationPreferences,
    contactPhone: '',
    contactEmail: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    insuranceProvider: '',
    insuranceNumber: '',
    preferredCenter: ''
  });
  
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreference>(defaultNotificationPreferences);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const {
    data: fetchedProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['patientProfile'],
    queryFn: fetchPatientProfile
  });
  
  useEffect(() => {
    if (fetchedProfile) {
      const extendedProfile: PatientProfileExtended = {
        id: fetchedProfile.userId,
        userId: fetchedProfile.userId,
        firstName: fetchedProfile.firstName,
        lastName: fetchedProfile.lastName,
        dateOfBirth: fetchedProfile.dateOfBirth,
        gender: fetchedProfile.gender,
        bloodType: fetchedProfile.bloodType,
        emergencyContact: fetchedProfile.emergencyContact,
        ckdStage: fetchedProfile.ckdStage,
        diagnosisDate: fetchedProfile.diagnosisDate,
        primaryNephrologist: fetchedProfile.primaryNephrologist,
        dialysisStartDate: fetchedProfile.dialysisStartDate,
        accessType: fetchedProfile.accessType,
        comorbidities: fetchedProfile.comorbidities,
        allergies: fetchedProfile.allergies,
        medications: fetchedProfile.medications || [],
        height: fetchedProfile.height,
        weight: fetchedProfile.weight,
        notificationPreferences: defaultNotificationPreferences,
        phone: fetchedProfile.phone,
        email: fetchedProfile.email,
        contactPhone: fetchedProfile.phone || '',
        contactEmail: fetchedProfile.email || '',
        address: fetchedProfile.address,
        insuranceProvider: '',
        insuranceNumber: '',
        preferredCenter: fetchedProfile.preferredCenter
      };

      setProfile(extendedProfile);
      
      setNotificationPrefs(defaultNotificationPreferences);
    }
  }, [fetchedProfile]);
  
  const updatePatientProfileMutation = useMutation({
    mutationFn: (data: Partial<PatientProfile>) => {
      return updatePatientProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientProfile'] });
      toast({ title: "Profile updated", description: "Your profile has been updated successfully." });
      setIsEditingProfile(false);
    },
    onError: (error) => {
      toast({ title: "Update failed", description: "There was an error updating your profile.", variant: "destructive" });
    },
  });
  
  const updateNotificationsMutation = useMutation({
    mutationFn: (prefs: NotificationPreference) => updateNotificationPreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientProfile'] });
      toast({ title: "Preferences updated", description: "Your notification preferences have been updated." });
    },
    onError: (error) => {
      toast({ title: "Update failed", description: "There was an error updating your preferences.", variant: "destructive" });
    },
  });
  
  const handleProfileFieldChange = (field: string, value: any) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      [field]: value
    }));
  };
  
  const handleToggleEdit = () => {
    setIsEditingProfile(prev => !prev);
  };
  
  const handleUpdateProfile = () => {
    const updatedData: Partial<PatientProfile> = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      email: profile.email
    };
    
    updatePatientProfileMutation.mutate(updatedData);
  };
  
  const handleNotificationToggle = (type: keyof NotificationPreference) => {
    const updatedPrefs = {
      ...notificationPrefs,
      [type]: !notificationPrefs[type]
    };
    
    setNotificationPrefs(updatedPrefs);
    updateNotificationsMutation.mutate(updatedPrefs);
  };
  
  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    relationship: z.string().min(2, "Relationship must be at least 2 characters."),
    phone: z.string().min(10, "Please enter a valid phone number."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile.emergencyContact.name,
      relationship: profile.emergencyContact.relationship,
      phone: profile.emergencyContact.phone,
    },
  });

  useEffect(() => {
    if (profile.emergencyContact) {
      form.reset({
        name: profile.emergencyContact.name,
        relationship: profile.emergencyContact.relationship,
        phone: profile.emergencyContact.phone,
      });
    }
  }, [profile.emergencyContact, form]);

  const onSubmitEmergencyContact = (values: z.infer<typeof formSchema>) => {
    const updatedProfile: Partial<PatientProfile> = {
      emergencyContact: {
        name: values.name,
        relationship: values.relationship,
        phone: values.phone,
      }
    };
    
    updatePatientProfileMutation.mutate(updatedProfile);
  };

  if (isLoading) {
    return (
      <PatientPortalLayout>
        <div className="container max-w-5xl p-4 mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading your profile...</p>
            </div>
          </div>
        </div>
      </PatientPortalLayout>
    );
  }

  if (error) {
    return (
      <PatientPortalLayout>
        <div className="container max-w-5xl p-4 mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  There was an error loading your profile. Please try refreshing the page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PatientPortalLayout>
    );
  }

  return (
    <PatientPortalLayout>
      <div className="container max-w-5xl p-4 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-gray-500 mt-2">
            View and update your profile information
          </p>
        </div>
        
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Personal Information</TabsTrigger>
            <TabsTrigger value="medical">Medical Information</TabsTrigger>
            <TabsTrigger value="notifications">Notification Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                </div>
                <Button 
                  variant={isEditingProfile ? "default" : "outline"} 
                  onClick={handleToggleEdit}
                >
                  {isEditingProfile ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditingProfile ? (
                      <Input 
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => handleProfileFieldChange('firstName', e.target.value)}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">{profile.firstName}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditingProfile ? (
                      <Input 
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => handleProfileFieldChange('lastName', e.target.value)}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-gray-50">{profile.lastName}</div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditingProfile ? (
                    <Input 
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-gray-50">{profile.email}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditingProfile ? (
                    <Input 
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleProfileFieldChange('phone', e.target.value)}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-gray-50">{profile.phone || "Not provided"}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Address</Label>
                  {isEditingProfile ? (
                    <div className="space-y-2">
                      <Input 
                        placeholder="Street Address"
                        value={profile.address.street}
                        onChange={(e) => handleProfileFieldChange('address', {...profile.address, street: e.target.value})}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          placeholder="City"
                          value={profile.address.city}
                          onChange={(e) => handleProfileFieldChange('address', {...profile.address, city: e.target.value})}
                        />
                        <Input 
                          placeholder="State"
                          value={profile.address.state}
                          onChange={(e) => handleProfileFieldChange('address', {...profile.address, state: e.target.value})}
                        />
                      </div>
                      <Input 
                        placeholder="ZIP Code"
                        value={profile.address.zipCode}
                        onChange={(e) => handleProfileFieldChange('address', {...profile.address, zipCode: e.target.value})}
                      />
                    </div>
                  ) : (
                    <div className="p-2 border rounded-md bg-gray-50">
                      {profile.address.street ? (
                        <>
                          <p>{profile.address.street}</p>
                          <p>{profile.address.city}, {profile.address.state} {profile.address.zipCode}</p>
                        </>
                      ) : (
                        "Not provided"
                      )}
                    </div>
                  )}
                </div>
                
                {isEditingProfile && (
                  <div className="pt-4">
                    <Button onClick={handleUpdateProfile}>
                      {updatePatientProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitEmergencyContact)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Emergency contact name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <FormControl>
                            <Input placeholder="Spouse, Parent, Friend, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={updatePatientProfileMutation.isPending}
                    >
                      {updatePatientProfileMutation.isPending ? "Saving..." : "Update Emergency Contact"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                      <dd className="mt-1">{profile.dateOfBirth}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Gender</dt>
                      <dd className="mt-1 capitalize">{profile.gender}</dd>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">CKD Stage</dt>
                      <dd className="mt-1">Stage {profile.ckdStage}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Diagnosis Date</dt>
                      <dd className="mt-1">{profile.diagnosisDate}</dd>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Primary Nephrologist</dt>
                    <dd className="mt-1">{profile.primaryNephrologist}</dd>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Height</dt>
                      <dd className="mt-1">{profile.height} cm</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Weight</dt>
                      <dd className="mt-1">{profile.weight} kg</dd>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Blood Type</dt>
                    <dd className="mt-1">{profile.bloodType}</dd>
                  </div>
                  {profile.dialysisStartDate && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Dialysis Start Date</dt>
                          <dd className="mt-1">{profile.dialysisStartDate}</dd>
                        </div>
                        {profile.accessType && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Access Type</dt>
                            <dd className="mt-1 capitalize">{profile.accessType}</dd>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationPrefs.email}
                    onCheckedChange={() => handleNotificationToggle('email')}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via text message</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notificationPrefs.sms}
                    onCheckedChange={() => handleNotificationToggle('sms')}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications in the app</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notificationPrefs.push}
                    onCheckedChange={() => handleNotificationToggle('push')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PatientPortalLayout>
  );
};

export default PatientProfilePage;
