import React, { useState, useEffect } from 'react';
import SearchBar from "@/components/dashboard/SearchBar";
import EventCarousel from "@/components/dashboard/EventCarousel";
import FeaturedEvents from "@/components/dashboard/FeaturedEvents";
import GenresSection from "@/components/dashboard/GenresSection";
import NearYou from "@/components/dashboard/NearYou";
import SearchResults from "@/components/dashboard/SearchResults";

// Import asset images
import img_big from "../../../../assets/img_big.webp";
import img_big2 from "../../../../assets/img_big2.jpg";
import img_big3 from "../../../../assets/img_big3.jpg";

const sampleCarouselEvents = [
  { id: 1, title: 'Comedy Night Live', location: 'Mumbai', date: '25 Oct 2023', image: img_big },
  { id: 2, title: 'Stand-up Premier League', location: 'Delhi', date: '28 Oct 2023', image: img_big2 },
  { id: 3, title: 'Laugh Riot Festival', location: 'Bangalore', date: '2 Nov 2023', image: img_big3 }
];
const sampleFeaturedEvents = [
  { id: 1, title: 'Satire Special', comedian: 'Vir Das', price: '₹499', date: '25 Oct', venue: 'Comedy Cube', image: img_big },
  { id: 2, title: 'Roast Battle', comedian: 'Kaneez Surka', price: '₹699', date: '28 Oct', venue: 'Laugh Factory', image: img_big2 },
  { id: 3, title: 'Improv Jam', comedian: 'Kenny Sebastian', price: '₹399', date: '2 Nov', venue: 'Funny Bone', image: img_big3 }
];
const genres = [
  'Observational Comedy','Satire','Improvisational','Sketch Comedy',
  'Dark Comedy','Musical Comedy','Roast Battles','Character Comedy'
];
const sampleNearYouEvents = [
  { id: 1, title: 'Local Laughs', location: 'Your City', date: '26 Oct', price: '₹299', image: img_big },
  { id: 2, title: 'Neighborhood Giggle', location: 'Your City', date: '27 Oct', price: '₹399', image: img_big2 },
  { id: 3, title: 'Hometown Humor', location: 'Your City', date: '28 Oct', price: '₹499', image: img_big3 }
];

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Debounce the search input (polling every 500ms)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter each field individually
  const allEvents = [...sampleFeaturedEvents, ...sampleNearYouEvents];
  const filteredResults = allEvents.filter(e => 
    (e.title?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
     (e.comedian && e.comedian.toLowerCase().includes(debouncedQuery.toLowerCase())) ||
     e.location?.toLowerCase().includes(debouncedQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <SearchBar onSearch={setSearchQuery} />
      {debouncedQuery.trim() === '' ? (
        <>
          <EventCarousel events={sampleCarouselEvents} />
          <FeaturedEvents events={sampleFeaturedEvents} />
        </>
      ) : (
        <SearchResults events={filteredResults} />
      )}
      <GenresSection genres={genres} />
      <NearYou events={sampleNearYouEvents} />
    </div>
  );
};

export default CustomerDashboard;