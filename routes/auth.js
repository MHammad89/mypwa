const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const refreshTokenHandler = require('./refreshTokenHandler');

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

        // Verify fingerprint
        if (JSON.stringify(user.fingerprint) !== JSON.stringify(fingerprint)) {
            return res.status(401).json({ message: "Device mismatch detected" });
        }

        // If fingerprint matches, proceed to issue tokens
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '10m' });

        user.refreshTokens.push({
            token: refreshToken,
            expires: new Date(Date.now() + 10*60*1000) // 10 minutes
        });
        await user.save();
        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.post('/refresh-token', refreshTokenHandler); // Ensure this is the only route handling refresh tokens

router.post('/logout', async (req, res) => {
    const { userId, refreshToken } = req.body;
    const user = await User.findById(userId);
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
    await user.save();
    res.status(204).send();
});

module.exports = router;