import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Filter,
} from "lucide-react";

const MetricCard = ({ title, value, change, icon: Icon }) => (
  <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className="p-2 rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
    <div
      className={`text-sm ${change >= 0 ? "text-green-500" : "text-red-500"}`}
    >
      {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% from last month
    </div>
  </Card>
);

const Analytics = () => {
  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Platform Analytics</h2>
            <p className="text-muted-foreground">
              Track platform performance and growth
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value="₹123,456"
            change={12.5}
            icon={TrendingUp}
          />
          <MetricCard
            title="Active Users"
            value="1,234"
            change={-2.3}
            icon={Users}
          />
          <MetricCard
            title="Events This Month"
            value="45"
            change={8.1}
            icon={Calendar}
          />
          <MetricCard
            title="Total Bookings"
            value="789"
            change={15.2}
            icon={BarChart}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 h-[400px] bg-background/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            {/* Add chart component here */}
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Chart placeholder
            </div>
          </Card>
          <Card className="p-6 h-[400px] bg-background/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4">User Demographics</h3>
            {/* Add chart component here */}
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Chart placeholder
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Analytics;
