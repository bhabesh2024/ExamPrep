// server.js — Sirf setup aur routes. Business logic routes/ folder mein hai.
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes       from './routes/auth.routes.js';
import questionRoutes   from './routes/questions.routes.js';
import resultRoutes     from './routes/results.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import paymentRoutes    from './routes/payment.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.send('PrepIQ Backend is LIVE! 🚀'));

// ── Routes ──
app.use('/api',         authRoutes);        // /api/signup, /api/login
app.use('/api/questions', questionRoutes);  // /api/questions, /api/questions/counts, etc.
app.use('/api/results',   resultRoutes);    // /api/results
app.use('/api/leaderboard', leaderboardRoutes); // /api/leaderboard
app.use('/api/payment',   paymentRoutes);   // /api/payment/create-order, /api/payment/verify-payment

app.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));