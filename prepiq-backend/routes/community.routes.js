const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all posts for user feed
router.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Admin: Create a new post
router.post('/posts', async (req, res) => {
  try {
    const { question, options, correctOptionIndex } = req.body;
    const newPost = await prisma.communityPost.create({
      data: { question, options, correctOptionIndex }
    });
    res.json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Admin: Delete a post
router.delete('/posts/:id', async (req, res) => {
  try {
    await prisma.communityPost.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// User: Increment Views
router.post('/posts/:id/view', async (req, res) => {
  try {
    await prisma.communityPost.update({
      where: { id: req.params.id },
      data: { views: { increment: 1 } }
    });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// User: Toggle Like count
router.post('/posts/:id/like', async (req, res) => {
  try {
    const { action } = req.body; // 'like' or 'unlike'
    await prisma.communityPost.update({
      where: { id: req.params.id },
      data: { likes: { [action === 'like' ? 'increment' : 'decrement']: 1 } }
    });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

module.exports = router;