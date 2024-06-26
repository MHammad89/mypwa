
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: "You have accessed a protected route" });
});

module.exports = router;
