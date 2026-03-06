const express = require('express');
const User = require('../models/User');
const { protect } = require('./auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, req.user._id + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// GET /api/users/:username (public profile, assume checking by githubUsername or name if unique)
router.get('/:username', async (req, res) => {
    try {
        // Looking by githubUsername as a generic public username field based on spec. Or name if simple.
        const user = await User.findOne({
            $or: [{ githubUsername: req.params.username }, { name: req.params.username }]
        }).select('-passwordHash -emailVerificationToken -passwordResetToken -passwordResetExpires -email');

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/users/me (update own profile)
router.put('/me', protect, async (req, res) => {
    try {
        const updates = { ...req.body };
        delete updates.passwordHash;
        delete updates.email; // Do not allow changing email or passwords here
        delete updates.role;
        delete updates.isEmailVerified;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-passwordHash');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/users/me/avatar (upload avatar image using multer)
router.post('/me/avatar', protect, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

        const user = await User.findById(req.user._id);
        user.avatar = `/uploads/${req.file.filename}`;
        await user.save();

        res.json({ avatar: user.avatar });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
