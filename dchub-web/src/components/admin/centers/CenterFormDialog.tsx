import React, { useState } from 'react';
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CenterFormValues } from "@/types/centerTypes";
import CenterOperatingHoursForm from './CenterOperatingHoursForm';

interface CenterFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CenterFormValues>;
  onSubmit: (data: CenterFormValues) => void;
  isEditing: boolean;
}

const CenterFormDialog: React.FC<CenterFormDialogProps> = ({
  isOpen,
  onOpenChange,
  form,
  onSubmit,
  isEditing
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 2;
  
  const nextStep = () => {
    if (step < totalSteps) {
      // Validate current step fields before proceeding
      const fieldsToValidate = step === 1 
        ? ['name', 'address', 'contactNo', 'email', 'totalCapacity'] as const
        : [];
        
      form.trigger(fieldsToValidate).then(isValid => {
        if (isValid) setStep(step + 1);
      });
    }
  };
  
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const handleSubmit = (data: any) => {
    if (step === totalSteps) {
      onSubmit(data);
    } else {
      nextStep();
    }
  };
  
  const handleClose = () => {
    setStep(1); // Reset to first step when closing
    onOpenChange(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle>{isEditing ? `Edit Center (Step ${step}/${totalSteps})` : `Add New Center (Step ${step}/${totalSteps})`}</DialogTitle>
          <DialogDescription>
            {step === 1 
              ? "Enter the basic information for the dialysis center." 
              : "Set the operating hours for the dialysis center."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-w-full">
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Center Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter center name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Address" 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact Number" className="max-w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact email" className="max-w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="totalCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Capacity</FormLabel>
                        <FormControl>
                          <Input type="number" className="max-w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div></div> {/* Empty div for alignment */}
                </div>
              </>
            )}
            
            {step === 2 && (
              <>
                {/* Center Type field hidden as requested */}
                <input type="hidden" {...form.register("type")} />
                
                {/* Operating Hours Form */}
                <CenterOperatingHoursForm form={form} />
              </>
            )}

            <DialogFooter>
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep}
                >
                  Back
                </Button>
              )}
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button type="submit">
                {step < totalSteps ? "Next" : (isEditing ? "Update Center" : "Create Center")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CenterFormDialog;
