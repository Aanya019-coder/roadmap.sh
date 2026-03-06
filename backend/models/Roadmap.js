const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    nodes: { type: Array, required: true },
    edges: { type: Array, required: true },
    isPublic: { type: Boolean, default: true },
    slug: { type: String, unique: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
