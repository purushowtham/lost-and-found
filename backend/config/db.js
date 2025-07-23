// backend/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log any connection errors and exit the process
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with a non-zero code to indicate an error
    }
};

module.exports = connectDB; // Export the connectDB function for use in server.js
