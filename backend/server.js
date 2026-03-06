require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const passport = require('./config/passport');
const fs = require('fs');

const authRoutes = require('./routes/auth').router;
const userRoutes = require('./routes/users');
const progressRoutes = require('./routes/progress');
const customRoadmapRoutes = require('./routes/roadmaps');
const teamRoutes = require('./routes/teams');
const aiRoutes = require('./routes/ai');
const paymentRoutes = require('./routes/payments');
const emailRoutes = require('./routes/email');

const app = express();

// Create uploads directory for avatars
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:4321', // Allow the frontend origin
    credentials: true, // required for cookies
};

app.use(cors(corsOptions));
// Stripe Webhook needs raw body, must be before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

// Setup rate limiting on auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Limit each IP to 100 requests per `window`
    message: 'Too many auth requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// Serve uploads publicly
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/roadmaps', customRoadmapRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/email', emailRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', details: err.message });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected successfully');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });
