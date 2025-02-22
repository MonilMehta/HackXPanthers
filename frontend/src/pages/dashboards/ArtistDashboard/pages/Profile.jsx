import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Edit,
  Users,
  MapPin,
} from "lucide-react";
import Posts from "./Posts";
import EditProfileModal from "./modals/EditProfileModal";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    stageName: "Johnny D",
    bio: "Award-winning stand-up comedian with 5+ years of experience...",
    avatar: "https://placekitten.com/200/200",
    location: "New York, USA",
    socials: {
      instagram: "@johndoe",
      twitter: "@johndoe",
      youtube: "@johndoe",
      facebook: "johndoe",
    },
    stats: {
      posts: 245,
      followers: "14.5K",
      following: 892,
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
    <main className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="relative overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/10" />

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Profile Image */}
              <div className="relative -mt-20">
                <div className="w-32 h-32 rounded-full border-4 border-background bg-primary/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">{profileData.name}</h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {profileData.location}
                    </p>
                  </div>
                  <EditProfileModal
                    user={profileData}
                    onSave={handleProfileUpdate}
                  />
                </div>

                {/* Stats */}
                <div className="flex gap-6 py-4 border-y">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {profileData.stats.posts}
                    </p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {profileData.stats.followers}
                    </p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {profileData.stats.following}
                    </p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Bio</h4>
                  <p className="text-muted-foreground">{profileData.bio}</p>
                </div>

                {/* Social Links */}
                <div className="flex gap-4">
                  {Object.entries(profileData.socials).map(
                    ([platform, handle]) =>
                      handle && (
                        <a
                          key={platform}
                          href={`https://${platform}.com/${handle.replace(
                            "@",
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                          {platform === "instagram" && (
                            <Instagram className="h-5 w-5 text-primary" />
                          )}
                          {platform === "twitter" && (
                            <Twitter className="h-5 w-5 text-primary" />
                          )}
                          {platform === "youtube" && (
                            <Youtube className="h-5 w-5 text-primary" />
                          )}
                        </a>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Posts />
      </div>
    </main>
  );
};

export default Profile;
