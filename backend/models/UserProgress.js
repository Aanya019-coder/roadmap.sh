const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    roadmapId: { type: String, required: true },
    nodeId: { type: String, required: true },
    status: { type: String, enum: ['done', 'in-progress', 'skipped', 'default'], default: 'default' },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Ensure unique index for user-node-roadmap combination
UserProgressSchema.index({ userId: 1, roadmapId: 1, nodeId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);
