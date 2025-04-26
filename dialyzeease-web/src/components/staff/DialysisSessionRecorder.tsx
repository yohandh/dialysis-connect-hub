
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
import { Plus, Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getDialysisSessionsByPatient,
  createDialysisSession,
  DialysisSession
} from "@/api/staffDialysisApi";
import DialysisSessionForm from '@/components/staff/DialysisSessionForm';

interface DialysisSessionRecorderProps {
  patientId: string;
  patientName: string;
}

const DialysisSessionRecorder: React.FC<DialysisSessionRecorderProps> = ({ 
  patientId,
  patientName
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch dialysis sessions for the patient
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['dialysisSessions', patientId],
    queryFn: () => getDialysisSessionsByPatient(patientId),
  });

  // Create new dialysis session mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<DialysisSession, 'id'>) => createDialysisSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dialysisSessions', patientId] });
      toast({
        title: "Success",
        description: "Dialysis session recorded successfully",
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to record dialysis session: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string, complications: string[]) => {
    if (status === 'completed') {
      return complications && complications.length > 0 ? (
        <Badge variant="outline" className="bg-yellow-50">
          <AlertCircle className="h-3 w-3 mr-1" />
          Completed with issues
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-green-50">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }
    
    if (status === 'cancelled') {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    
    return <Badge>In Progress</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dialysis Treatment History</CardTitle>
        <CardDescription>
          Record and view dialysis sessions for {patientName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Loading dialysis sessions...</div>
        ) : sessions && sessions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Weight Change</TableHead>
                <TableHead>UF (L)</TableHead>
                <TableHead>BP Change</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{formatDate(session.date)}</TableCell>
                  <TableCell>{session.duration} min</TableCell>
                  <TableCell>
                    {session.preWeight} → {session.postWeight} kg
                    <span className="text-xs text-muted-foreground ml-1">
                      ({(session.preWeight - session.postWeight).toFixed(1)} kg)
                    </span>
                  </TableCell>
                  <TableCell>{session.actualUltrafiltration} L</TableCell>
                  <TableCell>
                    {session.bloodPressureBefore.systolic}/{session.bloodPressureBefore.diastolic} → 
                    {session.bloodPressureAfter.systolic}/{session.bloodPressureAfter.diastolic}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(session.status, session.complications)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md border-dashed">
            <Activity className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No dialysis sessions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              There are no dialysis sessions recorded for this patient yet.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Record First Session
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {sessions && sessions.length > 0 && (
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Session
          </Button>
        )}
      </CardFooter>

      {/* Create Dialysis Session Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Record Dialysis Session</DialogTitle>
            <DialogDescription>
              Enter details for this dialysis treatment session for {patientName}.
            </DialogDescription>
          </DialogHeader>
          <DialysisSessionForm
            onSubmit={handleSubmit}
            isSubmitting={createMutation.isPending}
            defaultValues={{ 
              patientId,
              appointmentId: "",  // In a real app, you might pass this from the appointment
              staffId: "staff-001", // In a real app, this would come from auth context
              date: new Date().toISOString().split('T')[0],
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DialysisSessionRecorder;
