import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, Banknote, Filter, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import { getArtistEvents, respondToNegotiation } from "@/api/event.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ProposalCard = ({ event, onAction }) => {
  const getLastNegotiator = () => {
    if (!event.negotiationHistory?.length) return null;
    return event.negotiationHistory[event.negotiationHistory.length - 1].proposedBy;
  };

  const lastNegotiator = getLastNegotiator();

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <p className="text-muted-foreground">{event.venueId?.name}</p>
          </div>
          <Badge variant={
            event.status === "approved" ? "default" :
            event.status === "pending_approval" ? "outline" :
            event.status === "negotiation_pending" ? "secondary" :
            "destructive"
          }>
            {event.status.replace(/_/g, ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{new Date(event.eventDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{event.venueId?.address?.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-primary" />
            <span>
              {event.percentageCommission 
                ? `${event.percentageCommission}% Commission` 
                : `₹${event.proposedPrice}`}
            </span>
          </div>
        </div>

        {/* Negotiation Status & Actions */}
        {event.status === "negotiation_pending" && (
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-2">Negotiation Status</h4>
            {lastNegotiator === "artist" ? (
              <p className="text-sm text-muted-foreground italic">
                Waiting for venue manager response...
              </p>
            ) : (
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => onAction(event._id, "accept")}
                >
                  Accept
                </Button>
                <Button 
                  size="sm"
                  variant="destructive"
                  onClick={() => onAction(event._id, "reject")}
                >
                  Reject
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => onAction(event._id, "counter")}
                >
                  Counter
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

const Proposal = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterOffer, setCounterOffer] = useState({
    proposedPrice: "",
    percentageCommission: "",
  });
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getArtistEvents, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      setEvents(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleCounterOffer = async (eventId) => {
    try {
      await axios.post(
        respondToNegotiation,
        {
          eventId,
          response: "counter",
          counterProposedPrice: counterOffer.proposedPrice || null,
          counterPercentageCommission: counterOffer.percentageCommission || null
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }}
      );
      toast.success("Counter offer sent successfully");
      setShowCounterModal(false);
      setCounterOffer({ proposedPrice: "", percentageCommission: "" });
      fetchEvents();
    } catch (error) {
      toast.error("Failed to send counter offer");
    }
  };

  const CounterOfferModal = () => (
    <Dialog open={showCounterModal} onOpenChange={setShowCounterModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Counter Offer</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Propose new terms for this event. Fill in at least one field.
          </p>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label>Fixed Price (₹)</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={counterOffer.proposedPrice}
              onChange={(e) => setCounterOffer(prev => ({
                ...prev,
                proposedPrice: e.target.value
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Commission Percentage (%)</Label>
            <Input
              type="number"
              placeholder="Enter percentage"
              min="0"
              max="100"
              value={counterOffer.percentageCommission}
              onChange={(e) => setCounterOffer(prev => ({
                ...prev,
                percentageCommission: e.target.value
              }))}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCounterModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleCounterOffer(selectedEventId)}
              disabled={!counterOffer.proposedPrice && !counterOffer.percentageCommission}
            >
              Send Counter Offer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const handleAction = async (eventId, action) => {
    if (action === "counter") {
      setSelectedEventId(eventId);
      setShowCounterModal(true);
      return;
    }

    try {
      await axios.post(
        respondToNegotiation,
        { eventId, response: action },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }}
      );
      toast.success("Response sent successfully");
      fetchEvents();
    } catch (error) {
      toast.error("Failed to respond to negotiation");
    }
  };

  const filterEvents = (tab) => {
    switch (tab) {
      case "pending":
        return events.filter(e => 
          e.status === "pending_approval" || e.status === "approved_by_admin"
        );
      case "negotiations":
        return events.filter(e => e.status === "negotiation_pending");
      case "approved":
        return events.filter(e => e.status === "approved");
      case "rejected":
        return events.filter(e => e.status === "rejected");
      default:
        return events;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">My Proposals</h2>
          <p className="text-muted-foreground">
            Track and manage your event proposals
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="negotiations">Negotiations</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TabsContent value={activeTab} className="grid md:grid-cols-2 gap-6">
              {filterEvents(activeTab).map((event) => (
                <ProposalCard 
                  key={event._id} 
                  event={event} 
                  onAction={handleAction}
                />
              ))}
              {filterEvents(activeTab).length === 0 && (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  No events found in this category
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
      <CounterOfferModal />
    </main>
  );
};

export default Proposal;
