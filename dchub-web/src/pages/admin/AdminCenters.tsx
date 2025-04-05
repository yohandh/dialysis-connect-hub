
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
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
import { DialysisCenter } from '@/data/centerData';

const AdminCenters = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCenter, setCurrentCenter] = useState<string | null>(null);

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
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: "",
      capacity: 1,
      operatingHours: {
        monday: "6:00 AM - 9:00 PM",
        tuesday: "6:00 AM - 9:00 PM",
        wednesday: "6:00 AM - 9:00 PM",
        thursday: "6:00 AM - 9:00 PM",
        friday: "6:00 AM - 9:00 PM",
        saturday: "8:00 AM - 4:00 PM",
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
  const handleEditCenter = (centerId: string) => {
    const center = centers.find(c => c.id === centerId);
    if (center) {
      form.reset({
        name: center.name,
        address: center.address.street,
        city: center.address.city,
        state: center.address.state,
        zip: center.address.zipCode,
        phone: center.phone,
        email: center.email,
        capacity: center.capacity,
        operatingHours: center.operatingHours,
        type: center.type || "Independent"
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
      city: "",
      state: "",
      zip: "",
      phone: "",
      email: "",
      capacity: 1,
      operatingHours: {
        monday: "6:00 AM - 9:00 PM",
        tuesday: "6:00 AM - 9:00 PM",
        wednesday: "6:00 AM - 9:00 PM",
        thursday: "6:00 AM - 9:00 PM",
        friday: "6:00 AM - 9:00 PM",
        saturday: "8:00 AM - 4:00 PM",
        sunday: "Closed"
      },
      type: "Independent"
    });
    setCurrentCenter(null);
    setIsDialogOpen(true);
  };

  // Handle center deletion
  const handleDeleteCenter = (centerId: string) => {
    if (window.confirm("Are you sure you want to delete this center?")) {
      deleteMutation.mutate(centerId);
    }
  };

  // Form submission handler
  const onSubmit = (data: CenterFormValues) => {
    // Ensure all required fields are present
    const formData = {
      name: data.name,
      address: {
        street: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip
      },
      phone: data.phone,
      email: data.email,
      capacity: data.capacity,
      operatingHours: {
        monday: data.operatingHours?.monday || "",
        tuesday: data.operatingHours?.tuesday || "",
        wednesday: data.operatingHours?.wednesday || "",
        thursday: data.operatingHours?.thursday || "",
        friday: data.operatingHours?.friday || "",
        saturday: data.operatingHours?.saturday || "",
        sunday: data.operatingHours?.sunday || ""
      },
      type: data.type
    };

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
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Centers", path: "/admin/centers" },
        { name: "Users", path: "/admin/users" },
        { name: "Reports", path: "/admin/reports" },
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
                formatOperatingHours={formatOperatingHours}
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
