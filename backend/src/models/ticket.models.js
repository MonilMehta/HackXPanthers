import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    venueId: {
        type: Schema.Types.ObjectId,
        ref: "Venue",
        required: true
    },
    seatNumber: {
        type: String,
        required: true
    },
    row: {
        type: String, // Changed from Number to String to support alphanumeric rows
        required: true
    },
    column: {
        type: Number,
        required: true
    },
    seatSetName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    bookingStatus: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending"
    },
    qrCode: {
        type: String,
        required: true
    },
    ticketFormat: {
        type: String,
        enum: ["digital", "physical"],
        default: "digital"
    },
    isTransferable: {
        type: Boolean,
        default: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    validationHash: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Ticket = mongoose.model("Ticket", ticketSchema);
