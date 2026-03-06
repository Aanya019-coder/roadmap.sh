const express = require('express');
const bcrypt = require('bcrypt');
const jwtToken = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const passport = require('passport');
const { Resend } = require('resend');

const router = express.Router();
let resend;
if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder') {
    resend = new Resend(process.env.RESEND_API_KEY);
}

// Generate Tokens
const generateTokens = (userId) => {
    const accessToken = jwtToken.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwtToken.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

// Set Cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000 // 15 min
    });

    if (refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
};

// Middleware: Authenticate Request
const protect = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json({ message: 'Not authorized' });

        const decoded = jwtToken.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-passwordHash');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalid or expired' });
    }
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const verificationToken = crypto.randomBytes(32).toString('hex');

        user = new User({
            name, email, passwordHash,
            emailVerificationToken: verificationToken
        });

        await user.save();

        if (resend) {
            const verifyLink = `${process.env.FRONTEND_URL}/api/auth/verify-email/${verificationToken}`;
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Verify your email',
                html: `<p>Click <a href="${verifyLink}">here</a> to verify.</p>`
            });
        }

        const { accessToken } = generateTokens(user._id);
        setAuthCookies(res, accessToken, null); // Don't issue refresh token on register until verified or depending on policy. Actually, project spec says return access token in httpOnly.

        res.status(201).json({ message: 'User registered successfully. Check email.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.passwordHash) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const { accessToken, refreshToken } = generateTokens(user._id);
        setAuthCookies(res, accessToken, refreshToken);

        res.json({ message: 'Logged in successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
});

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: 'No refresh token' });

        const decoded = jwtToken.verify(token, process.env.JWT_REFRESH_SECRET);
        const { accessToken } = generateTokens(decoded.userId);
        setAuthCookies(res, accessToken, token); // Keep old refresh token

        res.json({ message: 'Token refreshed' });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
});

// GET /api/auth/verify-email/:token
router.get('/verify-email/:token', async (req, res) => {
    try {
        const user = await User.findOne({ emailVerificationToken: req.params.token });
        if (!user) return res.status(400).json({ message: 'Invalid token' });

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();

        res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        if (resend) {
            const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Password Reset',
                html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
            });
        }

        res.json({ message: 'Password reset link sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            passwordResetToken: req.params.token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(req.body.password, salt);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
    res.json(req.user);
});

// OAuth Callback Helper
const handleOAuthCallback = (req, res) => {
    const { accessToken, refreshToken } = generateTokens(req.user._id);
    setAuthCookies(res, accessToken, refreshToken);
    res.redirect(`${process.env.FRONTEND_URL}/login?oauth=success`);
};

// OAuth Routes
router.get('/github', passport.authenticate('github', { session: false }));
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login' }), handleOAuthCallback);

router.get('/google', passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), handleOAuthCallback);

router.get('/linkedin', passport.authenticate('linkedin', { session: false }));
router.get('/linkedin/callback', passport.authenticate('linkedin', { session: false, failureRedirect: '/login' }), handleOAuthCallback);

module.exports = { router, protect };
