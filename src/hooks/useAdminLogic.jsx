// src/hooks/useAdminLogic.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

import { subjectsData } from '../data/syllabusData.jsx'; 
import { getQuestionsByTitle } from '../data/questionsLoader';
import { AI_STRICT_RULES } from '../config/aiPrompts';
import { applyStrictMathFilter, cleanMarkdown } from '../utils/textUtils';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function useAdminLogic() {
  // ==========================================
  // SECTION 1: STATES & FORM HANDLERS
  // ==========================================
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
  
  const [status, setStatus] = useState('System Operational. Connected to DB.');
  const [statusType, setStatusType] = useState('success'); 
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editPromptText, setEditPromptText] = useState('');
  const [isEditingLoading, setIsEditingLoading] = useState(false);

  const [questions, setQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_draft_questions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    localStorage.setItem('admin_draft_questions', JSON.stringify(questions));
  }, [questions]);

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


  // ==========================================
  // SECTION 2: UI QUESTION ACTIONS
  // ==========================================
  const handleQuestionChange = (index, field, value) => { const updated = [...questions]; updated[index][field] = value; setQuestions(updated); };
  const handleOptionChange = (qIndex, optIndex, value) => { const updated = [...questions]; const oldOptValue = updated[qIndex].options[optIndex]; updated[qIndex].options[optIndex] = value; if (updated[qIndex].answer === oldOptValue) { updated[qIndex].answer = value; } setQuestions(updated); };
  const setCorrectAnswer = (qIndex, optValue) => { const updated = [...questions]; updated[qIndex].answer = optValue; setQuestions(updated); };
  const toggleSelect = (index) => { setSelectedForDelete(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]); };
  const handleSelectAll = (e) => { setSelectedForDelete(e.target.checked ? questions.map((_, i) => i) : []); };
  const addNewQuestion = () => { setQuestions([...questions, { question: "", questionHindi: "", options: ["", "", "", ""], answer: "", explanation: "", explanationHindi: "", examReference: "Expected", geometryType: null, geometryData: null }]); };
  
  const clearScreen = () => { 
    if (questions.length > 0 && window.confirm("Clear screen? (Database se delete nahi hoga)")) { 
      setQuestions([]); setSelectedForDelete([]); localStorage.removeItem('admin_draft_questions');
    } 
  };


  // ==========================================
  // SECTION 3: DATABASE OPERATIONS 
  // ==========================================
  const fetchFromDatabase = async () => {
    setStatus('Fetching questions...'); setStatusType('loading'); setIsLoading(true);
    try {
      const res = await axios.get(`/api/questions?chapter=${encodeURIComponent(chapter)}`);
      if (res.data && res.data.length > 0) { setQuestions(res.data); setSelectedForDelete([]); setStatus(`✅ Loaded ${res.data.length} questions from DB.`); setStatusType('success'); } 
      else { setQuestions([]); setStatus(`No questions found in DB.`); setStatusType('info'); }
    } catch (e) { setStatus('Failed to fetch from DB'); setStatusType('error'); } finally { setIsLoading(false); }
  };

  const pushToPostgreSQL = async (directData = null) => {
    const dataToSave = (directData && Array.isArray(directData)) ? directData : questions;
    if (dataToSave.length === 0) return;
    
    setStatus('Saving to DB...'); setStatusType('loading'); setIsLoading(true);
    try {
      for (const q of dataToSave) {
        const qSubject = q.subject || mainCategory;
        const qTopic = q.topic || subCategory;
        const qSubtopic = q.subtopic || chapter;
        const qChapterId = q.chapterId || qSubtopic.toLowerCase().replace(/\s+/g, '-');
        const qDifficulty = q.difficulty || difficulty;

        await axios.post('/api/questions', {
          subject: qSubject, topic: qTopic, subtopic: qSubtopic, chapterId: qChapterId, difficulty: qDifficulty,
          question: q.question, questionHindi: q.questionHindi || "", options: q.options, answer: q.answer,
          explanation: q.explanation || "", explanationHindi: q.explanationHindi || "", examReference: q.examReference || "Expected",
          geometryType: q.geometryType || null, geometryData: q.geometryData ? (typeof q.geometryData === 'string' ? q.geometryData : JSON.stringify(q.geometryData)) : null
        });
      }
      setStatus(`✅ Saved ${dataToSave.length} questions to DB!`); setStatusType('success'); 
      setQuestions([]); setSelectedForDelete([]); localStorage.removeItem('admin_draft_questions');
    } catch (err) { setStatus(`❌ Failed to save`); setStatusType('error'); } finally { setIsLoading(false); }
  };

  const handleDeleteQuestion = async (index) => {
    const q = questions[index];
    if (q.id) {
      if (window.confirm("⚠️ Delete permanently from DB?")) {
        try { await axios.delete(`/api/questions/${q.id}`); setQuestions(prev => prev.filter((_, i) => i !== index)); setSelectedForDelete(prev => prev.filter(i => i !== index)); setStatus('✅ Deleted from DB'); setStatusType('success');} 
        catch (err) { setStatus('❌ Failed to delete'); setStatusType('error'); }
      }
    } else { setQuestions(prev => prev.filter((_, i) => i !== index)); setSelectedForDelete(prev => prev.filter(i => i !== index)); }
  };

  const deleteSelected = async () => { 
    if (selectedForDelete.length === 0) return; 
    if (window.confirm(`⚠️ DANGER: In ${selectedForDelete.length} questions ko Database se hamesha ke liye delete karein?`)) { 
      setIsLoading(true); setStatus('Deleting selected questions from DB...'); setStatusType('loading');
      try {
        for (let i of selectedForDelete) {
          if (questions[i].id) { await axios.delete(`/api/questions/${questions[i].id}`); }
        }
        setQuestions(prev => prev.filter((_, i) => !selectedForDelete.includes(i))); setSelectedForDelete([]); 
        setStatus(`✅ Selected questions permanently deleted!`); setStatusType('success');
      } catch (err) { setStatus(`❌ Failed to delete`); setStatusType('error'); } finally { setIsLoading(false); }
    } 
  };


  // ==========================================
  // SECTION 4: JSON EXPORT & AUTO-SAVE IMPORT
  // ==========================================
  const downloadJson = () => {
    if (questions.length === 0) return;
    const chapterIdSlug = chapter.toLowerCase().replace(/\s+/g, '-');
    const dataToDownload = questions.map(q => ({
      subject: mainCategory, topic: subCategory, subtopic: chapter, chapterId: chapterIdSlug, difficulty: difficulty,
      question: q.question || "", questionHindi: q.questionHindi || "",
      options: q.options || ["", "", "", ""], answer: q.answer || "",
      explanation: q.explanation || "", explanationHindi: q.explanationHindi || "",
      examReference: q.examReference || "Expected", geometryType: q.geometryType || null, geometryData: q.geometryData || null
    }));

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToDownload, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${chapterIdSlug}_draft.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    setStatus(`✅ Downloaded ${dataToDownload.length} questions as JSON!`); setStatusType('success');
  };

  const handleBulkJsonUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          
          // 🔥 MAGIC: Auto-Fill Dropdowns 🔥
          const firstQ = parsedData[0];
          if (firstQ.subject) setMainCategory(firstQ.subject);
          if (firstQ.topic) setSubCategory(firstQ.topic);
          if (firstQ.subtopic) setChapter(firstQ.subtopic);
          if (firstQ.difficulty) setDifficulty(firstQ.difficulty);

          setQuestions(parsedData); setSelectedForDelete([]);
          setStatus(`✅ Successfully loaded ${parsedData.length} questions from JSON!`); setStatusType('success');
          
          // 🔥 AUTO-SAVE POPUP 🔥
          setTimeout(() => {
            if (window.confirm(`File Imported Successfully!\n\nDo you want to save these ${parsedData.length} questions directly to the Database?`)) {
              pushToPostgreSQL(parsedData);
            }
          }, 500);

        } else { setStatus('❌ Invalid JSON format or empty array.'); setStatusType('error'); }
      } catch (err) { setStatus('❌ Failed to parse JSON.'); setStatusType('error'); }
    };
    reader.readAsText(uploadedFile);
    if (bulkJsonRef.current) bulkJsonRef.current.value = '';
  };


  // ==========================================
  // SECTION 5: AI OPERATIONS (Generate & Translate)
  // ==========================================
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
        setStatus(`✅ Loaded ${formattedData.length} questions from local files!`); setStatusType('info');
      } else { setStatus(`No local JSON data found.`); setStatusType('error'); }
    } catch (e) { setStatus('Failed to load local data'); setStatusType('error'); }
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
        const page = await pdf.getPage(i); const textContent = await page.getTextContent(); text += textContent.items.map(s => s.str).join(' ') + '\n';
      }
      return { type: 'text', content: text };
    }
    throw new Error('Unsupported file type.');
  };

  const generateQuestions = async () => {
    if (!file || !chapter) { setStatus('Please select chapter and file.'); setStatusType('error'); return; }
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    if (!apiKey) { setStatus('API Key missing!'); setStatusType('error'); return; }
    
    setIsLoading(true); setStatus('Generating questions...'); setStatusType('loading');
    try {
      const fileData = await extractFileContent(file);
      const isAdvanced = mainCategory === 'Mathematics' || mainCategory === 'Reasoning';
      const isCurrentAffairs = mainCategory === 'Current Affairs'; 

      const systemPrompt = `You are an expert bilingual educator. Generate ${qCount} ${difficulty} MCQs for "${chapter}".\n${AI_STRICT_RULES.JSON_GENERATION}\n${AI_STRICT_RULES.TRANSLATION}\n- EXAM REF: ${isCurrentAffairs ? '"Recent"' : 'past exam name'}.\n- ${isAdvanced ? 'Use LaTeX wrapped in $ (inline) or $$ (block) for ALL math.' : 'No Math.'}`;

      let messages = [{ role: 'system', content: systemPrompt }];
      if (fileData.type === 'text') { messages.push({ role: 'user', content: `Source:\n\n${fileData.content.substring(0, 25000)}` }); } 
      else { messages.push({ role: 'user', content: [{ type: 'text', text: 'Image source.' }, { type: 'image_url', image_url: { url: fileData.content } }] }); }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: fileData.type === 'image' ? 'llama-3.2-11b-vision-preview' : 'llama-3.3-70b-versatile', messages, response_format: { type: 'json_object' }, temperature: 0.8 })
      });
      const result = await response.json();
      const jsonResponse = JSON.parse(result.choices[0].message.content);
      
      if (jsonResponse.questions) {
        const cleanedQuestions = jsonResponse.questions.map(q => ({
          ...q,
          question: cleanMarkdown(applyStrictMathFilter(q.question || "")),
          questionHindi: cleanMarkdown(applyStrictMathFilter(q.questionHindi || "")),
          explanation: cleanMarkdown(applyStrictMathFilter(q.explanation || "")),
          explanationHindi: cleanMarkdown(applyStrictMathFilter(q.explanationHindi || "")),
          options: q.options ? q.options.map(opt => cleanMarkdown(applyStrictMathFilter(opt))) : []
        }));
        setQuestions(prev => [...prev, ...cleanedQuestions]); setStatus(`${cleanedQuestions.length} questions generated!`); setStatusType('success'); 
      }
    } catch (error) { setStatus('Failed to generate.'); setStatusType('error'); } finally { setIsLoading(false); }
  };

  const autoTranslateAllToHindi = async () => {
    if (questions.length === 0) return;
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    if (!apiKey) return;
    if (!window.confirm("Translate all empty Hindi fields?")) return;

    setIsLoading(true);
    let updatedQs = [...questions];

    for (let i = 0; i < updatedQs.length; i++) {
      if (!updatedQs[i].questionHindi || updatedQs[i].questionHindi.trim() === "") {
        setStatus(`Translating ${i + 1} of ${updatedQs.length}...`); setStatusType('loading');
        try {
          const prompt = `Translate to pure Hindi.\n${AI_STRICT_RULES.TRANSLATION}\nQuestion: ${updatedQs[i].question}\nExplanation: ${updatedQs[i].explanation || "N/A"}\nReturn STRICTLY ONLY a JSON object: {"questionHindi": "...", "explanationHindi": "..."}`;
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' }, temperature: 0.3 })
          });
          const result = await response.json(); const parsed = JSON.parse(result.choices[0].message.content);
          updatedQs[i].questionHindi = cleanMarkdown(applyStrictMathFilter(parsed.questionHindi || "")); 
          const rawExpl = parsed.explanationHindi === "N/A" ? "" : (parsed.explanationHindi || "");
          updatedQs[i].explanationHindi = cleanMarkdown(applyStrictMathFilter(rawExpl));
          setQuestions([...updatedQs]); await new Promise(r => setTimeout(r, 3000)); 
        } catch (err) { console.error(`Failed Q${i+1}`, err); }
      }
    }
    setStatus(`✅ Translation Complete!`); setStatusType('success'); setIsLoading(false);
  };

  const translateSelectedToHindi = async () => {
    if (selectedForDelete.length === 0) return;
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    if (!apiKey) return;

    setIsLoading(true);
    let updatedQs = [...questions];
    let successCount = 0;

    for (let i of selectedForDelete) {
      setStatus(`Force Translating question ${i + 1}...`); setStatusType('loading');
      try {
        const prompt = `Translate to pure Hindi.\n${AI_STRICT_RULES.TRANSLATION}\nQuestion: ${updatedQs[i].question}\nExplanation: ${updatedQs[i].explanation || "N/A"}\nReturn STRICTLY ONLY a JSON object: {"questionHindi": "...", "explanationHindi": "..."}`;
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' }, temperature: 0.3 })
        });
        const result = await response.json(); const parsed = JSON.parse(result.choices[0].message.content);
        updatedQs[i].questionHindi = cleanMarkdown(applyStrictMathFilter(parsed.questionHindi || "")); 
        const rawExpl = parsed.explanationHindi === "N/A" ? "" : (parsed.explanationHindi || "");
        updatedQs[i].explanationHindi = cleanMarkdown(applyStrictMathFilter(rawExpl));
        setQuestions([...updatedQs]); successCount++; await new Promise(r => setTimeout(r, 3000)); 
      } catch (err) { console.error(err); }
    }
    setStatus(`✅ Translated ${successCount} questions!`); setStatusType('success'); 
    setIsLoading(false); setSelectedForDelete([]); 
  };

  const modifyQuestionWithAI = async (index) => {
    if (!editPromptText.trim()) return;
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    setIsEditingLoading(true); setStatus(`Modifying Question ${index + 1}...`); setStatusType('loading');
    try {
      const questionToEdit = questions[index];
      const systemPrompt = `Modify the JSON question strictly based on instruction.\n${AI_STRICT_RULES.MODIFICATION}`;
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST', headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: `Original JSON:\n${JSON.stringify(questionToEdit)}\n\nINSTRUCTION: ${editPromptText}` }],
          response_format: { type: 'json_object' }, temperature: 0.4
        })
      });
      const result = await response.json(); const modifiedQuestion = JSON.parse(result.choices[0].message.content);
      
      modifiedQuestion.question = cleanMarkdown(applyStrictMathFilter(modifiedQuestion.question || ""));
      modifiedQuestion.questionHindi = cleanMarkdown(applyStrictMathFilter(modifiedQuestion.questionHindi || ""));
      modifiedQuestion.explanation = cleanMarkdown(applyStrictMathFilter(modifiedQuestion.explanation || ""));
      modifiedQuestion.explanationHindi = cleanMarkdown(applyStrictMathFilter(modifiedQuestion.explanationHindi || ""));
      if (modifiedQuestion.options) { modifiedQuestion.options = modifiedQuestion.options.map(opt => cleanMarkdown(applyStrictMathFilter(opt))); }

      const updatedQuestions = [...questions];
      updatedQuestions[index] = { ...updatedQuestions[index], ...modifiedQuestion };
      setQuestions(updatedQuestions); setEditingIndex(null); setEditPromptText(''); setStatus(`✅ Modified successfully!`); setStatusType('success');
    } catch (error) { setStatus('Failed to modify.'); setStatusType('error'); } finally { setIsEditingLoading(false); }
  };

  // ==========================================
  // FINAL EXPORT
  // ==========================================
  return {
    mainSubjects, getCategories, getChapters, mainCategory, handleMainCategoryChange,
    subCategory, handleSubCategoryChange, chapter, setChapter, difficulty, setDifficulty,
    qCount, setQCount, isDragging, file, fileInputRef, bulkJsonRef,
    questions, status, statusType, isLoading, selectedForDelete, editingIndex,
    setEditingIndex, editPromptText, setEditPromptText, isEditingLoading,
    handleDragOver, handleDragLeave, handleDrop, handleFileSelect, removeFile,
    loadLocalJsonData, generateQuestions, autoTranslateAllToHindi, translateSelectedToHindi, modifyQuestionWithAI,
    handleQuestionChange, handleOptionChange, setCorrectAnswer, toggleSelect,
    handleSelectAll, deleteSelected, clearScreen, addNewQuestion, fetchFromDatabase,
    pushToPostgreSQL, handleDeleteQuestion, downloadJson, handleBulkJsonUpload
  };
}