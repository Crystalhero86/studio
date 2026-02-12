'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { MOCK_CATEGORY_DATA } from '@/lib/data';

const chartConfig = {
  co2: {
    label: 'CO₂ (kg)',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function CategoryChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart 
        accessibilityLayer 
        data={MOCK_CATEGORY_DATA}
        layout="vertical"
        margin={{ left: 10 }}
      >
        <YAxis
          dataKey="category"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={100}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <XAxis 
          dataKey="co2"
          type="number"
          hide
        />
        <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
        <Bar dataKey="co2" layout="vertical" radius={5} fill="hsl(var(--primary))" />
      </BarChart>
    </ChartContainer>
  );
}
