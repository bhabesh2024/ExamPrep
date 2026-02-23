import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import crypto from 'crypto';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Ek secret key jo tokens banane ke kaam aayegi
const JWT_SECRET = process.env.JWT_SECRET || "prepiq_super_secret_key_123";

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('PrepIQ Backend is LIVE! 🚀');
});

// ==========================================
// 🔐 AUTHENTICATION APIs
// ==========================================

// 1. Signup API
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Ye email pehle se registered hai!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });

    res.status(201).json({ message: "Account successfully ban gaya!" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Signup mein koi problem aayi." });
  }
});

// 2. Login API
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Email ya Password galat hai!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email ya Password galat hai!" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      message: "Login successful!", 
      token, 
      user: { id: user.id, name: user.name, email: user.email, isPremium: user.isPremium }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Login fail ho gaya." });
  }
});

// ==========================================
// 📚 QUESTIONS APIs
// ==========================================

app.get('/api/questions', async (req, res) => {
  try {
    const { chapter, chapterId } = req.query; 
    
    let whereClause = {};
    if (chapter) {
      whereClause.subtopic = chapter;
    } else if (chapterId) {
      whereClause.chapterId = chapterId;
    }

    const questions = await prisma.question.findMany({
      where: whereClause
    });

    const formattedQuestions = questions.map(q => {
      let parsedOptions = q.options;
      try {
        if (typeof q.options === 'string') parsedOptions = JSON.parse(q.options);
      } catch(e) { }

      let parsedGeometry = q.geometryData;
      try {
        if (typeof q.geometryData === 'string' && q.geometryData !== 'null') {
          parsedGeometry = JSON.parse(q.geometryData);
        }
      } catch(e) { }

      return {
        ...q,
        options: parsedOptions,
        geometryData: parsedGeometry
      };
    });

    res.json(formattedQuestions);
  } catch (err) {
    console.error("Fetch DB Error:", err);
    res.status(500).json({ error: "Database se questions laane mein problem aayi." });
  }
});

app.get('/api/questions/counts', async (req, res) => {
  try {
    const counts = await prisma.question.groupBy({
      by: ['chapterId'],
      _count: { id: true }
    });

    const countMap = {};
    counts.forEach(item => {
      if (item.chapterId) {
        countMap[item.chapterId] = item._count.id;
      }
    });

    res.json(countMap);
  } catch (err) {
    console.error("Count Error:", err);
    res.status(500).json({ error: "Failed to fetch question counts." });
  }
});

app.get('/api/results', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });
    
    const results = await prisma.result.findMany({
      where: { userId: parseInt(userId) }
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    const dataToSave = { ...req.body };

    if (dataToSave.options && typeof dataToSave.options !== 'string') {
      dataToSave.options = JSON.stringify(dataToSave.options);
    }
    if (dataToSave.geometryData && typeof dataToSave.geometryData !== 'string') {
      dataToSave.geometryData = JSON.stringify(dataToSave.geometryData);
    }

    const newQuestion = await prisma.question.create({ data: dataToSave });
    res.status(201).json(newQuestion);
  } catch (err) {
    console.error("Prisma Error:", err);
    res.status(500).json({ error: "Failed to save question" });
  }
});

// ==========================================
// 🗑️ DELETE & UPDATE QUESTION API
// ==========================================
app.delete('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.question.delete({
      where: { id: parseInt(id) } 
    });
    res.json({ message: "Question permanently deleted from DB!" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Question delete karne mein problem aayi." });
  }
});

app.patch('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { questionHindi, explanationHindi } = req.body;
    
    const dataToUpdate = {};
    if (questionHindi) dataToUpdate.questionHindi = questionHindi;
    if (explanationHindi) dataToUpdate.explanationHindi = explanationHindi;

    const updatedQ = await prisma.question.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    });

    res.json({ message: "Translation permanently saved to DB!", question: updatedQ });
  } catch (err) {
    console.error("Translation Save Error:", err);
    res.status(500).json({ error: "Failed to save translation in DB." });
  }
});

