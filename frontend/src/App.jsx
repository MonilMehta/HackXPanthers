import { ThemeProvider } from "./context/ThemeProvider";
import Landing from "./pages/landing/Landing";
import { Route, BrowserRouter, Routes, useLocation } from "react-router-dom";
import Signin from "./pages/signup-in/signin/Signin";
import Signup from "./pages/signup-in/signup/Signup";
import Admin from "./pages/dashboards/AdminDashboard/Admin";
import Artist from "./pages/dashboards/ArtistDashboard/Artist";
import Customer from "./pages/dashboards/CustomerDashboard/Customer";
import VenueManager from "./pages/dashboards/VenueDashboard/VenueManager";
import { AnimatePresence } from "framer-motion";

// Wrapper component that uses location
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/venue/*" element={<VenueManager />} />
        <Route path="/artist/*" element={<Artist />} />
        <Route path="/customer/*" element={<Customer />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AnimatedRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
