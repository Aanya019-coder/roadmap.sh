const mongoose = require('mongoose');

const AiContentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['course', 'roadmap', 'quiz', 'plan'],
        required: true
    },
    topic: { type: String, required: true },
    data: { type: Object, required: true }, // The generated JSON (nodes/edges for roadmap, modules for course, etc.)
}, {
    timestamps: true
});

module.exports = mongoose.model('AiContent', AiContentSchema);
