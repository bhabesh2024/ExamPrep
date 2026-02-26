import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Admin: Bulk Upload Posts (Smart CA System)
router.post('/bulk', async (req, res) => {
  try {
    const posts = req.body; 
    if (!Array.isArray(posts)) {
      return res.status(400).json({ error: "Expected an array of posts." });
    }

    const createdPosts = await prisma.communityPost.createMany({
      data: posts.map(post => ({
        question: post.question,
        options: post.options,
        correctOptionIndex: post.correctOptionIndex,
        isCurrentAffair: post.isCurrentAffair || false,
        region: post.region || "General",
        topic: post.topic || "Others",
        explanation: post.explanation || "",
        publishDate: post.publishDate || new Date().toISOString().split('T')[0]
      })),
      skipDuplicates: true,
    });

    res.json({ success: true, count: createdPosts.count });
  } catch (error) {
    console.error("Bulk Upload Error:", error);
    res.status(500).json({ error: "Failed to bulk upload posts" });
  }
});

// Get all posts for user feed
router.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
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
    console.error("Error creating post:", error); // Detailed error logging
    res.status(500).json({ error: "Failed to create post", details: error.message });
  }
});

// Admin: Delete a post
router.delete('/posts/:id', async (req, res) => {
  try {
    await prisma.communityPost.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
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
  } catch (e) { 
    console.error("Error incrementing view:", e);
    res.status(500).json({ error: "Failed" }); 
  }
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
  } catch (e) { 
    console.error("Error toggling like:", e);
    res.status(500).json({ error: "Failed" }); 
  }
});

// ==========================================
// 🔥 NEW: COMMENTS SYSTEM ROUTES
// ==========================================

// Get comments for a specific post
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const comments = await prisma.communityComment.findMany({
      where: { postId: req.params.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Add a new comment to a post
router.post('/posts/:id/comments', async (req, res) => {
  try {
    const { text, author } = req.body;
    
    // 1. Create the comment
    const newComment = await prisma.communityComment.create({
      data: { text, author, postId: req.params.id }
    });

    // 2. Increment the comment count in the main post
    await prisma.communityPost.update({
      where: { id: req.params.id },
      data: { comments: { increment: 1 } }
    });

    res.json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

export default router;