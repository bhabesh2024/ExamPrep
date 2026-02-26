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

// USER/ADMIN: Get tickets & AUTO DELETE > 7 Days
router.get('/', async (req, res) => {
  try {
    // 🔥 MEMORY SAVER: 7 din se purane tickets ko auto-delete karega fetch se pehle
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await prisma.supportTicket.deleteMany({
      where: { createdAt: { lt: sevenDaysAgo } }
    });

    const { userId } = req.query; 
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

// 🔥 NEW: ADMIN Bulk Delete Route
router.post('/bulk-delete', async (req, res) => {
  try {
    const { ticketIds } = req.body;
    if (!ticketIds || !Array.isArray(ticketIds)) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    
    await prisma.supportTicket.deleteMany({
      where: { id: { in: ticketIds } }
    });
    res.json({ message: 'Selected tickets deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to bulk delete.' });
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

    if (adminReply && status === 'RESOLVED') {
      await prisma.notification.create({
        data: {
          userId: ticket.userId,
          title: "Support Reply",
          message: `Admin replied: "${adminReply}"`
        }
      });
    }

    res.json(ticket);
  } catch (err) {
    console.error("Reply Error:", err);
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