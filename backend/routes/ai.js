const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');
const AiContent = require('../models/AiContent');
const { protect } = require('./auth');
const { checkPremium } = require('../middleware/premium');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Removed helper to check limits as it's now in middleware

// POST /api/ai/chat (Chat with streaming)
router.post('/chat', protect, async (req, res) => {
    try {
        const { message, chatId, context } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let chat;
        if (chatId) {
            chat = await Chat.findById(chatId);
        } else {
            chat = new Chat({ userId: req.user._id, messages: [] });
        }

        const systemPrompt = `You are a developer career AI tutor on roadmap.sh. Help developers learn and grow. ${context ? `Context: ${context}` : ''}`;

        // Prepare history for Gemini
        const history = chat.messages.map(m => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.text }]
        }));

        const geminiChat = model.startChat({
            history: history,
            systemInstruction: systemPrompt
        });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const result = await geminiChat.sendMessageStream(message);

        let fullResponse = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }

        // Save messages
        chat.messages.push({ role: 'user', text: message });
        chat.messages.push({ role: 'model', text: fullResponse });
        if (!chatId) chat.title = message.substring(0, 30) + '...';
        await chat.save();

        res.write(`data: ${JSON.stringify({ done: true, chatId: chat._id })}\n\n`);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/ai/generate (Unified generation endpoint)
router.post('/generate', protect, async (req, res) => {
    try {
        const { type, topic, prompt } = req.body;

        if (req.user.role !== 'pro' && req.user.role !== 'admin') {
            const count = await AiContent.countDocuments({ userId: req.user._id, type });
            if (count >= 2) {
                return res.status(403).json({
                    message: `Free tier limit reached for ${type}s. Please upgrade to Pro.`,
                    code: 'UPGRADE_REQUIRED'
                });
            }
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const finalPrompt = `
            Task: Generate a ${type} for the topic: "${topic}".
            User request: ${prompt}
            Format: RETURN ONLY VALID JSON.
            Structure:
            ${type === 'roadmap' ? '{ "nodes": [...], "edges": [...] }' : ''}
            ${type === 'course' ? '{ "title": "...", "modules": [{ "title": "...", "lessons": [{ "title": "...", "content": "markdown..." }] }] }' : ''}
            ${type === 'quiz' ? '{ "questions": [{ "question": "...", "options": ["a", "b", "c", "d"], "correctAnswer": "...", "explanation": "..." }] }' : ''}
            ${type === 'plan' ? '{ "title": "...", "weeks": [{ "week": 1, "goals": ["..."], "tasks": ["..."] }] }' : ''}
        `;

        const result = await model.generateContent(finalPrompt);
        const responseText = result.response.text();

        // Clean markdown if AI wrapped it in ```json
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

        const content = new AiContent({
            userId: req.user._id,
            type,
            topic,
            data: jsonData
        });

        await content.save();
        res.json(content);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/ai/library
router.get('/library', protect, async (req, res) => {
    try {
        const content = await AiContent.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/ai/chats
router.get('/chats', protect, async (req, res) => {
    try {
        const chats = await Chat.find({ userId: req.user._id }).sort({ updatedAt: -1 }).select('title createdAt roadmapId');
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/ai/chat/:id
router.get('/chat/:id', protect, async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
        if (!chat) return res.status(404).json({ message: 'Chat not found' });
        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/ai/content/:id
router.get('/content/:id', protect, async (req, res) => {
    try {
        const content = await AiContent.findOne({ _id: req.params.id, userId: req.user._id });
        if (!content) return res.status(404).json({ message: 'Content not found' });
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
