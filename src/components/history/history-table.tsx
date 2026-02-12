// @ts-nocheck
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { MOCK_ALL_ACTIVITIES } from '@/lib/data';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { GitBranch, Loader2, MoreHorizontal, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const categoryColors: { [key: string]: string } = {
  transportation: 'bg-blue-500/20 text-blue-300 border-blue-400/50',
  food_consumption: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50',
  electricity_usage: 'bg-green-500/20 text-green-300 border-green-400/50',
  shopping_lifestyle: 'bg-purple-500/20 text-purple-300 border-purple-400/50',
};

type Activity = (typeof MOCK_ALL_ACTIVITIES)[0] & {
    isCommitting?: boolean;
};

export function HistoryTable() {
    const [activities, setActivities] = useState<Activity[]>(MOCK_ALL_ACTIVITIES);
    const { toast } = useToast();

    const handleCommit = (activityId: number) => {
        setActivities(prev => prev.map(act => act.id === activityId ? { ...act, isCommitting: true } : act));
        
        // Simulate blockchain transaction
        setTimeout(() => {
            const txHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
            setActivities(prev => prev.map(act => act.id === activityId ? { ...act, isCommitting: false, status: 'Committed', txHash } : act));
            
            toast({
                title: '🎉 Commit Successful!',
                description: `Activity recorded on the blockchain. Tx: ${txHash.slice(0,10)}...${txHash.slice(-8)}`,
            });
        }, 2500);
    };

    const copyTxHash = (txHash: string) => {
        navigator.clipboard.writeText(txHash);
        toast({ title: 'Copied!', description: 'Transaction hash copied to clipboard.' });
    };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">CO₂e (kg)</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status / Tx Hash</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="font-medium">{activity.activityName}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {activity.details}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={categoryColors[activity.category] || ''}>
                    {activity.category.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-right">{activity.co2e.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">{activity.date}</TableCell>
                <TableCell>
                    {activity.status === 'Pending' && !activity.isCommitting && (
                        <Button variant="outline" size="sm" onClick={() => handleCommit(activity.id)}>
                            <GitBranch className="mr-2 h-3 w-3" />
                            Commit
                        </Button>
                    )}
                    {activity.isCommitting && (
                        <Button variant="outline" size="sm" disabled>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Committing...
                        </Button>
                    )}
                    {activity.status === 'Committed' && activity.txHash && (
                        <div className="flex items-center gap-2 group">
                            <Badge variant="secondary" className="font-code text-primary border-primary/50">
                                {activity.txHash.slice(0, 8)}...{activity.txHash.slice(-6)}
                            </Badge>
                             <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => copyTxHash(activity.txHash)}>
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
