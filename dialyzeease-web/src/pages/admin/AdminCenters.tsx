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
import { centerFormSchema, CenterFormValues } from "@/types/centerTypes";
import { 
  fetchCenters, 
  createCenter, 
  updateCenter, 
  deleteCenter,
  activateCenter,
  deactivateCenter
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

  // Activate center mutation
  const activateMutation = useMutation({
    mutationFn: activateCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      toast({
        title: "Success",
        description: "Center activated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to activate center: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Deactivate center mutation
  const deactivateMutation = useMutation({
    mutationFn: deactivateCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
      toast({
        title: "Success",
        description: "Center deactivated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to deactivate center: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Convert database time format (HH:MM:SS) to display format (HH:MM AM/PM)
  function formatTime(timeStr: string) {
    try {
      // Check if the timeStr is in the expected format
      if (!timeStr || typeof timeStr !== 'string') {
        return 'Invalid time';
      }

      // Parse the time string (format: HH:MM:SS)
      const timeParts = timeStr.split(':');
      if (timeParts.length < 2) {
        return timeStr; // Return original if not in expected format
      }

      // Extract hours and minutes
      let hours = parseInt(timeParts[0], 10);
      const minutes = timeParts[1];
      
      // Determine AM/PM
      const period = hours >= 12 ? 'PM' : 'AM';
      
      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours === 0 ? 12 : hours; // Convert 0 to 12 for 12 AM
      
      // Format as "h:MM AM/PM"
      return `${hours}:${minutes} ${period}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeStr;
    }
  }

  // Handle dialog open for editing
  const handleEditCenter = (centerId: number) => {
    const center = centers.find(c => c.id === centerId);
    if (center) {
      console.log('Center data from API:', center);
      
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

      // Check if centerHours exists before logging
      if (center.centerHours) {
        console.log('Center hours from API:', center.centerHours);
      } else {
        console.log('Center hours not available');
      }
      
      // Map centerHours from API to form format if available
      const centerHours = center.centerHours && Array.isArray(center.centerHours) && center.centerHours.length > 0
        ? center.centerHours.reduce((acc, hour) => {
            // Convert day abbreviation to full day name
            const dayMap: Record<string, string> = {
              'mon': 'monday',
              'tue': 'tuesday',
              'wed': 'wednesday',
              'thu': 'thursday',
              'fri': 'friday',
              'sat': 'saturday',
              'sun': 'sunday'
            };
            
            const day = dayMap[hour.weekday] || hour.weekday;
            
            // Format hours as "HH:MM AM - HH:MM PM" if both open and close times exist
            if (hour.openTime && hour.closeTime) {
              acc[day] = `${formatTime(hour.openTime)} - ${formatTime(hour.closeTime)}`;
            } else {
              acc[day] = 'Closed';
            }
            
            return acc;
          }, { ...defaultHours })
        : defaultHours;
      
      // Reset form and set values
      form.reset({
        name: center.name,
        address: center.address || '',
        contactNo: center.contactNo || '',
        email: center.email || '',
        totalCapacity: center.totalCapacity || 10,
        manageById: center.manageById,
        centerHours,
        type: center.type || 'Independent'
      });
      
      setCurrentCenter(centerId);
      setIsDialogOpen(true);
    }
  };

  // Handle dialog open for new center
  const handleNewCenter = () => {
    form.reset({
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
    });
    
    setCurrentCenter(null);
    setIsDialogOpen(true);
  };

  // Handle center deletion (hard delete)
  const handleDeleteCenter = (centerId: number) => {
    if (window.confirm("Are you sure you want to permanently delete this center? This action cannot be undone.")) {
      deleteMutation.mutate(centerId.toString());
    }
  };

  // Handle center activation/deactivation
  const handleToggleActive = (centerId: number, isActive: boolean) => {
    if (isActive) {
      // Deactivate center
      if (window.confirm("Are you sure you want to deactivate this center? This will make it unavailable for new appointments.")) {
        deactivateMutation.mutate(centerId.toString());
      }
    } else {
      // Activate center
      if (window.confirm("Are you sure you want to activate this center? This will make it available for new appointments.")) {
        activateMutation.mutate(centerId.toString());
      }
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
      manageById: data.manageById,
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
                onToggleActive={handleToggleActive}
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
