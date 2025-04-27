
import React from 'react';
import { Building2, CircleUser, PieChart, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionCardsProps {}

const QuickActionCards = ({}: QuickActionCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Add New Center</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-1">
          <p className="text-xs text-muted-foreground">Manage centers and their operating hours.</p>
          <Button className="w-full mt-4" size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> New Center
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Register User</CardTitle>
          <CircleUser className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-1">
          <p className="text-xs text-muted-foreground">Add patient, staff or doctor accounts.</p>
          <Button className="w-full mt-4" size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> New User
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Generate Reports</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pt-1">
          <p className="text-xs text-muted-foreground">View analytical reports and insights.</p>
          <Button className="w-full mt-4" size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> New Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActionCards;
