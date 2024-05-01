const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('No token provided');

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) return res.status(403).send('Invalid token');

        // Assuming fingerprint is sent as a header for simplicity
        const requestFingerprint = req.headers['fingerprint'];
        if (requestFingerprint !== decodedToken.fingerprint) {
            return res.status(403).send('Fingerprint mismatch');
        }
        req.user = decodedToken; // Pass the decoded token details forward
        next();
    });
}

module.exports = authenticateToken;