// src/hooks/admin/useAdminAI.js
// AI se question generate, translate aur modify karna
import { AI_STRICT_RULES } from '../../config/aiPrompts';
import { applyStrictMathFilter, cleanMarkdown } from '../../utils/textUtils';

const GROQ_URL  = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_TEXT  = 'llama-3.3-70b-versatile';
const MODEL_IMAGE = 'llama-3.2-11b-vision-preview';
const DELAY_MS = 3000;

const wait = (ms) => new Promise(r => setTimeout(r, ms));

const cleanQ = (q) => ({
  ...q,
  passage:          cleanMarkdown(applyStrictMathFilter(q.passage          || '')),
  passageHindi:     cleanMarkdown(applyStrictMathFilter(q.passageHindi     || '')),
  question:         cleanMarkdown(applyStrictMathFilter(q.question         || '')),
  questionHindi:    cleanMarkdown(applyStrictMathFilter(q.questionHindi    || '')),
  explanation:      cleanMarkdown(applyStrictMathFilter(q.explanation      || '')),
  explanationHindi: cleanMarkdown(applyStrictMathFilter(q.explanationHindi || '')),
  options: q.options ? q.options.map(o => cleanMarkdown(applyStrictMathFilter(o))) : [],
});

const callGroq = async (apiKey, body) => {
  const res  = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, response_format: { type: 'json_object' } }),
  });
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
};

