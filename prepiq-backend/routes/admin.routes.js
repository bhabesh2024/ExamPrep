// prepiq-backend/routes/admin.routes.js
import { Router } from 'express';
import prisma from '../prisma/db.js';

const router = Router();

// Get System Stats
router.get('/stats', async (req, res) => {
  try {
    const totalQuestions = await prisma.question.count();
    const activeUsers = await prisma.user.count();
    const premiumUsers = await prisma.user.count({ where: { isPremium: true } });
    const testsAttempted = await prisma.result.count();

    res.json({ totalQuestions, activeUsers, premiumUsers, testsAttempted });
  } catch (err) {
    console.error('Stats Error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Search User by Email (Ye aapke UI ke User Search ke liye hai)
router.get('/user', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search user' });
  }
});

export default router;