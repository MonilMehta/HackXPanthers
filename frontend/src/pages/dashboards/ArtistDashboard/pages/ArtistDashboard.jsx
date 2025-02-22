import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Mic2, Star, TrendingUp } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, change }) => (
  <Card className="p-6 space-y-4 bg-background/50 backdrop-blur-sm border-primary/20">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className="p-2 rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
    <div className="text-sm text-green-500 flex items-center gap-1">
      <TrendingUp className="h-4 w-4" />
      {change}% this month
    </div>
  </Card>
);

const ArtistDashboard = () => {
  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Artist Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, Artist Name</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Upcoming Shows"
            value="12"
            icon={Calendar}
            change="8"
          />
          <StatCard
            title="Total Followers"
            value="2.5K"
            icon={Users}
            change="12"
          />
          <StatCard
            title="Shows Performed"
            value="45"
            icon={Mic2}
            change="15"
          />
          <StatCard title="Average Rating" value="4.8" icon={Star} change="5" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4">Upcoming Shows</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((show) => (
                <div
                  key={show}
                  className="flex items-center gap-4 p-4 rounded-lg bg-background/50"
                >
                  <div className="p-3 rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Comedy Night Special</h4>
                    <p className="text-sm text-muted-foreground">
                      Venue Name • 7:00 PM
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((activity) => (
                <div key={activity} className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-sm">
                      New booking request from Venue XYZ
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ArtistDashboard;
