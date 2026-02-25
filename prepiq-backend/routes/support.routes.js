// prepiq-backend/routes/support.routes.js
import { Router } from 'express';
import prisma from '../prisma/db.js';

const router = Router();

// USER: Submit a new query
router.post('/', async (req, res) => {
  try {
    const { userId, subject, message } = req.body;
    const ticket = await prisma.supportTicket.create({
      data: { userId, subject, message }
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit query.' });
  }
});

// USER/ADMIN: Get tickets
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query; // Agar userId pass kiya toh sirf uske dikhenge, warna sab (Admin ke liye)
    const whereClause = userId ? { userId: parseInt(userId) } : {};
    
    const tickets = await prisma.supportTicket.findMany({
      where: whereClause,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets.' });
  }
});

// ADMIN: Reply to a ticket & mark resolved
router.patch('/:id', async (req, res) => {
  try {
    const { adminReply, status } = req.body;
    const ticket = await prisma.supportTicket.update({
      where: { id: parseInt(req.params.id) },
      data: { adminReply, status }
    });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reply.' });
  }
});

// ADMIN: Delete a resolved ticket
router.delete('/:id', async (req, res) => {
  try {
    await prisma.supportTicket.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Ticket deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete.' });
  }
});

export default router;