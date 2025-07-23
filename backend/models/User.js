// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

// Define the User schema
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure usernames are unique
        trim: true,   // Remove whitespace from both ends of a string
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure emails are unique
        trim: true,
        lowercase: true, // Store emails in lowercase
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set creation date
    },
});

// Pre-save hook to hash the password before saving the user
UserSchema.pre('save', async function (next) {
    // Only hash if the password has been modified (or is new)
    if (!this.isModified('password')) {
        next(); // Move to the next middleware
    }
    // Generate a salt (random string) with 10 rounds for hashing
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Move to the next middleware
});

// Method to compare entered password with the hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    // Compare the entered password with the stored hashed password
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); // Export the User model
