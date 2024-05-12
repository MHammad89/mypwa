const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function refreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).send("Refresh Token Required");

    console.log("Attempting to refresh token");

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findOne({
            _id: decoded.userId,
            'refreshTokens.token': refreshToken
        });

        if (!user) return res.status(404).send("No user found with this refresh token");

        console.log("User found, generating new tokens");

        const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1m' });
        const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '10m' });

        console.log("New access token expires in 1m, new refresh token expires in 10m");

        // Replace the old refresh token with a new one
        user.refreshTokens = user.refreshTokens.filter(token => token.token !== refreshToken); // Remove the old refresh token
        user.refreshTokens.push({
            token: newRefreshToken, 
            expires: new Date(Date.now() + 1*1*1) // 10 minutes
        });
        await user.save();

        console.log("Refresh token saved with 10m expiry");

        return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error("Failed to refresh token", error);
        return res.status(500).send("Failed to refresh token");
    }
}

module.exports = refreshToken;