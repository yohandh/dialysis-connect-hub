import React, { useEffect, useState } from 'react';
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
import { Building2, ChevronDown } from "lucide-react";
import { DialysisCenter } from "@/types/centerTypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CenterTableProps {
  centers: DialysisCenter[];
  onEditCenter: (centerId: number) => void;
  onDeleteCenter: (centerId: number) => void;
  onToggleActive: (centerId: number, currentStatus: boolean) => void;
}

const CenterTable: React.FC<CenterTableProps> = ({ 
  centers, 
  onEditCenter,
  onDeleteCenter,
  onToggleActive
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Centers data received by CenterTable:', centers);
    if (centers.length > 0) {
      console.log('First center data structure:', centers[0]);
      console.log('contactNo value:', centers[0].contactNo);
      console.log('totalCapacity value:', centers[0].totalCapacity);
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
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {centers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <Building2 className="h-12 w-12 mb-2 opacity-30" />
                <p className="text-lg font-medium">No centers found</p>
                <p className="text-sm">Add a new center to get started</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          centers.map((center) => (
          <TableRow key={center.id} className={!center.isActive ? "opacity-60" : ""}>
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
              <Badge 
                variant={center.isActive ? "default" : "secondary"}
                className={center.isActive ? "bg-green-100 text-green-600 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}
              >
                {center.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 px-2">
                    Actions <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={() => navigate(`/admin/centers/${center.id}`)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditCenter(center.id)}>
                    Edit Center
                  </DropdownMenuItem>
                  <DropdownMenuItem className="h-px bg-muted p-0 my-1" />
                  <DropdownMenuItem 
                    onClick={() => onToggleActive(center.id, center.isActive)}
                    className={center.isActive ? "text-amber-500" : "text-green-500"}
                  >
                    {center.isActive ? "Deactivate Center" : "Activate Center"}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDeleteCenter(center.id)}
                    className="text-red-500"
                  >
                    Delete Center
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )))
        }
      </TableBody>
    </Table>
  );
};

export default CenterTable;
