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



export { createEvent };