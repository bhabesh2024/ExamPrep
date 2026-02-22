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
// 🔐 AUTHENTICATION APIs
// ==========================================

// 1. Signup API (Naya account banane ke liye)
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

// 2. Login API (Account mein ghusne ke liye)
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
// 📚 QUESTIONS APIs (Fixed 404 Error Here)
// ==========================================

// 1. Questions Fetch karne ki API (Admin & Practice pages dono ke liye)
app.get('/api/questions', async (req, res) => {
  try {
    const { chapter, chapterId } = req.query; 
    
    let whereClause = {};
    if (chapter) {
      whereClause.subtopic = chapter; // Admin panel se 'chapter' naam query mein aata hai
    } else if (chapterId) {
      whereClause.chapterId = chapterId; // Practice page se shayad 'chapterId' aaye
    }

    const questions = await prisma.question.findMany({
      where: whereClause
    });

    // Database mein options string ban kar save hote hain, frontend ko array chahiye.
    const formattedQuestions = questions.map(q => {
      let parsedOptions = q.options;
      try {
        if (typeof q.options === 'string') parsedOptions = JSON.parse(q.options);
      } catch(e) { /* ignore parse error if any */ }

      let parsedGeometry = q.geometryData;
      try {
        if (typeof q.geometryData === 'string' && q.geometryData !== 'null') {
          parsedGeometry = JSON.parse(q.geometryData);
        }
      } catch(e) { /* ignore parse error if any */ }

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

// 2. Question Save karne ki API (Admin Panel se)
app.post('/api/questions', async (req, res) => {
  try {
    const dataToSave = { ...req.body };

    // Prisma ko Array nahi String chahiye hota hai JSON fields ke liye (SQLite mein)
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
// 🗑️ DELETE QUESTION API (Permanently udane ke liye)
// ==========================================
app.delete('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Database se question ko uski ID ke through permanently delete karna
    await prisma.question.delete({
      // Dhyan dein: Agar aapke Prisma schema mein ID Int hai toh parseInt lagega.
      // Agar UUID (String) hai, toh sirf `id: id` aayega. (Abhi ke liye parseInt lagaya hai)
      where: { id: parseInt(id) } 
    });

    res.json({ message: "Question permanently deleted from DB!" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Question delete karne mein problem aayi." });
  }
});

// ==========================================
// 📊 RESULTS APIs (Scores Save aur Dekhne ke liye)
// ==========================================

// 1. Result Save karne ki API
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

// 2. User ke saare Results nikaalne ki API (Profile ke liye)
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

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));