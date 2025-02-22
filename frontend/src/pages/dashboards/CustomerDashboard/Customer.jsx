import React from "react";
import Sidebar from "../components/Sidebar";
import CustomerDashboard from "./pages/CustomerDashboard";
import Ticket from "./pages/ViewBookings";
import Following from "./pages/Following";
import Profile from "./pages/Profile";
import { Route,Routes } from "react-router-dom";
const Customer = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <Routes>
        <Route path="/" element={<CustomerDashboard />} />
        <Route path="tickets" element={<Ticket />} />
        <Route path="following" element={<Following />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default Customer;
