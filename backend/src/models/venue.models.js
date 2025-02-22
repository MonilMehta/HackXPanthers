import mongoose, { Schema } from "mongoose";

const seatSchema = new Schema({
    seatNumber: { type: String, required: true }, // e.g., A1, B3
    row: { type: String, required: true }, // e.g., A, B, C (for structured seating)
    column: { type: Number, required: true }, // e.g., 1, 2, 3 (seat position in row)
    seatType: { type: String, enum: ["VIP", "Standard", "Balcony"], required: true },
    price: { type: Number, required: true }, // Price for this seat
    isBooked: { type: Boolean, default: false }, // Check if the seat is booked
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // User who booked the seat
    status: { type: String, enum: ["available", "pending", "booked"], default: "available" },
  });

const venueSchema = new Schema(
    {
        managerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "VenueManager",
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            pincode: { type: String, trim: true },
            latitude: { type: String },
            longitude: { type: String }
        },
        capacity: { 
            type: Number, 
            required: true 
        },
        seatLayout: [seatSchema],
        amenities: [
            {
                name: {
                    type: String,
                    required: true
                },
                icon: {
                    type: String 
                }
            }
        ],
        availabilitySchedule: {
            regularHours: [
                {
                    dayOfWeek: Number, 
                    startTime: String, 
                    endTime: String,
                    isAvailable: Boolean
                }
            ],
        },
        venueTypes: [
            {
                name: { 
                    type: String, 
                    required: true 
                },
                description: {
                    type: String
                } 
            }
        ],
        description: {
            type: String,
            required: true
        },
        images: [
            {
                type: String, //image url
                required: true,
            }
        ],
        Reviews:[
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            }
        ],
        isActive: {
            type: Boolean, 
            default: true 
        },
    },
    { timestamps: true }
);

export const Venue = mongoose.model("Venue", venueSchema);
