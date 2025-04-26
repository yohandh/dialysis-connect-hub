
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getCkdMeasurementsByPatient,
  createCkdMeasurement,
  CkdMeasurement
} from "@/api/staffDialysisApi";
import CkdMeasurementForm from '@/components/staff/CkdMeasurementForm';

interface CkdMeasurementRecorderProps {
  patientId: string;
  patientName: string;
}

const CkdMeasurementRecorder: React.FC<CkdMeasurementRecorderProps> = ({ 
  patientId,
  patientName
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch CKD measurements for the patient
  const { data: measurements, isLoading } = useQuery({
    queryKey: ['ckdMeasurements', patientId],
    queryFn: () => getCkdMeasurementsByPatient(patientId),
  });

  // Create new CKD measurement mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<CkdMeasurement, 'id' | 'calculatedStage'>) => createCkdMeasurement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ckdMeasurements', patientId] });
      toast({
        title: "Success",
        description: "CKD measurement recorded successfully",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to record CKD measurement: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = (data: any) => {
    createMutation.mutate({
      patientId,
      date: data.date,
      eGFR: data.eGFR,
      creatinine: data.creatinine,
      notes: data.notes,
      staffId: data.staffId,
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Get badge color based on CKD stage
  const getCkdStageBadge = (stage: number) => {
    switch (stage) {
      case 1:
        return <Badge variant="outline" className="bg-green-50">Stage 1</Badge>;
      case 2:
        return <Badge variant="outline" className="bg-blue-50">Stage 2</Badge>;
      case 3:
        return <Badge variant="outline" className="bg-yellow-50">Stage 3</Badge>;
      case 4:
        return <Badge variant="outline" className="bg-orange-50">Stage 4</Badge>;
      case 5:
        return <Badge variant="outline" className="bg-red-50">Stage 5</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CKD Measurements</CardTitle>
        <CardDescription>
          Track kidney function measurements for {patientName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Loading CKD measurements...</div>
        ) : measurements && measurements.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>eGFR (mL/min/1.73m²)</TableHead>
                <TableHead>Creatinine (mg/dL)</TableHead>
                <TableHead>CKD Stage</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {measurements.map((measurement) => (
                <TableRow key={measurement.id}>
                  <TableCell>{formatDate(measurement.date)}</TableCell>
                  <TableCell>{measurement.eGFR}</TableCell>
                  <TableCell>{measurement.creatinine}</TableCell>
                  <TableCell>{getCkdStageBadge(measurement.calculatedStage)}</TableCell>
                  <TableCell>
                    {measurement.notes ? (
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {measurement.notes.length > 20 
                          ? `${measurement.notes.substring(0, 20)}...` 
                          : measurement.notes}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">No notes</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md border-dashed">
            <FileText className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No CKD measurements</h3>
            <p className="text-sm text-muted-foreground mb-4">
              There are no CKD measurements recorded for this patient yet.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Record First Measurement
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {measurements && measurements.length > 0 && (
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Measurement
          </Button>
        )}
      </CardFooter>

      {/* Create CKD Measurement Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record CKD Measurement</DialogTitle>
            <DialogDescription>
              Enter the latest kidney function values for {patientName}.
            </DialogDescription>
          </DialogHeader>
          <CkdMeasurementForm
            patientId={patientId}
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CkdMeasurementRecorder;
