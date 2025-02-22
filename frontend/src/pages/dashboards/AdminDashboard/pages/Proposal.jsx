import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarCheck, MapPin, Clock, Users, Filter } from "lucide-react";

const ProposalCard = ({ proposal }) => (
  <Card className="p-6 bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-semibold text-lg">{proposal.eventName}</h3>
        <p className="text-muted-foreground text-sm">{proposal.comedian}</p>
      </div>
      <Badge variant={proposal.status === "Pending" ? "outline" : "default"}>
        {proposal.status}
      </Badge>
    </div>
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 text-primary" />
        <span>{proposal.venue}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <CalendarCheck className="h-4 w-4 text-primary" />
        <span>{proposal.date}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4 text-primary" />
        <span>{proposal.duration}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Users className="h-4 w-4 text-primary" />
        <span>{proposal.expectedAttendees} expected attendees</span>
      </div>
    </div>
    <div className="flex gap-2 mt-4">
      <Button size="sm" variant="default">
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-red-500 hover:text-red-600"
      >
        Reject
      </Button>
    </div>
  </Card>
);

const Proposal = () => {
  const proposals = [
    {
      id: 1,
      eventName: "Comedy Night Special",
      comedian: "John Smith",
      venue: "Laugh Factory Mumbai",
      date: "2024-02-15",
      duration: "2 hours",
      expectedAttendees: 200,
      status: "Pending",
    },
    // Add more mock data
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Event Proposals</h2>
            <p className="text-muted-foreground">
              Review and manage event proposals
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Proposal;
