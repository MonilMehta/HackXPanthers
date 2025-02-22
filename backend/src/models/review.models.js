import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        artistId: {
            type: Schema.Types.ObjectId,
            ref: 'Artist',
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            default:0,
            min: 0,
            max: 5,
            required: true
        },
        review_desc: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Review = mongoose.model('Review', reviewSchema);