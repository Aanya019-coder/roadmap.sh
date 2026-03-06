const express = require('express');
const { Resend } = require('resend');
const User = require('../models/User');
const { protect } = require('./auth');

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/email/subscribe (Newsletter)
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        // In a real app, you might save this to a separate "Subscribers" collection
        // or update the User object if they are logged in.
        const user = await User.findOneAndUpdate({ email }, { 'notificationSettings.newsletter': true });

        await resend.emails.send({
            from: 'roadmap.sh <onboarding@resend.dev>',
            to: email,
            subject: 'Welcome to the roadmap.sh newsletter!',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #16a34a;">Welcome, Learner! 🚀</h1>
                    <p>Thanks for subscribing to our weekly newsletter. You'll receive:</p>
                    <ul>
                        <li>New roadmap updates</li>
                        <li>Freshly generated AI courses</li>
                        <li>Career growth tips for developers</li>
                    </ul>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">If you didn't subscribe, you can ignore this or click <a href="${process.env.FRONTEND_URL}/settings">unsubscribe</a>.</p>
                </div>
            `
        });

        res.json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/email/newsletter (Admin only - send bulk)
router.post('/send-bulk', protect, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

    try {
        const { subject, body } = req.body;
        const subscribers = await User.find({ 'notificationSettings.newsletter': true }).select('email');
        const emails = subscribers.map(s => s.email);

        // Resend batch sending
        await resend.batches.create(emails.map(email => ({
            from: 'roadmap.sh <newsletter@resend.dev>',
            to: email,
            subject: subject,
            html: `<div style="font-family: sans-serif;">${body}</div>`
        })));

        res.json({ message: `Newsletter sent to ${emails.length} subscribers` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
