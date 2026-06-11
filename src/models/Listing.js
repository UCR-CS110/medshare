import mongoose from 'mongoose';
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
});

const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);

export default Listing;