// src/hooks/useQuizLogic.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { subjectsData } from '../data/syllabusData'; 

export default function useQuizLogic(type, testId) {
  const navigate = useNavigate();
  
  // 🔥 FETCH URL PARAMS FOR SMART CA SYSTEM
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isCA = searchParams.get('isCA') === 'true';
  const caType = searchParams.get('caType');
  const caValue = searchParams.get('caValue');
  const caRegion = searchParams.get('caRegion');
  const caTopic = searchParams.get('caTopic');

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // CA tests usually take less time, but we'll assign standard times for now
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
        setIsLoading(true);
        let finalShuffled = [];

        // 🚀 SMART CURRENT AFFAIRS ENGINE 🚀
        if (isCA) {
          let caUrl = `/api/ca/practice?region=${caRegion}&type=${caType}&value=${caValue}`;
          if (caTopic) caUrl += `&topic=${encodeURIComponent(caTopic)}`;
          
          const res = await axios.get(caUrl);
          if (res.data && res.data.length > 0) {
            finalShuffled = res.data;
            // Optionally shuffle CA questions
            finalShuffled.sort(() => 0.5 - Math.random());
          }
        } 
        // 📚 NORMAL SYLLABUS ENGINE 📚
        else {
          const res = await axios.get('/api/questions');
          if (res.data && res.data.length > 0) {
            
            let availableQs = res.data;

            if (!isFullMock && testId) {
              const lastDashIdx = testId.lastIndexOf('-');
              const subjectIdSlug = lastDashIdx !== -1 
                ? testId.substring(0, lastDashIdx).toLowerCase() 
                : testId.toLowerCase();
                
              const matchedSubject = subjectsData.find(s => s.id.toLowerCase() === subjectIdSlug);
              const actualSubjectTitle = matchedSubject ? matchedSubject.title.toLowerCase() : subjectIdSlug;

              availableQs = availableQs.filter(q => q.subject && q.subject.toLowerCase() === actualSubjectTitle);
            }

            const limit = isFullMock ? 150 : 50;

            // SMART PASSAGE GROUPING ALGORITHM
            const groupedBlocks = []; 
            const passageMap = {};
            
            availableQs.forEach(q => {
              const chap = q.subtopic || q.chapterId || 'misc';
              if (q.passage && q.passage.trim() !== '') {
                if (!passageMap[q.passage]) passageMap[q.passage] = { chapter: chap, questions: [] };
                passageMap[q.passage].questions.push(q);
              } else {
                groupedBlocks.push({ chapter: chap, questions: [q] });
              }
            });
            
            Object.values(passageMap).forEach(block => groupedBlocks.push(block));

            const blocksByChapter = {};
            groupedBlocks.forEach(block => {
              if (!blocksByChapter[block.chapter]) blocksByChapter[block.chapter] = [];
              blocksByChapter[block.chapter].push(block);
            });

            Object.keys(blocksByChapter).forEach(chap => {
              blocksByChapter[chap].sort(() => 0.5 - Math.random());
            });

            const selectedBlocks = [];
            let currentQCount = 0;
            const chapters = Object.keys(blocksByChapter);
            let currentChapIdx = 0;
            
            while (currentQCount < limit && chapters.length > 0) {
              const chapName = chapters[currentChapIdx];
              const chapArray = blocksByChapter[chapName];
              
              if (chapArray && chapArray.length > 0) {
                const blockToAdd = chapArray.pop();
                selectedBlocks.push(blockToAdd);
                currentQCount += blockToAdd.questions.length;
              } else {
                chapters.splice(currentChapIdx, 1);
                currentChapIdx--; 
              }
              
              currentChapIdx++;
              if (currentChapIdx >= chapters.length) {
                currentChapIdx = 0; 
              }
            }

            selectedBlocks.sort(() => 0.5 - Math.random());
            finalShuffled = selectedBlocks.flatMap(block => block.questions);
          }
        }

        setQuestions(finalShuffled);

      } catch (err) {
        console.error("Failed to fetch mock questions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRealQuestions();
  }, [type, testId, isFullMock, isCA, caType, caValue, caRegion, caTopic]);

  const totalQuestions = questions.length > 0 ? questions.length : (isCA ? 0 : (isFullMock ? 150 : 50));

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
        
        // 🔥 SMART RESULT SAVING FOR CA
        let saveSubject = 'Mock Test';
        let saveTopic = testId ? testId.toUpperCase() : (isFullMock ? 'FULL MOCK EXAM' : 'SECTIONAL MOCK');

        if (isCA) {
          saveSubject = 'Current Affairs';
          let label = caValue;
          if (caType === 'daily') label = `Daily CA (${caValue})`;
          if (caType === 'weekly') label = `Weekly CA (${caValue})`;
          if (caType === 'monthly') label = `Monthly CA (${caValue})`;
          if (caTopic) label = `${caTopic} (${caValue})`;
          
          saveTopic = `${caRegion} - ${label}`;
        }

        await axios.post('/api/results', {
          userId: userObj.id, 
          subject: saveSubject, 
          topic: saveTopic,
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
    currentQuestionData: questions[currentQ],
    testId
  };
}