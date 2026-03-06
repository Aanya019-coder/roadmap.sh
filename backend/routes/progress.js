const express = require('express');
const UserProgress = require('../models/UserProgress');
const { protect } = require('./auth');
const mongoose = require('mongoose');

const router = express.Router();

// POST /api/progress (upsert node status)
router.post('/', protect, async (req, res) => {
    try {
        const { roadmapId, nodeId, status } = req.body;

        const progress = await UserProgress.findOneAndUpdate(
            { userId: req.user._id, roadmapId, nodeId },
            { status, updatedAt: Date.now() },
            { upsert: true, new: true }
        );

        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/progress/:roadmapId (all node statuses for a roadmap)
router.get('/:roadmapId', protect, async (req, res) => {
    try {
        const progressList = await UserProgress.find({
            userId: req.user._id,
            roadmapId: req.params.roadmapId
        });

        const progressMap = progressList.reduce((acc, curr) => {
            acc[curr.nodeId] = curr.status;
            return acc;
        }, {});

        res.json(progressMap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/progress/:roadmapId/:nodeId (reset a node)
router.delete('/:roadmapId/:nodeId', protect, async (req, res) => {
    try {
        await UserProgress.findOneAndDelete({
            userId: req.user._id,
            roadmapId: req.params.roadmapId,
            nodeId: req.params.nodeId
        });
        res.json({ message: 'Progress reset' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/progress/summary (all roadmaps user has touched with % complete)
router.get('/summary/all', protect, async (req, res) => {
    try {
        const summary = await UserProgress.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: '$roadmapId',
                    doneCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
                    },
                    totalProgressCount: { $sum: 1 }
                }
            }
        ]);
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/progress/summary/:userId (public summary of progress)
router.get('/summary/:userId', async (req, res) => {
    try {
        const summary = await UserProgress.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
            {
                $group: {
                    _id: '$roadmapId',
                    doneCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] }
                    },
                    totalCount: { $sum: 1 }
                }
            }
        ]);
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
