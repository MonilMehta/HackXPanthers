import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="p-4 bg-card/30 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Search by title, comedian, genre, or location..." 
          className="flex-1 p-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="flex gap-3">
          <select className="p-3 rounded-lg bg-card border border-border text-foreground">
            <option>All Genres</option>
            <option>Observational</option>
            <option>Satire</option>
            <option>Improvisational</option>
          </select>
          <select className="p-3 rounded-lg bg-card border border-border text-foreground">
            <option>Date</option>
            <option>This Week</option>
            <option>Next Week</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
