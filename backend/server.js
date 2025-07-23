// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Make sure path is imported
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

dotenv.config();
connectDB();

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors());

// Serve static files from the 'uploads' directory
// This line is crucial for images to be accessible
// __dirname is the current directory (backend), 'uploads' is the folder name
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Basic route for testing server
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
