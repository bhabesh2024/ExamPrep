// src/hooks/useChapterPracticeLogic.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { fetchAiResponse, applyStrictMathFilter, cleanMarkdown} from '../services/aiService';
import { AI_STRICT_RULES } from '../config/aiPrompts';

const safeFormat = (text) => {
  if (!text) return "";
  return cleanMarkdown(applyStrictMathFilter(text));
};

export default function useChapterPracticeLogic() {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();

  const [allQuestions, setAllQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [showResult, setShowResult] = useState(false);

  // ── Database Fetching ──
  useEffect(() => {
    const fetchQuestionsFromDB = async () => {
      setIsLoadingQuestions(true);
      try {
        const res = await axios.get(`/api/questions?chapterId=${topicId}`);
        if (res.data && res.data.length > 0) {
          setAllQuestions(res.data.sort(() => 0.5 - Math.random()));
        } else {
          setAllQuestions([]);
        }
      } catch (error) {
        console.error("Failed to fetch questions from DB:", error);
      } finally {
        setCurrentQ(0); setAnswers({}); setReview({}); setVisited({ 0: true });
        setHindiCache({}); setShowHindi(false); setQHindiCache({}); setShowQHindi(false);
        setShowResult(false); setChatHistory([{ role: 'ai', text: `Hi! I am your PrepIQ AI Tutor. Let's master this chapter together! 🚀` }]);
        setIsAiChatOpen(false); setIsLoadingQuestions(false);
      }
    };
    fetchQuestionsFromDB();
  }, [subjectId, topicId]);

  const totalQuestions = allQuestions.length;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState({});
  const [visited, setVisited] = useState({ 0: true });

  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const messagesEndRef = useRef(null);
  const explanationRef = useRef(null);

  // ── Translation Caches ──
  const [hindiCache, setHindiCache] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [showHindi, setShowHindi] = useState(false);
  const hindiExplanation = hindiCache[currentQ] || null;

  const [qHindiCache, setQHindiCache] = useState({});
  const [isTranslatingQ, setIsTranslatingQ] = useState(false);
  const [showQHindi, setShowQHindi] = useState(false);
  const hindiQuestionText = qHindiCache[currentQ] || null;

  const currentQuestionData = allQuestions[currentQ] || null;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, isAiChatOpen]);

  // ── Core Actions ──
  const handleSelect = (idx) => {
    setAnswers(prev => ({ ...prev, [currentQ]: idx }));
    setTimeout(() => { explanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
  };
  const handleClear = () => { const newAns = { ...answers }; delete newAns[currentQ]; setAnswers(newAns); };
  const handleMarkReview = () => setReview(prev => ({ ...prev, [currentQ]: !prev[currentQ] }));
  const handlePrev = () => { if (currentQ > 0) { setCurrentQ(currentQ - 1); setVisited(prev => ({ ...prev, [currentQ - 1]: true })); setShowHindi(false); setShowQHindi(false); } };
  
  const handleNext = async () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1); setVisited(prev => ({ ...prev, [currentQ + 1]: true })); setShowHindi(false); setShowQHindi(false);
    } else {
      let correct = 0;
      Object.entries(answers).forEach(([idx, opt]) => { if (allQuestions[idx] && allQuestions[idx].options[opt] === allQuestions[idx].answer) correct++; });
      setShowResult(true);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try { await axios.post('/api/results', { userId: JSON.parse(userStr).id, subject: subjectId, topic: topicId, score: correct, total: totalQuestions }); } catch (err) { console.error(err); }
      }
    }
  };
  const jumpTo = (index) => { setCurrentQ(index); setVisited(prev => ({ ...prev, [index]: true })); setIsMobilePaletteOpen(false); setShowHindi(false); setShowQHindi(false); };

  // ── AI Translations ──
  const handleViewInHindi = async () => {
    if (showHindi) { setShowHindi(false); return; }
    if (currentQuestionData?.explanationHindi) { 
      setHindiCache(prev => ({ ...prev, [currentQ]: safeFormat(currentQuestionData.explanationHindi) })); 
      setShowHindi(true); 
      return; 
    }
    if (currentQuestionData?.explanationHindi) { setHindiCache(prev => ({ ...prev, [currentQ]: currentQuestionData.explanationHindi })); setShowHindi(true); return; }
    if (hindiCache[currentQ]) { setShowHindi(true); return; }
    if (!currentQuestionData || !currentQuestionData.explanation) return;
    
    setIsTranslating(true);
    const prompt = `Translate this explanation to Hindi. \n${AI_STRICT_RULES.TRANSLATION}\nExplanation to translate:\n${currentQuestionData.explanation}`;
    const result = await fetchAiResponse(prompt, 'Translate to Hindi');
    setHindiCache(prev => ({ ...prev, [currentQ]: result })); setShowHindi(true); setIsTranslating(false);
  };

  const handleTranslateQuestion = async () => {
    if (showQHindi) { setShowQHindi(false); return; }
    if (currentQuestionData?.questionHindi) { setQHindiCache(prev => ({ ...prev, [currentQ]: currentQuestionData.questionHindi })); setShowQHindi(true); return; }
    if (qHindiCache[currentQ]) { setShowQHindi(true); return; }
    if (!currentQuestionData) return;
    
    setIsTranslatingQ(true);
    const prompt = `Translate this multiple choice question to Hindi. \n${AI_STRICT_RULES.TRANSLATION}\nQuestion to translate:\n${currentQuestionData.question}`;
    const result = await fetchAiResponse(prompt, 'Translate Question to Hindi');
    setQHindiCache(prev => ({ ...prev, [currentQ]: result })); setShowQHindi(true); setIsTranslatingQ(false);
  };

  // ── AI Chat ──
  const openAiChatForQuestion = async () => {
    if (isAiChatOpen) { setIsAiChatOpen(false); return; }
    setIsAiChatOpen(true);
    if (!currentQuestionData || chatHistory.some(m => m._qIndex === currentQ)) return;
    setChatHistory(prev => [...prev, { role: 'ai', text: '🤔 Analyzing your question...', _qIndex: currentQ }]);
    const isCorrect = answers[currentQ] !== undefined && currentQuestionData.options[answers[currentQ]] === currentQuestionData.answer;
    const aiResponse = await fetchAiResponse(`You are PrepIQ AI Tutor... Question: ${currentQuestionData.question}... Status: ${answers[currentQ] !== undefined ? (isCorrect?'Correct':'Wrong') : 'Unanswered'}. Give 3 short suggested questions.`, `Topic: ${topicId}`);
    setChatHistory(prev => [...prev.filter(m => m.text !== '🤔 Analyzing your question...'), { role: 'ai', text: aiResponse, _qIndex: currentQ }]);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault(); if (!chatInput.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', text: chatInput }, { role: 'ai', text: "Thinking... 🤔" }]);
    const msg = chatInput; setChatInput("");
    const aiResponseText = await fetchAiResponse(msg, currentQuestionData ? `Context: ${currentQuestionData.question}` : `Topic: ${topicId}`);
    setChatHistory(prev => [...prev.slice(0, prev.length - 1), { role: 'ai', text: aiResponseText }]);
  };

  const handleRetake = () => {
    setAllQuestions([...allQuestions].sort(() => 0.5 - Math.random()));
    setCurrentQ(0); setAnswers({}); setReview({}); setVisited({ 0: true }); setShowResult(false);
    setHindiCache({}); setShowHindi(false); setQHindiCache({}); setShowQHindi(false);
  };

  // ── Computations ──
  let correctCount = 0, wrongCount = 0;
  if (showResult) {
    Object.entries(answers).forEach(([idx, opt]) => { 
      if (allQuestions[idx] && allQuestions[idx].options[opt] === allQuestions[idx].answer) correctCount++; 
      else wrongCount++; 
    });
  }

  const isAnswered = answers[currentQ] !== undefined;
  const skippedCount = totalQuestions - Object.keys(answers).length;
  const userStr = localStorage.getItem('user');
  const userObj = userStr ? JSON.parse(userStr) : null;
  // Agar aapke DB me role 'admin' hai, ya email aapki admin wali hai, toh us hisaab se condition lagayein.
  // Example: userObj?.role === 'admin' ya email match
  const isAdmin = userObj && (userObj.role === 'admin' || userObj.email === 'admin@prepiq.com');

  return {
    navigate, topicId, allQuestions, isLoadingQuestions, showResult, totalQuestions, isAdmin,
    currentQ, answers, review, visited, isMobilePaletteOpen, setIsMobilePaletteOpen,
    isAiChatOpen, setIsAiChatOpen, chatInput, setChatInput, chatHistory, messagesEndRef,
    explanationRef, isTranslating, showHindi, hindiExplanation, isTranslatingQ, showQHindi,
    hindiQuestionText, currentQuestionData, correctCount, wrongCount, skippedCount, isAnswered,
    handleSelect, handleClear, handleMarkReview, handlePrev, handleNext, jumpTo,
    handleViewInHindi, handleTranslateQuestion, openAiChatForQuestion, handleChatSubmit, handleRetake
  };
}