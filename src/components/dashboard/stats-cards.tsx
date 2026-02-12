import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footprints, ArrowUpRight, GitBranch, TrendingUp } from "lucide-react";
import { MOCK_STATS } from "@/lib/data";

const icons = {
  footprints: <Footprints className="h-4 w-4 text-muted-foreground" />,
  trending: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
  commits: <GitBranch className="h-4 w-4 text-muted-foreground" />,
};

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cumulative Footprint</CardTitle>
            {icons.footprints}
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{MOCK_STATS.cumulativeFootprint} kg CO₂e</div>
            <p className="text-xs text-muted-foreground">
                Your total emissions since tracking started
            </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week vs. Last Week</CardTitle>
            {icons.trending}
            </CardHeader>
            <CardContent>
            <div className={`text-2xl font-bold ${MOCK_STATS.weeklyChange > 0 ? 'text-destructive' : 'text-primary'}`}>{MOCK_STATS.weeklyChange > 0 ? '+' : ''}{MOCK_STATS.weeklyChange}%</div>
            <p className="text-xs text-muted-foreground">
                Compared to the previous 7 days
            </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blockchain Commits</CardTitle>
            {icons.commits}
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">+{MOCK_STATS.blockchainCommits}</div>
            <p className="text-xs text-muted-foreground">
                Total immutable records created
            </p>

            </CardContent>
        </Card>
    </div>
  );
}
