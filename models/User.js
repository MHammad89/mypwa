const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const loginHistorySchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    fingerprint: {
        visitorId: String,
        userAgent: String,
        screenResolution: String,
        timezone: String,
        fonts: String
    },
    ip: String
}, { _id: false });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    fingerprint: {
        visitorId: String,
        userAgent: String,
        screenResolution: String,
        timezone: String,
        fonts: String
    },
    refreshTokens: [{
        token: String,
        expires: Date,
        createdAt: { type: Date, default: Date.now }
    }]
});
module.exports = mongoose.model('User', userSchema);