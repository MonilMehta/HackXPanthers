import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Star,
  Mic2,
  UserPlus,
  UserCheck,
  Filter,
  MapPin,
  Clock,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import EmptyState from "@/components/EmptyState";
import { getArtist } from "@/api/artist.api";
import axios from "axios";
import { followArtist, unfollowArtist } from "@/api/follower.api";
import { toast } from "sonner"; // Add this import

const mockArtists = [
  {
    id: 1,
    name: "Johnny D",
    image: "https://i.pravatar.cc/150?img=1",
    genre: "Stand-up Comedy",
    rating: "4.8",
    shows: "45+",
    location: "Mumbai, India",
    specialization: ["Dark Comedy", "Improv", "Political Satire"],
    experience: "5 years",
    bio: "Award-winning comedian known for sharp wit and social commentary",
    isFollowing: false,
    isVerified: true,
  },
  {
    id: 2,
    name: "Sarah Smith",
    image: "https://i.pravatar.cc/150?img=2",
    genre: "Improv Comedy",
    rating: "4.9",
    shows: "120+",
    location: "Delhi, India",
    specialization: ["Musical Comedy", "Character Comedy", "Sketch"],
    experience: "8 years",
    bio: "Versatile performer specializing in musical comedy and improv",
    isFollowing: true,
    isVerified: true,
  },
  {
    id: 3,
    name: "Mike Johnson",
    image: "https://i.pravatar.cc/150?img=3",
    genre: "Observational Comedy",
    rating: "4.7",
    shows: "78+",
    location: "Bangalore, India",
    specialization: ["Crowd Work", "Story Telling", "Clean Comedy"],
    experience: "6 years",
    bio: "Making people laugh with everyday observations and relatable stories",
    isFollowing: false,
    isVerified: true,
  },
  {
    id: 4,
    name: "Emily Chen",
    image: "https://i.pravatar.cc/150?img=4",
    genre: "Musical Comedy",
    rating: "4.9",
    shows: "200+",
    location: "Pune, India",
    specialization: ["Piano Comedy", "Parody Songs", "Comedy Rock"],
    experience: "10 years",
    bio: "Musical comedian blending humor with original songs",
    isFollowing: true,
    isVerified: true,
  },
  // ... Add 8-10 more similar entries with different specialties and locations
];

