import React, { useEffect } from 'react';
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
import { Pencil, Trash, Eye, Building2 } from "lucide-react";
import { DialysisCenter } from "@/types/centerTypes";

interface CenterTableProps {
  centers: DialysisCenter[];
  onEditCenter: (centerId: number) => void;
  onDeleteCenter: (centerId: number) => void;
}

const CenterTable: React.FC<CenterTableProps> = ({ 
  centers, 
  onEditCenter,
  onDeleteCenter
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Centers data received by CenterTable:', centers);
    if (centers.length > 0) {
      console.log('First center data structure:', centers[0]);
      console.log('contact_no value:', centers[0].contact_no);
      console.log('total_capacity value:', centers[0].total_capacity);
    }
  }, [centers]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Capacity</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {centers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <Building2 className="h-12 w-12 mb-2 opacity-30" />
                <p className="text-lg font-medium">No centers found</p>
                <p className="text-sm">Add a new center to get started</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          centers.map((center) => (
          <TableRow key={center.id}>
            <TableCell className="font-medium">{center.name}</TableCell>
            <TableCell>{center.address || 'No address available'}</TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className="bg-slate-900 hover:bg-slate-800 text-white">
                {center.totalCapacity || 0}
              </Badge>
            </TableCell>
            <TableCell>
              <div>{center.contactNo || 'N/A'}</div>
              <div className="text-muted-foreground text-xs">{center.email || 'N/A'}</div>
            </TableCell>
            <TableCell>
              <div className="flex justify-end space-x-1">
                <Button 
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => navigate(`/admin/centers/${center.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => onEditCenter(center.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => onDeleteCenter(center.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )))
        }
      </TableBody>
    </Table>
  );
};

export default CenterTable;
