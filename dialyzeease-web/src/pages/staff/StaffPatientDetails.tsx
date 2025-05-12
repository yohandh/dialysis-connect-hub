import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, FileText, PenLine, Phone, Users, Plus, Activity, HeartPulse } from 'lucide-react';
import { DialogDescription, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import AppointmentStatusBadge from '@/components/AppointmentStatusBadge';
import CkdStageBadge from '@/components/CkdStageBadge';
import PortalLayout from '@/components/layouts/PortalLayout';
import { 
  getPatientDetails, 
  getDialysisTreatmentHistory,
  getCkdMeasurements,
  recordDialysisSession,
  recordCkdMeasurement,
  DialogysisSession,
  CkdMeasurement,
  getAssignedCenters,
  getAvailableTimeSlots,
  bookAppointmentForPatient
} from '@/api/staffApi';
import { getAppointmentsByPatient } from '@/data/appointmentData';
import { normalizePatientRecord } from '@/utils/userUtils';
import DialysisSessionForm from '@/components/staff/DialysisSessionForm';
import CkdMeasurementForm from '@/components/staff/CkdMeasurementForm';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const navLinks = [
  { name: 'Dashboard', path: '/staff/dashboard', icon: <Calendar className="h-5 w-5" /> },
  { name: 'Appointments', path: '/staff/appointments', icon: <Clock className="h-5 w-5" /> },
  { name: 'Patients', path: '/staff/patients', icon: <Users className="h-5 w-5" /> }
];

const StaffPatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [isDialysisFormOpen, setIsDialysisFormOpen] = useState(false);
  const [isCkdFormOpen, setIsCkdFormOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [isScheduleAppointmentOpen, setIsScheduleAppointmentOpen] = useState(false);
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { 
    data: patientData, 
    isLoading: isLoadingPatient 
  } = useQuery({
    queryKey: ['patientDetails', id],
    queryFn: async () => {
      const patient = await getPatientDetails(id || '');
      return patient ? normalizePatientRecord(patient) : null;
    },
    enabled: !!id
  });
  
  const {
    data: dialysisSessions = [],
    isLoading: isLoadingSessions
  } = useQuery({
    queryKey: ['dialysisSessions', patientData?.userId],
    queryFn: () => getDialysisTreatmentHistory(patientData?.userId || ''),
    enabled: !!patientData?.userId
  });
  
  const {
    data: ckdMeasurements = [],
    isLoading: isLoadingCkd
  } = useQuery({
    queryKey: ['ckdMeasurements', patientData?.userId],
    queryFn: () => getCkdMeasurements(patientData?.userId || ''),
    enabled: !!patientData?.userId
  });
  
  const patientAppointments = patientData ? getAppointmentsByPatient(patientData.userId) : [];
  
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const dialysisSessionMutation = useMutation({
    mutationFn: (session: Omit<DialogysisSession, 'id'>) => recordDialysisSession(session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dialysisSessions', patientData?.userId] });
      toast("Dialysis session recorded successfully");
      setIsDialysisFormOpen(false);
    },
    onError: (error: any) => {
      toast(`Failed to record dialysis session: ${error.message}`);
    }
  });
  
  const ckdMeasurementMutation = useMutation({
    mutationFn: (measurement: Omit<CkdMeasurement, 'id' | 'calculatedStage'>) => recordCkdMeasurement(measurement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ckdMeasurements', patientData?.userId] });
      toast("CKD measurement recorded successfully");
      setIsCkdFormOpen(false);
    },
    onError: (error: any) => {
      toast(`Failed to record CKD measurement: ${error.message}`);
    }
  });
  
  const { data: centers = [] } = useQuery({
    queryKey: ['dialysisCenters'],
    queryFn: () => getAssignedCenters('staff-001'),
  });
  
  const { data: availableSlots = [] } = useQuery({
    queryKey: ['availableSlots', selectedCenter, appointmentDate],
    queryFn: () => getAvailableTimeSlots(selectedCenter, appointmentDate),
    enabled: !!selectedCenter && !!appointmentDate,
  });
  
  const bookAppointmentMutation = useMutation({
    mutationFn: ({ appointmentId, patientId }: { appointmentId: string, patientId: string }) => 
      bookAppointmentForPatient(appointmentId, patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientAppointments'] });
      toast("Appointment booked successfully");
      setIsScheduleAppointmentOpen(false);
    },
    onError: (error: any) => {
      toast(`Failed to book appointment: ${error.message}`);
    }
  });
  
  const handleDialysisFormSubmit = (data: any) => {
    dialysisSessionMutation.mutate(data);
  };
  
  const handleCkdFormSubmit = (data: any) => {
    ckdMeasurementMutation.mutate(data);
  };
  
  const handleBookAppointment = (appointmentId: string) => {
    if (patientData) {
      bookAppointmentMutation.mutate({
        appointmentId,
        patientId: patientData.userId
      });
    }
  };
  
  if (isLoadingPatient) {
    return (
      <PortalLayout 
        portalName="Staff Portal"
        navLinks={navLinks}
        userName="Sarah Johnson"
        userRole="Nephrologist"
        userImage="https://randomuser.me/api/portraits/women/44.jpg"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading patient data...</p>
            </div>
          </div>
        </div>
      </PortalLayout>
    );
  }
  
  if (!patientData) {
    return (
      <PortalLayout 
        portalName="Staff Portal"
        navLinks={navLinks}
        userName="Sarah Johnson"
        userRole="Nephrologist"
        userImage="https://randomuser.me/api/portraits/women/44.jpg"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Patient not found. Please check the patient ID.
                </p>
              </div>
            </div>
          </div>
          <Link to="/staff/patients">
            <Button variant="outline">
              Back to Patient List
            </Button>
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const patient = patientData;

  return (
    <PortalLayout 
      portalName="Staff Portal"
      navLinks={navLinks}
      userName="Sarah Johnson"
      userRole="Nephrologist"
      userImage="https://randomuser.me/api/portraits/women/44.jpg"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div>
            <Link to="/staff/patients">
              <Button variant="ghost" size="sm" className="mb-2">
                ← Back to Patients
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-dark-slate">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="flex items-center mt-2 gap-4">
              <CkdStageBadge stage={patient.ckdStage} />
              <Badge variant="outline">{patient.bloodType}</Badge>
              <div className="text-sm text-gray-500">
                {calculateAge(patient.dateOfBirth)} years old
              </div>
              <div className="text-sm text-gray-500 capitalize">
                {patient.gender}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Phone className="h-4 w-4" /> Contact
            </Button>
            <Button 
              className="bg-medical-blue hover:bg-medical-blue/90 gap-2"
              onClick={() => setIsEditPatientOpen(true)}
            >
              <PenLine className="h-4 w-4" /> Edit Patient
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="bg-medical-blue/5">
                <CardTitle className="text-medical-blue text-lg">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm">{patient.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                    <dd className="mt-1 text-sm">{patient.dateOfBirth}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Primary Nephrologist</dt>
                    <dd className="mt-1 text-sm">{patient.primaryNephrologist}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Diagnosis Date</dt>
                    <dd className="mt-1 text-sm">{patient.diagnosisDate}</dd>
                  </div>
                  {patient.dialysisStartDate && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Dialysis Start Date</dt>
                      <dd className="mt-1 text-sm">{patient.dialysisStartDate}</dd>
                    </div>
                  )}
                  {patient.accessType && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Access Type</dt>
                      <dd className="mt-1 text-sm capitalize">{patient.accessType}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Preferred Center</dt>
                    <dd className="mt-1 text-sm">Westside Dialysis Center</dd>
                  </div>
                </dl>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500">Emergency Contact</h3>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium">{patient.emergencyContact.name}</p>
                    <p className="text-sm text-gray-500">{patient.emergencyContact.relationship}</p>
                    <p className="text-sm text-gray-500">{patient.emergencyContact.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader className="bg-medical-blue/5">
                <CardTitle className="text-medical-blue text-lg">Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Height</dt>
                    <dd className="mt-1 text-sm">{patient.height} cm</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Weight</dt>
                    <dd className="mt-1 text-sm">{patient.weight} kg</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Comorbidities</dt>
                    <dd className="mt-1 space-y-1">
                      {patient.comorbidities.map((condition: string, i: number) => (
                        <Badge key={i} variant="outline" className="mr-1 mb-1">
                          {condition}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                    <dd className="mt-1">
                      {patient.allergies.length > 0 ? (
                        <div className="space-y-1">
                          {patient.allergies.map((allergy: string, i: number) => (
                            <Badge key={i} variant="destructive" className="mr-1 mb-1">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No known allergies</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="dialysis">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="dialysis">Dialysis History</TabsTrigger>
                <TabsTrigger value="ckd">CKD Measurements</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dialysis" className="mt-6">
                <Card>
                  <CardHeader className="bg-medical-blue/5 flex flex-row justify-between items-center">
                    <CardTitle className="text-medical-blue text-lg">Dialysis History</CardTitle>
                    <Button 
                      className="bg-medical-blue hover:bg-medical-blue/90" 
                      size="sm"
                      onClick={() => setIsDialysisFormOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Record Session
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isLoadingSessions ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {dialysisSessions.length > 0 ? (
                          dialysisSessions.map((session, index) => (
                            <div key={session.id} className="relative pl-6 pb-8">
                              {index < dialysisSessions.length - 1 && (
                                <div className="absolute left-2.5 top-2.5 h-full w-px bg-gray-200"></div>
                              )}
                              
                              <div className="absolute left-0 top-1.5 h-5 w-5 rounded-full border-2 bg-blue-100 border-blue-500"></div>
                              
                              <div>
                                <div className="flex items-center">
                                  <p className="text-sm font-medium">
                                    {session.date} ({session.startTime} - {session.endTime})
                                  </p>
                                  <Badge variant="outline" className="ml-2">
                                    {session.duration} min
                                  </Badge>
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                  <div className="text-sm">
                                    <span className="text-gray-500">Weight:</span>{' '}
                                    {session.preWeight} kg → {session.postWeight} kg
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-gray-500">UF:</span>{' '}
                                    {session.actualUltrafiltration} L (Goal: {session.ultrafiltrationGoal} L)
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-gray-500">BP Before:</span>{' '}
                                    {session.bloodPressureBefore.systolic}/{session.bloodPressureBefore.diastolic} mmHg
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-gray-500">BP After:</span>{' '}
                                    {session.bloodPressureAfter.systolic}/{session.bloodPressureAfter.diastolic} mmHg
                                  </div>
                                </div>
                                
                                {session.complications.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-sm text-gray-500">Complications:</span>{' '}
                                    <span className="text-sm text-red-500">
                                      {session.complications.join(', ')}
                                    </span>
                                  </div>
                                )}
                                
                                {session.notes && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
                                    {session.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Activity className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                            <p>No dialysis history available</p>
                            <p className="text-sm mt-2">Record a new session using the button above</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ckd" className="mt-6">
                <Card>
                  <CardHeader className="bg-medical-blue/5 flex flex-row justify-between items-center">
                    <CardTitle className="text-medical-blue text-lg">CKD Measurements</CardTitle>
                    <Button 
                      className="bg-medical-blue hover:bg-medical-blue/90" 
                      size="sm"
                      onClick={() => setIsCkdFormOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Measurement
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isLoadingCkd ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {ckdMeasurements.length > 0 ? (
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 text-sm font-medium text-gray-500">Date</th>
                                <th className="text-left py-2 text-sm font-medium text-gray-500">eGFR</th>
                                <th className="text-left py-2 text-sm font-medium text-gray-500">Creatinine</th>
                                <th className="text-left py-2 text-sm font-medium text-gray-500">CKD Stage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ckdMeasurements.map((record) => (
                                <tr key={record.id} className="border-b">
                                  <td className="py-3">{record.date}</td>
                                  <td className="py-3">{record.eGFR} mL/min/1.73m²</td>
                                  <td className="py-3">{record.creatinine} mg/dL</td>
                                  <td className="py-3">
                                    <CkdStageBadge stage={record.calculatedStage} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <HeartPulse className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                            <p>No CKD measurements available</p>
                            <p className="text-sm mt-2">Add a new measurement using the button above</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="medications" className="mt-6">
                <Card>
                  <CardHeader className="bg-medical-blue/5">
                    <CardTitle className="text-medical-blue text-lg">Current Medications</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {patient.medications.map((medication, index) => (
                        <div key={index} className="flex justify-between border-b pb-4">
                          <div>
                            <p className="font-medium">{medication.name}</p>
                            <p className="text-sm text-gray-500">{medication.dosage}, {medication.frequency}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Card className="mt-6">
              <CardHeader className="bg-medical-blue/5">
                <CardTitle className="text-medical-blue text-lg">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {patientAppointments.filter(a => a.status === 'booked').length > 0 ? (
                  <div className="space-y-4">
                    {patientAppointments
                      .filter(a => a.status === 'booked')
                      .slice(0, 3)
                      .map(appointment => (
                        <div key={appointment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <div>
                            <p className="font-medium capitalize">{appointment.type}</p>
                            <p className="text-sm text-gray-500">
                              {appointment.date}, {appointment.startTime} - {appointment.endTime}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/staff/appointments/${appointment.id}`)}
                          >
                            Details
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No upcoming appointments scheduled
                  </div>
                )}
                
                <div className="mt-6 flex justify-center">
                  <Button 
                    className="bg-medical-blue hover:bg-medical-blue/90" 
                    size="sm"
                    onClick={() => setIsScheduleAppointmentOpen(true)}
                  >
                    Schedule Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Dialog open={isDialysisFormOpen} onOpenChange={setIsDialysisFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Dialysis Session</DialogTitle>
          </DialogHeader>
          <DialysisSessionForm
            onSubmit={handleDialysisFormSubmit}
            isSubmitting={dialysisSessionMutation.isPending}
            onCancel={() => setIsDialysisFormOpen(false)}
            defaultValues={{
              patientId: patient.userId,
              staffId: "staff-001"
            }}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCkdFormOpen} onOpenChange={setIsCkdFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record CKD Measurement</DialogTitle>
          </DialogHeader>
          <CkdMeasurementForm
            patientId={patient.userId}
            onSubmit={handleCkdFormSubmit}
            isSubmitting={ckdMeasurementMutation.isPending}
            onCancel={() => setIsCkdFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isScheduleAppointmentOpen} onOpenChange={setIsScheduleAppointmentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
            <DialogDescription>
              Book an appointment for {patient.firstName} {patient.lastName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Center</label>
                <Select
                  value={selectedCenter}
                  onValueChange={setSelectedCenter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a center" />
                  </SelectTrigger>
                  <SelectContent>
                    {centers.map(center => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Date</label>
                <Input 
                  type="date" 
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Available Time Slots</h3>
              
              {selectedCenter ? (
                availableSlots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className="justify-between"
                        onClick={() => handleBookAppointment(slot.id)}
                      >
                        <span>
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="capitalize text-xs bg-gray-100 px-2 py-1 rounded">
                          {slot.type}
                        </span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No available slots for this date</p>
                  </div>
                )
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-md">
                  <p className="text-gray-500">Please select a center first</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsScheduleAppointmentOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-medical-blue hover:bg-medical-blue/90"
                onClick={() => setIsNewAppointmentDialogOpen(true)}
              >
                Create New Appointment Slot
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditPatientOpen} onOpenChange={setIsEditPatientOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient Information</DialogTitle>
            <DialogDescription>
              Update {patient.firstName} {patient.lastName}'s information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input defaultValue={patient.firstName} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input defaultValue={patient.lastName} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue={patient.email} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input type="date" defaultValue={patient.dateOfBirth} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Blood Type</label>
                <Select defaultValue={patient.bloodType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-500 py-4">
              This is a placeholder for the patient edit form.<br />
              The complete form would include all patient fields.
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditPatientOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-medical-blue hover:bg-medical-blue/90"
                onClick={() => {
                  toast("Patient information updated successfully");
                  setIsEditPatientOpen(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
};

export default StaffPatientDetails;
