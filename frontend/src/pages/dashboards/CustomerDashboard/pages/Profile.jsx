import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Mail, Phone, Edit, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Add this import
import EditProfileModal from "../components/EditProfileModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { currentUser, updateDetails } from "@/api/user.api";
import { getFollowings } from "@/api/follower.api";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [error, setError] = useState(null);
  const [followings, setFollowings] = useState([]);
  const [followingsLoading, setFollowingsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log("Access Token:", accessToken); // Debug log

      if (!accessToken) {
        toast.error("Please login to continue");
        navigate("/signin");
        return;
      }

      // Fixed API URL
      const response = await axios.get(currentUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Raw Response:", response);

      if (response.data && response.data.success) {
        setUserData(response.data.data);
        setError(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error details:", error);
      toast.error(
        error.response?.data?.message || "Error fetching profile data"
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/signin");
      }
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
      const response = await axios.get(getFollowings, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Followings Response:", response.data);
      if (response.data.success) {
        // Set empty array if data is null
        setFollowings(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching followings:", error);
      toast.error("Failed to fetch following artists");
      setFollowings([]); // Set empty array on error
    } finally {
      setFollowingsLoading(false);
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

      if (response.data.success) {
        setUserData(response.data.data);
        toast.success("Profile updated successfully!");
        setIsEditProfileOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to update profile");
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
                  src={userData.profile_image}
                  alt={userData.fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/10"
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
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Following Artists
          </h2>

          {followingsLoading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : followings && followings.length > 0 ? ( // Added null check here
            <div className="grid md:grid-cols-3 gap-4">
              {followings.map((artist) => (
                <Card
                  key={artist._id}
                  className="p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={artist.profile_image || "/default-avatar.png"}
                      alt={artist.fullName}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{artist.fullName}</h3>
                      <p className="text-sm text-muted-foreground">
                        @{artist.username}
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-primary"
                        onClick={() => navigate(`/artist/${artist._id}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <h3 className="text-lg font-semibold">No Artists Found</h3>
              <p className="text-muted-foreground">
                You are not following any artists yet.
              </p>
              <Button
                variant="link"
                onClick={() => navigate("/customer/discover")}
                className="mt-2"
              >
                Discover Artists
              </Button>
            </Card>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        userData={userData}
        onUpdate={handleUpdateProfile}
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
