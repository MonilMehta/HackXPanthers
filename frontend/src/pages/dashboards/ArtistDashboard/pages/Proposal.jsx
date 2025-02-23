import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Banknote, Loader2, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "axios";
import { getArtistEvents, respondToNegotiation } from "@/api/event.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const StatusBadge = ({ status }) => {
  const variants = {
    approved: "bg-green-100 text-green-700 border-green-200",
    pending_approval: "bg-yellow-100 text-yellow-700 border-yellow-200",
    negotiation_pending: "bg-blue-100 text-blue-700 border-blue-200",
    rejected: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <Badge className={`${variants[status]} border px-2 py-1`}>
      {status.replace(/_/g, ' ').toUpperCase()}
    </Badge>
  );
};

const EventDetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/10">
    <div className="p-2 rounded-md bg-primary/10">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);

const ProposalCard = ({ event, onAction }) => {
  const getLastNegotiator = () => {
    if (!event.negotiationHistory?.length) return null;
    return event.negotiationHistory[event.negotiationHistory.length - 1].proposedBy;
  };

  const lastNegotiator = getLastNegotiator();

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold tracking-tight">{event.title}</h3>
            <p className="text-muted-foreground text-sm">{event.venueId?.name}</p>
          </div>
          <StatusBadge status={event.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <EventDetailItem 
            icon={Calendar}
            label="Date"
            value={new Date(event.eventDate).toLocaleDateString()}
          />
          <EventDetailItem 
            icon={Clock}
            label="Time"
            value={`${event.startTime} - ${event.endTime}`}
          />
          <EventDetailItem 
            icon={MapPin}
            label="Location"
            value={event.venueId?.address?.city}
          />
          <EventDetailItem 
            icon={Banknote}
            label="Payment"
            value={event.percentageCommission 
              ? `${event.percentageCommission}% Commission` 
              : `₹${event.proposedPrice}`}
          />
        </div>

        {event.status === "negotiation_pending" && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Negotiation Status</h4>
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              {lastNegotiator === "artist" ? (
                <div className="bg-secondary/20 text-secondary-foreground p-3 rounded-lg">
                  <p className="text-sm">
                    Waiting for venue manager response...
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
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
                    Counter Offer
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const CounterOfferModal = ({ open, onClose, onSubmit, counterOffer, setCounterOffer }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Make Counter Offer</DialogTitle>
        <p className="text-sm text-muted-foreground">
          Propose new terms for this event. Fill in at least one field.
        </p>
      </DialogHeader>
      
      <div className="space-y-6 py-4">
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
      </div>

      <DialogFooter className="flex space-x-2">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!counterOffer.proposedPrice && !counterOffer.percentageCommission}
          className="flex-1"
        >
          Submit Offer
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

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

  const handleCounterOffer = async () => {
    try {
      await axios.post(
        respondToNegotiation,
        {
          eventId: selectedEventId,
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
    <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">My Proposals</h2>
            <p className="text-muted-foreground">
              Track and manage your event proposals
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="pending" className="data-[state=active]:bg-background">
                Pending
              </TabsTrigger>
              <TabsTrigger value="negotiations" className="data-[state=active]:bg-background">
                Negotiations
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-background">
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-background">
                Rejected
              </TabsTrigger>
            </TabsList>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Loading proposals...</p>
              </div>
            </div>
          ) : (
            <TabsContent value={activeTab} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {filterEvents(activeTab).map((event) => (
                  <ProposalCard 
                    key={event._id} 
                    event={event} 
                    onAction={handleAction}
                  />
                ))}
                {filterEvents(activeTab).length === 0 && (
                  <div className="col-span-2 text-center py-32">
                    <div className="space-y-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                        <ChevronRight className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">No proposals</p>
                        <p className="text-sm text-muted-foreground">
                          No events found in this category
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      <CounterOfferModal 
        open={showCounterModal}
        onClose={() => setShowCounterModal(false)}
        onSubmit={() => handleCounterOffer(selectedEventId)}
        counterOffer={counterOffer}
        setCounterOffer={setCounterOffer}
      />
    </main>
  );
};

export default Proposal;