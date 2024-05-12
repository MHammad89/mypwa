/*const crypto = require('crypto');

function hashFingerprint(fingerprint) {
    return crypto.createHash('sha256').update(JSON.stringify(fingerprint)).digest('hex');
}

function detectAnomaly(user, currentAccess) {
    const { fingerprint, ip } = currentAccess;
    const lastAccess = user.loginHistory.slice(-1)[0];

    if (lastAccess.ip !== ip) {
        return 'Access from new IP detected.';
    }
    if (lastAccess.fingerprint !== fingerprint) {
        return 'Access from new device detected.';
    }
    return false;
}

module.exports = {
    hashFingerprint,
    detectAnomaly
};*/

const crypto = require('crypto');

const hashFingerprint = (fingerprint) => {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(fingerprint));
    return hash.digest('hex');
};

const detectAnomaly = (user, currentAccess) => {
    const { fingerprint, ip } = currentAccess;
    const lastAccess = user.loginHistory.slice(-1)[0];

    if (lastAccess && lastAccess.ip !== ip) {
        return 'Access from new IP detected.';
    }

    if (lastAccess && lastAccess.fingerprint !== fingerprint) {
        return 'Access from new device detected.';
    }

    return false;
};

module.exports = { hashFingerprint, detectAnomaly };