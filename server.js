const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const authRoute = require('./routes/auth');
const authenticateToken = require('./middleware/authenticateToken');
const routes = require('./models/routes'); // Ensure this is correct path
const router = express.Router();

// Load environment variables from .env file
require('dotenv').config();

// Log the JWT Secret to verify it's being loaded correctly
console.log('JWT Secret:', process.env.JWT_SECRET);

app.use(cors()); // Enables CORS for all domains
app.use(express.json()); // For parsing application/json

app.post('/api/test-login', (req, res) => {
  res.json({ message: "Test route is working" });
});

// Authentication Routes
app.use('/api/auth', authRoute); // Use authRoute for all auth-related paths

// Fingerprints Routes
app.use('/fingerprints', routes);

// Protected Route
app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route accessible only with a valid token.');
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/DeviceFingerprintDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('Database connection failed', err);
});

// Home Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Catch-all for non-defined routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});


router.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route accessible only with a valid token.' });
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));