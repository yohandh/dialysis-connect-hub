import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bed, BedFormValues } from '@/types/bedTypes';
import { fetchBedsByCenter, createBed, updateBed, deleteBed } from '@/api/bedApi';
import { Plus, Pencil, Trash2, Bed as BedIcon, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GenerateBedsDialog from './GenerateBedsDialog';

// Form schema for bed
const bedFormSchema = z.object({
  code: z.string().min(1, "Bed code is required"),
  status: z.enum(["active", "inactive"]),
});

interface BedManagementProps {
  centerId: string;
}

const BedManagement: React.FC<BedManagementProps> = ({ centerId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);

  // Fetch beds
  const { data: beds = [], isLoading } = useQuery({
    queryKey: ['beds', centerId],
    queryFn: () => fetchBedsByCenter(centerId),
  });

  // Initialize form
  const form = useForm<BedFormValues>({
    resolver: zodResolver(bedFormSchema),
    defaultValues: {
      code: "",
      status: "active",
    },
  });

  // Create bed mutation
  const createMutation = useMutation({
    mutationFn: (data: { center_id: number; code: string }) => createBed(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds', centerId] });
      toast({
        title: "Success",
        description: "Bed created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      console.error('Error in createMutation:', error);
      toast({
        title: "Error",
        description: `Failed to create bed: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Bulk create beds mutation
  const bulkCreateMutation = useMutation({
    mutationFn: async (beds: { code: string }[]) => {
      const promises = beds.map(bed => 
        createBed({ center_id: parseInt(centerId), code: bed.code })
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds', centerId] });
      toast({
        title: "Success",
        description: "Beds generated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error in bulkCreateMutation:', error);
      toast({
        title: "Error",
        description: `Failed to generate beds: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update bed mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { code: string; status: string } }) => 
      updateBed(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds', centerId] });
      toast({
        title: "Success",
        description: "Bed updated successfully",
      });
      setIsDialogOpen(false);
      setEditingBed(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update bed: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete bed mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds', centerId] });
      toast({
        title: "Success",
        description: "Bed deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete bed: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle dialog open for new bed
  const handleNewBed = () => {
    form.reset({
      code: "",
      status: "active",
    });
    setEditingBed(null);
    setIsDialogOpen(true);
  };

  // Handle dialog open for generating beds
  const handleGenerateBeds = () => {
    setIsGenerateDialogOpen(true);
  };

  // Handle bed generation
  const handleBedGeneration = (beds: { code: string }[]) => {
    bulkCreateMutation.mutate(beds);
  };

  // Handle dialog open for editing
  const handleEditBed = (bed: Bed) => {
    form.reset({
      code: bed.code,
      status: bed.status,
    });
    setEditingBed(bed);
    setIsDialogOpen(true);
  };

  // Handle bed deletion
  const handleDeleteBed = (id: number) => {
    if (window.confirm("Are you sure you want to delete this bed?")) {
      deleteMutation.mutate(id);
    }
  };

  // Form submission handler
  const onSubmit = (data: BedFormValues) => {
    if (editingBed) {
      // Update existing bed
      updateMutation.mutate({
        id: editingBed.id,
        data: {
          code: data.code,
          status: data.status,
        },
      });
    } else {
      // Create new bed
      createMutation.mutate({
        center_id: parseInt(centerId),
        code: data.code,
      });
    }
  };

  // Get status badge
  const getStatusBadge = (status: 'active' | 'inactive') => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Dialysis Beds</CardTitle>
          <CardDescription>Manage dialysis beds for this center.</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleGenerateBeds}>
            <BedIcon className="mr-2 h-4 w-4" />
            Generate Beds
          </Button>
          <Button onClick={handleNewBed}>
            <Plus className="mr-2 h-4 w-4" />
            Add Bed
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Loading beds...</div>
        ) : beds.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bed Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {beds.map((bed: Bed) => (
                <TableRow key={bed.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <BedIcon className="mr-2 h-4 w-4" />
                      <span className="font-medium">{bed.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(bed.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditBed(bed)}
                      className="h-8 w-8 p-0 mr-1"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteBed(bed.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md border-dashed">
            <BedIcon className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No beds available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add beds to manage dialysis machines.
            </p>
            <div className="flex space-x-2">              
              <Button variant="outline" onClick={handleGenerateBeds}>
                <BedIcon className="mr-2 h-4 w-4" />            
                Generate Beds
              </Button>
              <Button onClick={handleNewBed}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Bed
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Bed Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBed ? "Edit Bed" : "Add New Bed"}</DialogTitle>
            <DialogDescription>
              {editingBed 
                ? "Update the bed information below." 
                : "Enter the details for the new dialysis bed."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Code</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g.: BED-A1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {editingBed && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBed ? "Update Bed" : "Add Bed"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Generate Beds Dialog */}
      <GenerateBedsDialog 
        isOpen={isGenerateDialogOpen}
        onClose={() => setIsGenerateDialogOpen(false)}
        onGenerate={handleBedGeneration}
      />
    </Card>
  );
};

export default BedManagement;
