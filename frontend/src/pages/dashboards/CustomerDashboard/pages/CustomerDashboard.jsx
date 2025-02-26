import React, { useState, useEffect } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import EventCarousel from "@/components/dashboard/EventCarousel";
import FeaturedEvents from "@/components/dashboard/FeaturedEvents";
import GenresSection from "@/components/dashboard/GenresSection";
import NearYou from "@/components/dashboard/NearYou";
import SearchResults from "@/components/dashboard/SearchResults";
import Youtube from "@/pages/landing/Youtube";
import Shorts from "@/pages/landing/Shorts";
// Import asset images
import img_big from "../../../../assets/img_big.webp";
import img_big2 from "../../../../assets/img_big2.jpg";
import img_big3 from "../../../../assets/img_big3.jpg";
import img_small from "../../../../assets/img_small.jpg";
import { toast } from "sonner";
import axios from "axios";

// Updated sample data with proper ISO date strings and a new 'genre' key.

const sampleCarouselEvents = [
  {
    id: 1,
    title: "Comedy Night Live",
    location: "Mumbai",
    date: "2023-10-25T00:00:00",
    genre: "Satire",
    image: img_big,
  },
  {
    id: 2,
    title: "Stand-up Premier League",
    location: "Delhi",
    date: "2023-10-28T00:00:00",
    genre: "Observational Comedy",
    image: img_big2,
  },
  {
    id: 3,
    title: "Laugh Riot Festival",
    location: "Bangalore",
    date: "2023-11-02T00:00:00",
    genre: "Improvisational",
    image: img_big3,
  },
];
const sampleFeaturedEvents = [
  {
    id: 1,
    title: "Satire Special",
    comedian: "Vir Das",
    price: "₹499",
    date: "2023-10-25T00:00:00",
    venue: "Comedy Cube",
    genre: "Satire",
    image: img_big,
  },
  {
    id: 2,
    title: "Roast Battle",
    comedian: "Kaneez Surka",
    price: "₹699",
    date: "2023-10-28T00:00:00",
    venue: "Laugh Factory",
    genre: "Roast Battles",
    image: img_big2,
  },
  {
    id: 3,
    title: "Improv Jam",
    comedian: "Kenny Sebastian",
    price: "₹399",
    date: "2023-11-02T00:00:00",
    venue: "Funny Bone",
    genre: "Improvisational",
    image: img_big3,
  },
];
const sampleNearYouEvents = [
  {
    id: 1,
    title: "Local Laughs",
    location: "Mumbai",
    date: "2023-10-26T00:00:00",
    price: "₹299",
    genre: "Sketch Comedy",
    image: img_big,
  },
  {
    id: 2,
    title: "Neighborhood Giggle",
    location: "Pune",
    date: "2023-10-27T00:00:00",
    price: "₹399",
    genre: "Musical Comedy",
    image: img_big2,
  },
  {
    id: 3,
    title: "Hometown Humor",
    location: "Bangalore",
    date: "2023-10-28T00:00:00",
    price: "₹499",
    genre: "Dark Comedy",
    image: img_big3,
  },
];
const genres = [
  "Observational Comedy",
  "Satire",
  "Improvisational",
  "Sketch Comedy",
  "Dark Comedy",
  "Musical Comedy",
  "Roast Battles",
  "Character Comedy",
];
const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [allApiEvents, setAllApiEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPincode, setUserPincode] = useState(null);

  const calculateProximity = (userPin, venuePin) => {
    if (!userPin || !venuePin) return Infinity;
    const userPinNum = parseInt(userPin);
    const venuePinNum = parseInt(venuePin);
    return Math.abs(userPinNum - venuePinNum);
  };

  const fetchUserAndEvents = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");

      if (!accessToken || !userId) {
        toast.error("Please login to see events near you");
        return;
      }

      // Fetch user data
      const userResponse = await axios.post(
        "http://localhost:8000/api/users/getOneUser",
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

        // Fetch all events
        const eventsResponse = await axios.get(
          "http://localhost:8000/api/events/getAllEvents",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (eventsResponse.data.success) {
          const allEvents = eventsResponse.data.data;
          setAllApiEvents(allEvents);

          // Filter nearby events if user has pincode
          if (userPincode) {
            const nearby = allEvents.filter((event) => {
              const venuePincode = event.venueId?.address?.pincode;
              const proximity = calculateProximity(userPincode, venuePincode);
              return proximity < 5;
            });
            setNearbyEvents(nearby);
          }
        }
      }
    } catch (error) {
      console.error("Error details:", error.response || error);
      toast.error(
        error.response?.data?.message || "Failed to fetch events"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndEvents();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Normalize the API events to match the sample data structure
  const normalizedApiEvents = allApiEvents.map(event => ({
    id: event._id,
    title: event.title,
    description: event.description,
    location: event.venueId?.address?.city || '',
    date: event.datetime,
    price: event.ticketPrice,
    genre: event.category,
    venue: event.venueId?.name,
    image: event.image || img_big // fallback image
  }));

  // Combine all events for searching
  const allEvents = [
    ...sampleFeaturedEvents,
    ...sampleNearYouEvents,
    ...nearbyEvents,
    ...normalizedApiEvents
  ];

  // Remove duplicates based on event ID or _id
  const uniqueEvents = Array.from(
    new Map(allEvents.map(event => [event.id || event._id, event])).values()
  );

  const filteredResults = uniqueEvents.filter((e) => {
    const query = debouncedQuery.toLowerCase().trim();
    
    // Handle both API and sample data structures
    const searchableFields = [
      e.title,
      e.description,
      e.comedian,
      e.location,
      e.genre,
      e.venue,
      e.category,
      e.venueId?.name,
      e.venueId?.address?.city
    ];

    return searchableFields.some(field => 
      field && field.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <SearchBar onSearch={setSearchQuery} />
      {debouncedQuery.trim() !== "" ? (
        <SearchResults events={filteredResults} />
      ) : (
        <>
          <EventCarousel events={sampleCarouselEvents} />
          <FeaturedEvents events={sampleFeaturedEvents} />
          <GenresSection genres={genres} />
          <NearYou events={sampleNearYouEvents} />
          <div className="mt-20 space-y-20">
            <div className="w-full">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Featured Videos
              </h2>
              <Youtube />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerDashboard;