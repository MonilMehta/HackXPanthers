import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
    {
        venueId: { 
            type: Schema.Types.ObjectId, 
            ref: "Venue",
            required: true
        },
        primaryArtistId: { 
            type: Schema.Types.ObjectId, 
            ref: "Artist",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        eventType: { 
            type: String, 
            enum: ['standup', 'improv', 'sketch', 'open_mic', 'festival', 'workshop', 'other'],
            required: true
        },
        eventDate: {
            type: Date, 
            required: true
        },
        startTime: { 
            type: String, 
            required: true 
        },
        endTime: { 
            type: String, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ['draft', 'pending_approval', 'approved', 'rejected', 'cancelled', 'completed'],
            default: 'draft'
        },
        rejectionReason: String,
        minAge: { 
            type: Number,
            default: 18 
        },
        genres: [String],
        tags: [String],
        mediaAssets: {
            thumbnailUrl: String,
            bannerImageUrl: String,
            promotionalVideoUrl: String,
            galleryImages: [String]
        },
        proposedPrice: {
            type: Number,
            required: true
        },
        isApproved:{
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin", // Assuming admin is also stored in the User model
        },
        approvalDate: Date,
        analytics: {
            totalTicketsSold: { 
                type: Number, 
                default: 0 
            },
            revenueGenerated: { 
                type: Number, 
                default: 0 
            },
            audienceDemographics: {
                ageGroups: {
                    "18-24": Number,
                    "25-34": Number,
                    "35-44": Number,
                    "45-54": Number,
                    "55+": Number
                },
                genderDistribution: {
                    male: Number,
                    female: Number,
                    other: Number
                }
            }
        },
        seatPricing: [
            {
                seatSetName: {
                    type: String,
                    required: true 
                }, 
                price: { 
                    type: Number, 
                    required: true
                }
            }
        ],
        bookedSeats: [
            {
                seatSetName: { 
                    type: String, 
                    required: true 
                },
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
                bookedBy: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "User", 
                    required: true 
                },
                status: { 
                    type: String, 
                    enum: ["pending", "booked"], 
                    default: "pending" 
                }
            }
        ],
        Reviews:[
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            }
        ],
    },
    { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
