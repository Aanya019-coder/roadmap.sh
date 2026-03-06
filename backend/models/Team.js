const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
}, { _id: false });

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [memberSchema],
    assignedRoadmaps: [String], // Array of roadmap IDs
    onboardingPlan: [{
        nodeId: String,
        roadmapId: String,
        title: String
    }],
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
