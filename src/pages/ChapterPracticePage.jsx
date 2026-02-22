import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // 👈 NAYA IMPORT DATABASE CALL KE LIYE
import { 
  GraduationCap, ListOrdered, Bookmark, CheckCircle2, ArrowRight, 
  X, Sparkles, Bot, Send, ArrowLeft, Lightbulb, Languages, 
  AlertCircle, Trophy, RotateCcw 
} from 'lucide-react';
import { fetchAiResponse } from '../services/aiService';
import { getQuestions } from '../data/questionsLoader';

import MathText from '../components/common/MathText';
import GeometryVisualizer from '../components/common/GeometryVisualizer';

export default function ChapterPracticePage() {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();

  const [allQuestions, setAllQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setIsLoadingQuestions(true);
    const loaded = getQuestions(subjectId, topicId);
    setAllQuestions(loaded);
    setCurrentQ(0);
    setAnswers({});
    setReview({});
    setVisited({ 0: true });
    setHindiCache({});
    setShowHindi(false);
    setQHindiCache({});
    setShowQHindi(false);
    setShowResult(false);
    setChatHistory([{ role: 'ai', text: `Hi! I am your PrepIQ AI Tutor. Let's master this chapter together! 🚀` }]);
    setIsAiChatOpen(false);
    setIsLoadingQuestions(false);
  }, [subjectId, topicId]);

  const totalQuestions = allQuestions.length;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState({});
  const [visited, setVisited] = useState({ 0: true });

  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: `Hi! I am your PrepIQ AI Tutor. Let's master this chapter together! 🚀` }
  ]);

  const messagesEndRef = useRef(null);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isAiChatOpen]);

  const openAiChatForQuestion = async () => {
    if (isAiChatOpen) {
      setIsAiChatOpen(false);
      return;
    }
    setIsAiChatOpen(true);
    if (!currentQuestionData) return;

    const isAlreadyContextSet = chatHistory.some(m => m._qIndex === currentQ);
    if (isAlreadyContextSet) return;

    const userAnswered = answers[currentQ] !== undefined;
    const selectedOption = userAnswered ? currentQuestionData.options[answers[currentQ]] : null;
    const isCorrect = selectedOption === currentQuestionData.answer;

    const contextPrompt = `You are PrepIQ AI Tutor helping a student practice for competitive exams.
CURRENT QUESTION:
"${currentQuestionData.question}"
OPTIONS:
${currentQuestionData.options.map((o, i) => `${['A','B','C','D'][i]}) ${o}`).join('\n')}
CORRECT ANSWER: ${currentQuestionData.answer}
STUDENT STATUS: ${userAnswered ? `Student selected "${selectedOption}" which is ${isCorrect ? '✅ CORRECT' : `❌ WRONG (correct was: ${currentQuestionData.answer})`}` : 'Student has not answered yet'}
${currentQuestionData.explanation ? `EXPLANATION: ${currentQuestionData.explanation}` : ''}
Now greet the student briefly, acknowledge their status, and give them 3 short suggested questions they can ask you about this topic. Format the suggestions as a numbered list like:
1. [short question]
2. [short question]  
3. [short question]
Keep it concise and friendly.`;

    setChatHistory(prev => [...prev, { role: 'ai', text: '🤔 Analyzing your question...', _qIndex: currentQ }]);
    const aiResponse = await fetchAiResponse(contextPrompt, `Topic: ${topicId}, Question ${currentQ + 1}`);

    setChatHistory(prev => {
      const filtered = prev.filter(m => m.text !== '🤔 Analyzing your question...');
      return [...filtered, { role: 'ai', text: aiResponse, _qIndex: currentQ }];
    });
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'ai', text: "Thinking... 🤔" }]);

    const questionContext = currentQuestionData ? `
CONTEXT - Current Question being discussed:
Question: "${currentQuestionData.question}"
Options: ${currentQuestionData.options.map((o, i) => `${['A','B','C','D'][i]}) ${o}`).join(' | ')}
Correct Answer: ${currentQuestionData.answer}
Explanation: ${currentQuestionData.explanation || 'N/A'}
Topic: ${topicId}, Chapter Practice Session
` : `Topic: ${topicId}`;

    const aiResponseText = await fetchAiResponse(userMsg, questionContext);

    setChatHistory(prev => {
      const without = prev.slice(0, prev.length - 1);
      return [...without, { role: 'ai', text: aiResponseText }];
    });
  };

  const handleSelect = (idx) => {
    setAnswers(prev => ({ ...prev, [currentQ]: idx }));
    setTimeout(() => {
      explanationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleClear = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentQ];
    setAnswers(newAnswers);
  };
  
  const handleMarkReview = () => setReview(prev => ({ ...prev, [currentQ]: !prev[currentQ] }));
  
  // 🏆 YAHAN SCORE SAVE HOGA 🏆
  const handleNext = async () => {
    if (currentQ < totalQuestions - 1) {
      const nextQ = currentQ + 1;
      setCurrentQ(nextQ);
      setVisited(prev => ({ ...prev, [nextQ]: true }));
      setShowHindi(false);
      setShowQHindi(false);
    } else {
      // 1. Calculate the final score right now
      let correct = 0;
      Object.entries(answers).forEach(([qIndex, selectedOptionIdx]) => {
        const question = allQuestions[qIndex];
        if (question && question.options[selectedOptionIdx] === question.answer) {
          correct++;
        }
      });

      // 2. Show Result Screen
      setShowResult(true);

      // 3. Save to Database using Backend API
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          await axios.post('/api/results', {
            userId: userObj.id,
            subject: subjectId,
            topic: topicId,
            score: correct,
            total: totalQuestions
          });
          console.log("✅ Score saved successfully in database!");
        } catch (err) {
          console.error("⚠️ Failed to save score:", err);
        }
      } else {
        console.log("⚠️ Score not saved because user is not logged in.");
      }
    }
  };

  const jumpTo = (index) => {
    setCurrentQ(index);
    setVisited(prev => ({ ...prev, [index]: true }));
    setIsMobilePaletteOpen(false);
    setShowHindi(false);
    setShowQHindi(false);
  };

  const getPaletteStyle = (index) => {
    if (currentQ === index) return "bg-[#0d59f2] text-white font-bold shadow-[0_0_10px_#0d59f2] ring-1 ring-white/20 scale-105 border-transparent";
    if (answers[index] !== undefined) return "bg-[#00d26a]/20 border-[#00d26a]/40 text-[#00d26a]";
    if (review[index]) return "bg-[#eab308]/20 border-[#eab308]/40 text-[#eab308]";
    if (visited[index]) return "bg-[#f8312f]/20 border-[#f8312f]/40 text-[#f8312f]";
    return "bg-[#282e39] text-slate-500 border-transparent";
  };

  const handleViewInHindi = async () => {
    if (showHindi) { setShowHindi(false); return; }
    if (hindiCache[currentQ]) { setShowHindi(true); return; }
    if (!currentQuestionData) return;
    setIsTranslating(true);
    const prompt = `Translate this explanation to Hindi (Devanagari script only, no English). Keep any math/numbers as-is:\n\n${currentQuestionData.explanation}`;
    const result = await fetchAiResponse(prompt, 'Translate to Hindi');
    setHindiCache(prev => ({ ...prev, [currentQ]: result }));
    setShowHindi(true);
    setIsTranslating(false);
  };

  const handleTranslateQuestion = async () => {
    if (showQHindi) { setShowQHindi(false); return; }
    if (qHindiCache[currentQ]) { setShowQHindi(true); return; }
    if (!currentQuestionData) return;
    setIsTranslatingQ(true);
    if (currentQuestionData.questionHindi) {
      setQHindiCache(prev => ({ ...prev, [currentQ]: currentQuestionData.questionHindi }));
      setShowQHindi(true);
      setIsTranslatingQ(false);
      return;
    }
    const prompt = `Translate this multiple choice question to Hindi (Devanagari script only, no English). Keep any math/numbers/formulas as-is:\n\n${currentQuestionData.question}`;
    const result = await fetchAiResponse(prompt, 'Translate Question to Hindi');
    setQHindiCache(prev => ({ ...prev, [currentQ]: result }));
    setShowQHindi(true);
    setIsTranslatingQ(false);
  };

  const handleRetake = () => {
    let shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setAllQuestions(shuffled);
    setCurrentQ(0);
    setAnswers({});
    setReview({});
    setVisited({ 0: true });
    setShowResult(false);
    setHindiCache({});
    setShowHindi(false);
    setQHindiCache({});
    setShowQHindi(false);
    setChatHistory([{ role: 'ai', text: `Hi! I am your PrepIQ AI Tutor. Let's master this chapter together! 🚀` }]);
  };

  let correctCount = 0;
  let wrongCount = 0;
  const attemptedCount = Object.keys(answers).length;
  if (showResult) {
    Object.entries(answers).forEach(([qIndex, selectedOptionIdx]) => {
      const question = allQuestions[qIndex];
      if (question) {
        if (question.options[selectedOptionIdx] === question.answer) correctCount++;
        else wrongCount++;
      }
    });
  }
  const skippedCount = totalQuestions - attemptedCount;

  const letters = ['A', 'B', 'C', 'D'];
  const safeTopicId = topicId ? topicId.replace(/-/g, ' ') : 'Topic';
  const isAnswered = answers[currentQ] !== undefined;

  return (
    <div className="bg-[#0f1115] text-slate-100 font-sans h-screen flex flex-col overflow-hidden relative">
      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #282e39; border-radius: 10px; }
        .chat-bubble { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* HEADER */}
      <header className="flex-none h-14 md:h-16 border-b border-[#282e39] bg-[#1a1d24] px-3 md:px-6 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-3 md:gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#282e39] text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-[#282e39] hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <GraduationCap className="text-[#0d59f2] w-6 h-6" />
            <h1 className="text-base md:text-lg font-bold text-white hidden sm:block capitalize">{safeTopicId} Practice</h1>
          </div>
          {!showResult && !isLoadingQuestions && totalQuestions > 0 && (
            <button onClick={() => setIsMobilePaletteOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#282e39] border border-[#3b4354] hover:bg-[#3b4354] transition-colors lg:pointer-events-none ml-2 cursor-pointer">
              <ListOrdered className="w-4 h-4 text-[#0d59f2] lg:text-gray-400" />
              <span className="text-xs font-medium text-gray-300">Q. {currentQ + 1}/{totalQuestions}</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-[#00d26a]/10 border border-[#00d26a]/20 text-[#00d26a] text-xs font-bold uppercase tracking-widest">
            {showResult ? 'Practice Complete' : 'Learning Mode'}
          </span>
          <button onClick={() => navigate(-1)} className="h-8 md:h-9 px-4 rounded-full bg-[#282e39] hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30 text-white text-xs md:text-sm font-bold transition-all cursor-pointer">
            Exit
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">

        {/* RESULT SCREEN */}
        {showResult ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-[#1a1d24] border border-[#282e39] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00d26a] via-[#0d59f2] to-[#eab308]"></div>
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-[#0d59f2]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#0d59f2]/30 shadow-[0_0_30px_rgba(13,89,242,0.2)]">
                  <Trophy className="w-10 h-10 text-[#0d59f2]" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Practice Completed!</h2>
                <p className="text-slate-400">Your score has been saved. Here is your performance summary.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-[#161920] border border-[#282e39] rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-white mb-1">{totalQuestions}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Total</p>
                </div>
                <div className="bg-[#00d26a]/10 border border-[#00d26a]/30 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#00d26a] mb-1">{correctCount}</p>
                  <p className="text-[10px] text-[#00d26a]/70 uppercase tracking-widest font-semibold">Correct</p>
                </div>
                <div className="bg-[#f8312f]/10 border border-[#f8312f]/30 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#f8312f] mb-1">{wrongCount}</p>
                  <p className="text-[10px] text-[#f8312f]/70 uppercase tracking-widest font-semibold">Wrong</p>
                </div>
                <div className="bg-slate-500/10 border border-slate-500/30 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-slate-300 mb-1">{skippedCount}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Skipped</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleRetake}
                  className="px-8 py-3.5 rounded-full bg-[#0d59f2] hover:bg-[#0b4ecf] text-white font-bold transition-all shadow-[0_0_20px_rgba(13,89,242,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2">
                  <RotateCcw className="w-5 h-5" /> Retake Practice
                </button>
                <button onClick={() => navigate('/practice')}
                  className="px-8 py-3.5 rounded-full border border-slate-600 bg-[#282e39] hover:bg-[#3b4354] text-white font-bold transition-all flex items-center justify-center gap-2">
                  Back to Subjects
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <main className="flex-1 flex flex-col relative overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-10 custom-scrollbar">
                <div className="max-w-3xl mx-auto flex flex-col gap-6">

                  {isLoadingQuestions && (
                    <div className="flex items-center justify-center h-64">
                      <div className="w-8 h-8 border-2 border-[#0d59f2]/30 border-t-[#0d59f2] rounded-full animate-spin"></div>
                    </div>
                  )}

                  {!isLoadingQuestions && allQuestions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                      <AlertCircle className="w-12 h-12 text-slate-500" />
                      <div>
                        <p className="text-white font-bold text-lg mb-1">No Questions Found</p>
                        <p className="text-slate-400 text-sm">Admin Panel se is chapter ke liye questions generate karke save karein.</p>
                      </div>
                      <button onClick={() => navigate('/admin')}
                        className="px-5 py-2 rounded-full bg-[#0d59f2] text-white text-sm font-bold hover:bg-[#0b4ecf] transition-colors cursor-pointer">
                        Go to Admin Panel
                      </button>
                    </div>
                  )}

                  {!isLoadingQuestions && currentQuestionData && (<>
                    {/* QUESTION CARD */}
                    <div className="bg-[#1a1d24] rounded-2xl p-6 border border-[#282e39] shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/5 blur-2xl rounded-bl-full pointer-events-none"></div>
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0d59f2]/10 text-[#0d59f2] border border-[#0d59f2]/20 uppercase tracking-wider">
                          Question {currentQ + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <button onClick={handleTranslateQuestion} disabled={isTranslatingQ}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60
                              ${showQHindi ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-[#282e39] border-slate-600 text-slate-300 hover:bg-[#3b4354]'}`}>
                            {isTranslatingQ
                              ? <><div className="w-3 h-3 border border-slate-400 border-t-white rounded-full animate-spin" /> ...</>
                              : <><Languages className="w-3 h-3" /> {showQHindi ? 'English' : 'Hindi'}</>}
                          </button>
                          <button onClick={openAiChatForQuestion}
                            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:scale-105 transition-all duration-300 border border-white/20 overflow-hidden cursor-pointer">
                            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
                            <Sparkles className="w-4 h-4 relative z-10" />
                            <span className="relative z-10 hidden sm:inline">Ask AI Tutor</span>
                            <span className="relative z-10 sm:hidden">AI</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-base md:text-xl font-medium leading-relaxed text-slate-200 relative z-10">
                        {showQHindi
                          ? <div className="font-display"><MathText text={hindiQuestionText} /></div>
                          : <MathText text={currentQuestionData.question} />}
                      </div>
                      <GeometryVisualizer type={currentQuestionData.geometryType} dataStr={currentQuestionData.geometryData} />
                    </div>

                    {/* OPTIONS */}
                    <div className="grid gap-4">
                      {currentQuestionData.options.map((opt, idx) => {
                        const selected = answers[currentQ] === idx;
                        const isCorrect = isAnswered && opt === currentQuestionData.answer;
                        const isWrongSelected = selected && !isCorrect;
                        return (
                          <button key={idx}
                            onClick={() => !isAnswered && handleSelect(idx)}
                            disabled={isAnswered}
                            className={`relative flex items-center p-3.5 md:p-4 rounded-xl border-2 transition-all duration-300 text-left group overflow-hidden
                              ${!isAnswered ? 'cursor-pointer hover:border-[#3b4354] hover:bg-[#1f2229]' : 'cursor-default'}
                              ${isCorrect ? 'border-[#00d26a] bg-[#00d26a]/10' : ''}
                              ${isWrongSelected ? 'border-[#f8312f] bg-[#f8312f]/10' : ''}
                              ${!isCorrect && !isWrongSelected ? 'border-[#282e39] bg-[#1a1d24]' : ''}`}>
                            {isCorrect && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#00d26a] fill-current" />}
                            {isWrongSelected && <X className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#f8312f]" />}
                            <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm shrink-0 transition-colors duration-300 relative z-10
                              ${isCorrect ? 'bg-[#00d26a] text-white' : ''}
                              ${isWrongSelected ? 'bg-[#f8312f] text-white' : ''}
                              ${!isCorrect && !isWrongSelected ? 'bg-[#282e39] text-gray-400' : ''}`}>
                              {letters[idx]}
                            </div>
                            <div className={`ml-4 md:ml-5 text-base md:text-lg font-medium transition-colors duration-300 relative z-10 pr-8
                              ${isCorrect ? 'text-[#00d26a]' : ''}
                              ${isWrongSelected ? 'text-[#f8312f]' : ''}
                              ${!isCorrect && !isWrongSelected ? 'text-slate-300' : ''}`}>
                              <MathText text={opt} />
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* EXPLANATION BOX */}
                    {isAnswered && (
                      <div ref={explanationRef} className="mt-2 bg-[#151921] border border-[#282e39] rounded-2xl p-6 relative overflow-hidden transition-all duration-500 animate-[fadeIn_0.5s_ease-out]">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#00d26a]"></div>
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <h3 className="text-lg font-bold text-[#00d26a] flex items-center gap-2">
                            <Lightbulb className="w-5 h-5" /> Explanation
                          </h3>
                          <button onClick={handleViewInHindi} disabled={isTranslating}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60
                              ${showHindi ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-[#282e39] border-slate-600 text-slate-300 hover:bg-[#3b4354]'}`}>
                            {isTranslating
                              ? <><div className="w-3 h-3 border border-slate-400 border-t-white rounded-full animate-spin" /> ...</>
                              : <><Languages className="w-4 h-4" /> {showHindi ? 'English' : 'Hindi'}</>}
                          </button>
                        </div>
                        <div className="text-slate-300 leading-relaxed text-sm md:text-base">
                          {showHindi
                            ? <div className="font-display leading-relaxed"><MathText text={hindiExplanation} /></div>
                            : <MathText text={currentQuestionData.explanation} />}
                        </div>
                      </div>
                    )}
                  </>)}
                </div>
              </div>

              {/* AI CHAT WINDOW */}
              {isAiChatOpen && (
                <div className="absolute bottom-[75px] right-4 lg:right-6 w-[90%] md:w-96 max-w-sm bg-[#161920]/95 backdrop-blur-xl border border-[#282e39] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_20px_rgba(168,85,247,0.15)] flex flex-col z-40 h-[480px] overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b border-white/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm leading-none">PrepIQ AI Tutor</h3>
                        <span className="text-[10px] text-purple-300 font-medium tracking-wide">
                          Q.{currentQ + 1}: {currentQuestionData ? currentQuestionData.question.substring(0, 30) + '...' : 'Loading...'}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => setIsAiChatOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`chat-bubble flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-slate-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'}`}>
                          {msg.role === 'user' ? <GraduationCap className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className={`rounded-2xl p-3 text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#0d59f2]/20 border border-[#0d59f2]/30 rounded-tr-none text-blue-100' : 'bg-[#282e39] border border-white/5 rounded-tl-none text-slate-200'}`}>
                          <MathText text={msg.text} />
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-3 border-t border-[#282e39] bg-[#161920] shrink-0">
                    <form onSubmit={handleChatSubmit} className="relative">
                      <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                        className="w-full bg-[#0f1115] text-slate-200 text-sm rounded-full py-2.5 pl-4 pr-12 border border-[#282e39] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none placeholder:text-slate-500 transition-all"
                        placeholder="Ask anything about this question..." />
                      <button type="submit" disabled={!chatInput.trim()}
                        className="absolute right-1.5 top-1.5 p-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all cursor-pointer">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* BOTTOM NAV */}
              {!isLoadingQuestions && totalQuestions > 0 && (
                <div className="bg-[#1a1d24] border-t border-[#282e39] p-3 md:p-4 px-4 md:px-6 flex justify-between items-center z-20 shrink-0 w-full">
                  <div className="flex gap-2">
                    <button onClick={handleMarkReview}
                      className={`p-2 md:p-2.5 rounded-full border border-[#282e39] cursor-pointer ${review[currentQ] ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'text-slate-400'}`}>
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button onClick={handleClear} disabled={isAnswered}
                      className="px-4 py-2 rounded-full border border-slate-600 text-slate-400 disabled:opacity-50 text-xs font-bold uppercase cursor-pointer">
                      Clear
                    </button>
                  </div>
                  <button onClick={handleNext}
                    className="px-6 py-2 md:py-2.5 rounded-full bg-[#0d59f2] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#0d59f2]/20 cursor-pointer">
                    {currentQ === totalQuestions - 1 ? 'Finish Practice' : 'Next'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </main>

            {isMobilePaletteOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobilePaletteOpen(false)}></div>}

            {!isLoadingQuestions && totalQuestions > 0 && (
              <aside className={`fixed lg:static top-0 right-0 h-full z-50 w-72 bg-[#161920] border-l border-[#282e39] flex flex-col shrink-0 overflow-hidden transition-transform duration-300 ease-in-out ${isMobilePaletteOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                <div className="p-4 border-b border-[#282e39] flex justify-between items-center bg-[#1a1d24] shrink-0">
                  <h3 className="text-white font-bold text-xs uppercase tracking-widest">Questions</h3>
                  <button onClick={() => setIsMobilePaletteOpen(false)} className="lg:hidden p-1 bg-[#282e39] rounded-full text-gray-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#161920]">
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: totalQuestions }).map((_, idx) => (
                      <button key={idx} onClick={() => jumpTo(idx)}
                        className={`w-10 h-10 rounded-lg border text-xs font-bold transition-all cursor-pointer ${getPaletteStyle(idx)}`}>{idx + 1}</button>
                    ))}
                  </div>
                </div>
                <div className="p-4 border-t border-[#282e39] bg-[#1a1d24] shrink-0">
                  <div className="flex justify-around text-center">
                    <div><p className="text-lg font-bold text-white">{Object.keys(answers).length}</p><p className="text-[9px] text-slate-500 uppercase">Attempted</p></div>
                    <div className="w-px bg-[#282e39]"></div>
                    <div><p className="text-lg font-bold text-slate-500">{totalQuestions - Object.keys(answers).length}</p><p className="text-[9px] text-slate-500 uppercase">Left</p></div>
                  </div>
                </div>
              </aside>
            )}
          </>
        )}
      </div>
    </div>
  );
}