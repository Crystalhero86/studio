import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_RECENT_ACTIVITIES } from '@/lib/data';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const categoryColors: { [key: string]: string } = {
  transportation: 'bg-blue-500/20 text-blue-300 border-blue-400/50',
  food_consumption: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50',
  electricity_usage: 'bg-green-500/20 text-green-300 border-green-400/50',
  shopping_lifestyle: 'bg-purple-500/20 text-purple-300 border-purple-400/50',
};


export function RecentActivities() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle className="font-headline">Recent Activities</CardTitle>
            <CardDescription>
                Here are the last 5 activities you logged.
            </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/dashboard/history">
                View All
                <ArrowUpRight className="h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">CO₂e (kg)</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_RECENT_ACTIVITIES.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="font-medium">{activity.activityName}</div>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className={categoryColors[activity.category] || ''}>
                        {activity.category.replace(/_/g, ' ')}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">{activity.co2e.toFixed(2)}</TableCell>
                <TableCell>{activity.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