// ==========================================
// 📊 RESULTS APIs
// ==========================================
app.post('/api/results', async (req, res) => {
  try {
    const { userId, subject, topic, score, total } = req.body;

    const newResult = await prisma.result.create({
      data: {
        userId: parseInt(userId),
        subject,
        topic,
        score: parseInt(score),
        total: parseInt(total)
      }
    });

    res.status(201).json({ message: "Score successfully save ho gaya!", result: newResult });
  } catch (err) {
    console.error("Result Save Error:", err);
    res.status(500).json({ error: "Score save karne mein problem aayi." });
  }
});

app.get('/api/results/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const results = await prisma.result.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(results);
  } catch (err) {
    console.error("Fetch Results Error:", err);
    res.status(500).json({ error: "Results fetch karne mein problem aayi." });
  }
});

// ==========================================
// 🏆 LEADERBOARD API
// ==========================================
app.get('/api/leaderboard', async (req, res) => {
  try {
    const realResults = await prisma.result.groupBy({
      by: ['userId'],
      _sum: { score: true }
    });

    const userIds = realResults.map(r => r.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true }
    });

    let realLeaderboard = realResults.map(r => {
      const user = users.find(u => u.id === r.userId);
      return {
        id: r.userId,
        name: user ? user.name : 'Unknown Student',
        score: r._sum.score || 0,
        isReal: true,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user ? user.name : r.userId}`
      };
    });

    if (realLeaderboard.length >= 150) {
      realLeaderboard.sort((a, b) => b.score - a.score);
      realLeaderboard = realLeaderboard.map((item, index) => ({ ...item, rank: index + 1 }));
      return res.json(realLeaderboard);
    }

    const neededDummies = 150 - realLeaderboard.length;
    const firstNames = ["Aarav", "Priya", "Rahul", "Neha", "Amit", "Sneha", "Vikram", "Pooja", "Arjun", "Anjali", "Rohan", "Kavya", "Aditya", "Riya", "Karan", "Nisha", "Rishabh", "Meera", "Dhruv", "Aditi", "Sahil", "Shruti", "Kabir", "Aisha", "Aryan"];
    const lastNames = ["Sharma", "Patel", "Singh", "Gupta", "Kumar", "Reddy", "Das", "Joshi", "Jain", "Iyer", "Verma", "Menon", "Desai", "Kapoor", "Malhotra", "Bhatia"];

    let dummyLeaderboard = [];
    let maxDummyScore = 3500;

    for (let i = 0; i < neededDummies; i++) {
      const fName = firstNames[i % firstNames.length];
      const lName = lastNames[(i * 3) % lastNames.length];
      const score = maxDummyScore - (i * 22);
      
      dummyLeaderboard.push({
        id: `dummy-${i}`,
        name: `${fName} ${lName}`,
        score: score > 0 ? score : 15,
        isReal: false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fName}${lName}`
      });
    }

    let combined = [...realLeaderboard, ...dummyLeaderboard];
    combined.sort((a, b) => b.score - a.score);
    combined = combined.map((item, index) => ({ ...item, rank: index + 1 }));

    res.json(combined);

  } catch (err) {
    console.error("Leaderboard Error:", err);
    res.status(500).json({ error: "Leaderboard fetch karne mein problem aayi." });
  }
});

// ==========================================
// 💳 RAZORPAY PAYMENT GATEWAY APIs (STRICT ENV)
// ==========================================

// Ab setup strictly process.env se lega
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/create-order', async (req, res) => {
  try {
    // 🛡️ Strict Check: Agar `.env` mein keys nahi mili, toh error phek do
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("🚨 CRITICAL: Razorpay keys .env se missing hain!");
      return res.status(500).json({ error: "Server Configuration Error: Razorpay keys missing in .env." });
    }

    const { amount } = req.body; 
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Razorpay Order Error:", err);
    res.status(500).json({ error: "Payment order create nahi ho paya." });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    // 🛡️ Strict Check for Signature
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // ✅ PAYMENT SUCCESS! Asli jaadu yahan hoga, DB mein user Premium banega
      if (userId) {
        await prisma.user.update({
          where: { id: parseInt(userId) },
          data: { isPremium: true }
        });
      }
      return res.status(200).json({ message: "Payment successfully verified! You are now a Premium user." });
    } else {
      return res.status(400).json({ error: "Invalid signature! Payment fake ho sakti hai." });
    }
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ error: "Payment verification fail ho gayi." });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));