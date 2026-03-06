const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4321';
const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

// Helper to handle OAuth profiles
const handleOAuthProfile = async (provider, profile, done) => {
    try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
            return done(new Error(`No email found from ${provider}`), null);
        }

        let user = await User.findOne({ email });

        if (user) {
            // User exists, add provider if not linked
            const hasProvider = user.oauthProviders.find(p => p.provider === provider);
            if (!hasProvider) {
                user.oauthProviders.push({ provider, providerId: profile.id });
                await user.save();
            }
            return done(null, user);
        } else {
            // New user
            user = new User({
                name: profile.displayName || profile.username,
                email: email,
                isEmailVerified: true,
                oauthProviders: [{ provider, providerId: profile.id }]
            });
            await user.save();
            return done(null, user);
        }
    } catch (error) {
        return done(error, null);
    }
};

// GitHub
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'github_id_placeholder') {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/auth/github/callback`,
        scope: ['user:email']
    }, (accessToken, refreshToken, profile, done) => handleOAuthProfile('github', profile, done)));
}

// Google
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'google_id_placeholder') {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/auth/google/callback`
    }, (accessToken, refreshToken, profile, done) => handleOAuthProfile('google', profile, done)));
}

// LinkedIn
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_ID !== 'linkedin_id_placeholder') {
    passport.use(new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/auth/linkedin/callback`,
        scope: ['r_emailaddress', 'r_liteprofile']
    }, (accessToken, refreshToken, profile, done) => handleOAuthProfile('linkedin', profile, done)));
}

module.exports = passport;
