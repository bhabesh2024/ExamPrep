import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GraduationCap, ListOrdered, Bookmark, CheckCircle2, ArrowRight, X, Sparkles, Bot, Send, ArrowLeft, Lightbulb, Languages, AlertCircle } from 'lucide-react';
import { fetchAiResponse } from '../services/aiService';
import { subjectsData } from '../data/syllabusData';

// 👇 Naye Components Import Kiye 👇
import MathText from '../components/common/MathText';
import GeometryVisualizer from '../components/common/GeometryVisualizer';

// localStorage se questions load karne ka function (AdminPanel se same logic)
const loadQuestionsFromStorage = (subjectId, topicId) => {
  try {
    // Subject dhundho
    const subjObj = subjectsData.find(s => s.id === subjectId);
    if (!subjObj) return [];
    // Topic jis category mein hai wo dhundho
    for (const cat of subjObj.categories) {
      const topic = cat.topics.find(t => t.id === topicId);
      if (topic) {
        const key = `examprep__${subjObj.id}__${cat.id}__${topic.id}`;
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored);
      }
    }
    return [];
  } catch (e) {
    console.error('Error loading questions:', e);
    return [];
  }
};

export default function ChapterPracticePage() {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();

  // ✅ localStorage se real questions load karo
  const [allQuestions, setAllQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  useEffect(() => {
    setIsLoadingQuestions(true);
    const loaded = loadQuestionsFromStorage(subjectId, topicId);
    setAllQuestions(loaded);
    setCurrentQ(0);
    setAnswers({});
    setReview({});
    setVisited({ 0: true });
    setHindiCache({});
    setShowHindi(false);
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
    { role: 'ai', text: `Hi! I am your StudentAI Helper. Let's master this chapter together! 🚀` }
  ]);

  const messagesEndRef = useRef(null);
  const explanationRef = useRef(null);

  // Hindi translation state (cache: { [questionIndex]: translatedText })
  const [hindiCache, setHindiCache] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [showHindi, setShowHindi] = useState(false);
  const hindiExplanation = hindiCache[currentQ] || null;

  // Current question (real data from localStorage)
  const currentQuestionData = allQuestions[currentQ] || null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isAiChatOpen]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    const newHistory = [...chatHistory, { role: 'user', text: userMsg }];
    setChatHistory(newHistory);
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'ai', text: "Thinking... 🤔" }]);

    const currentContext = `Subject: ${topicId}, Currently looking at Question Number: ${currentQ + 1}`;
    const aiResponseText = await fetchAiResponse(userMsg, currentContext);

    setChatHistory(prev => {
      const historyWithoutLoading = prev.slice(0, prev.length - 1);
      return [...historyWithoutLoading, { role: 'ai', text: aiResponseText }];
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
  
  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      const nextQ = currentQ + 1;
      setCurrentQ(nextQ);
      setVisited(prev => ({ ...prev, [nextQ]: true }));
      setShowHindi(false);
      if (isAiChatOpen) {
          setChatHistory(prev => [...prev, { role: 'ai', text: `Moving to Question ${nextQ + 1}. Let me know if you need a hint!` }]);
      }
    }
  };

  const jumpTo = (index) => {
    setCurrentQ(index);
    setVisited(prev => ({ ...prev, [index]: true }));
    setIsMobilePaletteOpen(false);
    setShowHindi(false);
  };

  const getPaletteStyle = (index) => {
    if (currentQ === index) return "bg-[#0d59f2] text-white font-bold shadow-[0_0_10px_#0d59f2] ring-1 ring-white/20 scale-105 border-transparent";
    if (answers[index] !== undefined) return "bg-[#00d26a]/20 border-[#00d26a]/40 text-[#00d26a]";
    if (review[index]) return "bg-[#eab308]/20 border-[#eab308]/40 text-[#eab308]";
    if (visited[index]) return "bg-[#f8312f]/20 border-[#f8312f]/40 text-[#f8312f]";
    return "bg-[#282e39] text-slate-500 border-transparent";
  };

  // Hindi translation handler using AI (with per-question cache)
  const handleViewInHindi = async () => {
    if (showHindi) {
      setShowHindi(false);
      return;
    }
    // Already cached for this question? Use it directly
    if (hindiCache[currentQ]) {
      setShowHindi(true);
      return;
    }
    if (!currentQuestionData) return;
    setIsTranslating(true);
    const prompt = `Translate this explanation to Hindi (Devanagari script only, no English). Keep any math/numbers as-is:\n\n${currentQuestionData.explanation}`;
    const result = await fetchAiResponse(prompt, 'Translate to Hindi');
    setHindiCache(prev => ({ ...prev, [currentQ]: result }));
    setShowHindi(true);
    setIsTranslating(false);
  };

  const letters = ['A', 'B', 'C', 'D'];
  const safeTopicId = topicId ? topicId.replace('-', ' ') : 'Topic';
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
          
          <button 
            onClick={() => setIsMobilePaletteOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#282e39] border border-[#3b4354] hover:bg-[#3b4354] transition-colors lg:pointer-events-none ml-2 cursor-pointer"
          >
            <ListOrdered className="w-4 h-4 text-[#0d59f2] lg:text-gray-400" />
            <span className="text-xs font-medium text-gray-300">Q. {currentQ + 1}/{totalQuestions}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-[#00d26a]/10 border border-[#00d26a]/20 text-[#00d26a] text-xs font-bold uppercase tracking-widest">
            Learning Mode
          </span>
          <button onClick={() => navigate(-1)} className="h-8 md:h-9 px-4 rounded-full bg-[#282e39] hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30 text-white text-xs md:text-sm font-bold transition-all cursor-pointer">
            Exit
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 flex flex-col relative overflow-hidden">
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-10 custom-scrollbar">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">

              {/* ✅ Loading State */}
              {isLoadingQuestions && (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-2 border-[#0d59f2]/30 border-t-[#0d59f2] rounded-full animate-spin"></div>
                </div>
              )}

              {/* ✅ No Questions Found State */}
              {!isLoadingQuestions && allQuestions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                  <AlertCircle className="w-12 h-12 text-slate-500" />
                  <div>
                    <p className="text-white font-bold text-lg mb-1">No Questions Found</p>
                    <p className="text-slate-400 text-sm">Admin Panel se is chapter ke liye questions generate karke save karein.</p>
                  </div>
                  <button onClick={() => navigate('/admin')} className="px-5 py-2 rounded-full bg-[#0d59f2] text-white text-sm font-bold hover:bg-[#0b4ecf] transition-colors cursor-pointer">
                    Go to Admin Panel
                  </button>
                </div>
              )}

              {/* ✅ Questions loaded - show question card */}
              {!isLoadingQuestions && currentQuestionData && (<>
                <div className="bg-[#1a1d24] rounded-2xl p-6 border border-[#282e39] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/5 blur-2xl rounded-bl-full pointer-events-none"></div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0d59f2]/10 text-[#0d59f2] border border-[#0d59f2]/20 uppercase tracking-wider">
                      Question {currentQ + 1}
                    </span>
                    <button 
                      onClick={() => setIsAiChatOpen(!isAiChatOpen)}
                      className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:scale-105 transition-all duration-300 border border-white/20 overflow-hidden cursor-pointer"
                    >
                      <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
                      <Sparkles className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Ask AI Tutor</span>
                    </button>
                  </div>
                  <div className="text-base md:text-xl font-medium leading-relaxed text-slate-200 relative z-10">
                    <MathText text={currentQuestionData.question} />
                  </div>
                  <GeometryVisualizer type={currentQuestionData.geometryType} dataStr={currentQuestionData.geometryData} />
                </div>

                {/* Options */}
                <div className="grid gap-4">
                  {currentQuestionData.options.map((opt, idx) => {
                    const selected = answers[currentQ] === idx;
                    const isCorrect = isAnswered && opt === currentQuestionData.answer;
                    const isWrongSelected = selected && !isCorrect;
                    return (
                      <button 
                        key={idx}
                        onClick={() => !isAnswered && handleSelect(idx)}
                        disabled={isAnswered}
                        className={`relative flex items-center p-3.5 md:p-4 rounded-xl border-2 transition-all duration-300 text-left group overflow-hidden ${!isAnswered ? 'cursor-pointer hover:border-[#3b4354] hover:bg-[#1f2229]' : 'cursor-default'}
                          ${isCorrect ? 'border-[#00d26a] bg-[#00d26a]/10' : ''}
                          ${isWrongSelected ? 'border-[#f8312f] bg-[#f8312f]/10' : ''}
                          ${!isCorrect && !isWrongSelected ? 'border-[#282e39] bg-[#1a1d24]' : ''}
                        `}
                      >
                        {isCorrect && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#00d26a] fill-current" />}
                        {isWrongSelected && <X className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#f8312f]" />}
                        <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm shrink-0 transition-colors duration-300 relative z-10
                          ${isCorrect ? 'bg-[#00d26a] text-white' : ''}
                          ${isWrongSelected ? 'bg-[#f8312f] text-white' : ''}
                          ${!isCorrect && !isWrongSelected ? 'bg-[#282e39] text-gray-400' : ''}
                        `}>
                          {letters[idx]}
                        </div>
                        <div className={`ml-4 md:ml-5 text-base md:text-lg font-medium transition-colors duration-300 relative z-10 pr-8 
                          ${isCorrect ? 'text-[#00d26a]' : ''}
                          ${isWrongSelected ? 'text-[#f8312f]' : ''}
                          ${!isCorrect && !isWrongSelected ? 'text-slate-300' : ''}
                        `}>
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
                      <button
                        onClick={handleViewInHindi}
                        disabled={isTranslating}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60
                          ${showHindi
                            ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                            : 'bg-[#282e39] border-slate-600 text-slate-300 hover:bg-[#3b4354]'
                          }`}
                      >
                        {isTranslating
                          ? <><div className="w-3 h-3 border border-slate-400 border-t-white rounded-full animate-spin" /> Translating...</>
                          : <><Languages className="w-4 h-4" /> {showHindi ? 'View in English' : 'View in Hindi'}</>
                        }
                      </button>
                    </div>
                    <div className="text-slate-300 leading-relaxed text-sm md:text-base">
                      {showHindi
                        ? <p className="font-display leading-relaxed">{hindiExplanation}</p>
                        : <MathText text={currentQuestionData.explanation} />
                      }
                    </div>
                  </div>
                )}
              </>)}
            </div>
          </div>

          {/* AI CHAT WINDOW */}
          {isAiChatOpen && (
            <div className="absolute bottom-[75px] right-4 lg:right-6 w-[90%] md:w-96 max-w-sm bg-[#161920]/95 backdrop-blur-xl border border-[#282e39] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_20px_rgba(168,85,247,0.15)] flex flex-col z-40 h-[450px] overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm leading-none">StudentAI Helper</h3>
                    <span className="text-[10px] text-purple-300 font-medium tracking-wide">Detecting Q.{currentQ + 1} Context...</span>
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
                    <div className={`rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-[#0d59f2]/20 border border-[#0d59f2]/30 rounded-tr-none text-blue-100' : 'bg-[#282e39] border border-white/5 rounded-tl-none text-slate-200'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 border-t border-[#282e39] bg-[#161920] shrink-0">
                <form onSubmit={handleChatSubmit} className="relative">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="w-full bg-[#0f1115] text-slate-200 text-sm rounded-full py-2.5 pl-4 pr-12 border border-[#282e39] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none placeholder:text-slate-500 transition-all" 
                    placeholder="Ask for more help..." 
                  />
                  <button type="submit" disabled={!chatInput.trim()} className="absolute right-1.5 top-1.5 p-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all cursor-pointer">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="bg-[#1a1d24] border-t border-[#282e39] p-3 md:p-4 px-4 md:px-6 flex justify-between items-center z-20 shrink-0 w-full">
            <div className="flex gap-2">
               <button onClick={handleMarkReview} className={`p-2 md:p-2.5 rounded-full border border-[#282e39] cursor-pointer ${review[currentQ] ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'text-slate-400'}`}>
                <Bookmark className="w-5 h-5" />
              </button>
              <button onClick={handleClear} disabled={isAnswered} className="px-4 py-2 rounded-full border border-slate-600 text-slate-400 disabled:opacity-50 text-xs font-bold uppercase cursor-pointer">
                Clear
              </button>
            </div>
            <button onClick={handleNext} className="px-6 py-2 md:py-2.5 rounded-full bg-[#0d59f2] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#0d59f2]/20 cursor-pointer">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>

        {isMobilePaletteOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobilePaletteOpen(false)}></div>}

        <aside className={`fixed lg:static top-0 right-0 h-full z-50 w-72 bg-[#161920] border-l border-[#282e39] flex flex-col shrink-0 overflow-hidden transition-transform duration-300 ease-in-out ${isMobilePaletteOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
          <div className="p-4 border-b border-[#282e39] flex justify-between items-center bg-[#1a1d24] shrink-0">
            <h3 className="text-white font-bold text-xs uppercase tracking-widest">Questions</h3>
            <button onClick={() => setIsMobilePaletteOpen(false)} className="lg:hidden p-1 bg-[#282e39] rounded-full text-gray-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#161920]">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: totalQuestions }).map((_, idx) => (
                <button key={idx} onClick={() => jumpTo(idx)} className={`w-10 h-10 rounded-lg border text-xs font-bold transition-all cursor-pointer ${getPaletteStyle(idx)}`}>{idx + 1}</button>
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

      </div>
    </div>
  );
}