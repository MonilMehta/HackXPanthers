import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter } from "lucide-react";
import { getAllEvents } from "@/api/event.api";
import { getOneUser } from "@/api/user.api";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import img_small from "@/assets/img_small.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NearYou = () => {
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('all');
  const [filterOptions, setFilterOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPincode, setUserPincode] = useState(null);
  const navigate = useNavigate();

  const filterTypes = {
    all: { label: 'All', options: ['all'] },
    venue: { label: 'Venue', options: [] },
    price: { label: 'Price', options: ['0-500', '501-1000', '1000+'] },
    date: { label: 'Date', options: ['today', 'this-week', 'this-month'] },
    genre: { label: 'Genre', options: [] }
  };

  const calculateProximity = (userPin, venuePin) => {
    if (!userPin || !venuePin) return Infinity;
    const userPinNum = parseInt(userPin);
    const venuePinNum = parseInt(venuePin);
    return Math.abs(userPinNum - venuePinNum);
  };

  useEffect(() => {
    fetchUserAndEvents();
  }, []);

  useEffect(() => {
    if (nearbyEvents.length > 0) {
      const venues = [...new Set(nearbyEvents.map(e => e.venueId?.name).filter(Boolean))];
      const genres = [...new Set(nearbyEvents.flatMap(e => e.genres || []))];
      
      filterTypes.venue.options = venues;
      filterTypes.genre.options = genres;
      setFilterOptions(filterTypes[filterType]?.options || []);
    }
  }, [nearbyEvents, filterType]);

  const fetchUserAndEvents = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");

      if (!accessToken || !userId) {
        toast.error("Please login to see events near you");
        return;
      }

      const userResponse = await axios.post(
        getOneUser,
        { userId: userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (userResponse.data.success) {
        const userPincode = userResponse.data.data.address?.pincode;
        setUserPincode(userPincode);

        if (!userPincode) {
          setLoading(false);
          return;
        }

        const eventsResponse = await axios.get(getAllEvents, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (eventsResponse.data.success) {
          const allEvents = eventsResponse.data.data;
          const nearby = allEvents.filter((event) => {
            const venuePincode = event.venueId?.address?.pincode;
            const proximity = calculateProximity(userPincode, venuePincode);
            return proximity < 5;
          });

          setNearbyEvents(nearby);
        }
      }
    } catch (error) {
      console.error("Error details:", error.response || error);
      toast.error(
        error.response?.data?.message || "Failed to fetch nearby events"
      );
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    if (filterType === 'all' || filterValue === 'all') return nearbyEvents;

    return nearbyEvents.filter(event => {
      switch (filterType) {
        case 'venue':
          return event.venueId?.name === filterValue;
        
        case 'price':
          const price = event.proposedPrice;
          switch (filterValue) {
            case '0-500': return price <= 500;
            case '501-1000': return price > 500 && price <= 1000;
            case '1000+': return price > 1000;
            default: return true;
          }
        
        case 'date':
          const eventDate = new Date(event.eventDate);
          const today = new Date();
          switch (filterValue) {
            case 'today':
              return eventDate.toDateString() === today.toDateString();
            case 'this-week':
              const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
              return eventDate >= today && eventDate <= weekEnd;
            case 'this-month':
              return eventDate.getMonth() === today.getMonth() && 
                     eventDate.getFullYear() === today.getFullYear();
            default:
              return true;
          }
        
        case 'genre':
          return event.genres?.includes(filterValue);
        
        default:
          return true;
      }
    });
  };

  const filteredEvents = filterEvents();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Near You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!userPincode) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Location Not Found</h2>
          <p className="text-muted-foreground mb-4">
            Please update your profile with your address to see events near you.
          </p>
          <Button onClick={() => navigate("/customer/profile")}>
            Update Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-foreground">Events Near You</h2>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <Select onValueChange={setFilterType} value={filterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(filterTypes).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filterType !== 'all' && (
            <Select onValueChange={setFilterValue} value={filterValue}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select value..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filterOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            className="glass-card rounded-xl overflow-hidden venue-card hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate(`/customer/booking/${event._id}`)}
          >
            <div className="relative">
              <img
                src={event.mediaAssets?.bannerImageUrl || 
                    event.mediaAssets?.thumbnailUrl || 
                    img_small}
                alt={event.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{event.title}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-white">
                      {event.venueId?.name} • {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      ₹{event.proposedPrice}
                    </p>
                  </div>
                  {event.genres && (
                    <div className="flex gap-2 flex-wrap">
                      {event.genres.map((genre, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-white/20 rounded-full text-white">
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more events
          </p>
        </div>
      )}
    </div>
  );
};

export default NearYou;