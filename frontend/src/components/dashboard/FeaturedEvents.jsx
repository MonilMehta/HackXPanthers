import React from 'react';
import { Button } from "@/components/ui/button";

const FeaturedEvents = ({ events }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-foreground">Featured For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="glass-card rounded-xl overflow-hidden venue-card hover:shadow-lg">
            <div className="relative">
              <img 
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-card/90 to-transparent">
                <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
                <p className="text-muted-foreground">{event.comedian}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-primary font-bold">{event.price}</p>
                  <p className="text-sm text-muted-foreground">{event.date} • {event.venue}</p>
                </div>
                <Button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent-hover transition-colors">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedEvents;
