const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'cancelled', 'rejected'],
        default: 'pending'
    },
    mode: {
        type: String,
        enum: ['coins', 'swap'],
        default: 'coins'
    },
    volunteerConfirmed: {
        type: Boolean,
        default: false
    },
    userConfirmed: {
        type: Boolean,
        default: false
    },
    message: {
        type: String
    },
    volunteerRating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    },
    userRating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    },
    completionProof: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Request', requestSchema);
