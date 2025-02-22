import React from "react";
import Sidebar from "../components/Sidebar";
import { Routes,Route } from "react-router-dom";
import Venue from "./pages/VenueView";
import AddShow from "./pages/AddShow";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";
import ArtistDashboard from "./pages/ArtistDashboard";
const Artist = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <Routes>
        <Route path="/" element={<ArtistDashboard/>}/>
        <Route path="profile" element={<Profile />} />
        <Route path="venues" element={<Venue />} />
        <Route path="addshow" element={<AddShow />} />
        <Route path="stats" element={<Stats />} />
        
      </Routes>

      
    </div>
  );
};

export default Artist;
