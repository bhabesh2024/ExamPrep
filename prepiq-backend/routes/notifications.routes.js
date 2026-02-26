// prepiq-backend/routes/notifications.routes.js
import { Router } from 'express';
import prisma from '../prisma/db.js';

const router = Router();

// Get unread/all notifications for a user & AUTO DELETE > 4 days
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    // 🔥 MEMORY SAVER: 4 din se purane notifications auto-delete
    const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
    await prisma.notification.deleteMany({
      where: { 
        userId: parseInt(userId),
        createdAt: { lt: fourDaysAgo } 
      }
    });

    const notifications = await prisma.notification.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: parseInt(req.params.id) },
      data: { isRead: true }
    });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

export default router;