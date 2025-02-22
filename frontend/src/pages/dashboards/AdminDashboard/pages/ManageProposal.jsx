import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventProposalCard from "../components/EventProposalCard";
import VenueProposalCard from "../components/VenueProposalCard";
import EventDetailsModal from "../components/EventDetailsModal";
import VenueDetailsModal from "../components/VenueDetailsModal";
import emptyBox from "@/assets/empty-box.svg";
import { Loader2 } from "lucide-react";

const ManageProposal = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pendingVenues, setPendingVenues] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationOtp, setVerificationOtp] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPendingEvents();
    fetchPendingVenues();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8000/api/events/getPendingEventsAdmin");
      setPendingEvents(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch pending events");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingVenues = async () => {
    // Implement venue fetching when API is ready
  };

  const handleApproveEvent = async (eventId) => {
    try {
      await axios.post("http://localhost:8000/api/events/approveEventByAdmin", { eventId });
      toast.success("Event approved successfully");
      fetchPendingEvents();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to approve event");
    }
  };

  const handleVerifyVenue = async (venueId) => {
    // Implement venue verification when API is ready
    if (verificationOtp === "123456") { // Replace with actual OTP validation
      toast.success("Venue verified successfully");
      setIsModalOpen(false);
    } else {
      toast.error("Invalid OTP");
    }
  };

  const EmptyState = ({ type }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg">
      <img
        src={emptyBox}
        alt="Empty state"
        className="w-32 h-32 mb-4 opacity-50"
      />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        All Caught Up!
      </h3>
      <p className="text-gray-500 text-center">
        {type === 'events' 
          ? 'No pending event proposals to review at the moment.'
          : 'No pending venue proposals to review at the moment.'}
      </p>
    </div>
  );

  const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="space-y-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Manage Proposals
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white p-6 rounded-lg shadow-sm">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="events">Event Proposals</TabsTrigger>
            <TabsTrigger value="venues">Venue Proposals</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            {isLoading ? (
              <LoadingState />
            ) : pendingEvents.length === 0 ? (
              <EmptyState type="events" />
            ) : (
              pendingEvents.map((event) => (
                <EventProposalCard
                  key={event._id}
                  proposal={event}
                  onViewDetails={(event) => {
                    setSelectedItem(event);
                    setIsModalOpen(true);
                  }}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="venues" className="space-y-4">
            {isLoading ? (
              <LoadingState />
            ) : pendingVenues.length === 0 ? (
              <EmptyState type="venues" />
            ) : (
              pendingVenues.map((venue) => (
                <VenueProposalCard
                  key={venue._id}
                  venue={venue}
                  onViewDetails={(venue) => {
                    setSelectedItem(venue);
                    setIsModalOpen(true);
                  }}
                />
              ))
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {activeTab === "events" ? "Event Details" : "Venue Details"}
              </DialogTitle>
            </DialogHeader>

            {selectedItem && activeTab === "events" && (
              <EventDetailsModal
                event={selectedItem}
                onApprove={handleApproveEvent}
              />
            )}

            {selectedItem && activeTab === "venues" && (
              <VenueDetailsModal
                venue={selectedItem}
                verificationOtp={verificationOtp}
                onOtpChange={(e) => setVerificationOtp(e.target.value)}
                onVerify={handleVerifyVenue}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};

export default ManageProposal;
