const express = require('express');
const mongoose = require('mongoose');
const app = express();
const authRoute = require('./routes/auth');
const authenticateToken = require('./middleware/authenticateToken');
const routes = require('./models/routes'); // Correct path based on your project structure

require('dotenv').config(); // Load environment variables
console.log('JWT Secret:', process.env.JWT_SECRET);

app.use(express.json()); // For parsing application/json

// Specific Routes
app.use('/api/auth', authRoute);
app.use('/fingerprints', routes);
app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route accessible only with a valid token.');
});
app.get('/test', (req, res) => {
  res.send('Test route works');
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/DeviceFingerprintDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('Database connection failed', err);
});

// Optional: root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Catch-all for non-defined routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(3000, () => console.log('Server running on port 3000'));