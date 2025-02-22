import { Event } from "../models/Event.js";

const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            eventType,
            eventDate,
            minAge,
            genres,
            tags,
            mediaAssets,
            proposedPrice
        } = req.body;

        // Validate required fields
        if (!title || !description || !eventType || !eventDate  || !proposedPrice) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        // Create the event
        const event = await Event.create({
            primaryArtistId: req.user._id, // Assuming authentication middleware sets req.user
            title,
            description,
            eventType,
            eventDate,
            minAge,
            genres,
            tags,
            mediaAssets,
            proposedPrice,
            status: "draft", // Default status
        });

        res.status(201).json({
            message: "Event registered successfully!",
            event,
        });
    } catch (error) {
        console.error("Event creation error:", error);
        res.status(500).json({ message: "Error creating event.", error: error.message });
    }
};

const getEventDetails = async (req, res) => {
    try {
        const { id } = req.body;

        const event = await Event.findById(id)
            .populate({
                path: "primaryArtistId",
                select: "fullName"
            })
            .select(
                "title description eventType eventDate startTime endTime minAge genres tags mediaAssets seatPricing"
            );

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Failed to get event details", error: error.message });
    }
};

const approveEvent = async (req, res) => {
    try {
        const { id } = req.body;

        // Find the event by ID
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if event is already approved
        if (event.status === "approved") {
            return res.status(400).json({ message: "Event is already approved" });
        }

        // Update the event status and approval date
        event.status = "approved";
        event.approvalDate = new Date();

        await event.save();

        res.status(200).json({
            message: "Event has been successfully approved",
            event,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to approve event", error: error.message });
    }
};

export { createEvent , getEventDetails, approveEvent };