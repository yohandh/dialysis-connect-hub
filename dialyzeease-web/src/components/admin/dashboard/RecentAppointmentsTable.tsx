
import React from 'react';
import { CalendarRange } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AppointmentItem {
  id: number;
  patient: string;
  center: string;
  date: string;
  time: string;
  status: string;
}

interface RecentAppointmentsTableProps {
  appointments: AppointmentItem[];
}

const RecentAppointmentsTable = ({ appointments }: RecentAppointmentsTableProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed": return "outline";
      case "booked": return "default";
      case "canceled": return "destructive";
      case "rescheduled": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>The latest dialysis appointments across all centers.</CardDescription>
        </div>
        <Button size="sm">
          <CalendarRange className="mr-2 h-4 w-4" />
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Center</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.patient}</TableCell>
                <TableCell>{appointment.center}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentAppointmentsTable;
