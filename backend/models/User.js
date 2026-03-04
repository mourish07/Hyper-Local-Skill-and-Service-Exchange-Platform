const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'volunteer', 'admin'],
        default: 'user'
    },
    balance: {
        type: Number,
        default: 100 // Sign up bonus
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    badges: [{
        type: String
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    location: {
        type: String
    },
    skills: [{
        type: String
    }],
    bio: {
        type: String
    },
    profilePicture: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
