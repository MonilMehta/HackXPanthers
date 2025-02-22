import { Event } from "../models/event.models.js";

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

const filterEventsByType = async (req, res) => {
    try {
        const { eventType } = req.body;

        if (!eventType) {
            return res.status(400).json({ message: "eventType query parameter is required." });
        }

        const filteredEvents = await Event.find({ eventType });

        if (filteredEvents.length === 0) {
            return res.status(404).json({ message: "No events found for the specified eventType." });
        }

        res.status(200).json(filteredEvents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error: error.message });
    }
};

const getEventsByDate = async (req, res) => {
    try {
        const { date, status } = req.body;

        // Check if date is provided
        if (!date) {
            return res.status(400).json({ message: "Date is required to fetch events." });
        }

        // Create date range for the entire day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Create the query object
        const query = {
            eventDate: { $gte: startOfDay, $lte: endOfDay },
        };

        // Add status to the query if provided
        if (status) {
            query.status = status;
        }

        // Fetch events based on the query
        const events = await Event.find(query)
            .populate({
                path: "primaryArtistId",
                select: "fullName"
            })
            .select(
                "title description eventType eventDate startTime endTime minAge genres tags mediaAssets seatPricing status"
            );

        // If no events are found
        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found for the given date." });
        }

        // Return the list of events
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events by date:", error);
        res.status(500).json({ message: "Failed to get events by date.", error: error.message });
    }
};

export { createEvent , getEventDetails, approveEvent, getEventsByDate, filterEventsByType };