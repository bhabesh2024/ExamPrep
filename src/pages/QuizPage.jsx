import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GraduationCap, ListOrdered, AlertTriangle, Timer as TimerIcon, Pause, Play, Flag, Bookmark, CheckCircle2, ArrowRight } from 'lucide-react';

// 👇 Naye Components Import Kiye 👇
import MathText from '../components/common/MathText';
import GeometryVisualizer from '../components/common/GeometryVisualizer';

export default function QuizPage() {
  const { type, testId } = useParams();
  const navigate = useNavigate();

  const isFullMock = type === 'full';
  const totalQuestions = isFullMock ? 150 : 50;
  const initialTime = isFullMock ? 180 * 60 : 60 * 60; 

  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState({});
  const [visited, setVisited] = useState({ 0: true });

  // 👇 DUMMY QUESTION DATA (Backend lagne ke baad ye API se aayega) 👇
  const dummyQuestionData = {
    question: "If $a-b=3, b-c=5$ and $c-a=1$, then what is the value of $\\frac{a^3+b^3+c^3-3abc}{a+b+c}$?",
    options: ["10.5", "15.5", "17.5", "20.5"],
    geometryType: null, // Agar chart hoga toh 'recharts-pie' ya 'recharts-bar' aayega
    geometryData: null
  };

  useEffect(() => {
    if (isPaused) return;

    if (timeLeft <= 0) {
      alert("Time is up! Auto-submitting...");
      navigate('/practice');
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate, isPaused]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (idx) => setAnswers(prev => ({ ...prev, [currentQ]: idx }));
  
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
    }
  };

  const jumpTo = (index) => {
    setCurrentQ(index);
    setVisited(prev => ({ ...prev, [index]: true }));
  };

  const getPaletteStyle = (index) => {
    if (currentQ === index) return "bg-[#0d59f2] text-white font-bold shadow-[0_0_15px_#0d59f2] ring-2 ring-white/20 scale-110 z-10 border-transparent";
    if (answers[index] !== undefined) return "bg-[#00d26a]/20 border-[#00d26a]/50 text-[#00d26a] font-bold hover:brightness-110";
    if (review[index]) return "bg-[#eab308]/20 border-[#eab308]/50 text-[#eab308] font-bold hover:brightness-110";
    if (visited[index]) return "bg-[#f8312f]/20 border-[#f8312f]/50 text-[#f8312f] font-bold hover:brightness-110";
    return "bg-[#282e39] text-slate-500 font-medium hover:bg-[#3b4354] hover:text-slate-300 border-transparent";
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-[#f5f6f8] dark:bg-[#0f1115] text-slate-900 dark:text-slate-100 font-sans h-screen flex flex-col overflow-hidden selection:bg-[#0d59f2]/30 relative">
      
      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a1d24; }
        ::-webkit-scrollbar-thumb { background: #282e39; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3b4354; }
      `}</style>

      {/* HEADER */}
      <header className="flex-none h-16 border-b border-[#282e39] bg-[#1a1d24] px-4 md:px-6 flex items-center justify-between z-20 shrink-0 relative">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <GraduationCap className="text-[#0d59f2] w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">PrepIQ</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#282e39] border border-[#3b4354]">
            <ListOrdered className="text-gray-400 w-4 h-4" />
            <span className="text-sm font-medium text-gray-300">Q. {currentQ + 1} / {totalQuestions}</span>
          </div>
        </div>

        {/* Timer Display */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${isPaused ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : 'bg-[#1a1d24] border-[#0d59f2]/30 text-[#0d59f2]'}`}>
            <TimerIcon className="w-4 h-4" />
            <span className="text-lg font-mono font-bold tracking-widest">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center justify-center h-9 px-4 rounded-full text-sm font-semibold transition-colors border ${isPaused ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-[#282e39] hover:bg-[#3b4354] text-white border-transparent'}`}
          >
            {isPaused ? <><Play className="w-4 h-4 sm:mr-2 fill-current" /> <span className="hidden sm:inline">Resume</span></> : <><Pause className="w-4 h-4 sm:mr-2 fill-current" /> <span className="hidden sm:inline">Pause</span></>}
          </button>
          <button 
            onClick={() => navigate('/practice')}
            className="flex items-center justify-center h-9 px-4 rounded-full bg-[#0d59f2] hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-lg shadow-[#0d59f2]/20 cursor-pointer"
          >
            Finish
          </button>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* PAUSE OVERLAY */}
        {isPaused && (
          <div className="absolute inset-0 z-50 bg-[#0f1115]/80 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="bg-[#1a1d24] p-8 rounded-2xl border border-[#282e39] text-center shadow-2xl">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pause className="w-8 h-8 text-yellow-500 fill-current" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Test Paused</h2>
              <p className="text-slate-400 mb-6">Time has stopped. Click resume to continue.</p>
              <button 
                onClick={() => setIsPaused(false)}
                className="px-8 py-3 rounded-full bg-[#0d59f2] hover:bg-blue-600 text-white font-bold flex items-center gap-2 mx-auto transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" /> Resume Test
              </button>
            </div>
          </div>
        )}

        <main className={`flex-1 flex flex-col relative transition-filter ${isPaused ? 'blur-sm' : ''}`}>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-8">
              
              {/* Question Card */}
              <div className="bg-[#1a1d24] rounded-xl p-6 border border-[#282e39] shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#0d59f2] font-semibold text-sm tracking-wider">Question {currentQ + 1}</span>
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-[#282e39] rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer">
                      <Flag className="w-5 h-5" />
                    </button>
                    <button onClick={handleMarkReview} className="p-1.5 hover:bg-[#282e39] rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer">
                      <Bookmark className={`w-5 h-5 ${review[currentQ] ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </button>
                  </div>
                </div>
                
                {/* 👇 FIX: MathText aur GeometryVisualizer lagaya 👇 */}
                <div className="text-lg md:text-xl font-medium leading-relaxed text-slate-200">
                  <MathText text={dummyQuestionData.question} />
                </div>
                
                <GeometryVisualizer 
                  type={dummyQuestionData.geometryType} 
                  dataStr={dummyQuestionData.geometryData} 
                />

              </div>

              {/* Options */}
              <div className="grid gap-3 md:gap-4">
                {dummyQuestionData.options.map((opt, idx) => {
                  const selected = answers[currentQ] === idx;
                  return (
                    <button 
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`relative flex items-center p-3.5 md:p-4 rounded-xl border-2 transition-all duration-300 text-left group overflow-hidden cursor-pointer
                        ${selected 
                          ? 'border-[#0d59f2] bg-[#0d59f2]/10 shadow-[0_0_15px_-3px_rgba(13,89,242,0.3),inset_0_0_10px_rgba(13,89,242,0.15)] scale-[1.01] z-10' 
                          : 'border-[#282e39] bg-[#1a1d24] hover:border-[#3b4354] hover:bg-[#1f2229]'
                        }`}
                    >
                      {selected && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#0d59f2] fill-current drop-shadow-[0_0_5px_rgba(13,89,242,0.5)]" />}
                      
                      <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm shrink-0 transition-colors duration-300 relative z-10
                        ${selected ? 'bg-[#0d59f2] text-white shadow-[0_0_8px_#0d59f2]' : 'bg-[#282e39] text-gray-400 group-hover:bg-[#3b4354]'}`}>
                        {letters[idx]}
                      </div>
                      
                      {/* 👇 FIX: Options me bhi MathText lagaya 👇 */}
                      <div className={`ml-4 md:ml-5 text-base md:text-lg font-medium transition-colors duration-300 relative z-10 pr-8 ${selected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        <MathText text={opt} />
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          <div className="bg-[#1a1d24] border-t border-[#282e39] p-3 md:p-4 px-4 md:px-6 flex justify-between items-center gap-4 shrink-0 z-10 w-full">
            <button onClick={handleClear} className="px-5 py-2.5 rounded-full border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700/50 font-semibold text-sm transition-colors cursor-pointer">
              Clear
            </button>
            <button onClick={handleNext} className="px-8 py-2.5 rounded-full bg-[#0d59f2] hover:bg-blue-600 text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(13,89,242,0.3)]">
              Save & Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </main>

        {/* RIGHT: Question Palette */}
        <aside className={`w-80 bg-[#161920] border-l border-[#282e39] hidden lg:flex flex-col shrink-0 h-full transition-filter ${isPaused ? 'blur-sm' : ''}`}>
          <div className="p-4 md:p-5 border-b border-[#282e39] shrink-0">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Question Palette</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#00d26a] shadow-[0_0_8px_#00d26a]"></div><span className="text-xs text-slate-400">Answered</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f8312f] shadow-[0_0_8px_#f8312f]"></div><span className="text-xs text-slate-400">Not Answered</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#0d59f2] shadow-[0_0_8px_#0d59f2]"></div><span className="text-xs text-slate-400">Current</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-600"></div><span className="text-xs text-slate-400">Review</span></div>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {Array.from({ length: totalQuestions }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpTo(idx)}
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-semibold transition-all cursor-pointer ${getPaletteStyle(idx)}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 border-t border-[#282e39] bg-[#161920] shrink-0">
            <div className="bg-[#1a1d24] rounded-xl p-4 border border-[#282e39]">
              <div className="flex justify-between items-center text-center px-2">
                <div><p className="text-2xl font-bold text-white">{Object.keys(answers).length}</p><p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Attempted</p></div>
                <div className="h-10 w-px bg-[#282e39]"></div>
                <div><p className="text-2xl font-bold text-slate-500">{totalQuestions - Object.keys(answers).length}</p><p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Left</p></div>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}