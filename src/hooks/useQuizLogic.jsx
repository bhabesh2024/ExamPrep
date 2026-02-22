// src/hooks/useQuizLogic.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function useQuizLogic(type, testId) {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isFullMock = type === 'full';
  const initialTime = isFullMock ? 180 * 60 : 60 * 60; 

  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState({});
  const [visited, setVisited] = useState({ 0: true });
  
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState({ correct: 0, wrong: 0, skipped: 0 });

  useEffect(() => {
    const fetchRealQuestions = async () => {
      try {
        const res = await axios.get('/api/questions');
        if (res.data && res.data.length > 0) {
          const shuffled = res.data.sort(() => 0.5 - Math.random());
          const limit = isFullMock ? 150 : 50;
          setQuestions(shuffled.slice(0, limit));
        }
      } catch (err) {
        console.error("Failed to fetch real questions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealQuestions();
  }, [type, testId, isFullMock]);

  const totalQuestions = questions.length > 0 ? questions.length : (isFullMock ? 150 : 50);

  useEffect(() => {
    if (isPaused || showResult || isLoading || questions.length === 0) return;
    if (timeLeft <= 0) {
      handleFinishTest();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaused, showResult, isLoading, questions.length]);

  const handleSelect = (idx) => setAnswers(prev => ({ ...prev, [currentQ]: idx }));
  const handleClear = () => { const newAnswers = { ...answers }; delete newAnswers[currentQ]; setAnswers(newAnswers); };
  const handleMarkReview = () => setReview(prev => ({ ...prev, [currentQ]: !prev[currentQ] }));
  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(currentQ + 1); setVisited(prev => ({ ...prev, [currentQ + 1]: true }));
    }
  };
  const jumpTo = (index) => { setCurrentQ(index); setVisited(prev => ({ ...prev, [index]: true })); };

  const handleFinishTest = async () => {
    setIsPaused(true); 
    let correct = 0, wrong = 0;
    
    Object.entries(answers).forEach(([qIndexStr, selectedOptionIdx]) => {
      const qIndex = parseInt(qIndexStr);
      const q = questions[qIndex];
      if (q && q.options[selectedOptionIdx] === q.answer) correct++; else wrong++;
    });
    
    const skipped = totalQuestions - (correct + wrong);
    setFinalScore({ correct, wrong, skipped });
    setShowResult(true);

    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        await axios.post('/api/results', {
          userId: userObj.id, subject: 'Mock Test', topic: testId || (isFullMock ? 'Full Mock Exam' : 'Sectional Mock Exam'),
          score: correct, total: totalQuestions
        });
      } catch (err) { console.error("⚠️ Failed to save mock score:", err); }
    }
  };

  return {
    navigate, questions, isLoading, isFullMock, currentQ, setCurrentQ, timeLeft, setTimeLeft,
    isPaused, setIsPaused, answers, review, visited, showResult, finalScore, totalQuestions,
    handleSelect, handleClear, handleMarkReview, handleNext, jumpTo, handleFinishTest,
    currentQuestionData: questions[currentQ]
  };
}