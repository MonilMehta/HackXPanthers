import React from 'react';
import { Smile } from "lucide-react";

const genreGradients = {
  'Observational Comedy': 'from-gray-500 to-gray-600',
  'Satire': 'from-gray-500 to-gray-600',
  'Improvisational': 'from-gray-500 to-gray-600',
  'Sketch Comedy': 'from-gray-500 to-gray-600',
  'Dark Comedy': 'from-gray-700 to-gray-800',
  'Musical Comedy': 'from-gray-500 to-gray-600',
  'Roast Battles': 'from-gray-500 to-gray-600',
  'Character Comedy': 'from-gray-500 to-gray-600'
};

const GenresSection = ({ genres }) => {
  return (
    <div className="bg-card/20 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-foreground">Explore Comedy Genres</h2>
        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
          {genres.map((genre, index) => (
            <div key={index} 
                 className={`flex-shrink-0 w-48 rounded-lg p-6 hover:shadow-md transition-all border border-border 
                   bg-gradient-to-r ${genreGradients[genre] || 'from-gray-400 to-gray-500'}`}>
              <Smile className="h-6 w-6 text-white mb-2" />
              <h3 className="text-lg font-semibold text-white">{genre}</h3>
              <p className="text-sm text-white mt-1">100+ Events</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenresSection;
