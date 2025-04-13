import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, LayoutDashboard, Building2, Users, FileBarChart2, BookOpen, Bell, ClipboardList } from "lucide-react";
import PortalLayout from "@/components/layouts/PortalLayout";
import CenterTable from "@/components/admin/centers/CenterTable";
import CenterFormDialog from "@/components/admin/centers/CenterFormDialog";
import { formatOperatingHours } from "@/utils/centerUtils";
import { centerFormSchema, CenterFormValues } from "@/types/centerTypes";
import { 
  fetchCenters, 
  createCenter, 
  updateCenter, 
  deleteCenter 
} from "@/api/centerApi";
import { DialysisCenter } from '@/types/centerTypes';

const AdminCenters = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCenter, setCurrentCenter] = useState<number | null>(null);

  // Fetch centers
  const { data: centers = [], isLoading } = useQuery({
    queryKey: ['centers'],
    queryFn: fetchCenters,
  });

  // Initialize form
  const form = useForm<CenterFormValues>({
    resolver: zodResolver(centerFormSchema),
    defaultValues: {
      name: "",
      address: "",
      contactNo: "",
      email: "",
      totalCapacity: 10,
      centerHours: {
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: "Closed"
      },
      type: "Independent"
    },
  });

  // Create center mutation
  const createMutation = useMutation({
    mutationFn: createCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      toast({
        title: "Success",
        description: "Center created successfully",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create center: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update center mutation
  const updateMutation = useMutation({
    mutationFn: updateCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      toast({
        title: "Success",
        description: "Center updated successfully",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update center: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete center mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      toast({
        title: "Success",
        description: "Center deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete center: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle dialog open for editing
  const handleEditCenter = (centerId: number) => {
    const center = centers.find(c => c.id === centerId);
    if (center) {
      console.log('Center data from API:', center);
      console.log('Center hours from API:', center.centerHours);
      
      // Create default operating hours
      const defaultHours = {
        monday: 'Closed',
        tuesday: 'Closed',
        wednesday: 'Closed',
        thursday: 'Closed',
        friday: 'Closed',
        saturday: 'Closed',
        sunday: 'Closed'
      };

      // Map centerHours from API to form format if available
      let formattedHours = { ...defaultHours };
      
      if (center.centerHours && center.centerHours.length > 0) {
        // Create a mapping from short day names to full day names
        const dayMap: Record<string, string> = {
          'mon': 'monday',
          'tue': 'tuesday',
          'wed': 'wednesday',
          'thu': 'thursday',
          'fri': 'friday',
          'sat': 'saturday',
          'sun': 'sunday'
        };
        
        // Update formattedHours with actual data from API
        center.centerHours.forEach(hour => {
          // Get the weekday value
          const weekday = hour.weekday;
          const day = dayMap[weekday];
          
          // Format the time from 24-hour format to 12-hour format with AM/PM
          if (day && hour.openTime && hour.closeTime) {
            // Convert database time format (HH:MM:SS) to display format (HH:MM AM/PM)
            const formatTime = (timeStr: string) => {
              const [hours, minutes] = timeStr.split(':');
              const hourNum = parseInt(hours, 10);
              const ampm = hourNum >= 12 ? 'PM' : 'AM';
              const hour12 = hourNum % 12 || 12; // Convert 0 to 12 for 12 AM
              return `${hour12}:${minutes} ${ampm}`;
            };
            
            const openTimeFormatted = formatTime(hour.openTime);
            const closeTimeFormatted = formatTime(hour.closeTime);
            
            formattedHours[day] = `${openTimeFormatted} - ${closeTimeFormatted}`;
          } else if (day) {
            formattedHours[day] = 'Closed';
          }
        });
      }
      
      console.log('Formatted hours for editing:', formattedHours);
      
      form.reset({
        name: center.name,
        address: center.address || '',
        contactNo: center.contactNo || '',
        email: center.email || '',
        totalCapacity: center.totalCapacity || 0,
        centerHours: formattedHours,
        type: 'Independent'
      });
      setCurrentCenter(centerId);
      setIsDialogOpen(true);
    }
  };

  // Handle dialog open for new center
  const handleNewCenter = () => {
    // Reset form to default values
    form.reset({
      name: "",
      address: "",
      contactNo: "",
      email: "",
      totalCapacity: 1,
      centerHours: {
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: "Closed"
      },
      type: "Independent"
    });
    setCurrentCenter(null);
    setIsDialogOpen(true);
  };

  // Handle center deletion (soft delete)
  const handleDeleteCenter = (centerId: number) => {
    if (window.confirm("Are you sure you want to deactivate this center? This will make it unavailable for new appointments.")) {
      deleteMutation.mutate(centerId.toString());
    }
  };

  // Form submission handler
  const onSubmit = (data: CenterFormValues) => {
    // Process operating hours data
    const centerHoursData = Object.entries(data.centerHours || {}).map(([day, hours]) => {
      // Convert day names to database format (mon, tue, wed, etc.)
      const dayMap: Record<string, string> = {
        monday: 'mon',
        tuesday: 'tue',
        wednesday: 'wed',
        thursday: 'thu',
        friday: 'fri',
        saturday: 'sat',
        sunday: 'sun'
      };
      
      // Parse hours to extract open and close times
      let openTime = null;
      let closeTime = null;
      
      if (hours && hours !== 'Closed' && hours !== 'custom') {
        const timeMatch = hours.match(/(\d+:\d+ [AP]M) - (\d+:\d+ [AP]M)/);
        if (timeMatch) {
          openTime = timeMatch[1];
          closeTime = timeMatch[2];
        }
      }
      
      return {
        day: dayMap[day],
        openTime,
        closeTime
      };
    });
    
    // Ensure all required fields are present
    const formData = {
      name: data.name,
      address: data.address,
      contactNo: data.contactNo,
      email: data.email,
      totalCapacity: data.totalCapacity,
      isActive: true,
      centerHours: centerHoursData
    };

    console.log('Submitting center data:', formData);
    
    if (currentCenter) {
      // Update existing center
      updateMutation.mutate({
        id: currentCenter,
        ...formData
      });
    } else {
      // Create new center
      createMutation.mutate(formData);
    }
  };

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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dialysis Centers</h1>
          <Button onClick={handleNewCenter}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Center
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Centers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-4">Loading centers...</div>
            ) : centers ? (
              <CenterTable 
                centers={centers} 
                onEditCenter={handleEditCenter}
                onDeleteCenter={handleDeleteCenter}
              />
            ) : (
              <div>Error loading centers</div>
            )}
          </CardContent>
        </Card>

        {/* Center Form Dialog */}
        <CenterFormDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          form={form}
          onSubmit={onSubmit}
          isEditing={!!currentCenter}
        />
      </div>
    </PortalLayout>
  );
};

export default AdminCenters;
