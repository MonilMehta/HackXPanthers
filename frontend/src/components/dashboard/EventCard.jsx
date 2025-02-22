import React from 'react';
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/customer/booking', { state: { event } });
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden venue-card hover:shadow-lg cursor-pointer" onClick={handleClick}>
      <div className="relative">
        <img 
          src={event.image}
          alt={event.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">{event.title}</h3>
            <p className="text-xs text-white">
              {event.comedian ? `${event.comedian} • ` : ''}{event.location} • {new Date(event.date).toLocaleDateString()}
            </p>
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
