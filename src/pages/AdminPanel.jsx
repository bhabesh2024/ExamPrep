import React, { useState, useRef, useEffect } from 'react';
import { allData } from '../data/syllabusData.jsx'; // Make sure path is correct
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { 
  Settings, HelpCircle, CloudUpload, FileText, X, Sparkles, 
  Trash2, Save, CheckCircle2, CheckSquare, PlusCircle
} from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function AdminPanel() {
  const mainSubjects = Object.keys(allData);
  const [mainCategory, setMainCategory] = useState(mainSubjects[0]);
  const [subCategory, setSubCategory] = useState(Object.keys(allData[mainSubjects[0]])[0]);
  const [chapter, setChapter] = useState(allData[mainSubjects[0]][Object.keys(allData[mainSubjects[0]])[0]][0]);
  
  // New States for Generation
  const [difficulty, setDifficulty] = useState('Medium');
  const [qCount, setQCount] = useState(20);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('System Operational');
  const [statusType, setStatusType] = useState('info'); // info, loading, success, error
  const [isLoading, setIsLoading] = useState(false);

  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editPromptText, setEditPromptText] = useState('');
  const [isEditingLoading, setIsEditingLoading] = useState(false);

  // ── Handlers ──
  const handleMainCategoryChange = (e) => {
    const newMain = e.target.value;
    setMainCategory(newMain);
    const newSubs = Object.keys(allData[newMain] || {});
    setSubCategory(newSubs[0] || '');
    setChapter(allData[newMain]?.[newSubs[0]]?.[0] || '');
  };

  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
    setChapter(allData[mainCategory]?.[e.target.value]?.[0] || '');
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };
  const handleFileSelect = (e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); };
  const removeFile = () => setFile(null);

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

  // ── AI Generation ──
  const generateQuestions = async () => {
    if (!file || !chapter) {
      setStatus('Please select a chapter and upload a file.'); setStatusType('error'); return;
    }
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      setStatus('VITE_GROQ_API_KEY not found in .env file!'); setStatusType('error'); return;
    }
    
    setIsLoading(true); setStatusType('loading');
    setStatus('Analyzing document & generating questions...');

    try {
      const fileData = await extractFileContent(file);
      const isAdvanced = mainCategory === 'Maths' || mainCategory === 'Reasoning';
      const isCurrentAffairs = mainCategory === 'Current Affairs'; 

      const systemPrompt = `You are an expert Assamese educator and content creator.
Your task is to generate ${qCount} UNIQUE, ${difficulty} difficulty multiple-choice questions for the chapter "${chapter}".

CRITICAL RULES:
1. OUTPUT ONLY VALID JSON. Start directly with { and end with }.
2. Format: object with a "questions" array.
3. Each object must have these EXACT keys: "question", "questionAssamese", "options", "answer", "explanation", "explanationAssamese", "examReference".
4. OPTIONS: array of 4 VERY SHORT choices (max 6 words each) IN ENGLISH ONLY.
5. "answer" must exactly match the correct option string.
6. EXAM REFERENCE TAGGING: 
   ${isCurrentAffairs 
     ? 'Set "examReference" to "Recent Trend" or "Expected".' 
     : 'Set the "examReference" field to the exact past exam name and year (e.g., "APSC 2018", "SSC CGL 2021"). If it is a new question, set it to "Expected".'}
7. ${isAdvanced ? 'Use LaTeX for math equations.' : 'Ensure perfect Assamese translations.'}
8. 🛑 STRICT ASSAMESE FONT RULE: ALWAYS use 'ৰ' [U+09F0] and 'ৱ' [U+09F1]. NEVER use Bengali 'র'.`;

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
        setQuestions(jsonResponse.questions);
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

  const modifyQuestionWithAI = async (index) => {
    if (!editPromptText.trim()) return;
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) return;
    
    setIsEditingLoading(true);
    setStatus(`Modifying Question ${index + 1}...`); setStatusType('loading');

    try {
      const questionToEdit = questions[index];
      const systemPrompt = `You are an expert Assamese educator. MODIFY the provided JSON question STRICTLY based on the user's instruction. Keep the output format strictly as a valid JSON object with the exact same keys. MUST use proper Assamese ('ৰ' and 'ৱ').`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Original Question JSON:\n${JSON.stringify(questionToEdit)}\n\nUSER INSTRUCTION: ${editPromptText}` }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.4
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
    // Update answer if the modified option was the correct answer
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
    setSelectedForDelete(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedForDelete(questions.map((_, i) => i));
    } else {
      setSelectedForDelete([]);
    }
  };

  const deleteSelected = () => {
    if (selectedForDelete.length === 0) return;
    if (window.confirm(`Delete ${selectedForDelete.length} selected questions?`)) {
      setQuestions(prev => prev.filter((_, i) => !selectedForDelete.includes(i)));
      setSelectedForDelete([]);
      setStatus(`Deleted ${selectedForDelete.length} questions locally. Press Save to push to DB.`);
    }
  };

  const addNewQuestion = () => {
    const newQ = {
      question: "", questionAssamese: "", 
      options: ["", "", "", ""], answer: "", 
      explanation: "", explanationAssamese: "", examReference: "Expected"
    };
    setQuestions([...questions, newQ]);
  };

  // ── Database ──
  const loadExistingQuestions = async () => {
    const filePath = `${mainCategory}/${subCategory}.json`;
    setStatus('Loading existing questions...'); setStatusType('loading');
    try {
      const res = await fetch(`/api/get-questions?filePath=${encodeURIComponent(filePath)}&chapter=${encodeURIComponent(chapter)}`);
      const data = await res.json();
      if (data.success) {
        const questionsWithRefs = data.questions.map(q => ({ ...q, examReference: q.examReference || 'Expected' }));
        setQuestions(questionsWithRefs);
        setSelectedForDelete([]);
        setStatus(`Loaded ${questionsWithRefs.length} existing questions.`); setStatusType('success');
      }
    } catch (e) {
      setStatus('Failed to load questions.'); setStatusType('error');
    }
  };

  const saveToDatabase = async () => {
    const filePath = `${mainCategory}/${subCategory}.json`;
    try {
      setStatus('Saving to database...'); setStatusType('loading');
      const response = await fetch('/api/save-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, chapter, newQuestions: questions })
      });
      const result = await response.json();
      if (result.success) {
        setStatus(`Successfully saved ${questions.length} questions!`); setStatusType('success');
      }
    } catch {
      setStatus('Failed to save. Check server connection.'); setStatusType('error');
    }
  };

  // Status Color Logic
  const getStatusColor = () => {
    if(statusType === 'loading') return 'text-yellow-500';
    if(statusType === 'error') return 'text-red-500';
    if(statusType === 'success') return 'text-green-500';
    return 'text-[#0d59f2]';
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-[#0f1115] text-slate-100 min-h-screen overflow-hidden flex font-sans selection:bg-[#0d59f2]/30">
      
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #111318; }
        ::-webkit-scrollbar-thumb { background: #3b4354; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #4b5563; }
        .custom-checkbox:checked {
            background-color: #0d59f2; border-color: #0d59f2;
            background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
        }
      `}</style>

      {/* LEFT SIDEBAR - GENERATION PARAMS */}
      <aside className="w-[360px] lg:w-[400px] h-screen flex flex-col border-r border-[#2a2f3a] bg-[#111318]/50 shrink-0 p-6 gap-6 overflow-y-auto relative z-20">
        
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#0d59f2] text-white flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(13,89,242,0.5)]">Q</div>
            Content Engine
          </h2>
          <p className="text-sm text-slate-400 mt-2">Configure AI parameters to generate material.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#0d59f2] font-medium text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0d59f2] text-white text-xs">1</span>
            <span>Exam Context</span>
          </div>
          <div className="space-y-3 pl-8 border-l border-[#2a2f3a] ml-3">
            
            <label className="block">
              <span className="text-xs font-medium text-slate-400 mb-1.5 block">Main Subject</span>
              <select value={mainCategory} onChange={handleMainCategoryChange} className="w-full bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none transition-all">
                {mainSubjects.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-400 mb-1.5 block">Category</span>
              <select value={subCategory} onChange={handleSubCategoryChange} className="w-full bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none transition-all">
                {Object.keys(allData[mainCategory] || {}).map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-400 mb-1.5 block">Chapter</span>
              <select value={chapter} onChange={(e) => setChapter(e.target.value)} className="w-full bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none transition-all">
                {(allData[mainCategory]?.[subCategory] || []).map(chap => <option key={chap} value={chap}>{chap}</option>)}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium text-slate-400 mb-1.5 block">Difficulty</span>
                <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)} className="w-full bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none transition-all">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-400 mb-1.5 block">Count</span>
                <select value={qCount} onChange={(e)=>setQCount(Number(e.target.value))} className="w-full bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none transition-all">
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </label>
            </div>
            
            <button onClick={loadExistingQuestions} className="w-full py-2.5 mt-2 rounded-xl border border-yellow-500/30 text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2">
              <CloudUpload className="w-4 h-4" /> Load Existing Data
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#0d59f2] font-medium text-sm">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0d59f2] text-white text-xs">2</span>
            <span>Source Material</span>
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
                  <p className="text-sm font-medium text-slate-300">Click to upload or drag PDF</p>
                  <p className="text-xs text-slate-500">Max file size 10MB</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-[#181b21] rounded-lg border border-[#2a2f3a]">
                <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{file.name}</p>
                  <p className="text-[10px] text-slate-500">Ready for processing</p>
                </div>
                <button onClick={removeFile} className="text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 mt-auto">
          <button 
            onClick={generateQuestions} disabled={isLoading || isEditingLoading}
            className="w-full h-12 bg-[#0d59f2] hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-full shadow-[0_0_20px_rgba(13,89,242,0.4)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles className="w-5 h-5" />}
            {isLoading ? 'Generating...' : 'Generate AI MCQs'}
          </button>
          <p className="text-center text-[10px] text-slate-500 mt-3">Using Groq Llama-3 Model for Fast Processing</p>
        </div>
      </aside>

      {/* RIGHT MAIN PANEL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#0a0a0a]">
        
        {/* Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0d59f2]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]"></div>
        </div>

        {/* Top Action Bar */}
        <div className="h-16 border-b border-[#2a2f3a] bg-[#0a0a0a]/90 backdrop-blur-md flex items-center justify-between px-8 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={questions.length > 0 && selectedForDelete.length === questions.length}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-slate-600 bg-[#181b21] text-[#0d59f2] focus:ring-0 custom-checkbox transition-all" 
              />
              Select All
            </label>
            <div className="h-4 w-[1px] bg-[#2a2f3a]"></div>
            <span className="text-sm font-bold text-white">{questions.length} <span className="font-normal text-slate-400">Questions</span></span>
            
            {/* System Status */}
            <div className="ml-4 flex items-center gap-2 px-3 py-1 rounded bg-[#181b21] border border-[#2a2f3a]">
               <div className={`w-2 h-2 rounded-full animate-pulse ${statusType === 'loading' ? 'bg-yellow-500' : statusType === 'error' ? 'bg-red-500' : 'bg-green-500'}`}></div>
               <span className={`text-xs font-medium ${getStatusColor()}`}>{status}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedForDelete.length > 0 && (
              <button onClick={deleteSelected} className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:text-white hover:bg-red-500/20 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer">
                <Trash2 className="w-4 h-4" /> Delete Selected ({selectedForDelete.length})
              </button>
            )}
            <button onClick={saveToDatabase} disabled={questions.length === 0} className="px-6 py-2 rounded-full bg-white text-slate-900 hover:bg-slate-200 disabled:opacity-50 text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-white/10">
              <Save className="w-4 h-4" /> Save All
            </button>
          </div>
        </div>

        {/* QUESTIONS LIST */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative z-10 pb-32">
          
          {questions.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
              <CheckSquare className="w-16 h-16 text-slate-500 mb-4" />
              <p className="text-slate-400">No questions available. Generate or Load existing ones.</p>
            </div>
          )}

          {questions.map((q, qIndex) => {
            const isSelected = selectedForDelete.includes(qIndex);
            
            return (
              <article key={qIndex} className={`bg-[#181b21] rounded-2xl border p-6 relative group transition-all ${isSelected ? 'border-[#0d59f2]' : 'border-[#2a2f3a] hover:border-[#0d59f2]/30'}`}>
                
                {/* Actions */}
                <div className="absolute top-6 right-6 flex gap-2">
                  <button onClick={() => setEditingIndex(editingIndex === qIndex ? null : qIndex)} className="h-8 px-3 rounded-full bg-[#111318] border border-[#2a2f3a] flex items-center justify-center text-[#0d59f2] hover:text-white hover:bg-[#0d59f2] transition-all gap-1.5 text-xs font-medium cursor-pointer">
                    <Sparkles className="w-3.5 h-3.5" /> Edit with AI
                  </button>
                  <button onClick={() => {toggleSelect(qIndex); deleteSelected();}} className="w-8 h-8 rounded-full bg-[#111318] border border-[#2a2f3a] flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-400 transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="pt-1">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(qIndex)} className="w-5 h-5 rounded border-slate-600 bg-[#111318] text-[#0d59f2] focus:ring-0 custom-checkbox cursor-pointer" />
                  </div>
                  <div className="flex-1 space-y-4">
                    
                    {/* Inline AI Edit Box */}
                    {editingIndex === qIndex && (
                       <div className="bg-[#0d59f2]/10 border border-[#0d59f2]/30 rounded-xl p-4 flex gap-3 animate-fade-in-up">
                         <input type="text" value={editPromptText} onChange={(e) => setEditPromptText(e.target.value)} placeholder="Instruction: e.g. 'Make it harder' or 'Fix translation'" className="flex-1 bg-[#111318] border border-[#2a2f3a] rounded-lg px-4 py-2 text-sm text-white focus:border-[#0d59f2] outline-none" disabled={isEditingLoading} />
                         <button onClick={() => modifyQuestionWithAI(qIndex)} disabled={isEditingLoading || !editPromptText.trim()} className="bg-[#0d59f2] text-white px-6 rounded-lg text-sm font-bold cursor-pointer disabled:opacity-50">
                           {isEditingLoading ? 'Wait...' : 'Apply Magic'}
                         </button>
                       </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Question (English)</label>
                        <textarea value={q.question} onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)} className="w-full bg-[#111318] border border-[#2a2f3a] rounded-xl p-3 text-sm text-white resize-y h-20 focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none custom-scrollbar"/>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Question (Assamese)</label>
                        <textarea value={q.questionAssamese} onChange={e => handleQuestionChange(qIndex, 'questionAssamese', e.target.value)} className="w-full bg-[#111318] border border-[#2a2f3a] rounded-xl p-3 text-sm text-white resize-y h-20 focus:ring-1 focus:ring-[#0d59f2] focus:border-[#0d59f2] outline-none custom-scrollbar"/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Options Grid (Using Radio Buttons for Answer Selection) */}
                <div className="pl-9 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-6">
                  {q.options.map((opt, optIndex) => {
                    const isCorrect = opt === q.answer && opt.trim() !== "";
                    return (
                      <div key={optIndex} className={`flex items-center gap-3 p-2 rounded-lg transition-colors border ${isCorrect ? 'bg-[#0d59f2]/10 border-[#0d59f2]/30' : 'border-transparent hover:border-[#2a2f3a] hover:bg-[#111318]/50'}`}>
                        <input 
                          type="radio" 
                          name={`q${qIndex}_ans`} 
                          checked={isCorrect}
                          onChange={() => setCorrectAnswer(qIndex, opt)}
                          className="w-4 h-4 border-slate-600 bg-[#111318] text-[#0d59f2] focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-500 w-4">{letters[optIndex]}</span>
                        <input 
                          type="text" 
                          value={opt} 
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                          placeholder={`Option ${letters[optIndex]}`}
                          className={`bg-transparent border-none text-sm w-full focus:ring-0 p-0 placeholder-slate-600 outline-none ${isCorrect ? 'text-white font-medium' : 'text-slate-300'}`} 
                        />
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                      </div>
                    )
                  })}
                </div>

                {/* Explanations Grid */}
                <div className="pl-9 grid grid-cols-1 lg:grid-cols-2 gap-4 border-t border-[#2a2f3a] pt-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Explanation (English)</label>
                    <textarea value={q.explanation} onChange={e => handleQuestionChange(qIndex, 'explanation', e.target.value)} className="w-full bg-[#111318] border border-green-500/20 rounded-xl p-3 text-xs text-slate-300 resize-y h-16 focus:border-green-500 outline-none custom-scrollbar"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Explanation (Assamese)</label>
                    <textarea value={q.explanationAssamese} onChange={e => handleQuestionChange(qIndex, 'explanationAssamese', e.target.value)} className="w-full bg-[#111318] border border-green-500/20 rounded-xl p-3 text-xs text-slate-300 resize-y h-16 focus:border-green-500 outline-none custom-scrollbar"/>
                  </div>
                </div>

                {/* Tags Bottom Bar */}
                <div className="pl-9 mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#111318] px-3 py-1.5 rounded-lg border border-[#2a2f3a]">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Exam Tag:</span>
                    <input 
                      type="text" 
                      value={q.examReference} 
                      onChange={e => handleQuestionChange(qIndex, 'examReference', e.target.value)} 
                      className="bg-transparent border-none text-xs text-yellow-400 font-bold p-0 focus:ring-0 w-32 outline-none" 
                    />
                  </div>
                </div>

              </article>
            );
          })}

          <button onClick={addNewQuestion} className="w-full py-4 border-2 border-dashed border-[#2a2f3a] rounded-xl text-slate-400 hover:text-white hover:border-slate-500 hover:bg-[#181b21] transition-all flex items-center justify-center gap-2 cursor-pointer font-medium">
            <PlusCircle className="w-5 h-5" /> Add New Question Manually
          </button>

        </div>
      </main>
    </div>
  );
}