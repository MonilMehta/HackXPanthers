import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  MapPin,
  Mail,
  Phone,
  Calendar,
  User,
  Award,
  Clock,
  Mic2,
  Share2,
} from "lucide-react";
import Posts from "./Posts";
import EditProfileModal from "./modals/EditProfileModal";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    username: "johndoe",
    email: "john@example.com",
    fullName: "John Doe",
    phoneNo: "+1234567890",
    age: "28",
    dob: "1995-06-15",
    address: "123 Comedy Street, New York, NY 10001",
    gender: "Male",
    stageName: "Johnny D",
    bio: "Award-winning stand-up comedian with 5+ years of experience...",
    yearsOfExperience: "5",
    genre: "Stand-up Comedy",
    avatar: "https://placekitten.com/200/200",
    socials: {
      instagram: "@johndoe",
      twitter: "@johndoe",
      youtube: "@johndoe",
      facebook: "johndoe",
    },
  });

  const handleProfileUpdate = (updatedData) => {
    setProfileData((prev) => ({
      ...prev,
      ...updatedData,
      socials: {
        ...prev.socials,
        ...(updatedData.socials || {}),
      },
    }));
  };

  return (
    <main className="flex-1 overflow-y-auto">
      {/* Hero Section with Gradient Background */}
      <div className="h-[300px] bg-gradient-to-br from-primary/20 via-primary/10 to-background relative">
        <div className="absolute inset-0 backdrop-blur-xl" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-32 space-y-8 pb-8">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 backdrop-blur-md bg-background/50">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-40 h-40 rounded-2xl border-4 border-background shadow-xl overflow-hidden">
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      {profileData.stageName}
                    </h1>
                    <p className="text-muted-foreground">
                      @{profileData.username}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <EditProfileModal
                      user={profileData}
                      onSave={handleProfileUpdate}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex gap-6">
                  {[
                    { label: "Shows", value: "45+" },
                    {
                      label: "Experience",
                      value: `${profileData.yearsOfExperience}y`,
                    },
                    { label: "Rating", value: "4.9" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bio & Tags */}
                <div className="space-y-3">
                  <p className="text-muted-foreground">{profileData.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Stand-up Comedy",
                      "Improv",
                      "MC",
                      "Corporate Events",
                    ].map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 backdrop-blur-md bg-background/50">
              <h3 className="text-lg font-semibold mb-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: profileData.email },
                  { icon: Phone, label: "Phone", value: profileData.phoneNo },
                  { icon: Calendar, label: "DOB", value: profileData.dob },
                  {
                    icon: MapPin,
                    label: "Location",
                    value: profileData.address,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card className="p-6 backdrop-blur-md bg-background/50">
              <h3 className="text-lg font-semibold mb-4">Connect & Follow</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(profileData.socials).map(
                  ([platform, handle]) => (
                    <a
                      key={platform}
                      href={`https://${platform}.com/${handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                      {platform === "instagram" && (
                        <Instagram className="w-5 h-5 text-[#E4405F]" />
                      )}
                      {platform === "twitter" && (
                        <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                      )}
                      {platform === "youtube" && (
                        <Youtube className="w-5 h-5 text-[#FF0000]" />
                      )}
                      {platform === "facebook" && (
                        <Facebook className="w-5 h-5 text-[#1877F2]" />
                      )}
                      <span className="font-medium">{handle}</span>
                    </a>
                  )
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Posts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Posts />
        </motion.div>
      </div>
    </main>
  );
};

export default Profile;
