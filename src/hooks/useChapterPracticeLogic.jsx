// src/hooks/useChapterPracticeLogic.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { applyStrictMathFilter, cleanMarkdown } from '../utils/textUtils';

const safeFormat = (text) => {
  if (!text) return "";
  return cleanMarkdown(applyStrictMathFilter(text));
};

// 🚀 SMART SHUFFLE FUNCTION 🚀
const smartShuffle = (questionsArray) => {
  const passageGroups = {};
  const standaloneQs = [];
  
  questionsArray.forEach(q => {
    if (q.passage && q.passage.trim() !== "") {
      if (!passageGroups[q.passage]) passageGroups[q.passage] = [];
      passageGroups[q.passage].push(q);
    } else {
      standaloneQs.push([q]); 
    }
  });

  const allBlocks = [...Object.values(passageGroups), ...standaloneQs];
  allBlocks.sort(() => 0.5 - Math.random());
  
  return allBlocks.flat();
};

// 💾 SessionStorage Helpers (Progress save karne ke liye)
const SESSION_KEY_PREFIX = 'practice_session_';
const getSessionKey = (topicId) => `${SESSION_KEY_PREFIX}${topicId}`;

const loadSessionState = (topicId) => {
  try {
    const saved = sessionStorage.getItem(getSessionKey(topicId));
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return null;
};

const saveSessionState = (topicId, state) => {
  try {
    sessionStorage.setItem(getSessionKey(topicId), JSON.stringify(state));
  } catch (e) { /* ignore */ }
};

const clearSessionState = (topicId) => {
  try {
    sessionStorage.removeItem(getSessionKey(topicId));
  } catch (e) { /* ignore */ }
};

export default function useChapterPracticeLogic() {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();

  const [allQuestions, setAllQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState({});
  const [visited, setVisited] = useState({ 0: true });

 // ── Smart Fetching Logic ──
 useEffect(() => {
  const fetchQuestionsFromDB = async () => {
    setIsLoadingQuestions(true);
    
    try {
      // 1. CACHE BUSTER ADDED: &t=${Date.now()}
      // Ye Hostinger/Vercel/Browser ko force karega ki wo hamesha fresh data laye, cache use na kare.
      const res = await axios.get(`/api/questions?chapterId=${topicId}&t=${Date.now()}`);
      let freshQuestions = [];
      
      if (res.data && res.data.length > 0) {
        freshQuestions = smartShuffle(res.data);
      }

      // 2. Ab check karo kya student ka koi aadhura progress (session) bacha hai?
      const savedSession = loadSessionState(topicId);

      // 3. SMART SYNC CHECK
      // Check karo ki kya DB ke questions aur Session ke questions barabar hain?
      const hasProgress = savedSession && savedSession.answers && Object.keys(savedSession.answers).length > 0;
      const isDbUnchanged = savedSession && savedSession.questions && savedSession.questions.length === freshQuestions.length;

      if (hasProgress && isDbUnchanged) {
        // Agar DB change nahi hua hai aur progress hai, toh wahi se resume karo
        setAllQuestions(savedSession.questions);
        setCurrentQ(savedSession.currentQ || 0);
        setAnswers(savedSession.answers || {});
        setReview(savedSession.review || {});
        setVisited(savedSession.visited || { 0: true });
        setShowResult(savedSession.showResult || false);
      } else {
        // Agar Admin ne questions ADD ya DELETE kiye hain, ya test ekdum naya hai
        // Toh purana session clear karke fresh questions load karo
        if (savedSession) {
           clearSessionState(topicId); 
        }
        setAllQuestions(freshQuestions);
        setCurrentQ(0);
        setAnswers({});
        setReview({});
        setVisited({ 0: true });
        setShowResult(false);
      }

    } catch (error) {
      console.error("Failed to fetch questions from DB:", error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  fetchQuestionsFromDB();
}, [subjectId, topicId]);

  // 💾 Har click par progress background me save hota rahega
  useEffect(() => {
    if (allQuestions.length > 0 && topicId) {
      saveSessionState(topicId, { questions: allQuestions, currentQ, answers, review, visited, showResult });
    }
  }, [currentQ, answers, review, visited, showResult, topicId]);

  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const explanationRef = useRef(null);

  const [hindiCache, setHindiCache] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [showHindi, setShowHindi] = useState(false);
  const hindiExplanation = hindiCache[currentQ] || null;

  const [qHindiCache, setQHindiCache] = useState({});
  const [isTranslatingQ, setIsTranslatingQ] = useState(false);
  const [showQHindi, setShowQHindi] = useState(false);
  const hindiQuestionText = qHindiCache[currentQ] || null;

  const currentQuestionData = allQuestions[currentQ] || null;
  const totalQuestions = allQuestions.length;

  // ── Core Actions ──
  const handleSelect = (idx) => {
    setAnswers(prev => ({ ...prev, [currentQ]: idx }));
    setTimeout(() => { explanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
  };
  
  const handleClear = () => { 
    const newAns = { ...answers }; 
    delete newAns[currentQ]; 
    setAnswers(newAns); 
  };
  
  const handleMarkReview = () => setReview(prev => ({ ...prev, [currentQ]: !prev[currentQ] }));
  
  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setVisited(prev => ({ ...prev, [currentQ - 1]: true }));
      setShowHindi(false); setShowQHindi(false);
    }
  };

  const handleNext = async () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1);
      setVisited(prev => ({ ...prev, [currentQ + 1]: true }));
      setShowHindi(false); setShowQHindi(false);
    } else {
      let correct = 0;
      Object.entries(answers).forEach(([idx, opt]) => {
        if (allQuestions[idx] && allQuestions[idx].options[opt] === allQuestions[idx].answer) correct++;
      });
      setShowResult(true);
      
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          await axios.post('/api/results', {
            userId: JSON.parse(userStr).id,
            subject: subjectId,
            topic: topicId,
            score: correct,
            total: totalQuestions
          });
        } catch (err) { console.error(err); }
      }
    }
  };

  const jumpTo = (index) => {
    setCurrentQ(index);
    setVisited(prev => ({ ...prev, [index]: true }));
    setIsMobilePaletteOpen(false);
    setShowHindi(false); setShowQHindi(false);
  };

  const handleViewInHindi = () => {
    if (showHindi) { setShowHindi(false); return; }
    if (currentQuestionData?.explanationHindi) {
      setHindiCache(prev => ({ ...prev, [currentQ]: safeFormat(currentQuestionData.explanationHindi) }));
      setShowHindi(true);
    }
  };

  const handleTranslateQuestion = () => {
    if (showQHindi) { setShowQHindi(false); return; }
    if (currentQuestionData?.questionHindi) {
      setQHindiCache(prev => ({ ...prev, [currentQ]: currentQuestionData.questionHindi }));
      setShowQHindi(true);
    }
  };

  const handleRetake = () => {
    // 🚀 Smooth Retake: Bina page refresh kiye test reset hoga
    clearSessionState(topicId);
    
    // Naya shuffle karke states ko zero par set kar do
    const reshuffled = smartShuffle([...allQuestions]);
    setAllQuestions(reshuffled);
    setCurrentQ(0);
    setAnswers({});
    setReview({});
    setVisited({ 0: true });
    setShowResult(false);
    setHindiCache({});
    setShowHindi(false);
    setQHindiCache({});
    setShowQHindi(false);
  };

  // 🔥 NAYA LOGIC: Browser ke Back button ya Exit button par session clear karna
  const handleExit = () => {
    clearSessionState(topicId); // Pehle session clear karo
    navigate(-1); // Phir bahar niklo
  };

  // 🔥 Agar user browser ka Back (<-) arrow use kare
  useEffect(() => {
    const handlePopState = () => {
      clearSessionState(topicId);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [topicId]);

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
  const isAdmin = userObj && (userObj.role === 'admin' || userObj.email === 'admin@prepiq.com');

  return {
    navigate, subjectId, topicId, allQuestions, isLoadingQuestions, showResult, totalQuestions, isAdmin,
    currentQ, answers, review, visited, isMobilePaletteOpen, setIsMobilePaletteOpen,
    explanationRef, isTranslating, showHindi, hindiExplanation, isTranslatingQ, showQHindi,
    hindiQuestionText, currentQuestionData, correctCount, wrongCount, skippedCount, isAnswered,
    handleSelect, handleClear, handleMarkReview, handlePrev, handleNext, jumpTo,
    handleViewInHindi, handleTranslateQuestion, handleRetake,
    handleExit // 🔥 YE NAYA FUNCTION EXPORT KIYA HAI
  };
}