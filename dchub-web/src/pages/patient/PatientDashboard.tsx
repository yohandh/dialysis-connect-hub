
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PatientPortalLayout from '@/components/layouts/PatientPortalLayout';
import { useQuery } from '@tanstack/react-query';
import { getPatientData, getCkdHistory, fetchEducationContent, EducationContent as ApiEducationContent } from '@/api/patientApi';
import { getPatientAppointments } from '@/api/patientApi';
import { ckdStages } from '@/data/ckdData';

// Import dashboard components
import AppointmentCard from '@/components/patient/dashboard/AppointmentCard';
import CKDStageCard from '@/components/patient/dashboard/CKDStageCard';
import DietLifestyleCard from '@/components/patient/dashboard/DietLifestyleCard';
import HealthMetricsCard from '@/components/patient/dashboard/HealthMetricsCard';
import EducationResourcesCard from '@/components/patient/dashboard/EducationResourcesCard';
import DashboardAlert from '@/components/patient/dashboard/DashboardAlert';
import { Skeleton } from '@/components/ui/skeleton';

// Define the required EducationContent type for our component
export interface EducationContent {
  id: string;
  title: string;
  description: string;
  category: string;
}

// Map API education content to our required format
const mapEducationContent = (apiContent: ApiEducationContent[]): EducationContent[] => {
  return apiContent.map(content => ({
    id: content.id,
    title: content.title,
    description: content.summary || "Learn more about managing your kidney health",
    category: content.type || "general"
  }));
};

// Dashboard loading skeleton component
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="w-64 h-8">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="w-40 h-10">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
    
    <Skeleton className="h-16 w-full" />
    
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
    
    <div className="grid gap-4 md:grid-cols-2">
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-80 w-full" />
    </div>
  </div>
);

const PatientDashboard = () => {
  // Get patient profile
  const { data: patient, isLoading: isLoadingPatient, error: patientError } = useQuery({
    queryKey: ['patientProfile'],
    queryFn: () => getPatientData(), // Fixed function name
    retry: 1, // Only retry once
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Get CKD history
  const { data: ckdHistory, isLoading: isLoadingCkdHistory, error: ckdHistoryError } = useQuery({
    queryKey: ['ckdHistory'],
    queryFn: () => getCkdHistory(), // Fixed function name
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!patient, // Only fetch if patient data is available
  });
  
  // Get upcoming appointments
  const { data: appointments, isLoading: isLoadingAppointments, error: appointmentsError } = useQuery({
    queryKey: ['patientAppointments'],
    queryFn: () => getPatientAppointments(), // Use the available API function
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!patient, // Only fetch if patient data is available
  });
  
  // Get education content
  const patientCkdStage = ckdHistory && ckdHistory.length > 0
    ? ckdHistory[0].stage
    : patient?.ckdStage || 3; // Fallback to the one from patient profile or default to 3
    
  const { data: apiEducationContent, isLoading: isLoadingEducation, error: educationError } = useQuery({
    queryKey: ['educationContent', patientCkdStage],
    queryFn: () => fetchEducationContent(patientCkdStage),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!patientCkdStage, // Only fetch if ckd stage is available
  });
  
  // Map the education content to our required format
  const educationContent = apiEducationContent 
    ? mapEducationContent(apiEducationContent) 
    : [];
  
  // Determine the patient's CKD stage info
  const ckdStageInfo = ckdStages.find(stage => stage.stage === patientCkdStage);
  
  // Get the next appointment
  const nextAppointment = appointments && appointments.length > 0 
    ? appointments.find(apt => apt.status === 'booked') 
    : null;
  
  // Handle API errors by showing toast notifications
  React.useEffect(() => {
    if (patientError) {
      toast.error("Failed to load patient profile data");
      console.error("Patient profile error:", patientError);
    }
    if (ckdHistoryError) {
      toast.error("Failed to load CKD history data");
      console.error("CKD history error:", ckdHistoryError);
    }
    if (appointmentsError) {
      toast.error("Failed to load appointment data");
      console.error("Appointments error:", appointmentsError);
    }
    if (educationError) {
      toast.error("Failed to load education materials");
      console.error("Education content error:", educationError);
    }
  }, [patientError, ckdHistoryError, appointmentsError, educationError]);
  
  // Loading state
  const isLoading = isLoadingPatient || isLoadingCkdHistory || isLoadingAppointments || isLoadingEducation;
  
  return (
    <PatientPortalLayout>
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Patient Dashboard</h1>
            <Button asChild variant="outline">
              <Link to="/patient/book">
                Book New Appointment
              </Link>
            </Button>
          </div>
          
          <DashboardAlert />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AppointmentCard nextAppointment={nextAppointment} />
            <CKDStageCard patientCkdStage={patientCkdStage} ckdStageInfo={ckdStageInfo} />
            <DietLifestyleCard ckdStageInfo={ckdStageInfo} />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <HealthMetricsCard ckdHistory={ckdHistory} patient={patient} />
            <EducationResourcesCard educationContent={educationContent} />
          </div>
        </div>
      )}
    </PatientPortalLayout>
  );
};

export default PatientDashboard;
