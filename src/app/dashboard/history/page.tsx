import { HistoryTable } from "@/components/history/history-table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold tracking-tight">Activity History</h1>
          <p className="text-muted-foreground">
            View, manage, and verify your logged activities.
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>
      
      <HistoryTable />
    </div>
  );
}
