'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp, orderBy } from 'firebase/firestore';
import type { CarbonActivity } from '@/lib/types';
import { subDays, format, startOfDay } from 'date-fns';
import { useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';

const chartConfig = {
  co2: {
    label: 'CO₂ (kg)',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;


export function OverviewChart() {
  const { firestore, user } = useFirebase();

  const sevenDaysAgo = useMemo(() => startOfDay(subDays(new Date(), 6)), []);

  const activitiesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'carbonActivities'),
      where('activityDate', '>=', sevenDaysAgo),
      orderBy('activityDate', 'asc')
    );
  }, [firestore, user, sevenDaysAgo]);

  const { data: activities, isLoading } = useCollection<CarbonActivity>(activitiesQuery);

  const chartData = useMemo(() => {
    const dailyData: { [key: string]: number } = {};
    for (let i = 0; i < 7; i++) {
        const d = subDays(new Date(), i);
        const formattedDate = format(d, 'yyyy-MM-dd');
        dailyData[formattedDate] = 0;
    }

    if (activities) {
        activities.forEach(activity => {
            const activityDate = activity.activityDate instanceof Timestamp ? activity.activityDate.toDate() : activity.activityDate;
            const formattedDate = format(activityDate, 'yyyy-MM-dd');
            if (dailyData.hasOwnProperty(formattedDate)) {
                dailyData[formattedDate] += activity.co2e;
            }
        });
    }

    return Object.entries(dailyData)
        .map(([date, co2]) => ({ date, co2: parseFloat(co2.toFixed(2)) }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [activities]);

  if (isLoading) {
    return <Skeleton className="h-[250px] w-full" />
  }

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
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
              if (payload && payload.length > 0 && payload[0].payload.date) {
                return new Date(payload[0].payload.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                });
              }
              return label;
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
