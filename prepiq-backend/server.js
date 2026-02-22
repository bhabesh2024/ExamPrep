import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
// 🔐 AUTHENTICATION APIs (Naya Code)
// ==========================================

// 1. Signup API (Naya account banane ke liye)
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check karein agar email pehle se use ho chuka hai
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Ye email pehle se registered hai!" });
    }

    // Password ko chupa do (hash kar do)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Database mein user save karo
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

// 2. Login API (Account mein ghusne ke liye)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email database mein dhoondho
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Email ya Password galat hai!" });
    }

    // Password match karke dekho
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email ya Password galat hai!" });
    }

    // User ko ek 'Entry Pass' (JWT token) do jo 7 din tak chalega
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      message: "Login successful!", 
  token, 
  // 👇 Yahan isPremium hona bohot zaroori hai! 👇
  user: { id: user.id, name: user.name, email: user.email, isPremium: user.isPremium }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Login fail ho gaya." });
  }
});

// ==========================================
// 📚 QUESTIONS APIs (Aapka Purana Code)
// ==========================================

// Questions Fetch karne ki API
app.get('/api/questions/:chapterId', async (req, res) => {
  try {
    const { chapterId } = req.params;
    const questions = await prisma.question.findMany({
      where: { chapterId }
    });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// ==========================================
// 📊 RESULTS APIs (Scores Save aur Dekhne ke liye)
// ==========================================

// 1. Result Save karne ki API (Jab test khatam ho)
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

// 2. User ke saare Results nikaalne ki API (Dashboard/Profile ke liye)
app.get('/api/results/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const results = await prisma.result.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' } // Naye results sabse upar dikhenge
    });
    
    res.json(results);
  } catch (err) {
    console.error("Fetch Results Error:", err);
    res.status(500).json({ error: "Results fetch karne mein problem aayi." });
  }
});

// Question Save karne ki API
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
    res.status(500).json({ error: "Failed to save" });
  }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));