export default function useAdminAI({ mainCategory, chapter, difficulty, qCount, setQuestions, setStatus, setStatusType, setIsLoading, setEditingIndex, setEditPromptText, setIsEditingLoading }) {
  const getApiKey = () => {
    const key = import.meta.env.VITE_AI_API_KEY;
    if (!key) { setStatus('API Key missing!'); setStatusType('error'); }
    return key;
  };

  // ── Generate from file ──
  const generateQuestions = async (extractFileContent, file) => {
    if (!file || !chapter) { setStatus('Chapter aur file select karo.'); setStatusType('error'); return; }
    const apiKey = getApiKey(); if (!apiKey) return;

    setIsLoading(true); setStatus('Generating questions...'); setStatusType('loading');
    try {
      const fileData = await extractFileContent(file);
      const isAdvanced      = ['Mathematics', 'Reasoning'].includes(mainCategory);
      const isCurrentAffairs = mainCategory === 'Current Affairs';

      const systemPrompt = [
        `You are an expert bilingual educator. Generate ${qCount} ${difficulty} MCQs for "${chapter}".`,
        AI_STRICT_RULES.JSON_GENERATION,
        AI_STRICT_RULES.TRANSLATION,
        `- EXAM REF: ${isCurrentAffairs ? '"Recent"' : 'past exam name'}.`,
        `- ${isAdvanced ? 'Use LaTeX wrapped in $ (inline) or $$ (block) for ALL math.' : 'No Math.'}`,
      ].join('\n');

      const userMsg = fileData.type === 'text'
        ? { role: 'user', content: `Source:\n\n${fileData.content.substring(0, 25000)}` }
        : { role: 'user', content: [{ type: 'text', text: 'Image source.' }, { type: 'image_url', image_url: { url: fileData.content } }] };

      const json = await callGroq(apiKey, {
        model: fileData.type === 'image' ? MODEL_IMAGE : MODEL_TEXT,
        messages: [{ role: 'system', content: systemPrompt }, userMsg],
        temperature: 0.8,
      });

      if (json.questions) {
        const cleaned = json.questions.map(cleanQ);
        setQuestions(prev => [...prev, ...cleaned]);
        setStatus(`✅ ${cleaned.length} questions generated!`); setStatusType('success');
      }
    } catch (_) { setStatus('Failed to generate.'); setStatusType('error'); }
    finally { setIsLoading(false); }
  };

  // ── Auto-translate all empty Hindi fields ──
  const autoTranslateAllToHindi = async (questions, setQuestions) => {
    if (questions.length === 0) return;
    const apiKey = getApiKey(); if (!apiKey) return;
    if (!window.confirm('Translate all empty Hindi fields?')) return;

    setIsLoading(true);
    const updated = [...questions];
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].questionHindi?.trim()) continue;
      setStatus(`Translating ${i + 1} of ${updated.length}...`); setStatusType('loading');
      try {
        const parsed = await callGroq(apiKey, {
          model: MODEL_TEXT, temperature: 0.3,
          messages: [{ role: 'user', content: `Translate to pure Hindi.\n${AI_STRICT_RULES.TRANSLATION}\nQuestion: ${updated[i].question}\nExplanation: ${updated[i].explanation || 'N/A'}\nReturn JSON: {"questionHindi":"...","explanationHindi":"..."}` }],
        });
        updated[i].questionHindi    = cleanMarkdown(applyStrictMathFilter(parsed.questionHindi || ''));
        updated[i].explanationHindi = cleanMarkdown(applyStrictMathFilter(parsed.explanationHindi === 'N/A' ? '' : (parsed.explanationHindi || '')));
        setQuestions([...updated]);
        await wait(DELAY_MS);
      } catch (err) { console.error(`Failed Q${i + 1}`, err); }
    }
    setStatus('✅ Translation Complete!'); setStatusType('success'); setIsLoading(false);
  };

  // ── Translate only selected questions ──
  const translateSelectedToHindi = async (questions, selectedForDelete, setQuestions, setSelectedForDelete) => {
    if (selectedForDelete.length === 0) return;
    const apiKey = getApiKey(); if (!apiKey) return;

    setIsLoading(true);
    const updated = [...questions];
    let count = 0;

    for (const i of selectedForDelete) {
      setStatus(`Translating question ${i + 1}...`); setStatusType('loading');
      try {
        const parsed = await callGroq(apiKey, {
          model: MODEL_TEXT, temperature: 0.3,
          messages: [{ role: 'user', content: `Translate to pure Hindi.\n${AI_STRICT_RULES.TRANSLATION}\nPassage: ${updated[i].passage || 'N/A'}\nQuestion: ${updated[i].question}\nExplanation: ${updated[i].explanation || 'N/A'}\nReturn JSON: {"passageHindi":"...","questionHindi":"...","explanationHindi":"..."}` }],
        });
        if (parsed.passageHindi && parsed.passageHindi !== 'N/A') updated[i].passageHindi = cleanMarkdown(applyStrictMathFilter(parsed.passageHindi));
        updated[i].questionHindi    = cleanMarkdown(applyStrictMathFilter(parsed.questionHindi || ''));
        updated[i].explanationHindi = cleanMarkdown(applyStrictMathFilter(parsed.explanationHindi === 'N/A' ? '' : (parsed.explanationHindi || '')));
        setQuestions([...updated]); count++;
        await wait(DELAY_MS);
      } catch (err) { console.error(err); }
    }
    setStatus(`✅ Translated ${count} questions!`); setStatusType('success');
    setIsLoading(false); setSelectedForDelete([]);
  };

  // ── Modify one question with AI ──
  const modifyQuestionWithAI = async (index, questions, editPromptText, setQuestions) => {
    if (!editPromptText.trim()) return;
    const apiKey = getApiKey(); if (!apiKey) return;

    setIsEditingLoading(true); setStatus(`Modifying Question ${index + 1}...`); setStatusType('loading');
    try {
      const modified = await callGroq(apiKey, {
        model: MODEL_TEXT, temperature: 0.4,
        messages: [
          { role: 'system', content: `Modify the JSON question strictly.\n${AI_STRICT_RULES.MODIFICATION}` },
          { role: 'user',   content: `Original:\n${JSON.stringify(questions[index])}\n\nINSTRUCTION: ${editPromptText}` },
        ],
      });

      const cleaned = cleanQ(modified);
      const updated = [...questions];
      updated[index] = { ...updated[index], ...cleaned };
      setQuestions(updated);
      setEditingIndex(null); setEditPromptText('');
      setStatus('✅ Modified!'); setStatusType('success');
    } catch (_) { setStatus('Failed to modify.'); setStatusType('error'); }
    finally { setIsEditingLoading(false); }
  };

  return { generateQuestions, autoTranslateAllToHindi, translateSelectedToHindi, modifyQuestionWithAI };
}