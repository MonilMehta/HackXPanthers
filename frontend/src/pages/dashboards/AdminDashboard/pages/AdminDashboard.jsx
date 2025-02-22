import React from "react";
import { Card } from "@/components/ui/card";
import {
  Users,
  Calendar,
  DollarSign,
  ArrowUpRight,
  BarChart2,
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, change }) => (
  <Card className="p-6 space-y-4 bg-background/50 backdrop-blur-sm border-primary/20">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="flex items-center text-sm text-green-500">
      <ArrowUpRight className="h-4 w-4 mr-1" />
      {change}% from last month
    </div>
  </Card>
);

const AdminDashboard = () => {
  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value="2,543"
            icon={Users}
            change="12"
          />
          <StatCard
            title="Events This Month"
            value="45"
            icon={Calendar}
            change="8"
          />
          <StatCard
            title="Revenue"
            value="$12,345"
            icon={DollarSign}
            change="23"
          />
          <StatCard
            title="Active Venues"
            value="28"
            icon={BarChart2}
            change="15"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Add charts here later */}
          <Card className="p-6 h-[400px] bg-background/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
            {/* Add revenue chart */}
          </Card>
          <Card className="p-6 h-[400px] bg-background/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>
            {/* Add user growth chart */}
          </Card>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
