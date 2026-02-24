// src/hooks/useChapterPracticeLogic.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { applyStrictMathFilter, cleanMarkdown } from '../utils/textUtils';

const safeFormat = (text) => {
  if (!text) return "";
  return cleanMarkdown(applyStrictMathFilter(text));
};

// 🚀 NAYA SMART SHUFFLE FUNCTION (Passage questions ko ek saath group rakhega) 🚀
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

  // Har ek group (block) ko mix karega
  const allBlocks = [...Object.values(passageGroups), ...standaloneQs];
  allBlocks.sort(() => 0.5 - Math.random());
  
  // Wapas unko seedhi line mein laga dega
  return allBlocks.flat();
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
          // 🚀 Yahan hum apna naya smart shuffle use karenge
          setAllQuestions(smartShuffle(res.data));
        } else {
          setAllQuestions([]);
        }
      } catch (error) {
        console.error("Failed to fetch questions from DB:", error);
      } finally {
        setCurrentQ(0); setAnswers({}); setReview({}); setVisited({ 0: true });
        setHindiCache({}); setShowHindi(false); setQHindiCache({}); setShowQHindi(false);
        setShowResult(false); setIsLoadingQuestions(false);
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

  // ── Core Actions ──
  const handleSelect = (idx) => {
    setAnswers(prev => ({ ...prev, [currentQ]: idx }));
    setTimeout(() => { explanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
  };
  const handleClear = () => { const newAns = { ...answers }; delete newAns[currentQ]; setAnswers(newAns); };
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
    // 🚀 Retake me bhi naya group-based shuffle
    setAllQuestions(smartShuffle([...allQuestions]));
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
  const isAdmin = userObj && (userObj.role === 'admin' || userObj.email === 'admin@prepiq.com');

  return {
    navigate, subjectId, topicId, allQuestions, isLoadingQuestions, showResult, totalQuestions, isAdmin,
    currentQ, answers, review, visited, isMobilePaletteOpen, setIsMobilePaletteOpen,
    explanationRef, isTranslating, showHindi, hindiExplanation, isTranslatingQ, showQHindi,
    hindiQuestionText, currentQuestionData, correctCount, wrongCount, skippedCount, isAnswered,
    handleSelect, handleClear, handleMarkReview, handlePrev, handleNext, jumpTo,
    handleViewInHindi, handleTranslateQuestion, handleRetake
  };
}