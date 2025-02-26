import React from "react";
import Sidebar from "../components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Venue from "./pages/VenueView";
import Proposal from "./pages/Proposal";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";
import ArtistDashboard from "./pages/ArtistDashboard";
import Addpost from "./pages/Addpost";
import BookVenue from "./pages/BookVenue";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Artist = () => {
  return (
    <DashboardLayout sidebar={Sidebar}>
      <Routes>
        <Route path="/" element={<ArtistDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="venues" element={<Venue />} />
        <Route path="addshow" element={<Proposal />} />
        <Route path="stats" element={<Stats />} />
        <Route path="addpost" element={<Addpost />} />
        <Route path="booking" element={<BookVenue />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Artist;
