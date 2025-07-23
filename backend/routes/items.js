// backend/routes/items.js
const express = require('express');
const multer = require('multer'); // For handling file uploads
const path = require('path');     // For path manipulation
const fs = require('fs');         // For file system operations (e.g., deleting files)
const Item = require('../models/Item'); // Import Item model
const { protect } = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router(); // Create an Express router

// --- Multer setup for image uploads ---
// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Set the destination directory for uploads
        // Ensure this 'uploads' directory exists in your backend root
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir); // Create the uploads directory if it doesn't exist
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Set the filename: original name + current timestamp + extension
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Filter for image files only
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype); // Check mimetype
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check extension

    if (mimetype && extname) {
        return cb(null, true); // Accept the file
    } else {
        cb(new Error('Only images (jpeg, jpg, png, gif) are allowed!')); // Reject the file
    }
};

// Initialize multer upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// --- Item Routes ---

// @desc    Upload a new lost item
// @route   POST /api/items
// @access  Private (requires authentication)
router.post('/', protect, upload.single('image'), async (req, res) => {
    // 'image' is the field name expected from the form data
    const { name, description, locationFound, contactInfo } = req.body;

    // Check if an image was uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Basic validation
    if (!name || !description || !locationFound || !contactInfo) {
        // If validation fails, delete the uploaded file to clean up
        if (req.file) {
            fs.unlinkSync(req.file.path); // Use fs directly here
        }
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Create a new item in the database
        const item = await Item.create({
            name,
            description,
            locationFound,
            image: `/uploads/${req.file.filename}`, // Store the path to the uploaded image
            foundBy: req.user._id, // The ID of the user who found the item (from auth middleware)
            contactInfo,
        });
        res.status(201).json(item); // Send the created item back
    } catch (error) {
        console.error(error);
        // If there's a server error, delete the uploaded file
        if (req.file) {
            fs.unlinkSync(req.file.path); // Use fs directly here
        }
        res.status(500).json({ message: 'Server error during item upload' });
    }
});

// @desc    Get all lost items
// @route   GET /api/items
// @access  Public (no authentication needed to view items)
router.get('/', async (req, res) => {
    try {
        // Find all items and populate the 'foundBy' field with username and email
        // Sort by creation date, newest first
        const items = await Item.find({})
            .populate('foundBy', 'username email') // Populate foundBy with username and email
            .sort({ createdAt: -1 }); // Sort by creation date, descending

        res.json(items); // Send all items back
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching items' });
    }
});

// @desc    Get a single lost item by ID
// @route   GET /api/items/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        // Find item by ID and populate foundBy and claimedBy user details
        const item = await Item.findById(req.params.id)
            .populate('foundBy', 'username email')
            .populate('claimedBy', 'username email');

        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching item' });
    }
});

// @desc    Claim an item
// @route   PUT /api/items/:id/claim
// @access  Private (requires authentication)
router.put('/:id/claim', protect, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (item) {
            // Check if the item is already claimed
            if (item.isClaimed) {
                return res.status(400).json({ message: 'Item has already been claimed' });
            }

            // Prevent a user from claiming their own found item
            if (item.foundBy.toString() === req.user._id.toString()) {
                return res.status(400).json({ message: 'You cannot claim an item you found' });
            }

            // Update item status to claimed
            item.isClaimed = true;
            item.claimedBy = req.user._id; // Set the user who claimed it
            item.claimedDate = Date.now();

            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error claiming item' });
    }
});

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private (requires authentication and ownership)
router.delete('/:id', protect, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if the logged-in user is the one who found the item
        if (item.foundBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this item' });
        }

        // Check if the item is claimed before allowing deletion
        if (!item.isClaimed) {
            return res.status(400).json({ message: 'Item must be claimed before it can be removed' });
        }

        // Delete the associated image file from the server
        if (item.image) {
            const imagePath = path.join(__dirname, '..', item.image); // Construct full path
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                    // Continue with item deletion even if image deletion fails,
                    // but log the error.
                } else {
                    console.log(`Deleted image: ${imagePath}`);
                }
            });
        }

        await item.deleteOne(); // Use deleteOne() for Mongoose 6+
        res.json({ message: 'Item removed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting item' });
    }
});

module.exports = router;
