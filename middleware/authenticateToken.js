const jwt = require('jsonwebtoken');
const { hashFingerprint, detectAnomaly } = require('../utilities/authHelpers');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, tokenPayload) => {
        if (err) return res.sendStatus(403);

        const user = await User.findById(tokenPayload.userId);
        if (!user) return res.sendStatus(401);

        const requestFingerprint = req.body.fingerprint || {};
        const hashedRequestFingerprint = hashFingerprint(requestFingerprint);

        if (tokenPayload.fingerprint !== hashedRequestFingerprint) {
            return res.status(401).json({ message: "Device mismatch detected" });
        }

        req.user = tokenPayload;
        next();
    });
};

module.exports = authenticateToken;