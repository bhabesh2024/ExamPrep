// src/hooks/useAdminLogic.jsx
import { useState, useRef } from 'react';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

import { subjectsData } from '../data/syllabusData.jsx'; 
import { getQuestionsByTitle } from '../data/questionsLoader';
import { AI_STRICT_RULES } from '../config/aiPrompts';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function useAdminLogic() {
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
  const bulkJsonRef = useRef(null);
  
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('System Operational. Connected to DB.');
  const [statusType, setStatusType] = useState('success'); 
  const [isLoading, setIsLoading] = useState(false);

  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editPromptText, setEditPromptText] = useState('');
  const [isEditingLoading, setIsEditingLoading] = useState(false);

  const handleMainCategoryChange = (e) => {
    const newMain = e.target.value; setMainCategory(newMain);
    const newSubs = getCategories(newMain); setSubCategory(newSubs[0] || '');
    setChapter(getChapters(newMain, newSubs[0])[0] || '');
  };

  const handleSubCategoryChange = (e) => {
    const newSub = e.target.value; setSubCategory(newSub);
    setChapter(getChapters(mainCategory, newSub)[0] || '');
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]); };
  const handleFileSelect = (e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); };
  const removeFile = () => setFile(null);

  const loadLocalJsonData = () => {
    setStatus('Loading local JSON data...'); setStatusType('loading');
    try {
      const loaded = getQuestionsByTitle(chapter);
      if (loaded && loaded.length > 0) {
        const formattedData = loaded.map(q => ({
          ...q, questionHindi: "", explanationHindi: "", examReference: q.examReference || "Expected",
          geometryType: q.geometryType || null, geometryData: q.geometryData || null
        }));
        setQuestions(formattedData); setSelectedForDelete([]);
        setStatus(`✅ Loaded ${formattedData.length} questions from local files! Click Auto-Translate.`); setStatusType('info');
      } else { setStatus(`No local JSON data found for "${chapter}".`); setStatusType('error'); }
    } catch (e) { setStatus('Failed to load local data: ' + e.message); setStatusType('error'); }
  };

  const extractFileContent = async (uploadedFile) => {
    if (uploadedFile.type.includes('image')) {
      return new Promise((resolve) => {
        const reader = new FileReader(); reader.onloadend = () => resolve({ type: 'image', content: reader.result }); reader.readAsDataURL(uploadedFile);
      });
    } else if (uploadedFile.type === 'application/pdf') {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i); const textContent = await page.getTextContent();
        text += textContent.items.map(s => s.str).join(' ') + '\n';
      }
      return { type: 'text', content: text };
    }
    throw new Error('Unsupported file type.');
  };

  const generateQuestions = async () => {
    if (!file || !chapter) { setStatus('Please select a chapter and upload a file.'); setStatusType('error'); return; }
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    if (!apiKey) { setStatus('VITE_AI_API_KEY missing!'); setStatusType('error'); return; }
    
    setIsLoading(true); setStatusType('loading'); setStatus('Analyzing & generating questions...');

    try {
      const fileData = await extractFileContent(file);
      const isAdvanced = mainCategory === 'Mathematics' || mainCategory === 'Reasoning';
      const isCurrentAffairs = mainCategory === 'Current Affairs'; 

      const systemPrompt = `You are an expert bilingual (English & Hindi) educator.
Generate ${qCount} UNIQUE, ${difficulty} difficulty multiple-choice questions for "${chapter}".

${AI_STRICT_RULES.JSON_GENERATION}
${AI_STRICT_RULES.TRANSLATION}

ADDITIONAL CONTEXT RULES:
- EXAM REFERENCE: ${isCurrentAffairs ? '"Recent Trend"' : 'exact past exam name and year'}.
- ${isAdvanced ? 'Use LaTeX wrapped in $ (inline) or $$ (block) for ALL math. Use geometryType/geometryData if chart/figure needed, else null.' : 'Set "geometryType" and "geometryData" to null.'}`;

      let messages = [{ role: 'system', content: systemPrompt }];
      if (fileData.type === 'text') { messages.push({ role: 'user', content: `Source:\n\n${fileData.content.substring(0, 25000)}` }); } 
      else { messages.push({ role: 'user', content: [{ type: 'text', text: 'Source image.' }, { type: 'image_url', image_url: { url: fileData.content } }] }); }

      const model = fileData.type === 'image' ? 'llama-3.2-11b-vision-preview' : 'llama-3.3-70b-versatile';
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, response_format: { type: 'json_object' }, temperature: 0.8 })
      });
      const result = await response.json();
      if (result.error) throw new Error(result.error.message);
      
      const jsonResponse = JSON.parse(result.choices[0].message.content);
      if (jsonResponse.questions) { setQuestions(prev => [...prev, ...jsonResponse.questions]); setStatus(`${jsonResponse.questions.length} questions generated!`); setStatusType('success'); }
    } catch (error) { setStatus(error.message); setStatusType('error'); } finally { setIsLoading(false); }
  };

  const autoTranslateAllToHindi = async () => {
    if (questions.length === 0) return;
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    if (!apiKey) { setStatus('API Key missing!'); setStatusType('error'); return; }
    if (!window.confirm("Translate all empty Hindi fields?")) return;

    setIsLoading(true);
    let updatedQs = [...questions];

    for (let i = 0; i < updatedQs.length; i++) {
      if (!updatedQs[i].questionHindi || updatedQs[i].questionHindi.trim() === "") {
        setStatus(`Translating question ${i + 1} of ${updatedQs.length}...`); setStatusType('loading');
        try {
          const prompt = `You are an expert Hindi translator for competitive exams. 
          Translate the following English question and explanation into pure Hindi.
          ${AI_STRICT_RULES.TRANSLATION}
          English Question: ${updatedQs[i].question}
          English Explanation: ${updatedQs[i].explanation || "N/A"}
          Return STRICTLY ONLY a JSON object: {"questionHindi": "...", "explanationHindi": "..."}`;

          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' }, temperature: 0.3 })
          });
          const result = await response.json(); const parsed = JSON.parse(result.choices[0].message.content);
          updatedQs[i].questionHindi = parsed.questionHindi || ""; updatedQs[i].explanationHindi = (parsed.explanationHindi === "N/A") ? "" : (parsed.explanationHindi || "");
          setQuestions([...updatedQs]); await new Promise(r => setTimeout(r, 1000));
        } catch (err) { console.error(`Translation failed Q${i+1}`, err); }
      }
    }
    setStatus(`✅ Translation Complete!`); setStatusType('success'); setIsLoading(false);
  };

  const modifyQuestionWithAI = async (index) => {
    if (!editPromptText.trim()) return;
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    if (!apiKey) return;
    
    setIsEditingLoading(true); setStatus(`Modifying Question ${index + 1}...`); setStatusType('loading');

    try {
      const questionToEdit = questions[index];
      const systemPrompt = `You are an expert educator. MODIFY the provided JSON question STRICTLY based on the user's instruction.\n${AI_STRICT_RULES.MODIFICATION}`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: `Original JSON:\n${JSON.stringify(questionToEdit)}\n\nINSTRUCTION: ${editPromptText}` }],
          response_format: { type: 'json_object' }, temperature: 0.4
        })
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error.message);
      
      const modifiedQuestion = JSON.parse(result.choices[0].message.content);
      const updatedQuestions = [...questions];
      updatedQuestions[index] = { ...updatedQuestions[index], ...modifiedQuestion };
      
      setQuestions(updatedQuestions); setEditingIndex(null); setEditPromptText('');
      setStatus(`Question ${index + 1} modified successfully!`); setStatusType('success');
    } catch (error) { setStatus('Failed to modify question: ' + error.message); setStatusType('error'); } finally { setIsEditingLoading(false); }
  };

  const handleQuestionChange = (index, field, value) => { const updated = [...questions]; updated[index][field] = value; setQuestions(updated); };
  const handleOptionChange = (qIndex, optIndex, value) => { const updated = [...questions]; const oldOptValue = updated[qIndex].options[optIndex]; updated[qIndex].options[optIndex] = value; if (updated[qIndex].answer === oldOptValue) { updated[qIndex].answer = value; } setQuestions(updated); };
  const setCorrectAnswer = (qIndex, optValue) => { const updated = [...questions]; updated[qIndex].answer = optValue; setQuestions(updated); };
  const toggleSelect = (index) => { setSelectedForDelete(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]); };
  const handleSelectAll = (e) => { setSelectedForDelete(e.target.checked ? questions.map((_, i) => i) : []); };
  const deleteSelected = () => { if (selectedForDelete.length > 0 && window.confirm(`Delete from UI?`)) { setQuestions(prev => prev.filter((_, i) => !selectedForDelete.includes(i))); setSelectedForDelete([]); } };
  const clearScreen = () => { if (questions.length > 0 && window.confirm("Clear screen?")) { setQuestions([]); setSelectedForDelete([]); } };
  const addNewQuestion = () => { setQuestions([...questions, { question: "", questionHindi: "", options: ["", "", "", ""], answer: "", explanation: "", explanationHindi: "", examReference: "Expected", geometryType: null, geometryData: null }]); };

  const fetchFromDatabase = async () => {
    setStatus('Fetching questions...'); setStatusType('loading'); setIsLoading(true);
    try {
      const res = await axios.get(`/api/questions?chapter=${encodeURIComponent(chapter)}`);
      if (res.data && res.data.length > 0) { setQuestions(res.data); setSelectedForDelete([]); setStatus(`✅ Loaded ${res.data.length} questions from DB.`); setStatusType('success'); } 
      else { setQuestions([]); setStatus(`No questions found in DB.`); setStatusType('info'); }
    } catch (e) { setStatus('Failed to fetch from DB'); setStatusType('error'); } finally { setIsLoading(false); }
  };

  const pushToPostgreSQL = async () => {
    if (questions.length === 0) return;
    setStatus('Saving to DB...'); setStatusType('loading'); setIsLoading(true);
    try {
      const chapterIdSlug = chapter.toLowerCase().replace(/\s+/g, '-');
      for (const q of questions) {
        await axios.post('/api/questions', {
          subject: mainCategory, topic: subCategory, subtopic: chapter, chapterId: chapterIdSlug, difficulty: difficulty,
          question: q.question, questionHindi: q.questionHindi || "", options: q.options, answer: q.answer,
          explanation: q.explanation || "", explanationHindi: q.explanationHindi || "", examReference: q.examReference || "Expected",
          geometryType: q.geometryType || null, geometryData: q.geometryData ? (typeof q.geometryData === 'string' ? q.geometryData : JSON.stringify(q.geometryData)) : null
        });
      }
      setStatus(`✅ Saved to DB!`); setStatusType('success'); setQuestions([]); 
    } catch (err) { setStatus(`❌ Failed to save`); setStatusType('error'); } finally { setIsLoading(false); }
  };

  const handleDeleteQuestion = async (index) => {
    const q = questions[index];
    if (q.id) {
      if (window.confirm("⚠️ Delete permanently from DB?")) {
        try { await axios.delete(`/api/questions/${q.id}`); setQuestions(prev => prev.filter((_, i) => i !== index)); setSelectedForDelete(prev => prev.filter(i => i !== index)); } 
        catch (err) { console.error(err); }
      }
    } else { setQuestions(prev => prev.filter((_, i) => i !== index)); setSelectedForDelete(prev => prev.filter(i => i !== index)); }
  };

  // Return everything needed by the UI
  return {
    mainSubjects, getCategories, getChapters,
    mainCategory, handleMainCategoryChange,
    subCategory, handleSubCategoryChange,
    chapter, setChapter, difficulty, setDifficulty,
    qCount, setQCount, isDragging, file, fileInputRef, bulkJsonRef,
    questions, status, statusType, isLoading, selectedForDelete, editingIndex,
    setEditingIndex, editPromptText, setEditPromptText, isEditingLoading,
    handleDragOver, handleDragLeave, handleDrop, handleFileSelect, removeFile,
    loadLocalJsonData, generateQuestions, autoTranslateAllToHindi, modifyQuestionWithAI,
    handleQuestionChange, handleOptionChange, setCorrectAnswer, toggleSelect,
    handleSelectAll, deleteSelected, clearScreen, addNewQuestion, fetchFromDatabase,
    pushToPostgreSQL, handleDeleteQuestion
  };
}