const express = require('express');
const Team = require('../models/Team');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const { protect } = require('./auth');
const crypto = require('crypto');

const router = express.Router();

// Middleware to check if user is a team admin
const isTeamAdmin = async (req, res, next) => {
    try {
        const team = await Team.findOne({ slug: req.params.slug });
        if (!team) return res.status(404).json({ message: 'Team not found' });

        const membership = team.members.find(m => m.userId.toString() === req.user._id.toString());
        if (!membership || membership.role !== 'admin') {
            return res.status(403).json({ message: 'Only team admins can perform this action' });
        }

        req.team = team;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /api/teams (create team)
router.post('/', protect, async (req, res) => {
    try {
        const { name } = req.body;
        const slug = name.toLowerCase().replace(/ /g, '-') + '-' + crypto.randomBytes(3).toString('hex');

        const team = new Team({
            name,
            slug,
            ownerId: req.user._id,
            members: [{ userId: req.user._id, role: 'admin' }]
        });

        await team.save();
        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/teams/me (get user's teams)
router.get('/me/all', protect, async (req, res) => {
    try {
        const teams = await Team.find({ 'members.userId': req.user._id });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/teams/:slug (get team details)
router.get('/:slug', protect, async (req, res) => {
    try {
        const team = await Team.findOne({ slug: req.params.slug }).populate('members.userId', 'name email avatar');
        if (!team) return res.status(404).json({ message: 'Team not found' });

        // Check if user is a member
        const isMember = team.members.find(m => m.userId._id.toString() === req.user._id.toString());
        if (!isMember) return res.status(403).json({ message: 'Not a member of this team' });

        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/teams/:slug/roadmaps (assign roadmap to team)
router.post('/:slug/roadmaps', protect, isTeamAdmin, async (req, res) => {
    try {
        const { roadmapId } = req.body;
        if (!req.team.assignedRoadmaps.includes(roadmapId)) {
            req.team.assignedRoadmaps.push(roadmapId);
            await req.team.save();
        }
        res.json(req.team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/teams/:slug/insights (team progress aggregated)
router.get('/:slug/insights', protect, isTeamAdmin, async (req, res) => {
    try {
        const members = req.team.members.map(m => m.userId);

        const progressData = await UserProgress.aggregate([
            { $match: { userId: { $in: members }, roadmapId: { $in: req.team.assignedRoadmaps } } },
            {
                $group: {
                    _id: { userId: '$userId', roadmapId: '$roadmapId' },
                    doneCount: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } }
                }
            }
        ]);

        res.json(progressData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/teams/:slug/members/:userId (remove member)
router.delete('/:slug/members/:userId', protect, isTeamAdmin, async (req, res) => {
    try {
        if (req.params.userId === req.team.ownerId.toString()) {
            return res.status(400).json({ message: 'Cannot remove the team owner' });
        }

        req.team.members = req.team.members.filter(m => m.userId.toString() !== req.params.userId);
        await req.team.save();
        res.json({ message: 'Member removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/teams/:slug (delete team)
router.delete('/:slug', protect, async (req, res) => {
    try {
        const team = await Team.findOne({ slug: req.params.slug });
        if (!team) return res.status(404).json({ message: 'Team not found' });

        if (team.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only team owner can delete the team' });
        }

        await Team.findByIdAndDelete(team._id);
        res.json({ message: 'Team deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    // POST /api/teams/:slug/onboarding (add step to onboarding plan)
    router.post('/:slug/onboarding', protect, isTeamAdmin, async (req, res) => {
        try {
            const { nodeId, roadmapId, title } = req.body;
            req.team.onboardingPlan.push({ nodeId, roadmapId, title });
            await req.team.save();
            res.json(req.team.onboardingPlan);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // DELETE /api/teams/:slug/onboarding/:nodeId (remove step)
    router.delete('/:slug/onboarding/:nodeId', protect, isTeamAdmin, async (req, res) => {
        try {
            req.team.onboardingPlan = req.team.onboardingPlan.filter(step => step.nodeId !== req.params.nodeId);
            await req.team.save();
            res.json(req.team.onboardingPlan);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    module.exports = router;
