import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useToast } from "@/hooks/use-toast";

// Form schema for generating beds
const generateBedsSchema = z.object({
  section: z.string().min(1, "Section is required"),
  keyword: z.string().min(1, "Keyword is required"),
  count: z.coerce.number().min(1, "Number of beds must be at least 1").max(100, "Maximum 100 beds can be generated at once"),
});

type GenerateBedsFormValues = z.infer<typeof generateBedsSchema>;

interface GenerateBedsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (beds: { code: string }[]) => void;
}

const GenerateBedsDialog: React.FC<GenerateBedsDialogProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const { toast } = useToast();

  // Initialize form
  const form = useForm<GenerateBedsFormValues>({
    resolver: zodResolver(generateBedsSchema),
    defaultValues: {
      section: '',
      keyword: 'BED',
      count: 10,
    },
  });

  // Form submission handler
  const onSubmit = (data: GenerateBedsFormValues) => {
    try {
      const { section, keyword, count } = data;
      const beds = [];

      // Generate bed codes
      for (let i = 1; i <= count; i++) {
        const paddedNumber = i.toString().padStart(2, '0');
        const bedCode = `${section}-${keyword}-${paddedNumber}`;
        beds.push({ code: bedCode });
      }

      // Call the onGenerate callback with the generated beds
      onGenerate(beds);
      
      // Reset form and close dialog
      form.reset();
      onClose();
      
      // Show success toast
      toast({
        title: "Success",
        description: `Generated ${count} beds successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to generate beds: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Multiple Beds</DialogTitle>
          <DialogDescription>
            Generate multiple beds with a consistent naming pattern.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g.: A1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keyword</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g.: BED" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Beds</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={100} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                Generate Beds
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateBedsDialog;
