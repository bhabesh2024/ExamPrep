import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Helper to get formatted month name
function getMonthName(ymString) {
  const d = new Date(ymString + "-01");
  return d.toLocaleString('default', { month: 'long', year: 'numeric' });
}

// 🚀 1. SMART CA HUB (Auto-Merging Logic: Daily -> Weekly -> Monthly)
router.get('/hub/:region', async (req, res) => {
  try {
    const { region } = req.params;
    
    const caPosts = await prisma.communityPost.findMany({
      where: { isCurrentAffair: true, region: region },
      orderBy: { publishDate: 'desc' }
    });

    const today = new Date();
    // Generate Current Year-Month and Current Week Index
    const currYM = today.toISOString().substring(0, 7); // e.g., "2026-02"
    const currWeek = Math.ceil(today.getUTCDate() / 7);

    const dailyMap = new Map();
    const weeklyMap = new Map();
    const monthlyMap = new Map();
    const topicMap = new Map();

    caPosts.forEach(post => {
      if (!post.publishDate) return;
      
      const postDate = new Date(post.publishDate);
      const postYM = post.publishDate.substring(0, 7);
      const postWeek = Math.ceil(postDate.getUTCDate() / 7);

      let type, value, label;

      // 🔥 THE MAGIC MERGE LOGIC
      if (postYM < currYM) {
        // Past Month -> Merge into Monthly Card
        type = 'monthly';
        value = postYM;
        label = getMonthName(postYM);
      } else if (postYM === currYM && postWeek < currWeek) {
        // Current Month but Past Week -> Merge into Weekly Card
        type = 'weekly';
        value = `${postYM}-W${postWeek}`;
        label = `Week ${postWeek}, ${getMonthName(postYM)}`;
      } else {
        // Current Week -> Keep as Daily Card
        type = 'daily';
        value = post.publishDate;
        label = new Date(post.publishDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }

      // Add to Main Categories
      if (type === 'daily') dailyMap.set(value, { id: `daily-${value}`, title: `Daily CA - ${label}`, caType: type, caValue: value });
      if (type === 'weekly') weeklyMap.set(value, { id: `weekly-${value}`, title: label, caType: type, caValue: value });
      if (type === 'monthly') monthlyMap.set(value, { id: `monthly-${value}`, title: label, caType: type, caValue: value });

      // Add to Topic-wise Categories (Applying the same Merge Logic)
      if (post.topic && post.topic !== "Others") {
        const tKey = `${post.topic}-${type}-${value}`;
        topicMap.set(tKey, { 
          id: tKey, 
          title: `${post.topic} (${label})`, 
          caType: type, 
          caValue: value, 
          caTopic: post.topic 
        });
      }
    });

    res.json({
      daily: Array.from(dailyMap.values()),
      weekly: Array.from(weeklyMap.values()),
      monthly: Array.from(monthlyMap.values()),
      topics: Array.from(topicMap.values())
    });

  } catch (error) {
    console.error("CA Hub Error:", error);
    res.status(500).json({ error: "Failed to generate CA Hub data" });
  }
});

// 🚀 2. FETCH SPECIFIC TEST QUESTIONS (With Hindi Support)
router.get('/practice', async (req, res) => {
  try {
    const { region, type, value, topic } = req.query;
    
    let whereClause = { isCurrentAffair: true, region };
    if (topic) whereClause.topic = topic; // Filter by topic if requested

    let questions = [];

    // Apply Time Filters
    if (type === 'daily') {
      whereClause.publishDate = value;
      questions = await prisma.communityPost.findMany({ where: whereClause, orderBy: { publishDate: 'asc' } });
    } 
    else if (type === 'monthly') {
      whereClause.publishDate = { startsWith: value }; // Matches "YYYY-MM"
      questions = await prisma.communityPost.findMany({ where: whereClause, orderBy: { publishDate: 'asc' } });
    } 
    else if (type === 'weekly') {
      const [ym, w] = value.split('-W');
      whereClause.publishDate = { startsWith: ym };
      const tempPosts = await prisma.communityPost.findMany({ where: whereClause, orderBy: { publishDate: 'asc' } });
      // Filter memory for exact week
      questions = tempPosts.filter(p => Math.ceil(new Date(p.publishDate).getUTCDate() / 7) === parseInt(w));
    }

    // Format for Practice Engine
    const formattedQuestions = questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      answer: q.options[q.correctOptionIndex], 
      explanation: q.explanation || "No explanation provided.",
      topic: q.topic,
      difficulty: "Medium",
      // 🔥 NAYA HINDI DATA YAHAN BHEJ RAHE HAIN
      questionHindi: q.questionHindi || null,
      explanationHindi: q.explanationHindi || null
    }));

    res.json(formattedQuestions);
  } catch (error) {
    console.error("CA Practice Error:", error);
    res.status(500).json({ error: "Failed to fetch CA questions" });
  }
});

export default router;