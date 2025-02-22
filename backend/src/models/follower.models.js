import mongoose from "mongoose";

const followersSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    artist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
    }],
});

export const Followers = mongoose.model("Followers", followersSchema);