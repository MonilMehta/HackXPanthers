import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Slider from 'react-slick';

const VenueCarousel = ({ venues }) => {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    vertical: true,
    verticalSwiping: true,
    adaptiveHeight: true
  };

  return (
     <Card className="glass-card venue-carousel md:col-span-1">
     <CardHeader>
       <CardTitle>Your Venues</CardTitle>
     </CardHeader>
     <CardContent>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {venues.map((venue, index) => (
           <div key={index} className="venue-card relative group h-[250px] rounded-xl overflow-hidden">
             {/* Background Image */}
             <img 
               src={venue.image} 
               alt={venue.name} 
               className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
             
             {/* Content */}
             <div className="relative h-full p-6 flex flex-col justify-between">
               <div>
                 <h3 className="text-white text-xl font-bold">{venue.name}</h3>
                 <p className="text-white/80 text-sm">{venue.address}</p>
               </div>
               
               <div>
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-white/90">Capacity: {venue.capacity}</span>
                   <span className="text-white/90">⭐ {venue.rating}</span>
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {venue.amenities.map((amenity, i) => (
                     <Badge key={i} variant="outline" className="bg-black/50 text-white">{amenity}</Badge>
                   ))}
                 </div>
                 <p className="text-white/80 text-sm mt-2">Next show: {venue.nextShow}</p>
               </div>
             </div>
           </div>
         ))}
       </div>
     </CardContent>
   </Card>

  );
};

export default VenueCarousel;
