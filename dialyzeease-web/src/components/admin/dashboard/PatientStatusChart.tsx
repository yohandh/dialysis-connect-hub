
import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PatientStatusProps {
  data: Array<{
    id: string;
    label: string;
    value: number;
  }>;
}

const PatientStatusChart = ({ data }: PatientStatusProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Status Overview</CardTitle>
        <CardDescription>Distribution of patients by status</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsivePie
          data={data}
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
              translateX: 20,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 120,
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
  );
};

export default PatientStatusChart;
