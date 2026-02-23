// src/hooks/useQuizLogic.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// 🔥 Syllabus data import kiya taaki Asli naam mil sake
import { subjectsData } from '../data/syllabusData'; 

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
          
          let availableQs = res.data;

          if (!isFullMock && testId) {
            const lastDashIdx = testId.lastIndexOf('-');
            const subjectIdSlug = lastDashIdx !== -1 
              ? testId.substring(0, lastDashIdx).toLowerCase() 
              : testId.toLowerCase();
              
            // 🔥 BUG FIX: URL ID se Asli Title ("Mathematics") nikalenge
            const matchedSubject = subjectsData.find(s => s.id.toLowerCase() === subjectIdSlug);
            const actualSubjectTitle = matchedSubject ? matchedSubject.title.toLowerCase() : subjectIdSlug;

            availableQs = availableQs.filter(q => q.subject.toLowerCase() === actualSubjectTitle);
          }

          const limit = isFullMock ? 150 : 50;

          // ROUND-ROBIN SMART ALGORITHM
          const questionsByChapter = {};
          availableQs.forEach(q => {
            const chap = q.subtopic || q.chapterId || 'misc';
            if (!questionsByChapter[chap]) questionsByChapter[chap] = [];
            questionsByChapter[chap].push(q);
          });

          Object.keys(questionsByChapter).forEach(chap => {
            questionsByChapter[chap].sort(() => 0.5 - Math.random());
          });

          const selectedQuestions = [];
          const chapters = Object.keys(questionsByChapter);
          let currentChapIdx = 0;
          
          while (selectedQuestions.length < limit && chapters.length > 0) {
            const chapName = chapters[currentChapIdx];
            const chapArray = questionsByChapter[chapName];
            
            if (chapArray && chapArray.length > 0) {
              selectedQuestions.push(chapArray.pop());
            } else {
              chapters.splice(currentChapIdx, 1);
              currentChapIdx--; 
            }
            
            currentChapIdx++;
            if (currentChapIdx >= chapters.length) {
              currentChapIdx = 0; 
            }
          }

          const finalShuffled = selectedQuestions.sort(() => 0.5 - Math.random());
          setQuestions(finalShuffled);
        }
      } catch (err) {
        console.error("Failed to fetch mock questions:", err);
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
          userId: userObj.id, 
          subject: 'Mock Test', 
          topic: testId ? testId.toUpperCase() : (isFullMock ? 'FULL MOCK EXAM' : 'SECTIONAL MOCK'),
          score: correct, 
          total: totalQuestions
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