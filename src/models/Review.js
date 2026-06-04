import mongoose from 'mongoose';
import { unique } from 'next/dist/build/utils';
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        unique: true,
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        maxlength: 1000,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;