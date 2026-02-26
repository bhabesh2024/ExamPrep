// prepiq-backend/routes/questions.routes.js
import { Router } from 'express';
import prisma from '../prisma/db.js';

const router = Router();

// ── Helper: options aur geometry ko parse karo ──
const parseQuestion = (q) => {
  let options = q.options;
  let geometryData = q.geometryData;
  try { if (typeof options === 'string') options = JSON.parse(options); } catch (_) {}
  try { if (typeof geometryData === 'string' && geometryData !== 'null') geometryData = JSON.parse(geometryData); } catch (_) {}
  return { ...q, options, geometryData };
};

// ── Helper: options aur geometry ko stringify karo (save karne se pehle) ──
const serializeQuestion = (q) => {
  const data = { ...q };
  if (data.options && typeof data.options !== 'string') data.options = JSON.stringify(data.options);
  if (data.geometryData && typeof data.geometryData !== 'string') data.geometryData = JSON.stringify(data.geometryData);
  return data;
};

// GET /api/questions
router.get('/', async (req, res) => {
  try {
    const { chapter, chapterId } = req.query;
    const where = chapter ? { subtopic: chapter } : chapterId ? { chapterId } : {};
    const questions = await prisma.question.findMany({ where });
    res.json(questions.map(parseQuestion));
  } catch (err) {
    console.error('Fetch Questions Error:', err);
    res.status(500).json({ error: 'Database se questions laane mein problem aayi.' });
  }
});

// GET /api/questions/counts
router.get('/counts', async (req, res) => {
  try {
    const counts = await prisma.question.groupBy({ by: ['chapterId'], _count: { id: true } });
    const countMap = {};
    counts.forEach(item => { if (item.chapterId) countMap[item.chapterId] = item._count.id; });
    res.json(countMap);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch question counts.' });
  }
});

// GET /api/questions/duplicates
router.get('/duplicates', async (req, res) => {
  try {
    const { chapterId } = req.query;
    const where = chapterId ? { chapterId } : {};

    const allQuestions = await prisma.question.findMany({
      where,
      select: { id: true, question: true, chapterId: true, subtopic: true },
      orderBy: { id: 'asc' },
    });

    const groupMap = {};
    for (const q of allQuestions) {
      const key = (q.question || '').trim();
      if (!groupMap[key]) groupMap[key] = [];
      groupMap[key].push(q);
    }

    const duplicates = Object.values(groupMap)
      .filter(records => records.length > 1)
      .map(records => {
        const [keep, ...dupes] = records;
        return {
          question: (records[0].question || '').substring(0, 100) + (records[0].question?.length > 100 ? '...' : ''),
          chapterId: records[0].chapterId,
          keepId: keep.id,
          duplicateIds: dupes.map(d => d.id),
          count: records.length,
        };
      });

    res.json({
      message: duplicates.length === 0 ? 'Koi duplicate nahi mila!' : `${duplicates.length} duplicate groups mile!`,
      totalGroups: duplicates.length,
      duplicates,
    });
  } catch (err) {
    res.status(500).json({ error: 'Duplicates dhundhne mein problem aayi.' });
  }
});

// POST /api/questions (Bulk or Single create)
router.post('/', async (req, res) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];
    const results = { saved: 0, duplicates: 0, errors: 0 };

    for (const item of payload) {
      const data = serializeQuestion(item);
      const existing = await prisma.question.findFirst({
        where: { question: data.question, chapterId: data.chapterId },
      });
      if (existing) { results.duplicates++; continue; }
      try {
        await prisma.question.create({ data });
        results.saved++;
      } catch (err) {
        results.errors++;
      }
    }

    res.status(201).json({
      message: `✅ Saved: ${results.saved}, Duplicates Skipped: ${results.duplicates}, Errors: ${results.errors}`,
      ...results,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save question.' });
  }
});

// 🔥 NAYA FEATURE: PUT /api/questions/:id (Full Question Edit directly from Admin)
router.put('/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id; // Prisma relation conflict bachane ke liye IDs hatana zaroori hai
    delete data.flags; 

    // Convert arrays/objects back to string for SQLite/DB compatibility
    if (data.options && typeof data.options !== 'string') data.options = JSON.stringify(data.options);
    if (data.geometryData && typeof data.geometryData !== 'string') data.geometryData = JSON.stringify(data.geometryData);

    const updated = await prisma.question.update({
      where: { id: parseInt(req.params.id) },
      data: data,
    });
    res.json(updated);
  } catch (err) {
    console.error('Full Update Error:', err);
    res.status(500).json({ error: 'Failed to fully update question.' });
  }
});

router.post('/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'IDs required' });
    const numericIds = ids.map(Number).filter(id => !isNaN(id));
    const result = await prisma.question.deleteMany({ where: { id: { in: numericIds } } });
    res.json({ message: `✅ ${result.count} deleted!`, deletedCount: result.count });
  } catch (err) { res.status(500).json({ error: 'Bulk delete failed.' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.question.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted!' });
  } catch (err) { res.status(500).json({ error: 'Delete failed.' }); }
});

router.patch('/:id', async (req, res) => {
  try {
    const { questionHindi, explanationHindi, passageHindi } = req.body;
    const dataToUpdate = {};
    if (questionHindi) dataToUpdate.questionHindi = questionHindi;
    if (explanationHindi) dataToUpdate.explanationHindi = explanationHindi;
    if (passageHindi) dataToUpdate.passageHindi = passageHindi;

    const updated = await prisma.question.update({
      where: { id: parseInt(req.params.id) },
      data: dataToUpdate,
    });
    res.json({ message: 'Translation saved!', question: updated });
  } catch (err) { res.status(500).json({ error: 'Save failed.' }); }
});

export default router;