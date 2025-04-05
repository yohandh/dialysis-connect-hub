
import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CenterUtilizationProps {
  data: Array<{
    center: string;
    maxCapacity: number;
    currentLoad: number;
  }>;
}

const CenterUtilizationChart = ({ data }: CenterUtilizationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Center Utilization</CardTitle>
        <CardDescription>Current patient load vs. capacity</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveBar
          data={data}
          keys={["currentLoad", "maxCapacity"]}
          indexBy="center"
          groupMode="grouped"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Centers",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Count",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default CenterUtilizationChart;
