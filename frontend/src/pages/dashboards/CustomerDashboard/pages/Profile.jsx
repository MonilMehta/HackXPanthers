"use client"
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Mail, Phone, Edit, MapPin, Calendar, Users, Music, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Add this import
import { Badge } from "@/components/ui/badge";
import EditProfileModal from "../components/EditProfileModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { currentUser, updateDetails } from "@/api/user.api";
import { getFollowings } from "@/api/follower.api";
import AWSHelper from '@/utils/awsHelper';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followings, setFollowings] = useState([]);
  const [followingsLoading, setFollowingsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Please login to continue");
      navigate("/signin");
      return;
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.get(currentUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data?.success) {
        setUserData(response.data.data);
      } else {
        throw new Error(response.data?.message || "Failed to fetch user data");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        toast.error("Session expired. Please login again");
        navigate("/signin");
      } else {
        toast.error(error.message || "Error fetching profile data");
      }
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      fetchFollowings();
    }
  }, [userData]);

  const fetchFollowings = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const response = await axios.get(getFollowings, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          userId: userData._id,
        }
      });
      
      setFollowings(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching followings:', error);
      setFollowings([]); // Set empty array on error
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Please login to continue");
        navigate("/signin");
        return;
      }

      const response = await axios.patch(updateDetails, updatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Update Profile Response:", response);

      if (response.data.success) {
        setUserData(response.data.data);
        console.log("Updated Profile Data:", response.data.data);
        toast.success("Profile updated successfully!");
        setIsEditProfileOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Error updating profile");

      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/signin");
      }
    }
  };

  const handleUpdateSuccess = async (updatedUserData) => {
    console.log("Updating user data:", updatedUserData);
    setUserData(updatedUserData);
    await fetchUserData(); // Refresh data from server
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Card className="p-6 max-w-md w-full">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-destructive">
              Error Loading Profile
            </h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => fetchUserData()}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  // No data state
  if (!userData) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Card className="p-6 max-w-md w-full">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">No Profile Data</h2>
            <p className="text-muted-foreground">
              Unable to load profile information
            </p>
            <Button onClick={() => navigate("/signin")}>Sign In Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="glass-card rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={userData.profile_image || "/default-avatar.png"} // Add default image
                  alt={userData.fullName || "User"}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/10"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png"; // Fallback if image fails to load
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {userData.fullName}
                  </h1>
                  <p className="text-muted-foreground">@{userData.username}</p>
                </div>

                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{userData.phone_no}</span>
                  </div>
                  {userData.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {`${userData.address.street}, ${userData.address.city}, ${userData.address.state} - ${userData.address.pincode}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Age: {userData.age}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-primary" />
                    <span>Gender: {userData.gender}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsEditProfileOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Following Artists Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Following Artists
              <Badge variant="secondary" className="ml-2">
                {followings?.length || 0}
              </Badge>
            </h2>
            <Button
              variant="outline"
              onClick={() => navigate("/customer/discover")}
            >
              Discover More Artists
            </Button>
          </div>

          {followingsLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : followings && followings.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {followings.map((artist) => (
                <Card
                  key={artist._id}
                  className="p-6 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <img
                        src={artist.profile_image || "/default-avatar.png"}
                       
                        className="h-24 w-24 rounded-full object-cover border-4 border-primary/10 group-hover:border-primary/30 transition-all"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                          e.target.onerror = null;
                        }}
                      />
                      {artist.isVerified && (
                        <Badge 
                          variant="secondary" 
                          className="absolute -top-2 -right-2"
                        >
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">{artist.fullName}</h3>
                      <p className="text-sm text-muted-foreground">@{artist.username}</p>
                      
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {artist.followersCount || 0}
                        </div>
                        {artist.genre && (
                          <div className="flex items-center">
                            <Music className="h-4 w-4 mr-1" />
                            {artist.genre}
                          </div>
                        )}
                      </div>

                      {artist.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {artist.bio}
                        </p>
                      )}
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => navigate(`/artist/${artist._id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <Users className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold">No Artists Found</h3>
                <p className="text-muted-foreground max-w-sm">
                  You are not following any artists yet. Discover amazing artists and follow them to see their updates here.
                </p>
                <Button
                  onClick={() => navigate("/customer/discover")}
                  className="mt-4"
                >
                  Discover Artists
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => {
          console.log("Modal closing from parent");
          setIsEditProfileOpen(false);
        }}
        userData={userData}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

// Loading state component
const LoadingState = () => (
  <div className="min-h-screen bg-background p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="space-y-4 flex-1">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </Card>
    </div>
  </div>
);

export default Profile;
