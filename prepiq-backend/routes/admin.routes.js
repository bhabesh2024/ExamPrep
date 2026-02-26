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

// 1. User submits a flag (Report issue)
router.post('/flag', async (req, res) => {
  try {
    const { questionId, reason } = req.body;
    const flag = await prisma.flaggedQuestion.create({
      data: { questionId, reason }
    });
    res.status(201).json(flag);
  } catch (err) {
    res.status(500).json({ error: 'Failed to flag question' });
  }
});

// 2. Admin fetches all OPEN flags
router.get('/flags', async (req, res) => {
  try {
    const flags = await prisma.flaggedQuestion.findMany({
      where: { status: 'OPEN' },
      include: { question: true }, // Question ka data bhi sath aayega
      orderBy: { createdAt: 'desc' }
    });
    res.json(flags);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flags' });
  }
});

// 3. Admin resolves a flag
router.patch('/flag/:id', async (req, res) => {
  try {
    await prisma.flaggedQuestion.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'RESOLVED' }
    });
    res.json({ message: 'Issue Resolved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve flag' });
  }
});
export default router;