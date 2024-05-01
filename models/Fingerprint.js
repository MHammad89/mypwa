const mongoose = require('mongoose');

const fingerprintSchema = new mongoose.Schema({
  userAgent: String,
  screenResolution: String,
  timezone: String,
  fonts: String,
  canvasFingerprint: {
    winding: Boolean,
    geometry: String,
    text: String
  },
  webglFingerprint: String,
  visitorId: String
});

module.exports = mongoose.model('Fingerprint', fingerprintSchema);


