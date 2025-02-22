import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Shield,
  Flag,
  MessageSquare,
  Image,
  AlertTriangle,
} from "lucide-react";

const ReportCard = ({ report }) => (
  <Card className="p-4 bg-background/50 backdrop-blur-sm border-primary/20">
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20">
        <Flag className="h-5 w-5 text-red-600" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{report.title}</h4>
            <p className="text-sm text-muted-foreground">
              {report.description}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">{report.time}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="destructive">
            Remove Content
          </Button>
          <Button size="sm" variant="outline">
            Ignore
          </Button>
        </div>
      </div>
    </div>
  </Card>
);

const Moderation = () => {
  const reports = [
    {
      id: 1,
      title: "Inappropriate Content Report",
      description: "User reported inappropriate language in event description",
      time: "2 hours ago",
      type: "content",
    },
    // Add more mock data
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Content Moderation
          </h2>
          <p className="text-muted-foreground">
            Monitor and moderate platform content
          </p>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Active Reports</AlertTitle>
          <AlertDescription>
            There are {reports.length} reports that require your attention.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </TabsContent>

          {/* Add other TabsContent components for different sections */}
        </Tabs>
      </div>
    </main>
  );
};

export default Moderation;