const SearchArtist = () => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    genre: "all",
    rating: "all",
    experience: "all",
    location: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const itemsPerPage = 6;

  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleFollow = async (artistId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        followArtist,
        { artistId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Update local state
        setArtists((prev) =>
          prev.map((artist) =>
            artist._id === artistId
              ? { ...artist, isFollowing: !artist.isFollowing }
              : artist
          )
        );

        // Show success toast
        toast.success(response.data.message || "Successfully followed artist!");
      }
    } catch (error) {
      console.error("Follow error:", error);
      toast.error(error.response?.data?.message || "Failed to follow artist");
    }
  };

  // Add useEffect for fetching artists
  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(getArtist, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        // Transform API data to match our UI requirements
        const transformedArtists = response.data.data.map((artist) => ({
          _id: artist._id,
          name: artist.fullName,
          stageName: artist.stageName,
          image: artist.profile_image,
          genre: artist.genre,
          bio: artist.bio,
          location: `${artist.address?.city || ""}, ${
            artist.address?.state || ""
          }`,
          specialization: artist.genre || [],
          experience: `${artist.yearsExperience || 0} years`,
          isVerified: artist.isVerified,
          followersCount: artist.followersCount,
          socialMedia: artist.socialMedia,
        }));

        setArtists(transformedArtists);
        setFilteredArtists(transformedArtists);
      }
    } catch (error) {
      console.error("Error fetching artists:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search logic
  useEffect(() => {
    setIsLoading(true);

    const filterArtists = () => {
      let result = [...artists];

      // Search filter
      if (debouncedSearch) {
        result = result.filter(
          (artist) =>
            artist.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            artist.location
              .toLowerCase()
              .includes(debouncedSearch.toLowerCase()) ||
            artist.specialization.some((tag) =>
              tag.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
        );
      }

      // Genre filter
      if (filters.genre !== "all") {
        result = result.filter((artist) => artist.genre === filters.genre);
      }

      // Rating filter
      if (filters.rating !== "all") {
        result = result.filter(
          (artist) => parseFloat(artist.rating) >= parseFloat(filters.rating)
        );
      }

      // Experience filter
      if (filters.experience !== "all") {
        result = result.filter((artist) => {
          const years = parseInt(artist.experience);
          switch (filters.experience) {
            case "beginner":
              return years < 3;
            case "intermediate":
              return years >= 3 && years < 7;
            case "expert":
              return years >= 7;
            default:
              return true;
          }
        });
      }

      return result;
    };

    // Simulate API call
    setTimeout(() => {
      const filtered = filterArtists();
      setFilteredArtists(filtered);
      setIsLoading(false);
    }, 500);
  }, [debouncedSearch, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredArtists.length / itemsPerPage);
  const currentArtists = filteredArtists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (key, value) => {
    setCurrentPage(1); // Reset to first page when filters change
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Search Header - Made sticky with solid background */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b pb-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search artists by name, location, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select
              value={filters.genre}
              onValueChange={(value) => handleFilterChange("genre", value)}
            >
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                {/* Add more genre options */}
                <SelectItem value="all">All Genres</SelectItem>
                <SelectItem value="standup">Stand-up</SelectItem>
                <SelectItem value="improv">Improv</SelectItem>
                <SelectItem value="sketch">Sketch Comedy</SelectItem>
                <SelectItem value="musical">Musical Comedy</SelectItem>
                <SelectItem value="observational">Observational</SelectItem>
              </SelectContent>
            </Select>

            {/* Similar updates for other filters */}
          </div>

          {/* Results count */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Found {filteredArtists.length} artists
            </p>
          </div>
        </div>
      </div>

      {/* Content Container with Fixed Width */}
      <div className="max-w-7xl mx-auto py-6">
        {/* Artists Grid with Consistent Layout */}
        <div className="grid md:grid-cols-2 gap-6 min-h-[400px]">
          {isLoading ? (
            // Show same number of skeletons as items per page
            Array(itemsPerPage)
              .fill(0)
              .map((_, i) => <ArtistCardSkeleton key={`skeleton-${i}`} />)
          ) : currentArtists.length > 0 ? (
            currentArtists.map((artist) => (
              <ArtistCard
                key={artist._id}
                artist={artist}
                onFollow={handleFollow}
              />
            ))
          ) : (
            // Empty state with full width
            <div className="col-span-full flex items-center justify-center">
              <EmptyState
                title="No artists found"
                description={
                  searchQuery
                    ? `No artists match "${searchQuery}". Try adjusting your filters or search term.`
                    : "No artists match the selected filters."
                }
                action={
                  <Button
                    variant="link"
                    onClick={() => {
                      setFilters({
                        genre: "all",
                        rating: "all",
                        experience: "all",
                        location: "all",
                      });
                      setSearchQuery("");
                    }}
                  >
                    Reset all filters
                  </Button>
                }
              />
            </div>
          )}
        </div>

        {/* Pagination with Consistent Position */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8 sticky bottom-4">
            <div className="bg-background/80 backdrop-blur-md p-2 rounded-lg shadow-lg">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={`page-${i}`}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ArtistCard = ({ artist, onFollow }) => {
  const handleFollowClick = async () => {
    await onFollow(artist._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all">
        {/* Card Header with Cover Image */}
        <div className="relative h-40 bg-gradient-to-r from-primary/20 to-primary/10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
          {artist.isVerified && (
            <Badge className="absolute top-2 right-2 bg-primary">
              Verified
            </Badge>
          )}
        </div>

        {/* Profile Section */}
        <div className="p-6 -mt-20 relative space-y-6">
          <div className="flex gap-4 items-end">
            <div className="relative">
              <img
                src={artist.image || "/default-avatar.png"}
                alt={artist.name}
                className="w-24 h-24 rounded-xl border-4 border-background object-cover"
              />
              <Badge className="absolute -bottom-2 -right-2 bg-primary">
                {artist.followersCount} followers
              </Badge>
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-lg">
                {artist.stageName || artist.name}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {artist.location}
              </p>
            </div>
          </div>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2">
            {artist.specialization.map((genre) => (
              <Badge key={genre} variant="secondary">
                {genre}
              </Badge>
            ))}
          </div>

          {/* Bio */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {artist.bio}
          </p>

          {/* Social Links & Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              {artist.socialMedia?.instagram && (
                <a
                  href={artist.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="sm">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </a>
              )}
              {artist.socialMedia?.twitter && (
                <a
                  href={artist.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="sm">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>

            <Button
              onClick={handleFollowClick}
              variant={artist.isFollowing ? "secondary" : "default"}
              disabled={artist.isFollowing} // Disable if already following
            >
              {artist.isFollowing ? (
                <>
                  <UserCheck className="mr-2 h-4 w-4" /> Following
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Follow
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Loading skeleton component
const ArtistCardSkeleton = () => (
  <Card className="overflow-hidden h-[420px]">
    {" "}
    {/* Fixed height */}
    <div className="relative h-32 bg-muted" />
    <div className="p-6 pt-0">
      <div className="flex gap-4 -mt-12 relative">
        <Skeleton className="w-24 h-24 rounded-xl" />
        <div className="flex-1 pt-12 space-y-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  </Card>
);

export default SearchArtist;
