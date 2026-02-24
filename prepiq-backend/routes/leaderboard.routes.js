// routes/leaderboard.routes.js
import { Router } from 'express';
import prisma from '../prisma/db.js';

const router = Router();

const FIRST_NAMES = ['Aarav','Priya','Rahul','Neha','Amit','Sneha','Vikram','Pooja','Arjun','Anjali','Rohan','Kavya','Aditya','Riya','Karan','Nisha','Rishabh','Meera','Dhruv','Aditi','Sahil','Shruti','Kabir','Aisha','Aryan'];
const LAST_NAMES  = ['Sharma','Patel','Singh','Gupta','Kumar','Reddy','Das','Joshi','Jain','Iyer','Verma','Menon','Desai','Kapoor','Malhotra','Bhatia'];

const buildDummies = (count) =>
  Array.from({ length: count }, (_, i) => {
    const fName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const score = Math.max(3500 - i * 22, 15);
    return {
      id: `dummy-${i}`, name: `${fName} ${lName}`, score,
      isReal: false,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fName}${lName}`,
    };
  });

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const realResults = await prisma.result.groupBy({ by: ['userId'], _sum: { score: true } });
    const userIds = realResults.map(r => r.userId);
    const users = await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } });

    let real = realResults.map(r => {
      const user = users.find(u => u.id === r.userId);
      return {
        id: r.userId,
        name: user?.name ?? 'Unknown Student',
        score: r._sum.score || 0,
        isReal: true,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name ?? r.userId}`,
      };
    });

    const combined = real.length >= 150
      ? real
      : [...real, ...buildDummies(150 - real.length)];

    const ranked = combined
      .sort((a, b) => b.score - a.score)
      .map((item, i) => ({ ...item, rank: i + 1 }));

    res.json(ranked);
  } catch (err) {
    console.error('Leaderboard Error:', err);
    res.status(500).json({ error: 'Leaderboard fetch karne mein problem aayi.' });
  }
});

export default router;