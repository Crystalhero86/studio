'use client';

import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { MOCK_OVERVIEW_DATA } from '@/lib/data';

const chartConfig = {
  co2: {
    label: 'CO₂ (kg)',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;


export function OverviewChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart
        accessibilityLayer
        data={MOCK_OVERVIEW_DATA}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
         <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}kg`}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent 
            indicator="line"
            labelFormatter={(label, payload) => {
              return new Date(payload[0].payload.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              });
            }}
          />}
        />
        <Line
          type="monotone"
          dataKey="co2"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={true}
        />
      </LineChart>
    </ChartContainer>
  );
}
