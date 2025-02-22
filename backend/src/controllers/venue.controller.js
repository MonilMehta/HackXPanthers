import { Venue } from "../models/venue.models.js";
import {Event} from "../models/event.models.js";
import mongoose from "mongoose";

// Function to auto-generate seat arrangements
const generateSeats = (seatSet) => {
    const seats = [];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // For row labels

    for (let r = 0; r < seatSet.rows; r++) {
        for (let c = 1; c <= seatSet.column; c++) {
            seats.push({
                seatNumber: `${alphabet[r]}${c}`, // Example: A1, B3
                row: alphabet[r], // A, B, C...
                column: c, // 1, 2, 3...
                isBooked: false,
                bookedBy: null,
                status: "available"
            });
        }
    }

    return seats;
};


const getSimilarVenues = async (req, res) => {
    try {
        const { eventId } = req.body;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found." });
        }

        // Find venues that match the event type
        const venues = await Venue.find({
            venueTypes: { $in: [event.eventType] } // Match venues where venueTypes array contains the eventType
        })
        .populate("managerId", "name email")
        .populate("Reviews");

        if (!venues.length) {
            return res.status(404).json({ 
                success: false, 
                message: "No venues found matching the event type." 
            });
        }

        res.status(200).json({ 
            success: true, 
            venues: filteredVenues,
            eventType: event.eventType // Include event type in response for reference
        });

    } catch (error) {
        console.error("Error fetching similar venues:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error while fetching similar venues." 
        });
    }
};

// Controller to register a venue
const registerVenue = async (req, res) => {
    try {
        const {
            managerId,
            name,
            address,
            capacity,
            seatLayout,
            amenities,
            availabilitySchedule,
            venueTypes,
            description,
            images
        } = req.body;

        // Check for required fields
        if (!managerId || !name || !capacity || !seatLayout || !description || !images) {
            return res.status(400).json({ success: false, message: "All required fields must be provided." });
        }

        // Check if managerId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(managerId)) {
            return res.status(400).json({ success: false, message: "Invalid managerId provided." });
        }

        // Auto-generate seats for each seat set
        const processedSeatLayout = seatLayout.map(seatSet => ({
            ...seatSet,
            seats: generateSeats(seatSet)
        }));

        // Create new venue
        const newVenue = new Venue({
            managerId,
            name,
            address,
            capacity,
            seatLayout: processedSeatLayout,
            amenities,
            availabilitySchedule,
            venueTypes,
            description,
            images
        });

        await newVenue.save();

        return res.status(201).json({ success: true, message: "Venue registered successfully!", venue: newVenue });
    } catch (error) {
        console.error("Error registering venue:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get all venue details with populated references
const getAllVenues = async (req, res) => {
    try {
        const venues = await Venue.find()
            .populate("managerId", "name email") // Populate manager details with selected fields
            .populate("Reviews"); // Populate reviews if available

        if (!venues.length) {
            return res.status(404).json({ success: false, message: "No venues found." });
        }

        res.status(200).json({ success: true, venues });
    } catch (error) {
        console.error("Error fetching venues:", error);
        res.status(500).json({ success: false, message: "Server error while fetching venues." });
    }
};


const bookVenue = async (req, res) => {
    const { eventId, venueId } = req.body;
    const { startTime, endTime } = req.body;

    try {
        // 1️⃣ Check if event exists
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found." });

        // 2️⃣ Check if venue exists
        const venue = await Venue.findById(venueId);
        if (!venue) return res.status(404).json({ message: "Venue not found." });

        // 3️⃣ Validate start and end time
        if (!startTime || !endTime) {
            return res.status(400).json({ message: "Start time and end time are required for booking." });
        }

        if (startTime >= endTime) {
            return res.status(400).json({ message: "End time must be after start time." });
        }

        // 4️⃣ Check for time slot conflicts
        const conflictingEvent = await Event.findOne({
            venueId: venueId,
            eventDate: event.eventDate,
            $or: [
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime },
                },
            ],
            status: { $in: ["approved", "pending_approval"] },
        });

        if (conflictingEvent) {
            return res.status(400).json({
                message: "Venue is already booked for this time slot.",
            });
        }

        // 5️⃣ Update event with venue details, startTime, endTime, and status
        event.venueId = venueId;
        event.startTime = startTime;
        event.endTime = endTime;
        event.status = "pending_approval"; // Assuming approval is needed
        await event.save();

        res.status(200).json({
            message: "Venue booked successfully and pending approval.",
            event,
        });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: "Error booking venue.", error: error.message });
    }
};


export { getSimilarVenues, registerVenue, getAllVenues, bookVenue };
