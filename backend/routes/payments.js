const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const { protect } = require('./auth');

const router = express.Router();

// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', protect, async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: req.user.email,
            line_items: [
                {
                    price: process.env.PRO_PLAN_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/premium?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/premium?cancel=true`,
            metadata: {
                userId: req.user._id.toString()
            }
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/payments/webhook
// This route needs raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            await User.findByIdAndUpdate(session.metadata.userId, {
                role: 'pro',
                stripeCustomerId: session.customer,
                stripeSubscriptionId: session.subscription
            });
            break;
        case 'customer.subscription.deleted':
            const subscription = event.data.object;
            await User.findOneAndUpdate({ stripeSubscriptionId: subscription.id }, {
                role: 'user',
                stripeSubscriptionId: null
            });
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

module.exports = router;
