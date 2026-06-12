import mongoose from 'mongoose';
import Review from './Review';
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dailyRate: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    images: [
        {
            url: String,
        },
    ],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

listingSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'listing',
});

listingSchema.virtual('avgRating').get(function() {
    if (this.reviews && this.reviews.length > 0) {
        const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / this.reviews.length;
    }
    return 0;
});

const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);

export default Listing;