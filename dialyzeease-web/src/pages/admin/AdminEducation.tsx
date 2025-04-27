
import React, { useState } from 'react';
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Book, Edit, FileText, Plus, Trash, LayoutDashboard, Building2, Users, BookOpen, FileBarChart2, Bell, ClipboardList, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import PortalLayout from "@/components/layouts/PortalLayout";
import { EducationMaterial, CkdStage } from '@/types/adminTypes';
import { 
  fetchEducationMaterials, 
  fetchCkdStages, 
  createEducationMaterial, 
  updateEducationMaterial, 
  deleteEducationMaterial 
} from '@/api/educationApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ucfirst = (str: string) => str ? str[0].toUpperCase() + str.slice(1) : '';

// Schema for education material form validation
const educationFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  content: z.string().min(20, { message: "Content must be at least 20 characters." }),
  ckdStage: z.coerce.number().min(1, { message: "Please select a CKD stage" }),
  langCode: z.string().min(2, { message: "Please select a language" }),
  type: z.enum(['diet', 'lifestyle', 'general'], { 
    required_error: "Please select a content type" 
  }),
});

type EducationFormValues = z.infer<typeof educationFormSchema>;

const AdminEducation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<number | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<EducationMaterial | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Fetch education materials
  const { data: educationMaterials = [], isLoading: isLoadingMaterials } = useQuery({
    queryKey: ['educationMaterials'],
    queryFn: fetchEducationMaterials,
  });
  
  // Fetch CKD stages
  const { data: ckdStages = [], isLoading: isLoadingStages } = useQuery({
    queryKey: ['ckdStages'],
    queryFn: fetchCkdStages,
  });
  
  // Initialize form
  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      title: "",
      content: "",
      ckdStage: 1,
      langCode: "en",
      type: "general",
    },
  });

  // Handle dialog open for editing
  const handleEditMaterial = (materialId: number) => {
    const material = educationMaterials.find(m => m.id === materialId);
    if (material) {
      form.reset({
        title: material.title,
        content: material.content,
        ckdStage: material.ckdStage,
        langCode: material.langCode,
        type: material.type,
      });
      setCurrentMaterial(materialId);
      setIsDialogOpen(true);
    }
  };

  // Handle delete material
  const handleDeleteMaterial = (materialId: number) => {
    toast({
      title: "Delete material",
      description: `Are you sure you want to delete this educational material? This action cannot be undone.`,
      variant: "error",
      action: (
        <ToastAction altText="Confirm deletion" onClick={() => deleteMutation.mutate(materialId)}>
          Confirm
        </ToastAction>
      ),
    });
  };

  // Handle dialog open for new material
  const handleNewMaterial = () => {
    form.reset({
      title: "",
      content: "",
      ckdStage: 1,
      langCode: "en",
      type: "general",
    });
    setCurrentMaterial(null);
    setIsDialogOpen(true);
  };

  // Handle preview material
  const handlePreview = (materialId: number) => {
    const material = educationMaterials.find(m => m.id === materialId);
    if (material) {
      setPreviewMaterial(material);
      setIsPreviewOpen(true);
    }
  };

  // Create material mutation
  const createMutation = useMutation({
    mutationFn: createEducationMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationMaterials'] });
      toast({
        title: "Material added",
        description: "The new education material has been added successfully.",
        variant: "success",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add material: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "error",
      });
    },
  });

  // Update material mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Omit<EducationMaterial, 'id'> }) => 
      updateEducationMaterial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationMaterials'] });
      toast({
        title: "Material updated",
        description: "The education material has been updated successfully.",
        variant: "success",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update material: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "error",
      });
    },
  });

  // Delete material mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEducationMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationMaterials'] });
      toast({
        title: "Success",
        description: "Educational material has been deleted successfully.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete material: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "error",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: EducationFormValues) => {
    const materialData = {
      title: data.title,
      content: data.content,
      ckdStage: data.ckdStage,
      langCode: data.langCode,
      type: data.type
    };
    
    if (currentMaterial) {
      // Update existing material
      updateMutation.mutate({ id: currentMaterial, data: materialData });
    } else {
      // Create new material
      createMutation.mutate(materialData);
    }
  };

  // Get stage label
  const getStageName = (stageNumber: number) => {
    const stage = ckdStages.find(s => s.stageNumber === stageNumber);
    return stage ? `Stage ${stage.stageNumber}` : `Stage ${stageNumber}`;
  };

  // Get material type badge variant
  const getTypeBadgeVariant = (type: string): "diet" | "lifestyle" | "general" => {
    switch (type) {
      case "diet": return "diet";
      case "lifestyle": return "lifestyle";
      case "general": return "general";
      default: return "general";
    }
  };

  // Get CKD stage badge variant
  const getStageBadgeVariant = (stageNumber: number): "stage1" | "stage2" | "stage3" | "stage4" | "stage5" => {
    switch (stageNumber) {
      case 1: return "stage1";
      case 2: return "stage2";
      case 3: return "stage3";
      case 4: return "stage4";
      case 5: return "stage5";
      default: return "stage1";
    }
  };

  // Language code to language name
  const getLanguageName = (code: string): string => {
    const languages: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'pt': 'Portuguese'
    };
    return languages[code] || code;
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
      userName="Suwan Ratnayake"
      userRole="Administrator"
      userImage="https://randomuser.me/api/portraits/women/42.jpg"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Education Materials</h1>
          <Button onClick={handleNewMaterial}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Material
          </Button>
        </div>

        <div className="flex flex-row gap-4 overflow-x-auto pb-2">
          {isLoadingStages ? (
            <div className="flex justify-center w-full py-4">Loading CKD stages...</div>
          ) : (
            ckdStages.map((stage) => (
              <Card key={stage.id} className="min-w-[180px] flex-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stage {stage.stageNumber} Materials</CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{educationMaterials.filter(m => m.ckdStage === stage.stageNumber).length}</div>
                  <p className="text-xs text-muted-foreground">
                    eGFR: {stage.minEgfr}-{stage.maxEgfr === 999 ? '∞' : stage.maxEgfr} mL/min
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Education Materials</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingMaterials ? (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">Loading education materials...</p>
                </div>
              </div>
            ) : educationMaterials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Book className="h-12 w-12 text-muted-foreground opacity-30 mb-2" />
                <h3 className="font-medium text-lg">No education materials found</h3>
                <p className="text-sm text-muted-foreground mt-1">Add your first education material to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>CKD Stage</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {educationMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.title}</TableCell>
                    <TableCell>
                      <Badge variant={getStageBadgeVariant(material.ckdStage)}>
                        {getStageName(material.ckdStage)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(material.type)}>
                        {ucfirst(material.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getLanguageName(material.langCode)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 px-2">
                            Actions <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem onClick={() => handlePreview(material.id)}>
                            View Material
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditMaterial(material.id)}>
                            Edit Material
                          </DropdownMenuItem>
                          <DropdownMenuItem className="h-px bg-muted p-0 my-1" />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteMaterial(material.id)}
                            className="text-red-500"
                          >
                            Delete Material
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Education Material Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{currentMaterial ? "Edit Education Material" : "Add New Education Material"}</DialogTitle>
              <DialogDescription>
                {currentMaterial 
                  ? "Update the education material details below." 
                  : "Enter the details for the new education material."}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter material title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="ckdStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CKD Stage</FormLabel>
                        <Select 
                          value={field.value ? field.value.toString() : "1"} 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ckdStages.map((stage) => (
                              <SelectItem key={stage.id} value={stage.stageNumber.toString()}>
                                Stage {stage.stageNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select 
                          value={field.value || "en"} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="diet">Diet</SelectItem>
                            <SelectItem value="lifestyle">Lifestyle</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="langCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select 
                          value={field.value || "en"} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                            <SelectItem value="ar">Arabic</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="pt">Portuguese</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter the educational content here..." 
                          className="min-h-[200px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {currentMaterial ? "Update Material" : "Create Material"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Material Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{previewMaterial?.title}</DialogTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">
                  {previewMaterial && getStageName(previewMaterial.ckdStage)}
                </Badge>
                <Badge variant={previewMaterial ? getTypeBadgeVariant(previewMaterial.type) : "default"}>
                  {previewMaterial?.type}
                </Badge>
                <Badge variant="secondary">
                  {previewMaterial && getLanguageName(previewMaterial.langCode)}
                </Badge>
              </div>
            </DialogHeader>
            
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              <div className="prose max-w-none">
                <p>{previewMaterial?.content}</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setIsPreviewOpen(false)}>
                Close Preview
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PortalLayout>
  );
};

export default AdminEducation;
