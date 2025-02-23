import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label"; // Add this import
import { Input } from "@/components/ui/input"; // Add this import
import { Calendar, Clock, MapPin, Users, Tag, Ticket, DollarSign, Loader2 } from "lucide-react";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  getPendingEventsVenueManager,
  getAllEvents,
  proposeNegotiation,
  respondToNegotiation,
  approveEventByVenueManager,
  rejectEvent
} from "@/api/event.api";

const ManageVenue = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [rejectedEvents, setRejectedEvents] = useState([]);
  const [negotiationEvents, setNegotiationEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [negotiationData, setNegotiationData] = useState({
    proposedPrice: "",
    percentageCommission: "",
  });
  const [showNegotiationDialog, setShowNegotiationDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fix the useEffect that has syntax errors
  useEffect(() => {
    switch (activeTab) {
      case "pending":
        fetchPendingEvents();
        break;
      case "approved":
        fetchApprovedEvents();
        break;
      case "rejected":
        fetchRejectedEvents();
        break;
      case "negotiations":
        fetchNegotiationEvents();
        break;
      default:
        break;
    }
  }, [activeTab]);

  const fetchPendingEvents = async () => {
    try {
      setIsLoading(true);
      const venueId = '67ba2ee1e9072bec73cbba16'; // Get from your auth context
      const response = await axios.post(
        getPendingEventsVenueManager,
        { venueId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }}
      );
      setPendingEvents(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch pending events");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApprovedEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(getAllEvents, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      console.log(response)
      const approved = response.data.data.filter(event => event.status == "approved");
      setApprovedEvents(approved);
    } catch (error) {
      toast.error("Failed to fetch approved events");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRejectedEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(getAllEvents, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      const rejected = response.data.data.filter(event => event.status === "rejected");
      setRejectedEvents(rejected);
    } catch (error) {
      toast.error("Failed to fetch rejected events");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNegotiationEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(getAllEvents, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
      const negotiations = response.data.data.filter(event => event.status === "negotiation_pending");
      setNegotiationEvents(negotiations);
    } catch (error) {
      toast.error("Failed to fetch events under negotiation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNegotiate = async (eventId) => {
    try {
      setIsLoading(true);
      await axios.post(
        proposeNegotiation,
        { eventId,
          newProposedPrice: negotiationData.proposedPrice,
          newPercentageCommission: negotiationData.percentageCommission
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }}
      );
      toast.success("Negotiation proposal sent");
      setShowNegotiationDialog(false);
      fetchNegotiationEvents();
    } catch (error) {
      toast.error("Failed to send negotiation proposal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespondToNegotiation = async (eventId, response, counterOffer = null) => {
    try {
      setIsLoading(true);
      const payload = {
        eventId,
        response,
        ...counterOffer
      };
      await axios.post(
        respondToNegotiation,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }}
      );
      toast.success("Response sent successfully");
      fetchNegotiationEvents();
    } catch (error) {
      toast.error("Failed to respond to negotiation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      setIsLoading(true);
      await axios.post(
        approveEventByVenueManager, // Make sure this is imported from event.api.js
        { eventId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }}
      );
      toast.success("Event approved successfully");
      fetchPendingEvents(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (eventId) => {
    try {
      setIsLoading(true);
      await axios.post(
        rejectEvent, // Make sure this is imported from event.api.js
        { eventId,
          rejectionReason: "Not suitable for our venue" // You might want to add a dialog for rejection reason
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }}
      );
      toast.success("Event rejected successfully");
      fetchPendingEvents(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject event");
    } finally {
      setIsLoading(false);
    }
  };

  // Add NegotiationDialog component
  const NegotiationDialog = () => (
    <Dialog open={showNegotiationDialog} onOpenChange={setShowNegotiationDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Negotiate Terms</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Propose new terms for this event. Fill in at least one field.
          </p>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="fixedPrice">Fixed Price (₹)</Label>
            <Input
              id="fixedPrice"
              type="number"
              placeholder="Enter amount"
              min="0"
              value={negotiationData.proposedPrice}
              onChange={(e) => setNegotiationData(prev => ({
                ...prev,
                proposedPrice: e.target.value
              }))}
              className="col-span-3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commission">Commission Percentage (%)</Label>
            <Input
              id="commission"
              type="number"
              placeholder="Enter percentage"
              min="0"
              max="100"
              value={negotiationData.percentageCommission}
              onChange={(e) => setNegotiationData(prev => ({
                ...prev,
                percentageCommission: e.target.value
              }))}
              className="col-span-3"
            />
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Current Terms</h4>
            <div className="text-sm text-muted-foreground">
              <p>Fixed Price: ₹{selectedEvent?.proposedPrice || 'Not set'}</p>
              <p>Commission: {selectedEvent?.percentageCommission || 'Not set'}%</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowNegotiationDialog(false);
                setNegotiationData({ proposedPrice: "", percentageCommission: "" });
              }}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleNegotiate(selectedEventId)}
              disabled={!negotiationData.proposedPrice && !negotiationData.percentageCommission}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Proposal'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const openNegotiationDialog = (event) => {
    setSelectedEvent(event);
    setSelectedEventId(event._id);
    setShowNegotiationDialog(true);
  };

  const TableActions = ({ event }) => {
    // Function to determine who made the last negotiation
    const getLastNegotiator = () => {
      if (!event.negotiationHistory?.length) return null;
      return event.negotiationHistory[event.negotiationHistory.length - 1].proposedBy;
    };

    const lastNegotiator = getLastNegotiator();

    return (
      <TableCell className="space-x-2">
        {event.status === "negotiation_pending" ? (
          lastNegotiator === "venueManager" ? (
            <div className="text-sm text-muted-foreground italic">
              Waiting for artist response...
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => handleRespondToNegotiation(event._id, "accept")}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRespondToNegotiation(event._id, "reject")}
              >
                Reject
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openNegotiationDialog(event)}
              >
                Re-negotiate
              </Button>
            </div>
          )
        ) : (
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => handleApprove(event._id)}
              disabled={isLoading}
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleReject(event._id)}
              disabled={isLoading}
            >
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openNegotiationDialog(event)}
              disabled={isLoading}
            >
              Negotiate
            </Button>
          </div>
        )}
      </TableCell>
    );
  };

  // Fix the NegotiationsTable with complete structure
  const NegotiationsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Current Terms</TableHead>
          <TableHead>Negotiation History</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {negotiationEvents.map((event) => (
          <TableRow key={event._id}>
            <TableCell className="font-medium">
              <div>
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </TableCell>
            <TableCell>{event.primaryArtistId?.fullName || 'N/A'}</TableCell>
            <TableCell>
              <div>
                <p>{event?.eventDate.split("T")[0]}</p>
                <p className="text-sm text-muted-foreground">
                  {event.startTime} - {event.endTime}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p>Price: ₹{event.proposedPrice || 'N/A'}</p>
                <p>Commission: {event.percentageCommission || 'N/A'}%</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                <p className="font-medium">Negotiation History:</p>
                {event.negotiationHistory?.map((negotiation, index) => (
                  <div key={index} className="text-sm border-l-2 pl-3 py-1">
                    <p className="font-medium">
                      {negotiation.proposedBy === "venueManager" ? "You" : "Artist"}:
                    </p>
                    {negotiation.proposedPrice && (
                      <p>Proposed Price: ₹{negotiation.proposedPrice}</p>
                    )}
                    {negotiation.percentageCommission && (
                      <p>Commission: {negotiation.percentageCommission}%</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(negotiation.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </TableCell>
            <TableActions event={event} />
          </TableRow>
        ))}
        {negotiationEvents.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              No events under negotiation
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  // Add StatusBadge component
  const StatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status) {
        case "negotiation_pending":
          return "bg-yellow-100 text-yellow-800";
        case "approved":
          return "bg-green-100 text-green-800";
        case "rejected":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return amount ? `₹${amount}` : 'N/A';
  };

  // Before the return statement, add the function to check if a proposal is valid
  const isValidProposal = () => {
    return negotiationData.proposedPrice || negotiationData.percentageCommission;
  };

  // Update the pending events table to use TableActions
  const PendingEventsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Venue</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Commission</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingEvents.map((event) => (
          <TableRow key={event._id}>
            <TableCell className="font-medium">
              <div>
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </TableCell>
            <TableCell>
              {event.primaryArtistId?.fullName || 'N/A'}
            </TableCell>
            <TableCell>
              <div>
                <p>{event?.eventDate.split("T")[0]}</p>
                <p className="text-sm text-muted-foreground">
                  {event.startTime} - {event.endTime}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p>{event.venueId?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {event.venueId?.address?.city}, {event.venueId?.address?.state}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="capitalize">{event.eventType}</p>
                <p className="text-sm text-muted-foreground">
                  Age {event.minAge}+
                </p>
              </div>
            </TableCell>
            <TableCell>
              {event.percentageCommission ? `${event.percentageCommission}%` : 
               event.proposedPrice ? `₹${event.proposedPrice}` : 'N/A'}
            </TableCell>
            <TableActions event={event} />
          </TableRow>
        ))}
        {pendingEvents.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
              No pending events found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="negotiations">Negotiations</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingEventsTable />
        </TabsContent>

        <TabsContent value="negotiations">
          <NegotiationsTable />
        </TabsContent>

        <TabsContent value="approved">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedEvents.map((event) => (
                <TableRow key={event._id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.primaryArtistId?.fullName || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{event?.eventDate.split("T")[0]}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{event.venueId?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.venueId?.address?.city}, {event.venueId?.address?.state}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="capitalize">{event.eventType}</p>
                      <p className="text-sm text-muted-foreground">
                        Age {event.minAge}+
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.percentageCommission ? `${event.percentageCommission}%` : 
                     event.proposedPrice ? `₹${event.proposedPrice}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      Approved
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {approvedEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No approved events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="rejected">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rejectedEvents.map((event) => (
                <TableRow key={event._id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.primaryArtistId?.fullName || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{event?.eventDate.split("T")[0]}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{event.venueId?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.venueId?.address?.city}, {event.venueId?.address?.state}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="capitalize">{event.eventType}</p>
                      <p className="text-sm text-muted-foreground">
                        Age {event.minAge}+
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.percentageCommission ? `${event.percentageCommission}%` : 
                     event.proposedPrice ? `₹${event.proposedPrice}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <Badge variant="destructive" className="mb-2">
                        Rejected
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {event.rejectionReason || 'No reason provided'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rejectedEvents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No rejected events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

      </Tabs>

      <NegotiationDialog />
    </div>
  );
};

export default ManageVenue;
