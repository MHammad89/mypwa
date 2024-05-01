const express = require('express');
const router = express.Router();
const Fingerprint = require('./Fingerprint'); // Ensure correct path

router.post('/', async (req, res) => {
    console.log('Received data:', req.body);
  try {
    const fingerprint = new Fingerprint(req.body);
    const savedFingerprint = await fingerprint.save();
    res.status(201).json(savedFingerprint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const fingerprints = await Fingerprint.find();
    res.json(fingerprints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;