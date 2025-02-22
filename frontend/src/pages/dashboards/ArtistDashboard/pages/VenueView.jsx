import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, Star, Calendar } from "lucide-react";

const VenueCard = ({ venue }) => (
  <Card className="overflow-hidden bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all">
    <div className="h-48 bg-primary/10 relative">
      <img
        src={venue.image}
        alt={venue.name}
        className="w-full h-full object-cover"
      />
      <Badge className="absolute top-2 right-2">{venue.type}</Badge>
    </div>
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-lg">{venue.name}</h3>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{venue.location}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-primary" />
          <span>{venue.capacity}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-primary" />
          <span>{venue.rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{venue.shows}+ shows</span>
        </div>
      </div>

      <Button className="w-full">Book Venue</Button>
    </div>
  </Card>
);

const Venue = () => {
  const venues = [
    {
      id: 1,
      name: "Laugh Factory Mumbai",
      location: "Andheri West, Mumbai",
      type: "Comedy Club",
      capacity: "200",
      rating: "4.8",
      shows: "120",
      image: "https://images.unsplash.com/photo-1603190287605-e6ade32fa852",
    },
    // Add more mock data
  ];

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Browse Venues</h2>
          <p className="text-muted-foreground">
            Find the perfect venue for your next show
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search venues..."
              className="pl-10 bg-background/50 backdrop-blur-sm"
            />
          </div>
          <Button variant="outline">Filters</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Venue;
