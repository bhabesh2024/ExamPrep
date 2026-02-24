// routes/auth.routes.js
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'prepiq_super_secret_key_123';

// POST /api/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Ye email pehle se registered hai!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { name, email, password: hashedPassword } });
    res.status(201).json({ message: 'Account successfully ban gaya!' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'Signup mein koi problem aayi.' });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Email ya Password galat hai!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Email ya Password galat hai!' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        premiumExpiry: user.premiumExpiry,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Login fail ho gaya.' });
  }
});

export default router;