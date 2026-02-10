import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import destinationsRouter from './routes/destinations.js';
import attractionsRouter from './routes/attractions.js';
import budgetBreakdownRouter from './routes/budget-breakdown.js';
import nearbyPlacesRouter from './routes/nearby-places.js';
import recommendationsRouter from './routes/recommendations.js';
import tripDetailsRouter from './routes/trip-details.js';
import realBookingsRouter from './routes/real-bookings.js';
import aiChatRouter from './routes/ai-chat.js';
import authRouter from './routes/auth.js';
import tripsRouter from './routes/trips.js';
import expensesRouter from './routes/expenses.js';
import conversationsRouter from './routes/conversations.js';
import googleAuthRouter from './routes/google-auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes — existing
app.use('/api/destinations', destinationsRouter);
app.use('/api/attractions', attractionsRouter);
app.use('/api/budget-breakdown', budgetBreakdownRouter);
app.use('/api/nearby-places', nearbyPlacesRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/trip-details', tripDetailsRouter);
app.use('/api/real-bookings', realBookingsRouter);
app.use('/api/ai-chat', aiChatRouter);

// API routes — new (MongoDB-backed)
app.use('/api/auth', authRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/conversations', conversationsRouter);
app.use('/api/auth/google', googleAuthRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    console.log('⚠️  Starting server without MongoDB — some features will be limited.');
    app.listen(PORT, () => {
        console.log(`🚀 Backend server running on http://localhost:${PORT} (without DB)`);
    });
});
