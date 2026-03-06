const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    provider: String,
    providerId: String
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    avatar: { type: String },
    bio: { type: String },
    githubUsername: { type: String },
    linkedinUrl: { type: String },
    websiteUrl: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'pro', 'admin'], default: 'user' },
    oauthProviders: [providerSchema],
    emailVerificationToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    notificationSettings: {
        newsletter: { type: Boolean, default: true },
        activity: { type: Boolean, default: true }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
