// src/hooks/admin/useAdminFileHandling.js
import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { getQuestionsByTitle } from '../../data/questionsLoader';
import { getTrueChapterId } from './useAdminConfig.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// 🔥 ADDED: setMainCategory, setSubCategory, setChapter in arguments
export default function useAdminFileHandling({ 
  chapter, mainCategory, subCategory, difficulty, 
  setMainCategory, setSubCategory, setChapter, 
  setQuestions, setSelectedForDelete, setStatus, setStatusType, pushToPostgreSQL 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [file,       setFile]       = useState(null);
  const fileInputRef = useRef(null);
  const bulkJsonRef  = useRef(null);

  // ── Drag & Drop ──
  const handleDragOver   = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave  = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop       = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]); };
  const handleFileSelect = (e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); };
  const removeFile       = ()  => setFile(null);

  // ── PDF / Image extract ──
  const extractFileContent = async (uploadedFile) => {
    if (uploadedFile.type.includes('image')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ type: 'image', content: reader.result });
        reader.readAsDataURL(uploadedFile);
      });
    }
    if (uploadedFile.type === 'application/pdf') {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page    = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(s => s.str).join(' ') + '\n';
      }
      return { type: 'text', content: text };
    }
    throw new Error('Unsupported file type.');
  };

  // ── Load from local JSON files ──
  const loadLocalJsonData = () => {
    setStatus('Loading local JSON data...'); setStatusType('loading');
    try {
      const loaded = getQuestionsByTitle(chapter);
      if (loaded?.length > 0) {
        const formatted = loaded.map(q => ({
          ...q,
          questionHindi: '', explanationHindi: '',
          examReference: q.examReference || 'Expected',
          passage: q.passage || null, passageHindi: q.passageHindi || null,
          geometryType: q.geometryType || null, geometryData: q.geometryData || null,
        }));
        setQuestions(formatted); setSelectedForDelete([]);
        setStatus(`✅ Loaded ${formatted.length} questions from local files!`); setStatusType('info');
      } else {
        setStatus('No local JSON data found.'); setStatusType('error');
      }
    } catch (_) { setStatus('Failed to load local data.'); setStatusType('error'); }
  };

  // ── Bulk JSON upload ──
  const handleBulkJsonUpload = (e) => {
    const uploaded = e.target.files[0];
    if (!uploaded) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          
          // 🔥 AUTO-SELECT LOGIC START 🔥
          // Pehle question se details extract karke dropdowns ko update karenge
          const firstQ = parsed[0];
          if (firstQ.subject && setMainCategory) setMainCategory(firstQ.subject);
          if (firstQ.topic && setSubCategory) setSubCategory(firstQ.topic);
          if (firstQ.subtopic && setChapter) setChapter(firstQ.subtopic);
          // 🔥 AUTO-SELECT LOGIC END 🔥

          setQuestions(parsed); setSelectedForDelete([]);
          setStatus(`✅ Loaded ${parsed.length} questions from JSON!`); setStatusType('success');
          
          setTimeout(() => {
            if (window.confirm(`File Imported!\n\nSave these ${parsed.length} questions to DB?`)) {
              pushToPostgreSQL(parsed);
            }
          }, 500);
        } else {
          setStatus('❌ Invalid JSON format or empty array.'); setStatusType('error');
        }
      } catch (_) { setStatus('❌ Failed to parse JSON.'); setStatusType('error'); }
    };
    reader.readAsText(uploaded);
    if (bulkJsonRef.current) bulkJsonRef.current.value = '';
  };

  // ── JSON download / template generate ──
  const downloadJson = (questions) => {
    const safeChapter    = chapter || 'export_data';
    const chapterIdSlug  = getTrueChapterId(safeChapter);
    const isComprehension = safeChapter.toLowerCase().includes('passage') || safeChapter.toLowerCase().includes('comprehension');

    let dataToDownload;

    if (questions.length === 0) {
      const count        = isComprehension ? 4 : 1;
      const sharedPassage = isComprehension
        ? 'Read the following passage carefully...\n\n[Your passage here]'
        : 'Enter paragraph here (Optional)';
      const sharedPassageHindi = isComprehension
        ? 'निम्नलिखित गद्यांश को ध्यानपूर्वक पढ़ें...\n\n[आपका गद्यांश यहाँ]'
        : 'पैसेज यहाँ दर्ज करें (वैकल्पिक)';

      dataToDownload = Array.from({ length: count }, (_, i) => ({
        subject: mainCategory, topic: subCategory, subtopic: safeChapter,
        chapterId: chapterIdSlug, difficulty,
        passage: sharedPassage, passageHindi: sharedPassageHindi,
        question: isComprehension ? `Question ${i + 1} based on passage? (Replace)` : 'Sample Question? (Replace)',
        questionHindi: isComprehension ? `गद्यांश पर प्रश्न ${i + 1}? (बदलें)` : 'नमूना प्रश्न? (बदलें)',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'Option A', explanation: 'Explanation here', explanationHindi: 'व्याख्या यहाँ',
        examReference: 'Expected', geometryType: null, geometryData: null,
      }));
      setStatus(`✅ Downloaded ${isComprehension ? 'Passage Template' : 'Blank Template'}!`); setStatusType('success');
    } else {
      dataToDownload = questions.map(q => ({
        subject: mainCategory, topic: subCategory, subtopic: safeChapter, chapterId: chapterIdSlug, difficulty,
        passage: q.passage || null, passageHindi: q.passageHindi || null,
        question: q.question || '', questionHindi: q.questionHindi || '',
        options: q.options || ['', '', '', ''], answer: q.answer || '',
        explanation: q.explanation || '', explanationHindi: q.explanationHindi || '',
        examReference: q.examReference || 'Expected', geometryType: q.geometryType || null, geometryData: q.geometryData || null,
      }));
      setStatus(`✅ Downloaded ${dataToDownload.length} questions!`); setStatusType('success');
    }

    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${chapterIdSlug}_draft.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  return {
    isDragging, file, fileInputRef, bulkJsonRef,
    handleDragOver, handleDragLeave, handleDrop, handleFileSelect, removeFile,
    extractFileContent, loadLocalJsonData, handleBulkJsonUpload, downloadJson,
  };
}