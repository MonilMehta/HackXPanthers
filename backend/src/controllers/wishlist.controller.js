import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Wishlist } from "../models/wishlist.models.js";

const createWishlist = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  const { userId } = req.body;

  if (!eventId) {
    throw new ApiError(400, "Event ID is required");
  }

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    // Create new wishlist if it doesn't exist
    wishlist = await Wishlist.create({
      userId,
      events: [eventId],
    });
  } else {
    // Add event to existing wishlist if not already present
    if (!wishlist.events.includes(eventId)) {
      wishlist.events.push(eventId);
      await wishlist.save();
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, wishlist, "Event added to wishlist successfully")
    );
});

const getAllWishlists = asyncHandler(async (req, res) => {
  const {userId} = req.body;
  console.log(userId);

  const wishlist = await Wishlist.findOne({ userId })
    .populate({
      path: "events",
      select: "title eventDate startTime endTime proposedPrice mediaAssets genres venueId",
      populate: {
        path: 'venueId',
        select: 'name address'
      }
    })
    .populate("userId", "username email");

  if (!wishlist) {
    return res.status(200).json(new ApiResponse(200, [], "No wishlist found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Wishlists fetched successfully"));
});

export { createWishlist, getAllWishlists };
