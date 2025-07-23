// backend/models/Item.js
const mongoose = require('mongoose');

// Define the Item schema
const ItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    locationFound: { // Where the item was found (e.g., "Library", "Cafeteria")
        type: String,
        required: true,
        trim: true,
    },
    image: { // Path to the uploaded image
        type: String,
        required: true,
    },
    foundBy: { // Reference to the User who found the item
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the 'User' model
        required: true,
    },
    contactInfo: { // Contact information provided by the finder
        type: String,
        required: true,
        trim: true,
    },
    isClaimed: { // Flag to indicate if the item has been claimed
        type: Boolean,
        default: false,
    },
    claimedBy: { // Reference to the User who claimed the item
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    claimedDate: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set creation date
    },
});

module.exports = mongoose.model('Item', ItemSchema); // Export the Item model
