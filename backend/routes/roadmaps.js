const express = require('express');
const Roadmap = require('../models/Roadmap');
const { protect } = require('./auth');
const crypto = require('crypto');

const router = express.Router();

// POST /api/roadmaps (save custom roadmap)
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, nodes, edges } = req.body;
        const slug = crypto.randomBytes(6).toString('hex');

        const roadmap = new Roadmap({
            userId: req.user._id,
            title,
            description,
            nodes,
            edges,
            slug
        });

        await roadmap.save();
        res.status(201).json(roadmap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/roadmaps/:slug (publicly view a custom roadmap)
router.get('/:slug', async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({ slug: req.params.slug });
        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        res.json(roadmap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/roadmaps/me (get user's own custom roadmaps)
router.get('/me/all', protect, async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({ userId: req.user._id });
        res.json(roadmaps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
