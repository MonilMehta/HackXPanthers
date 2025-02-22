import React from 'react';
import { useLocation } from 'react-router-dom';

const Booking = () => {
  const location = useLocation();
  const { event } = location.state || {};

  if (!event) return <div>No event selected.</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Booking for {event.title}</h1>
      {/* ... Use event details for booking ... */}
      <p>{event.comedian && `Comedian: ${event.comedian}`}</p>
      <p>Location: {event.location}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Price: {event.price}</p>
      {/* ...additional booking UI... */}
    </div>
  );
};

export default Booking;
