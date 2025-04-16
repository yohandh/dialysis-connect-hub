
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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Book, Edit, FileText, Plus, Trash, LayoutDashboard, Building2, Users, BookOpen, FileBarChart2, Bell, ClipboardList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PortalLayout from "@/components/layouts/PortalLayout";
import { EducationMaterial, CkdStage } from '@/types/adminTypes';

// Mock data for education materials
const educationMaterials: EducationMaterial[] = [
  {
    id: 1,
    ckdStage: 1,
    langCode: 'en',
    type: 'diet',
    title: 'Diet Recommendations for CKD Stage 1',
    content: 'Limit protein intake to 0.8g per kg body weight. Reduce sodium intake to less than 2,300mg per day...'
  },
  {
    id: 2,
    ckdStage: 2,
    langCode: 'en',
    type: 'lifestyle',
    title: 'Exercise Guidelines for CKD Stage 2',
    content: 'Aim for 30 minutes of moderate exercise 5 days per week. Avoid high-intensity workouts...'
  },
  {
    id: 3,
    ckdStage: 3,
    langCode: 'en',
    type: 'general',
    title: 'Understanding CKD Stage 3',
    content: 'At stage 3, your kidneys are moderately damaged and not working as well as they should...'
  },
  {
    id: 4,
    ckdStage: 4,
    langCode: 'es',
    type: 'diet',
    title: 'Recomendaciones Dietéticas para ERC Etapa 4',
    content: 'Limite la ingesta de proteínas a 0.6g por kg de peso corporal. Reduzca el potasio y el fósforo...'
  },
  {
    id: 5,
    ckdStage: 5,
    langCode: 'en',
    type: 'general',
    title: 'Preparing for Dialysis - Stage 5 CKD',
    content: 'Stage 5 CKD means your kidneys are working at less than 15% capacity. Preparation for dialysis...'
  },
];

// Mock data for CKD stages
const ckdStages: CkdStage[] = [
  { id: 1, stageNumber: 1, minEgfr: 90, maxEgfr: 999, description: 'Kidney damage with normal kidney function' },
  { id: 2, stageNumber: 2, minEgfr: 60, maxEgfr: 89, description: 'Kidney damage with mild loss of kidney function' },
  { id: 3, stageNumber: 3, minEgfr: 30, maxEgfr: 59, description: 'Mild to severe loss of kidney function' },
  { id: 4, stageNumber: 4, minEgfr: 15, maxEgfr: 29, description: 'Severe loss of kidney function' },
  { id: 5, stageNumber: 5, minEgfr: 0, maxEgfr: 15, description: 'Kidney failure' },
];

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<number | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<EducationMaterial | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
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

  // Form submission handler
  const onSubmit = (data: EducationFormValues) => {
    if (currentMaterial) {
      // Update existing material
      toast({
        title: "Material updated",
        description: "The education material has been updated successfully.",
      });
    } else {
      // Create new material
      toast({
        title: "Material added",
        description: "The new education material has been added successfully.",
      });
    }
    setIsDialogOpen(false);
  };

  // Get stage label
  const getStageName = (stageNumber: number) => {
    const stage = ckdStages.find(s => s.stageNumber === stageNumber);
    return stage ? `Stage ${stage.stageNumber}` : `Stage ${stageNumber}`;
  };

  // Get material type badge variant
  const getTypeBadgeVariant = (type: string): "default" | "secondary" | "outline" => {
    switch (type) {
      case "diet": return "default";
      case "lifestyle": return "secondary";
      case "general": return "outline";
      default: return "default";
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
      userName="Michael Adams"
      userRole="System Administrator"
      userImage="https://randomuser.me/api/portraits/men/42.jpg"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Education Materials</h1>
          <Button onClick={handleNewMaterial}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Material
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ckdStages.map((stage) => (
            <Card key={stage.id}>
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
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Education Materials</CardTitle>
          </CardHeader>
          <CardContent>
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
                      <Badge variant="outline">
                        {getStageName(material.ckdStage)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(material.type)}>
                        {material.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{getLanguageName(material.langCode)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handlePreview(material.id)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditMaterial(material.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                          defaultValue={field.value.toString()} 
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
                          defaultValue={field.value} 
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
                          defaultValue={field.value} 
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
