import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  MapPin,
  Clock,
  Users,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

const ProposalCard = ({ proposal }) => (
  <Card className="p-6 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all">
    <div className="flex flex-col md:flex-row gap-6">
      {/* Event Details */}
      <div className="flex-1 space-y-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl font-semibold">{proposal.eventName}</h3>
            <p className="text-muted-foreground">{proposal.artistName}</p>
          </div>
          <Badge
            variant={
              proposal.status === "pending"
                ? "secondary"
                : proposal.status === "approved"
                ? "success"
                : "destructive"
            }
          >
            {proposal.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-primary" />
            <span className="text-sm">{proposal.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm">{proposal.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm">{proposal.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm">{proposal.capacity} capacity</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          <span className="font-semibold">{proposal.ticketPrice}</span>
          <span className="text-sm text-muted-foreground">per ticket</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex md:flex-col gap-2">
        <Button variant="default" className="flex-1 gap-2">
          <ThumbsUp className="h-4 w-4" />
          Approve
        </Button>
        <Button variant="outline" className="flex-1 gap-2">
          <ThumbsDown className="h-4 w-4" />
          Reject
        </Button>
      </div>
    </div>
  </Card>
);

const ManageProposal = () => {
  const proposals = [
    {
      id: 1,
      eventName: "Comedy Night Special",
      artistName: "John Doe",
      status: "pending",
      date: "2024-03-15",
      time: "8:00 PM",
      venue: "Laugh Factory NYC",
      capacity: 200,
      ticketPrice: "$25",
    },
    // Add more mock data
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold">Event Proposals</h2>
          <p className="text-muted-foreground">
            Review and manage event proposals
          </p>
        </div>

        <div className="space-y-4">
          {proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ManageProposal;
