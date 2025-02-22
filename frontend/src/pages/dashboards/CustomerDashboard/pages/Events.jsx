import React, { useState, useEffect } from 'react';
import SearchBar from "@/components/dashboard/SearchBar";
import EventCard from "@/components/dashboard/EventCard";
import eventsData from "@/data/events.data";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(eventsData);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const query = debouncedQuery.toLowerCase();
    const filtered = eventsData.filter(e =>
      (e.title && e.title.toLowerCase().includes(query)) ||
      (e.comedian && e.comedian.toLowerCase().includes(query)) ||
      (e.location && e.location.toLowerCase().includes(query)) ||
      (e.genre && e.genre.toLowerCase().includes(query))
    );
    setFilteredEvents(filtered);
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-background p-4">
      <SearchBar onSearch={setSearchQuery} />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;
