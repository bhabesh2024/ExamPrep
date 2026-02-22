import React, { useState, useRef } from 'react';
import { subjectsData } from '../data/syllabusData.jsx'; 
import { getQuestionsByTitle } from '../data/questionsLoader'; // 👈 Wapas laya gaya Import!
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { 
  Settings, HelpCircle, CloudUpload, FileText, X, Sparkles, 
  Trash2, CheckCircle2, PlusCircle, ChevronDown, Upload, Database, RotateCcw, Languages
} from 'lucide-react';
import axios from 'axios';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function AdminPanel() {
  const mainSubjects = subjectsData.map(s => s.title);
  
  const getCategories = (mainCatTitle) => {
    const subj = subjectsData.find(s => s.title === mainCatTitle);
    return subj ? subj.categories.map(c => c.title) : [];
  };

  const getChapters = (mainCatTitle, subCatTitle) => {
    const subj = subjectsData.find(s => s.title === mainCatTitle);
    if(!subj) return [];
    const cat = subj.categories.find(c => c.title === subCatTitle);
    if(!cat) return [];
    return cat.topics.map(t => t.title);
  };

  const [mainCategory, setMainCategory] = useState(mainSubjects[0]);
  const [subCategory, setSubCategory] = useState(getCategories(mainSubjects[0])[0] || '');
  const [chapter, setChapter] = useState(getChapters(mainSubjects[0], getCategories(mainSubjects[0])[0])[0] || '');
  
  const [difficulty, setDifficulty] = useState('Medium');
  const [qCount, setQCount] = useState(10);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('System Operational. Connected to DB.');
  const [statusType, setStatusType] = useState('success'); 
  const [isLoading, setIsLoading] = useState(false);

  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editPromptText, setEditPromptText] = useState('');
  const [isEditingLoading, setIsEditingLoading] = useState(false);

  // ── Handlers ──
  const handleMainCategoryChange = (e) => {
    const newMain = e.target.value;
    setMainCategory(newMain);
    const newSubs = getCategories(newMain);
    setSubCategory(newSubs[0] || '');
    setChapter(getChapters(newMain, newSubs[0])[0] || '');
  };

  const handleSubCategoryChange = (e) => {
    const newSub = e.target.value;
    setSubCategory(newSub);
    setChapter(getChapters(mainCategory, newSub)[0] || '');
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };
  const handleFileSelect = (e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); };
  const removeFile = () => setFile(null);

  // ── LOCAL JSON DATA LOAD KARNA (Without Assamese) ──
  const loadLocalJsonData = () => {
    setStatus('Loading local JSON data...'); setStatusType('loading');
    try {
      const loaded = getQuestionsByTitle(chapter);
      if (loaded && loaded.length > 0) {
        const formattedData = loaded.map(q => ({
          ...q,
          questionHindi: "",    // 🔥 Assamese gayab
          explanationHindi: "", // 🔥 Assamese gayab
          examReference: q.examReference || "Expected",
          geometryType: q.geometryType || null,
          geometryData: q.geometryData || null
        }));
        setQuestions(formattedData);
        setSelectedForDelete([]);
        setStatus(`✅ Loaded ${formattedData.length} questions from local files! Click Auto-Translate.`);
        setStatusType('info');
      } else {
        setStatus(`No local JSON data found for "${chapter}".`);
        setStatusType('error');
      }
    } catch (e) {
      setStatus('Failed to load local data: ' + e.message);
      setStatusType('error');
    }
  };

  // ── PDF Extraction ──
  const extractFileContent = async (uploadedFile) => {
    if (uploadedFile.type.includes('image')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ type: 'image', content: reader.result });
        reader.readAsDataURL(uploadedFile);
      });
    } else if (uploadedFile.type === 'application/pdf') {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        text += textContent.items.map(s => s.str).join(' ') + '\n';
      }
      return { type: 'text', content: text };
    }
    throw new Error('Unsupported file type. Please upload PDF or Image.');
  };

  // ── AI Generation (Groq API) ──
  const generateQuestions = async () => {
    if (!file || !chapter) {
      setStatus('Please select a chapter and upload a file.'); setStatusType('error'); return;
    }
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    if (!apiKey) {
      setStatus('VITE_AI_API_KEY not found in .env file!'); setStatusType('error'); return;
    }
    
    setIsLoading(true); setStatusType('loading');
    setStatus('Analyzing document & generating questions...');

    try {
      const fileData = await extractFileContent(file);
      const isAdvanced = mainCategory === 'Mathematics' || mainCategory === 'Reasoning';
      const isCurrentAffairs = mainCategory === 'Current Affairs'; 

      const systemPrompt = `You are an expert bilingual (English & Hindi) educator.
Generate ${qCount} UNIQUE, ${difficulty} difficulty multiple-choice questions for "${chapter}".
CRITICAL RULES:
1. OUTPUT ONLY VALID JSON. Start with { and end with }.
2. Format: object with a "questions" array.
3. Keys: "question", "questionHindi", "options", "answer", "explanation", "explanationHindi", "examReference", "geometryType", "geometryData".
4. OPTIONS: array of 4 choices IN ENGLISH ONLY.
5. "answer" must exactly match the correct option string.
6. EXAM REFERENCE: ${isCurrentAffairs ? '"Recent Trend"' : 'exact past exam name and year (e.g., "SSC CGL 2021")'}.
7. ${isAdvanced ? 'Use LaTeX wrapped in $ (inline) or $$ (block) for ALL math. Use geometryType/geometryData if chart/figure needed, else null.' : 'Set "geometryType" and "geometryData" to null.'}
8. Provide proper Hindi translations in "questionHindi" and "explanationHindi".`;

      let messages = [{ role: 'system', content: systemPrompt }];
      if (fileData.type === 'text') {
        messages.push({ role: 'user', content: `Source document:\n\n${fileData.content.substring(0, 25000)}` });
      } else {
        messages.push({ role: 'user', content: [{ type: 'text', text: 'Here is the source image.' }, { type: 'image_url', image_url: { url: fileData.content } }] });
      }

      const model = fileData.type === 'image' ? 'llama-3.2-11b-vision-preview' : 'llama-3.3-70b-versatile';
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, response_format: { type: 'json_object' }, temperature: 0.8, max_tokens: 8000 })
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error.message);
      const jsonResponse = JSON.parse(result.choices[0].message.content);
      
      if (jsonResponse.questions && Array.isArray(jsonResponse.questions)) {
        setQuestions(prev => [...prev, ...jsonResponse.questions]);
        setStatus(`${jsonResponse.questions.length} questions generated successfully!`);
        setStatusType('success');
      } else {
        throw new Error('AI did not return the correct JSON structure.');
      }
    } catch (error) {
      setStatus(error.message); setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 NAYA FEATURE: BULK AUTO-TRANSLATE TO HINDI 🔥
  const autoTranslateAllToHindi = async () => {
    if (questions.length === 0) return;
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    if (!apiKey) {
      setStatus('API Key missing for translation!'); setStatusType('error'); return;
    }

    if (!window.confirm("AI will translate all empty Hindi fields to pure Hindi. Start?")) return;

    setIsLoading(true);
    let updatedQs = [...questions];

    for (let i = 0; i < updatedQs.length; i++) {
      if (!updatedQs[i].questionHindi || updatedQs[i].questionHindi.trim() === "") {
        setStatus(`Translating question ${i + 1} of ${updatedQs.length}...`);
        setStatusType('loading');
        
        try {
          const prompt = `You are an expert Hindi translator for competitive exams. 
          Translate the following English question and explanation into pure, grammatically correct Hindi (Devanagari script).
          DO NOT translate math variables or LaTeX. Keep LaTeX equations exactly as they are.
          
          English Question: ${updatedQs[i].question}
          English Explanation: ${updatedQs[i].explanation || "N/A"}
          
          Return STRICTLY ONLY a JSON object: {"questionHindi": "...", "explanationHindi": "..."}`;

          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [{ role: 'user', content: prompt }],
              response_format: { type: 'json_object' },
              temperature: 0.3
            })
          });

          const result = await response.json();
          const parsed = JSON.parse(result.choices[0].message.content);
          
          updatedQs[i].questionHindi = parsed.questionHindi || "";
          updatedQs[i].explanationHindi = (parsed.explanationHindi === "N/A") ? "" : (parsed.explanationHindi || "");
          
          setQuestions([...updatedQs]);
          
          await new Promise(r => setTimeout(r, 1000)); // Rate limit prevention
        } catch (err) {
          console.error(`Translation failed for Q${i+1}`, err);
        }
      }
    }

    setStatus(`✅ Translation Complete! You can now Save to Database.`);
    setStatusType('success');
    setIsLoading(false);
  };

  const modifyQuestionWithAI = async (index) => {
    if (!editPromptText.trim()) return;
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    if (!apiKey) return;
    
    setIsEditingLoading(true);
    setStatus(`Modifying Question ${index + 1}...`); setStatusType('loading');

    try {
      const questionToEdit = questions[index];
      const systemPrompt = `You are an expert educator. MODIFY the provided JSON question STRICTLY based on the user's instruction. Keep output as a valid JSON object with exact keys. Use proper LaTeX for math.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Original JSON:\n${JSON.stringify(questionToEdit)}\n\nINSTRUCTION: ${editPromptText}` }
          ],
          response_format: { type: 'json_object' }, temperature: 0.4
        })
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error.message);
      
      const modifiedQuestion = JSON.parse(result.choices[0].message.content);
      const updatedQuestions = [...questions];
      updatedQuestions[index] = { ...updatedQuestions[index], ...modifiedQuestion };
      
      setQuestions(updatedQuestions);
      setEditingIndex(null);
      setEditPromptText('');
      setStatus(`Question ${index + 1} modified successfully!`); setStatusType('success');
    } catch (error) {
      setStatus('Failed to modify question: ' + error.message); setStatusType('error');
    } finally {
      setIsEditingLoading(false);
    }
  };

  // ── Question Interactions ──
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    const oldOptValue = updated[qIndex].options[optIndex];
    updated[qIndex].options[optIndex] = value;
    if (updated[qIndex].answer === oldOptValue) {
        updated[qIndex].answer = value;
    }
    setQuestions(updated);
  };

  const setCorrectAnswer = (qIndex, optValue) => {
    const updated = [...questions];
    updated[qIndex].answer = optValue;
    setQuestions(updated);
  };

  const toggleSelect = (index) => {
    setSelectedForDelete(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  const handleSelectAll = (e) => {
    setSelectedForDelete(e.target.checked ? questions.map((_, i) => i) : []);
  };

  const deleteSelected = () => {
    if (selectedForDelete.length === 0) return;
    if (window.confirm(`Delete ${selectedForDelete.length} selected questions from UI?`)) {
      setQuestions(prev => prev.filter((_, i) => !selectedForDelete.includes(i)));
      setSelectedForDelete([]);
      setStatus(`Removed ${selectedForDelete.length} questions from view.`);
      setStatusType('info');
    }
  };

  const clearScreen = () => {
    if (questions.length === 0) return;
    if (window.confirm("Are you sure you want to clear the screen? (No DB deletion)")) {
      setQuestions([]);
      setSelectedForDelete([]);
      setStatus('Screen cleared.');
      setStatusType('info');
    }
  };

  const addNewQuestion = () => {
    const newQ = { question: "", questionHindi: "", options: ["", "", "", ""], answer: "", explanation: "", explanationHindi: "", examReference: "Expected", geometryType: null, geometryData: null };
    setQuestions([...questions, newQ]);
  };

  // ── 🔗 FETCH FROM DATABASE ──
  const fetchFromDatabase = async () => {
    setStatus('Fetching questions from DB...'); setStatusType('loading'); setIsLoading(true);
    try {
      const res = await axios.get(`/api/questions?chapter=${encodeURIComponent(chapter)}`);
      if (res.data && res.data.length > 0) {
        setQuestions(res.data); setSelectedForDelete([]);
        setStatus(`✅ Loaded ${res.data.length} questions from Database.`); setStatusType('success');
      } else {
        setQuestions([]);
        setStatus(`No questions found in DB for "${chapter}".`); setStatusType('info');
      }
    } catch (e) {
      setStatus('Failed to fetch from DB: ' + (e.response?.data?.error || e.message)); setStatusType('error');
    } finally { setIsLoading(false); }
  };

  // ── 🔗 PUSH TO DATABASE ──
  const pushToPostgreSQL = async () => {
    if (questions.length === 0) { setStatus('No questions to save.'); setStatusType('error'); return; }
    setStatus('Saving to Database...'); setStatusType('loading'); setIsLoading(true);

    try {
      const chapterIdSlug = chapter.toLowerCase().replace(/\s+/g, '-');
      let successCount = 0;
      for (const q of questions) {
        await axios.post('/api/questions', {
          subject: mainCategory, topic: subCategory, subtopic: chapter, chapterId: chapterIdSlug, difficulty: difficulty,
          question: q.question, questionHindi: q.questionHindi || "", options: q.options, answer: q.answer,
          explanation: q.explanation || "", explanationHindi: q.explanationHindi || "", examReference: q.examReference || "Expected",
          geometryType: q.geometryType || null, geometryData: q.geometryData ? (typeof q.geometryData === 'string' ? q.geometryData : JSON.stringify(q.geometryData)) : null
        });
        successCount++;
      }
      setStatus(`✅ Success! ${successCount} questions saved to Database!`); setStatusType('success');
      setQuestions([]); 
    } catch (err) {
      console.error(err); setStatus(`❌ Failed to save: ` + (err.response?.data?.error || err.message)); setStatusType('error');
    } finally { setIsLoading(false); }
  };

  // ── 🗑️ SMART DELETE FUNCTION ──
  const handleDeleteQuestion = async (index) => {
    const q = questions[index];
    if (q.id) {
      if (window.confirm("⚠️ DANGER: Kya aap sach mein is question ko Database se hamesha ke liye udana chahte hain?")) {
        setStatus('Deleting from Database...'); setStatusType('loading');
        try {
          await axios.delete(`/api/questions/${q.id}`);
          setQuestions(prev => prev.filter((_, i) => i !== index));
          setSelectedForDelete(prev => prev.filter(i => i !== index)); 
          setStatus('✅ Question permanently deleted from Database!'); setStatusType('success');
        } catch (err) { setStatus('❌ Failed to delete'); setStatusType('error'); }
      }
    } else {
      if (window.confirm("Remove this unsaved question from screen?")) {
        setQuestions(prev => prev.filter((_, i) => i !== index));
        setSelectedForDelete(prev => prev.filter(i => i !== index));
      }
    }
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-[#0f1115] text-slate-100 min-h-screen overflow-hidden flex font-sans selection:bg-[#0d59f2]/30">
      <style>{`
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #111318; }
        ::-webkit-scrollbar-thumb { background: #3b4354; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #4b5563; }
        .custom-checkbox:checked {
            background-color: #0d59f2; border-color: #0d59f2;
            background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
        }
      `}</style>

      {/* ── NARROW SIDEBAR ── */}
      <aside className="hidden xl:flex w-20 flex-col items-center justify-between border-r border-[#2a2f3a] bg-[#111318] py-6 h-screen sticky top-0 z-20 shrink-0">
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0d59f2] text-white font-bold text-xl shadow-[0_0_20px_rgba(13,89,242,0.5)] cursor-pointer">
            Q
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
            <Settings className="w-5 h-5" />
          </button>
          <div className="h-10 w-10 rounded-full bg-slate-800 border border-[#2a2f3a] flex items-center justify-center font-bold text-slate-400">
            A
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0d59f2]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]"></div>
        </div>

        {/* ── HEADER ── */}
        <header className="h-16 border-b border-[#2a2f3a] bg-[#0f1115]/80 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight">PrepIQ DB Manager</h1>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Live</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusType === 'loading' ? 'bg-yellow-500 animate-pulse' : statusType === 'error' ? 'bg-red-500' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`}></span>
              {status}
            </div>
            <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium cursor-pointer">
              <HelpCircle className="w-5 h-5" /> Help
            </button>
          </div>
        </header>

        {/* ── SPLIT VIEW ── */}
        <div className="flex flex-1 overflow-hidden relative z-10">
          
          {/* ── CONFIG PANEL (LEFT) ── */}
          <section className="w-[400px] h-full flex flex-col border-r border-[#2a2f3a] bg-[#111318]/50 shrink-0 overflow-y-auto p-6 gap-6 custom-scrollbar backdrop-blur-md">
            
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-white">Database Routing</h2>
              <p className="text-sm text-slate-400">Select where to save or fetch questions.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#0d59f2] font-medium text-sm">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0d59f2] text-white text-xs">1</span>
                <span>Category Map</span>
              </div>
              <div className="space-y-3 pl-8 border-l border-[#2a2f3a] ml-3">
                
                <label className="block">
                  <span className="text-xs font-medium text-slate-400 mb-1.5 block">Main Subject</span>
                  <div className="relative">
                    <select value={mainCategory} onChange={handleMainCategoryChange} className="w-full appearance-none bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none transition-all cursor-pointer">
                      {mainSubjects.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs font-medium text-slate-400 mb-1.5 block">Category</span>
                  <div className="relative">
                    <select value={subCategory} onChange={handleSubCategoryChange} className="w-full appearance-none bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none transition-all cursor-pointer">
                      {getCategories(mainCategory).map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs font-medium text-slate-400 mb-1.5 block">Chapter</span>
                  <div className="relative">
                    <select value={chapter} onChange={(e) => setChapter(e.target.value)} className="w-full appearance-none bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none transition-all cursor-pointer">
                      {getChapters(mainCategory, subCategory).map(chap => <option key={chap} value={chap}>{chap}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-xs font-medium text-slate-400 mb-1.5 block">Difficulty</span>
                    <div className="relative">
                      <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)} className="w-full appearance-none bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none transition-all cursor-pointer">
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-400 mb-1.5 block">AI Q-Count</span>
                    <div className="relative">
                      <select value={qCount} onChange={(e)=>setQCount(Number(e.target.value))} className="w-full appearance-none bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none transition-all cursor-pointer">
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </label>
                </div>

                <button onClick={fetchFromDatabase} disabled={isLoading} className="w-full py-2.5 mt-2 rounded-xl border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                  <Database className="w-4 h-4" /> Fetch DB Questions
                </button>

                {/* 🌟 NAYE BUTTONS JSON IMPORT AUR BULK TRANSLATE KE LIYE 🌟 */}
                <div className="mt-4 pt-4 border-t border-[#2a2f3a]">
                  
                  {/* DIRECT FETCH FROM LOCAL DATA FOLDER */}
                  <button 
                    onClick={loadLocalJsonData}
                    className="w-full h-10 mb-3 border border-[#0d59f2]/50 bg-[#0d59f2]/10 hover:bg-[#0d59f2]/20 text-blue-400 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all text-xs cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> 1. Load Local JSON Data
                  </button>
                  
                  <button 
                    onClick={autoTranslateAllToHindi}
                    disabled={isLoading || questions.length === 0}
                    className="w-full h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
                  >
                    {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Languages className="w-4 h-4" />}
                    2. Auto-Translate to Hindi
                  </button>
                </div>

              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#0d59f2] font-medium text-sm">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0d59f2] text-white text-xs">2</span>
                <span>AI Generator File</span>
              </div>
              <div className="pl-8 border-l border-[#2a2f3a] ml-3">
                {!file ? (
                  <div 
                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 group cursor-pointer transition-all ${isDragging ? 'border-[#0d59f2] bg-[#0d59f2]/10' : 'border-[#2a2f3a] bg-[#181b21]/50 hover:bg-[#181b21] hover:border-[#0d59f2]/50'}`}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept=".pdf, image/*" />
                    <div className="p-2 rounded-full bg-[#111318] group-hover:bg-[#0d59f2]/20 transition-colors">
                      <CloudUpload className="w-6 h-6 text-slate-400 group-hover:text-[#0d59f2]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-300">Click or drag PDF/Image</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-[#181b21] rounded-lg border border-[#2a2f3a]">
                    <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{file.name}</p>
                    </div>
                    <button onClick={removeFile} className="text-slate-500 hover:text-white cursor-pointer shrink-0">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-auto space-y-3">
              <button 
                onClick={generateQuestions} disabled={isLoading || isEditingLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold rounded-full shadow-[0_0_20px_rgba(13,89,242,0.5)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles className="w-5 h-5" />}
                {isLoading ? 'Processing...' : 'Generate AI MCQs'}
              </button>
            </div>
          </section>

          {/* ── QUESTION LIST PANEL (RIGHT) ── */}
          <section className="flex-1 flex flex-col h-full overflow-hidden bg-[#0f1115]/50">
            
            {/* ── TOP BAR with Buttons ── */}
            <div className="h-16 border-b border-[#2a2f3a] bg-[#0f1115]/95 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between px-8 shrink-0">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={questions.length > 0 && selectedForDelete.length === questions.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-600 bg-[#181b21] text-[#0d59f2] focus:ring-0 focus:ring-offset-0 custom-checkbox transition-all cursor-pointer" 
                  />
                  Select All
                </label>
                <div className="h-4 w-[1px] bg-[#2a2f3a]"></div>
                <span className="text-sm text-slate-400">{questions.length} Items on Screen</span>
              </div>
              
              {/* ── ACTION BUTTONS ── */}
              <div className="flex items-center gap-3">
                <button onClick={clearScreen} disabled={questions.length === 0} className="px-4 py-2 rounded-lg border border-[#2a2f3a] text-slate-300 hover:text-yellow-400 hover:bg-[#181b21] cursor-pointer text-sm font-medium flex items-center gap-2 transition-colors">
                  <RotateCcw className="w-4 h-4" /> Clear
                </button>
                <button
                  onClick={deleteSelected}
                  disabled={selectedForDelete.length === 0}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedForDelete.length > 0
                      ? 'border-[#2a2f3a] text-slate-300 hover:text-red-400 hover:bg-[#181b21] cursor-pointer'
                      : 'border-transparent text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-4 h-4" /> Remove Selected
                </button>

                <button
                  onClick={pushToPostgreSQL}
                  disabled={questions.length === 0 || isLoading}
                  className="px-6 py-2 rounded-full bg-emerald-500 text-slate-900 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  {isLoading
                    ? <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                    : <Database className="w-4 h-4" />
                  }
                  3. Save to Database
                </button>
              </div>
            </div>

            {/* ── QUESTIONS LIST ── */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar pb-32">
              
              {questions.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full opacity-50">
                  <Database className="w-16 h-16 text-slate-500 mb-4" />
                  <p className="text-slate-400">Fetch from DB, Generate by AI, or Load Local JSON to view questions.</p>
                </div>
              )}

              {questions.map((q, qIndex) => {
                const isSelected = selectedForDelete.includes(qIndex);
                return (
                  <article key={qIndex} className="bg-[#181b21] rounded-2xl border border-[#2a2f3a] p-6 relative group transition-all hover:border-[#0d59f2]/30">
                    
                    <div className="absolute top-6 right-6 flex gap-2">
                      <button onClick={() => setEditingIndex(editingIndex === qIndex ? null : qIndex)} className="h-8 px-3 rounded-full bg-[#111318] border border-[#2a2f3a] flex items-center justify-center text-[#0d59f2] hover:text-white hover:bg-[#0d59f2] hover:border-[#0d59f2] transition-all gap-1.5 text-xs font-medium cursor-pointer" title="Edit with AI">
                        <Sparkles className="w-3.5 h-3.5" /> Edit with AI
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(qIndex)} 
                        className="w-8 h-8 rounded-full bg-[#111318] border border-[#2a2f3a] flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-400 transition-colors cursor-pointer" 
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-start gap-4 mb-6">
                      <div className="pt-1">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(qIndex)} className="w-5 h-5 rounded border-slate-600 bg-[#111318] text-[#0d59f2] focus:ring-0 focus:ring-offset-0 custom-checkbox cursor-pointer" />
                      </div>
                      <div className="flex-1 space-y-4">
                        
                        {editingIndex === qIndex && (
                           <div className="bg-[#0d59f2]/10 border border-[#0d59f2]/30 rounded-xl p-4 flex gap-3 animate-fade-in-up">
                             <input type="text" value={editPromptText} onChange={(e) => setEditPromptText(e.target.value)} placeholder="e.g. 'Make it harder' or 'Fix Hindi translation'" className="flex-1 bg-[#111318] border border-[#2a2f3a] rounded-lg px-4 py-2 text-sm text-white focus:border-[#0d59f2] outline-none" disabled={isEditingLoading} />
                             <button onClick={() => modifyQuestionWithAI(qIndex)} disabled={isEditingLoading || !editPromptText.trim()} className="bg-[#0d59f2] hover:bg-blue-600 text-white px-6 rounded-lg text-sm font-bold cursor-pointer disabled:opacity-50 transition-colors">
                               {isEditingLoading ? 'Wait...' : 'Apply'}
                             </button>
                           </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Question (English)</label>
                            <textarea value={q.question} onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)} className="w-full bg-[#111318] border border-[#2a2f3a] rounded-xl p-3 text-sm text-white resize-none h-24 focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none custom-scrollbar" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Question (Hindi)</label>
                            <textarea value={q.questionHindi} onChange={e => handleQuestionChange(qIndex, 'questionHindi', e.target.value)} placeholder="Click 'Auto-Translate' to fill this automatically" className="w-full bg-[#111318] border border-[#2a2f3a] rounded-xl p-3 text-sm text-white resize-none h-24 focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none custom-scrollbar font-display" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pl-9 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      {q.options.map((opt, optIndex) => {
                        const isCorrect = opt === q.answer && opt.trim() !== "";
                        return (
                          <div key={optIndex} className={`flex items-center gap-3 p-2 rounded-lg transition-colors border ${isCorrect ? 'border-transparent bg-[#111318]/50' : 'border-transparent hover:border-[#2a2f3a] hover:bg-[#111318]/50'}`}>
                            <input type="radio" name={`q${qIndex}_ans`} checked={isCorrect} onChange={() => setCorrectAnswer(qIndex, opt)} className="w-4 h-4 border-slate-600 bg-[#111318] text-[#0d59f2] focus:ring-offset-0 focus:ring-0 cursor-pointer" />
                            <span className="text-xs font-bold text-slate-500 w-4">{letters[optIndex]}</span>
                            <input type="text" value={opt} onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)} placeholder={`Option ${letters[optIndex]}`} className={`bg-transparent border-none text-sm w-full focus:ring-0 p-0 placeholder-slate-600 outline-none ${isCorrect ? 'text-white' : 'text-slate-300'}`} />
                            {isCorrect && <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" title="Correct Answer" />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pl-9 grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 pt-4 border-t border-[#2a2f3a]">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-emerald-500 uppercase tracking-wider flex items-center gap-1">Explanation (English)</label>
                        <textarea value={q.explanation} onChange={e => handleQuestionChange(qIndex, 'explanation', e.target.value)} className="w-full bg-[#111318] border border-emerald-500/20 rounded-xl p-3 text-xs text-slate-300 resize-none h-16 focus:border-emerald-500 outline-none custom-scrollbar" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-emerald-500 uppercase tracking-wider flex items-center gap-1">Explanation (Hindi)</label>
                        <textarea value={q.explanationHindi} onChange={e => handleQuestionChange(qIndex, 'explanationHindi', e.target.value)} placeholder="Click 'Auto-Translate' to fill this automatically" className="w-full bg-[#111318] border border-emerald-500/20 rounded-xl p-3 text-xs text-slate-300 resize-none h-16 focus:border-emerald-500 outline-none custom-scrollbar font-display" />
                      </div>
                    </div>

                    <div className="pl-9 mt-4 flex flex-wrap items-center gap-2 border-t border-[#2a2f3a] pt-4">
                      <div className="px-2 py-1 rounded bg-slate-800 border border-slate-700 flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">Tag:</span>
                        <input type="text" value={q.examReference || ''} onChange={e => handleQuestionChange(qIndex, 'examReference', e.target.value)} className="bg-transparent border-none p-0 text-yellow-400 focus:ring-0 outline-none w-24 text-[10px] font-bold" />
                      </div>
                      <div className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">Diff: {difficulty}</div>
                      
                      <div className="px-2 py-1 rounded bg-indigo-900/30 border border-indigo-500/30 flex items-center gap-2 w-full mt-2 lg:w-auto lg:mt-0">
                        <span className="text-[10px] text-indigo-300 font-medium">Geometry/Chart:</span>
                        <input type="text" value={q.geometryType || ''} onChange={e => handleQuestionChange(qIndex, 'geometryType', e.target.value)} placeholder="Type" className="bg-transparent border-none p-0 text-indigo-200 focus:ring-0 outline-none w-32 text-[10px]" />
                        <input type="text" value={q.geometryData ? (typeof q.geometryData === 'string' ? q.geometryData : JSON.stringify(q.geometryData)) : ''} onChange={e => handleQuestionChange(qIndex, 'geometryData', e.target.value)} placeholder="Data (JSON)" className="bg-transparent border-none p-0 text-indigo-200 focus:ring-0 outline-none w-48 text-[10px] border-l border-indigo-500/30 pl-2 ml-1" />
                      </div>
                    </div>
                  </article>
                );
              })}

              <button onClick={addNewQuestion} className="w-full py-4 border-2 border-dashed border-[#2a2f3a] rounded-xl text-slate-400 hover:text-white hover:border-slate-500 hover:bg-[#181b21] transition-all flex items-center justify-center gap-2 cursor-pointer font-medium">
                <PlusCircle className="w-5 h-5" /> Add Blank Question Row
              </button>
              
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}