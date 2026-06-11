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
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    providerType: {
        type: String,
        enum: ['medical-clinic', 'individual-caregiver', 'non-profit-center'],
        default: 'individual-caregiver',
    },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;