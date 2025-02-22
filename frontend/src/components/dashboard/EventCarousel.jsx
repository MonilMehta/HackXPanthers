import React from 'react';
import Slider from 'react-slick';
import { Button } from "@/components/ui/button";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EventCarousel = ({ events }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    autoplay: true
  };

  return (
    <div className="py-8 bg-gradient-to-r from-primary/20 to-primary/10">
      <div className="max-w-6xl mx-auto px-4">
        <Slider {...settings} className="venue-carousel">
          {events.map((event) => (
            <div key={event.id} className="relative h-96 rounded-xl overflow-hidden show-card">
              <img 
                src={event.image}
                alt={event.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-black/70 to-transparent">
                <h2 className="text-4xl font-bold mb-2 text-white">{event.title}</h2>
                <p className="text-xl mb-4 text-white">{event.location} • {event.date}</p>
                <Button className="px-6 py-2 rounded-full font-semibold hover:bg-accent-hover transition-colors">
                  Book Tickets
                </Button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default EventCarousel;
