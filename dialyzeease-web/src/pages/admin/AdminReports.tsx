import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { Download, LayoutDashboard, Building2, Users, BookOpen, FileBarChart2, Bell, ClipboardList } from "lucide-react";
import PortalLayout from "@/components/layouts/PortalLayout";
import { ckdStages, centers, patients } from '@/data/adminMockData';

// Mock data for the reports
const centerUtilizationData = [
  { center: "Metro Dialysis", capacity: 50, used: 42, utilization: 84 },
  { center: "Central Kidney", capacity: 40, used: 35, utilization: 87.5 },
  { center: "Riverside Renal", capacity: 35, used: 28, utilization: 80 },
  { center: "Highland", capacity: 25, used: 21, utilization: 84 },
  { center: "Eastside", capacity: 30, used: 26, utilization: 86.7 }
];

const patientDemographicsData = [
  { id: "Male", label: "Male", value: 58 },
  { id: "Female", label: "Female", value: 42 },
];

const ckdStageData = [
  { id: "Stage 1", value: 10 },
  { id: "Stage 2", value: 15 },
  { id: "Stage 3", value: 30 },
  { id: "Stage 4", value: 25 },
  { id: "Stage 5", value: 20 },
];

const monthlyAppointmentsData = [
  {
    id: "appointments",
    data: [
      { x: "Jan", y: 240 },
      { x: "Feb", y: 255 },
      { x: "Mar", y: 270 },
      { x: "Apr", y: 285 },
      { x: "May", y: 292 },
      { x: "Jun", y: 305 },
      { x: "Jul", y: 310 },
      { x: "Aug", y: 315 },
      { x: "Sep", y: 325 },
      { x: "Oct", y: 330 },
      { x: "Nov", y: 335 },
      { x: "Dec", y: 340 },
    ],
  },
];

// Mock audit log data
const auditLogData = [
  { id: 1, action: "create", tableName: "appointments", recordId: 2051, changedBy: "Sarah Johnson", date: "2023-05-20 14:32:45" },
  { id: 2, action: "update", tableName: "patients", recordId: 103, changedBy: "David Chen", date: "2023-05-20 13:15:22" },
  { id: 3, action: "update", tableName: "ckd_records", recordId: 455, changedBy: "Dr. Thomas Brown", date: "2023-05-20 11:05:17" },
  { id: 4, action: "delete", tableName: "appointments", recordId: 2048, changedBy: "Suwan Ratnayake", date: "2023-05-19 16:44:30" },
  { id: 5, action: "create", tableName: "education_materials", recordId: 24, changedBy: "Jennifer Wilson", date: "2023-05-19 09:22:11" },
];

const AdminReports = () => {
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
      userName="Suwan Ratnayake"
      userRole="Administrator"
      userImage="https://randomuser.me/api/portraits/women/42.jpg"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <Tabs defaultValue="centers" className="w-full">
          <TabsList>
            <TabsTrigger value="centers">Centers</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>
          
          <TabsContent value="centers" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Center Utilization Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Center Utilization</CardTitle>
                  <CardDescription>Current Patient Load vs. Capacity</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveBar
                    data={centerUtilizationData}
                    keys={["utilization"]}
                    indexBy="center"
                    margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: "linear" }}
                    indexScale={{ type: "band", round: true }}
                    colors={{ scheme: "nivo" }}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -45,
                      legend: "Center",
                      legendPosition: "middle",
                      legendOffset: 50,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Utilization (%)",
                      legendPosition: "middle",
                      legendOffset: -40,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{
                      from: "color",
                      modifiers: [["darker", 1.6]],
                    }}
                  />
                </CardContent>
              </Card>
              
              {/* Center Capacity Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Centers Overview</CardTitle>
                  <CardDescription>Detailed Capacity Information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Center</TableHead>
                        <TableHead>Total Capacity</TableHead>
                        <TableHead>In Use</TableHead>
                        <TableHead className="text-right">Utilization</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {centerUtilizationData.map((item) => (
                        <TableRow key={item.center}>
                          <TableCell className="font-medium">{item.center}</TableCell>
                          <TableCell>{item.capacity}</TableCell>
                          <TableCell>{item.used}</TableCell>
                          <TableCell className="text-right">
                            {item.utilization}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="patients" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Patient Demographics Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Patient Demographics</CardTitle>
                  <CardDescription>Gender distribution</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsivePie
                    data={patientDemographicsData}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={{ scheme: "paired" }}
                    borderWidth={1}
                    borderColor={{
                      from: "color",
                      modifiers: [["darker", 0.2]],
                    }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{
                      from: "color",
                      modifiers: [["darker", 2]],
                    }}
                    legends={[
                      {
                        anchor: "bottom",
                        direction: "row",
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: "#999",
                        itemDirection: "left-to-right",
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: "circle",
                      },
                    ]}
                  />
                </CardContent>
              </Card>
              
              {/* CKD Stage Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>CKD Stage Distribution</CardTitle>
                  <CardDescription>Percentage of patients at each stage</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsivePie
                    data={ckdStageData}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={{ scheme: "category10" }}
                    borderWidth={1}
                    borderColor={{
                      from: "color",
                      modifiers: [["darker", 0.2]],
                    }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{
                      from: "color",
                      modifiers: [["darker", 2]],
                    }}
                    legends={[
                      {
                        anchor: "bottom",
                        direction: "row",
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: "#999",
                        itemDirection: "left-to-right",
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: "circle",
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="appointments" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Appointments</CardTitle>
                <CardDescription>Total appointments processed per month</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveLine
                  data={monthlyAppointmentsData}
                  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: true,
                    reverse: false,
                  }}
                  yFormat=" >-.2f"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Month",
                    legendOffset: 36,
                    legendPosition: "middle",
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Appointments",
                    legendOffset: -40,
                    legendPosition: "middle",
                  }}
                  pointSize={10}
                  pointColor={{ theme: "background" }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: "serieColor" }}
                  pointLabelYOffset={-12}
                  useMesh={true}
                  legends={[
                    {
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 0,
                      itemDirection: "left-to-right",
                      itemWidth: 80,
                      itemHeight: 20,
                      itemOpacity: 0.75,
                      symbolSize: 12,
                      symbolShape: "circle",
                      symbolBorderColor: "rgba(0, 0, 0, .5)",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemBackground: "rgba(0, 0, 0, .03)",
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audit" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Audit Log</CardTitle>
                <CardDescription>Record of recent system changes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Record ID</TableHead>
                      <TableHead>Changed By</TableHead>
                      <TableHead>Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogData.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.id}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            log.action === 'create' ? 'bg-green-100 text-green-800' : 
                            log.action === 'update' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell>{log.tableName}</TableCell>
                        <TableCell>{log.recordId}</TableCell>
                        <TableCell>{log.changedBy}</TableCell>
                        <TableCell>{log.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
};

export default AdminReports;
