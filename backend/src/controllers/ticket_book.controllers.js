import { Event } from "../models/event.models.js";
import { Venue } from "../models/venue.models.js";
import { Ticket } from "../models/ticket.models.js"; // Add this import
// import { v4 as uuidv4 } from 'uuid'; // Add this for generating unique IDs

const bookTickets = async (req, res) => {
    try {
        const { 
            eventId, 
            userId, 
            selectedSeats // Array of {seatSetName, seatNumber}
        } = req.body;

        // 1. Validate event exists and is approved
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ 
                success: false, 
                message: "Event not found" 
            });
        }

        if (event.status !== 'approved') {
            return res.status(400).json({ 
                success: false, 
                message: "Event is not approved for ticket booking" 
            });
        }

        // 2. Get venue details
        const venue = await Venue.findById(event.venueId);
        if (!venue) {
            return res.status(404).json({ 
                success: false, 
                message: "Venue not found" 
            });
        }

        // 3. Validate and process each seat
        const bookedSeatsData = [];
        const ticketsData = []; // Array to store ticket documents
        let totalPrice = 0;

        for (const seat of selectedSeats) {
            // Find seat set in venue layout
            const seatSet = venue.seatLayout.find(s => s.name === seat.seatSetName);
            if (!seatSet) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Invalid seat set: ${seat.seatSetName}` 
                });
            }

            // Check if seat exists and is available
            const seatDetails = seatSet.seats.find(s => s.seatNumber === seat.seatNumber);
            if (!seatDetails || seatDetails.isBooked) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Seat ${seat.seatNumber} is not available` 
                });
            }

            // Find price for this seat set
            const seatPrice = event.seatPricing.find(sp => sp.seatSetName === seat.seatSetName);
            if (!seatPrice) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Price not set for seat set: ${seat.seatSetName}` 
                });
            }

            totalPrice += seatPrice.price;

            // Generate QR code data (you'll need to implement actual QR generation)
            const qrCodeData = `${eventId}-${seat.seatNumber}-${uuidv4()}`;

            // Create ticket document
            const ticketData = {
                eventId,
                userId,
                venueId: event.venueId,
                seatNumber: seatDetails.seatNumber,
                row: seatDetails.row,
                column: seatDetails.column,
                seatSetName: seat.seatSetName,
                price: seatPrice.price,
                bookingStatus: "confirmed",
                paymentStatus: "pending", // Update this based on your payment flow
                qrCode: qrCodeData,
                ticketFormat: "digital",
                isTransferable: true,
                expiryDate: event.eventDate, // Set expiry to event date
                validationHash: uuidv4() // Generate a unique validation hash
            };

            ticketsData.push(ticketData);

            // Prepare booking data
            bookedSeatsData.push({
                seatSetName: seat.seatSetName,
                seatNumber: seatDetails.seatNumber,
                row: seatDetails.row,
                column: seatDetails.column,
                bookedBy: userId,
                status: "booked"
            });
        }

        // Create tickets in bulk
        const createdTickets = await Ticket.insertMany(ticketsData);

        // 4. Update event with booked seats
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                $push: { 
                    bookedSeats: { $each: bookedSeatsData },
                    tickets: { $each: createdTickets.map(ticket => ticket._id) } // Add reference to tickets
                },
                $inc: { 
                    'analytics.totalTicketsSold': bookedSeatsData.length,
                    'analytics.revenueGenerated': totalPrice
                }
            },
            { new: true }
        );

        // 5. Update venue seat status
        for (const seat of selectedSeats) {
            await Venue.updateOne(
                { 
                    _id: event.venueId,
                    "seatLayout.name": seat.seatSetName,
                    "seatLayout.seats.seatNumber": seat.seatNumber
                },
                {
                    $set: {
                        "seatLayout.$.seats.$[seat].isBooked": true,
                        "seatLayout.$.seats.$[seat].bookedBy": userId,
                        "seatLayout.$.seats.$[seat].status": "booked"
                    }
                },
                {
                    arrayFilters: [{ "seat.seatNumber": seat.seatNumber }]
                }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Tickets booked successfully",
            bookingDetails: {
                eventTitle: event.title,
                bookedSeats: bookedSeatsData,
                tickets: createdTickets, // Include ticket details in response
                totalPrice,
                bookingDate: new Date()
            }
        });

    } catch (error) {
        console.error("Error booking tickets:", error);
        return res.status(500).json({
            success: false,
            message: "Error processing ticket booking",
            error: error.message
        });
    }
};

// Get available seats for an event
const getAvailableSeats = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId)
            .populate('venueId');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const venue = event.venueId;
        const availableSeats = venue.seatLayout.map(seatSet => ({
            seatSetName: seatSet.name,
            price: event.seatPricing.find(sp => sp.seatSetName === seatSet.name)?.price,
            availableSeats: seatSet.seats.filter(seat => !seat.isBooked)
        }));

        return res.status(200).json({
            success: true,
            eventTitle: event.title,
            availableSeats
        });

    } catch (error) {
        console.error("Error fetching available seats:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching available seats",
            error: error.message
        });
    }
};

export { bookTickets, getAvailableSeats};