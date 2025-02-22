// constants/landingPageData.js
import { Calendar, DollarSign, Users } from "lucide-react";

export const emojiPositions = [
  { emoji: "😂", x: 15, y: 20 },
  { emoji: "🎭", x: 75, y: 15 },
  { emoji: "🎪", x: 85, y: 60 },
  { emoji: "🎵", x: 25, y: 70 },
  { emoji: "🎨", x: 45, y: 40 },
  { emoji: "✨", x: 65, y: 80 },
  { emoji: "🎤", x: 35, y: 25 },
  { emoji: "🌟", x: 55, y: 65 },
];

export const features = [
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Smart Scheduling",
    description:
      "AI-powered scheduling system that helps you find the perfect time slots for your shows",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: "Seamless Payments",
    description:
      "Secure payment processing with instant transfers and detailed financial reporting",
    color: "from-pink-400 to-purple-500",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community Building",
    description:
      "Connect with other comedians, venues, and fans to grow your network",
    color: "from-blue-400 to-indigo-500",
  },
];

export const statistics = [
  { number: "10K+", label: "Shows Booked" },
  { number: "500+", label: "Partner Venues" },
  { number: "2M+", label: "Tickets Sold" },
  { number: "50K+", label: "Active Users" },
];

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Stand-up Comedian",
    content:
      "This platform has completely transformed how I book and manage my shows. The exposure to new venues and audiences is incredible!",
  },
  {
    name: "Mike Richards",
    role: "Venue Owner",
    content:
      "Managing comedy events has never been easier. The automated scheduling and payment systems save us hours of work.",
  },
  {
    name: "Alex Chen",
    role: "Comedy Fan",
    content:
      "I love how easy it is to discover new shows and comedians. The booking process is seamless, and I never miss my favorite performers.",
  },
];
