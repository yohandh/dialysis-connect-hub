
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Edit, Trash, Eye } from "lucide-react";
import { DialysisCenter } from "@/data/centerData";

interface CenterTableProps {
  centers: DialysisCenter[];
  onEditCenter: (centerId: string) => void;
  onDeleteCenter: (centerId: string) => void;
  formatOperatingHours: (center: DialysisCenter) => string;
}

const CenterTable: React.FC<CenterTableProps> = ({ 
  centers, 
  onEditCenter,
  onDeleteCenter,
  formatOperatingHours 
}) => {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Capacity</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Operating Hours</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {centers.map((center) => (
          <TableRow key={center.id}>
            <TableCell className="font-medium">{center.name}</TableCell>
            <TableCell>{center.address.city}, {center.address.state}</TableCell>
            <TableCell>
              <Badge variant={center.currentPatients / center.capacity > 0.9 ? "destructive" : "default"}>
                {center.currentPatients} / {center.capacity}
              </Badge>
            </TableCell>
            <TableCell>
              <div>{center.phone}</div>
              <div className="text-muted-foreground text-xs">{center.email}</div>
            </TableCell>
            <TableCell>
              <div className="text-sm max-w-md">
                {formatOperatingHours(center)}
              </div>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => navigate(`/admin/centers/${center.id}`)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onEditCenter(center.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => onDeleteCenter(center.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CenterTable;
