// src/hooks/admin/useAdminQuestions.js
// Screen par questions ki state, aur DB ke saath interaction
import { useState, useEffect } from 'react';
import axios from 'axios';

const DRAFT_KEY = 'admin_draft_questions';
const EMPTY_QUESTION = {
  passage: '', passageHindi: '', question: '', questionHindi: '',
  options: ['', '', '', ''], answer: '', explanation: '', explanationHindi: '',
  examReference: 'Expected', geometryType: null, geometryData: null,
};

export default function useAdminQuestions({ mainCategory, subCategory, chapter, difficulty, getTrueChapterId, setStatus, setStatusType, setIsLoading }) {
  const [questions, setQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (_) { return []; }
  });
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [editingIndex,      setEditingIndex]      = useState(null);
  const [editPromptText,    setEditPromptText]     = useState('');
  const [isEditingLoading,  setIsEditingLoading]   = useState(false);

  // Draft localStorage mein save karo
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(questions));
  }, [questions]);

  // ── Inline editing ──
  const handleQuestionChange = (index, field, value) => {
    setQuestions(prev => { const q = [...prev]; q[index] = { ...q[index], [field]: value }; return q; });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setQuestions(prev => {
      const q = [...prev];
      const oldVal = q[qIndex].options[optIndex];
      q[qIndex] = { ...q[qIndex], options: [...q[qIndex].options] };
      q[qIndex].options[optIndex] = value;
      if (q[qIndex].answer === oldVal) q[qIndex].answer = value;
      return q;
    });
  };

  const setCorrectAnswer = (qIndex, optValue) => {
    setQuestions(prev => { const q = [...prev]; q[qIndex] = { ...q[qIndex], answer: optValue }; return q; });
  };

  const toggleSelect    = (i)  => setSelectedForDelete(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  const handleSelectAll = (e)  => setSelectedForDelete(e.target.checked ? questions.map((_, i) => i) : []);
  const addNewQuestion  = ()   => setQuestions(prev => [...prev, { ...EMPTY_QUESTION }]);

  const clearScreen = () => {
    if (questions.length > 0 && window.confirm('Clear screen? (Database se delete nahi hoga)')) {
      setQuestions([]); setSelectedForDelete([]);
      localStorage.removeItem(DRAFT_KEY);
    }
  };

  // ── DB Operations ──
  const fetchFromDatabase = async () => {
    setStatus('Fetching questions...'); setStatusType('loading'); setIsLoading(true);
    try {
      const res = await axios.get(`/api/questions?chapter=${encodeURIComponent(chapter)}`);
      if (res.data?.length > 0) {
        setQuestions(res.data); setSelectedForDelete([]);
        setStatus(`✅ Loaded ${res.data.length} questions from DB.`); setStatusType('success');
      } else {
        setQuestions([]); setStatus('No questions found in DB.'); setStatusType('info');
      }
    } catch (_) { setStatus('Failed to fetch from DB.'); setStatusType('error'); }
    finally { setIsLoading(false); }
  };

  const pushToPostgreSQL = async (directData = null) => {
    const data = Array.isArray(directData) ? directData : questions;
    if (data.length === 0) return;

    setStatus('Saving to DB...'); setStatusType('loading'); setIsLoading(true);
    try {
      for (const q of data) {
        await axios.post('/api/questions', {
          subject:    q.subject    || mainCategory,
          topic:      q.topic      || subCategory,
          subtopic:   q.subtopic   || chapter,
          chapterId:  q.chapterId  || getTrueChapterId(q.subtopic || chapter),
          difficulty: q.difficulty || difficulty,
          passage:    q.passage    || null,
          passageHindi: q.passageHindi || null,
          question:   q.question,
          questionHindi: q.questionHindi || '',
          options:    q.options,
          answer:     q.answer,
          explanation:     q.explanation     || '',
          explanationHindi: q.explanationHindi || '',
          examReference: q.examReference || 'Expected',
          geometryType: q.geometryType || null,
          geometryData: q.geometryData ? (typeof q.geometryData === 'string' ? q.geometryData : JSON.stringify(q.geometryData)) : null,
        });
      }
      setStatus(`✅ Saved ${data.length} questions to DB!`); setStatusType('success');
      setQuestions([]); setSelectedForDelete([]);
      localStorage.removeItem(DRAFT_KEY);
    } catch (_) { setStatus('❌ Failed to save.'); setStatusType('error'); }
    finally { setIsLoading(false); }
  };

  const handleDeleteQuestion = async (index) => {
    const q = questions[index];
    if (q.id) {
      if (!window.confirm('⚠️ Delete permanently from DB?')) return;
      try {
        await axios.delete(`/api/questions/${q.id}`);
        setStatus('✅ Deleted from DB.'); setStatusType('success');
      } catch (_) { setStatus('❌ Failed to delete.'); setStatusType('error'); return; }
    }
    setQuestions(prev => prev.filter((_, i) => i !== index));
    setSelectedForDelete(prev => prev.filter(i => i !== index));
  };

  const deleteSelected = async () => {
    if (selectedForDelete.length === 0) return;
    if (!window.confirm(`⚠️ DANGER: ${selectedForDelete.length} questions ko Database se delete karein?`)) return;

    setIsLoading(true); setStatus('Deleting...'); setStatusType('loading');
    try {
      for (const i of selectedForDelete) {
        if (questions[i]?.id) await axios.delete(`/api/questions/${questions[i].id}`);
      }
      setQuestions(prev => prev.filter((_, i) => !selectedForDelete.includes(i)));
      setSelectedForDelete([]);
      setStatus('✅ Selected questions deleted!'); setStatusType('success');
    } catch (_) { setStatus('❌ Failed to delete.'); setStatusType('error'); }
    finally { setIsLoading(false); }
  };

  return {
    questions, setQuestions, selectedForDelete, setSelectedForDelete,
    editingIndex, setEditingIndex, editPromptText, setEditPromptText, isEditingLoading, setIsEditingLoading,
    handleQuestionChange, handleOptionChange, setCorrectAnswer,
    toggleSelect, handleSelectAll, addNewQuestion, clearScreen,
    fetchFromDatabase, pushToPostgreSQL, handleDeleteQuestion, deleteSelected,
  };
}