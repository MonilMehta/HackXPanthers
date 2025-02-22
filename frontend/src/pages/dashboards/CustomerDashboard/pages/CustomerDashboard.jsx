import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CustomerDashboard = () => {
  const carouselEvents = [
    { id: 1, title: 'Comedy Night Live', location: 'Mumbai', date: '25 Oct 2023' },
    { id: 2, title: 'Stand-up Premier League', location: 'Delhi', date: '28 Oct 2023' },
    { id: 3, title: 'Laugh Riot Festival', location: 'Bangalore', date: '2 Nov 2023' },
  ];

  const featuredEvents = [
    { id: 1, title: 'Satire Special', comedian: 'Vir Das', price: '₹499', date: '25 Oct', venue: 'Comedy Cube' },
    { id: 2, title: 'Roast Battle', comedian: 'Kaneez Surka', price: '₹699', date: '28 Oct', venue: 'Laugh Factory' },
    { id: 3, title: 'Improv Jam', comedian: 'Kenny Sebastian', price: '₹399', date: '2 Nov', venue: 'Funny Bone' },
  ];

  const comedyGenres = [
    'Observational Comedy', 'Satire', 'Improvisational', 'Sketch Comedy', 
    'Dark Comedy', 'Musical Comedy', 'Roast Battles', 'Character Comedy'
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search and Filters */}
      <div className="p-4 bg-card/30 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Search events, comedians, or venues..." 
              className="flex-1 p-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            <div className="flex gap-3">
              <select className="p-3 rounded-lg bg-card border border-border text-foreground">
                <option className="bg-card">Date</option>
                <option className="bg-card">This Week</option>
                <option className="bg-card">Next Week</option>
              </select>
              <select className="p-3 rounded-lg bg-card border border-border text-foreground">
                <option className="bg-card">Price</option>
                <option className="bg-card">Free</option>
                <option className="bg-card">Under ₹500</option>
                <option className="bg-card">₹500-₹1000</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Event Carousel */}
      <div className="py-8 bg-gradient-to-r from-primary/20 to-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <Slider {...settings} className="venue-carousel">
            {carouselEvents.map((event) => (
              <div key={event.id} className="relative h-96 rounded-xl overflow-hidden show-card">
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6">
                  <div className="text-center text-primary-foreground">
                    <h2 className="text-4xl font-bold mb-2">{event.title}</h2>
                    <p className="text-xl mb-4">{event.location} • {event.date}</p>
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-accent-hover transition-colors">
                      Book Tickets
                    </button>
                  </div>
                </div>
                <img 
                  src={`https://source.unsplash.com/random/800x600?comedy,${event.id}`} 
                  alt={event.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Featured For You */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Featured For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <div key={event.id} className="glass-card rounded-xl overflow-hidden venue-card hover:shadow-lg">
              <div className="relative">
                <img 
                  src={`https://source.unsplash.com/random/400x300?comedy,${event.id}`}
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
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent-hover transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comedy Genres */}
      <div className="bg-card/20 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Explore Comedy Genres</h2>
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
            {comedyGenres.map((genre, index) => (
              <div key={index} className="flex-shrink-0 glass-card rounded-lg p-6 hover:shadow-md transition-all border border-border">
                <h3 className="text-lg font-semibold text-foreground">{genre}</h3>
                <p className="text-sm text-muted-foreground mt-2">100+ Events</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Comedians */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Trending Comedians</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="glass-card p-4 rounded-xl hover:shadow-md transition-all border border-border">
              <img 
                src={`https://source.unsplash.com/random/200x200?comedian,${id}`}
                alt={`Comedian ${id}`}
                className="w-full h-48 object-cover rounded-lg mb-4 border-2 border-primary"
              />
              <h3 className="font-semibold text-lg text-foreground">Comedian Name</h3>
              <p className="text-muted-foreground text-sm">50k followers</p>
              <button className="mt-2 w-full py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;