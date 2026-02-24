// routes/results.routes.js
import { Router } from 'express';
import prisma from '../prisma/db.js';

const router = Router();

// GET /api/results?userId=...
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID is required.' });
    const results = await prisma.result.findMany({ where: { userId: parseInt(userId) } });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/results/:userId
router.get('/:userId', async (req, res) => {
  try {
    const results = await prisma.result.findMany({
      where: { userId: parseInt(req.params.userId) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(results);
  } catch (err) {
    console.error('Fetch Results Error:', err);
    res.status(500).json({ error: 'Results fetch karne mein problem aayi.' });
  }
});

// POST /api/results
router.post('/', async (req, res) => {
  try {
    const { userId, subject, topic, score, total } = req.body;
    const result = await prisma.result.create({
      data: { userId: parseInt(userId), subject, topic, score: parseInt(score), total: parseInt(total) },
    });
    res.status(201).json({ message: 'Score successfully save ho gaya!', result });
  } catch (err) {
    console.error('Result Save Error:', err);
    res.status(500).json({ error: 'Score save karne mein problem aayi.' });
  }
});

export default router;