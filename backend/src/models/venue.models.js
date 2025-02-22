import mongoose, { Schema } from "mongoose";

const seatSchema = new Schema(
    {
        name: {
            type: String, 
            required: true,
        },
        priority: {
            type: Number, 
            required: true 
        },
        rows: { 
            type: Number, 
            required: true 
        }, 
        columns: { 
            type: Number, 
            required: true 
        }, 
        seats: [
            {
                seatNumber: { 
                    type: String, 
                    required: true 
                },
                row: { 
                    type: String, 
                    required: true 
                }, 
                column: { 
                    type: Number, 
                    required: true 
                }, 
                isBooked: { 
                    type: Boolean, 
                    default: false 
                }, 
                bookedBy: { 
                    type: Schema.Types.ObjectId, 
                    ref: "User", 
                    default: null 
                }, 
                status: { 
                    type: String, 
                    enum: ["available", "pending", "booked"], 
                    default: "available" 
                } 
            }
        ]
    
    }
);

const venueSchema = new Schema(
    {
        managerId: { 
            type: Schema.Types.ObjectId, 
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
