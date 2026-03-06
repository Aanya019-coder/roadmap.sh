const User = require('../models/User');
const AiContent = require('../models/AiContent');

const checkPremium = (type) => async (req, res, next) => {
    try {
        if (req.user.role === 'pro' || req.user.role === 'admin') {
            return next();
        }

        const count = await AiContent.countDocuments({ userId: req.user._id, type });
        const limit = 2; // Free limit

        if (count >= limit) {
            return res.status(403).json({
                message: 'Free tier limit reached for this feature.',
                code: 'UPGRADE_REQUIRED'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { checkPremium };
