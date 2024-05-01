const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');  // Adjust path as necessary

// Dummy user validation function
// You should replace this with your actual user authentication logic
const getUser = (username, password) => {
    // This is a placeholder. Normally, you would check a database.
    if (username === "admin" && password === "admin") {
        return { username };
    } else {
        return null;
    }
};

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = await User.create({ username, password });
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
});

router.post('/login', async (req, res) => {
    const { username, password, fingerprint } = req.body;
    try {
        const user = await User.findOne({ username }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).send('Login Failed');
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username,
            fingerprint: fingerprint
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ accessToken: token });
    } catch (err) {
        res.status(500).send(err.message);
    }
});



module.exports = router;