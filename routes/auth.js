const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { hashFingerprint } = require('../utilities/authHelpers');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password, email, fingerprint } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            fingerprint
        });
        await newUser.save();
        res.status(201).json({ status: 'success', data: { user: newUser } });
    } catch (err) {
        console.error('Error registering new user:', err);
        res.status(500).json({ status: 'error', message: 'Error registering new user: ' + err.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password, fingerprint } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: "User not found" });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ message: "Invalid password" });

        if (JSON.stringify(user.fingerprint) !== JSON.stringify(fingerprint)) {
            return res.status(401).json({ message: "Device mismatch detected" });
        }

        const hashedFingerprint = hashFingerprint(fingerprint);

        const accessToken = jwt.sign({ userId: user._id, fingerprint: hashedFingerprint }, process.env.JWT_SECRET, { expiresIn: '1m' });
        const refreshToken = jwt.sign({ userId: user._id, fingerprint: hashedFingerprint }, process.env.JWT_REFRESH_SECRET, { expiresIn: '10m' });

        user.refreshTokens.push({
            token: refreshToken,
            expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });
        await user.save();
        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).send("Refresh Token Required");

    console.log("Attempting to refresh token with:", refreshToken);

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        console.log("Decoded token:", decoded);
        
        const user = await User.findOne({
            _id: decoded.userId,
            'refreshTokens.token': refreshToken
        });

        if (!user) {
            console.log("User not found or refresh token does not match");
            return res.status(404).send("No user found with this refresh token");
        }

        console.log("User found, generating new tokens");

        const newAccessToken = jwt.sign({ userId: user._id, fingerprint: decoded.fingerprint }, process.env.JWT_SECRET, { expiresIn: '1m' });
        const newRefreshToken = jwt.sign({ userId: user._id, fingerprint: decoded.fingerprint }, process.env.JWT_REFRESH_SECRET, { expiresIn: '10m' });

        console.log("New access token expires in 1m, new refresh token expires in 10m");

        user.refreshTokens = user.refreshTokens.filter(token => token.token !== refreshToken);
        user.refreshTokens.push({
            token: newRefreshToken, 
            expires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });
        await user.save();

        console.log("Refresh token saved with 10m expiry");

        return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error("Failed to refresh token", error);
        return res.status(500).send("Failed to refresh token");
    }
});

module.exports = router;