import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        select: false,
        required: true,
    },
    bio: {
        type: String,
        maxlength: 500,
        default: '',
    },
    avgRating: {
        type: Number,
        default: 0,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;