
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Venue } from "../models/venue.models.js";
import { Artist } from "../models/artist.models.js";

const getDashboardStats = asyncHandler(async (req, res) => {
    try {
        // Get counts from all collections
        const [userCount, venueCount, artistCount] = await Promise.all([
            User.countDocuments(),
            Venue.countDocuments(),
            Artist.countDocuments()
        ]);

        // Get recent registrations (last 7 days)
        const lastWeekDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        const [recentUsers, recentVenues, recentArtists] = await Promise.all([
            User.countDocuments({ createdAt: { $gte: lastWeekDate } }),
            Venue.countDocuments({ createdAt: { $gte: lastWeekDate } }),
            Artist.countDocuments({ createdAt: { $gte: lastWeekDate } })
        ]);

        // Calculate growth percentages
        const calculateGrowth = (total, recent) => {
            if (total === 0) return 0;
            return ((recent / total) * 100).toFixed(2);
        };

        const stats = {
            totalCounts: {
                users: userCount,
                venues: venueCount,
                artists: artistCount,
                total: userCount + venueCount + artistCount
            },
            recentCounts: {
                newUsers: recentUsers,
                newVenues: recentVenues,
                newArtists: recentArtists,
                totalNew: recentUsers + recentVenues + recentArtists
            },
            growth: {
                userGrowth: calculateGrowth(userCount, recentUsers),
                venueGrowth: calculateGrowth(venueCount, recentVenues),
                artistGrowth: calculateGrowth(artistCount, recentArtists)
            }
        };

        return res.status(200).json(
            new ApiResponse(
                200,
                stats,
                "Dashboard statistics fetched successfully"
            )
        );

    } catch (error) {
        throw new ApiError(500, "Error fetching dashboard statistics: " + error.message);
    }
});

export { getDashboardStats };