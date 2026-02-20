import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GraduationCap, ListOrdered, AlertTriangle, Timer as TimerIcon, Pause, Flag, Bookmark, CheckCircle2, ArrowRight } from 'lucide-react';

export default function QuizPage() {
  const { type, testId } = useParams();
  const navigate = useNavigate();

  // Configuration
  const isFullMock = type === 'full';
  const totalQuestions = isFullMock ? 150 : 50;
  const initialTime = isFullMock ? 180 * 60 : 60 * 60; // 3 hrs or 1 hr in seconds

  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState({});
  const [visited, setVisited] = useState({ 0: true });

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Time is up! Auto-submitting...");
      navigate('/practice');
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Actions
  const handleSelect = (idx) => {
    setAnswers(prev => ({ ...prev, [currentQ]: idx }));
  };

  const handleClear = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentQ];
    setAnswers(newAnswers);
  };

  const handleMarkReview = () => {
    setReview(prev => ({ ...prev, [currentQ]: !prev[currentQ] }));
  };

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

  // Status Checkers
  const isAnswered = (index) => answers[index] !== undefined;
  const isReviewed = (index) => review[index];
  const isVisited = (index) => visited[index];

  const getPaletteStyle = (index) => {
    if (currentQ === index) {
      return "bg-[#0d59f2] text-white font-bold shadow-[0_0_15px_#0d59f2] ring-2 ring-white/20 scale-110 z-10 border-transparent";
    }
    if (isAnswered(index)) {
      return "bg-[#00d26a]/20 border-[#00d26a]/50 text-[#00d26a] font-bold hover:brightness-110";
    }
    if (isReviewed(index)) {
      return "bg-[#eab308]/20 border-[#eab308]/50 text-[#eab308] font-bold hover:brightness-110";
    }
    if (isVisited(index)) {
      return "bg-[#f8312f]/20 border-[#f8312f]/50 text-[#f8312f] font-bold hover:brightness-110";
    }
    return "bg-[#282e39] text-slate-500 font-medium hover:bg-[#3b4354] hover:text-slate-300 border-transparent";
  };

  // Dummy Options
  const letters = ['A', 'B', 'C', 'D'];
  const dummyOptions = [
    "x = 4",
    "x = 2",
    "x = 0",
    "x = -2"
  ];

  return (
    <div className="bg-[#f5f6f8] dark:bg-[#0f1115] text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col overflow-hidden selection:bg-[#0d59f2]/30">
      
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1a1d24; }
        ::-webkit-scrollbar-thumb { background: #282e39; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3b4354; }
        .timer-pulse { animation: pulse-glow 2s infinite; }
        @keyframes pulse-glow {
            0% { box-shadow: 0 0 5px rgba(13, 89, 242, 0.2); }
            50% { box-shadow: 0 0 15px rgba(13, 89, 242, 0.6); }
            100% { box-shadow: 0 0 5px rgba(13, 89, 242, 0.2); }
        }
      `}</style>

      {/* HEADER */}
      <header className="flex-none h-16 border-b border-[#282e39] bg-[#1a1d24] px-4 md:px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <GraduationCap className="text-[#0d59f2] w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">PrepIQ</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#282e39] border border-[#3b4354]">
            <ListOrdered className="text-gray-400 w-4 h-4" />
            <span className="text-sm font-medium text-gray-300">Q. {currentQ + 1} / {totalQuestions}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f8312f]/10 border border-[#f8312f]/20 text-[#f8312f]">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-bold">Negative: -0.25</span>
          </div>
        </div>

        {/* Center Timer */}
        <div className="absolute left-1/2 top-8 -translate-x-1/2 -translate-y-1/2">
          <div className="timer-pulse flex items-center gap-2 px-5 py-2 rounded-full bg-[#1a1d24] border border-[#0d59f2]/30 text-[#0d59f2]">
            <TimerIcon className="w-5 h-5" />
            <span className="text-lg font-mono font-bold tracking-widest">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center justify-center h-9 px-4 rounded-full bg-[#282e39] hover:bg-[#3b4354] text-white text-sm font-semibold transition-colors border border-transparent hover:border-gray-500">
            <Pause className="w-4 h-4 mr-2" /> Pause
          </button>
          <button 
            onClick={() => navigate('/practice')}
            className="flex items-center justify-center h-9 px-4 rounded-full bg-[#0d59f2] hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-lg shadow-[#0d59f2]/20"
          >
            Finish Test
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT: Question Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-24">
            
            {/* Question Card */}
            <div className="bg-[#1a1d24] rounded-2xl p-6 md:p-8 border border-[#282e39] shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0d59f2]/10 text-[#0d59f2] border border-[#0d59f2]/20 uppercase tracking-wider">
                  Question {currentQ + 1}
                </span>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-[#282e39] rounded-full text-gray-400 hover:text-white transition-colors"><Flag className="w-4 h-4" /></button>
                  <button onClick={handleMarkReview} className="p-2 hover:bg-[#282e39] rounded-full text-gray-400 hover:text-white transition-colors">
                    <Bookmark className={`w-4 h-4 ${isReviewed(currentQ) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                  </button>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-200">
                  If <i className="font-serif text-[#0d59f2]">f(x) = x² + 2x</i>, what is the value of the derivative at <i className="font-serif text-[#0d59f2]">x = 1</i>? (Mock Question {currentQ + 1})
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="grid gap-3">
              {dummyOptions.map((opt, idx) => {
                const selected = answers[currentQ] === idx;
                return (
                  <button 
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 text-left group
                      ${selected 
                        ? 'border-[#0d59f2] bg-[#0d59f2]/5 shadow-[0_0_10px_#0d59f2,0_0_20px_#0d59f2aa]' 
                        : 'border-[#282e39] bg-[#1a1d24] hover:border-[#0d59f2]/50 hover:bg-[#282e39]'
                      }`}
                  >
                    {selected && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0d59f2]">
                        <CheckCircle2 className="w-5 h-5 fill-current text-[#1a1d24]" />
                      </div>
                    )}
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm shrink-0 transition-colors
                      ${selected ? 'bg-[#0d59f2] text-white' : 'bg-[#282e39] text-gray-400 group-hover:bg-[#0d59f2] group-hover:text-white'}
                    `}>
                      {letters[idx]}
                    </div>
                    <div className={`ml-4 text-base md:text-lg font-medium ${selected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      {opt}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Bottom Action Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#1a1d24]/95 backdrop-blur-md border-t border-[#282e39] p-4 flex flex-wrap justify-between items-center gap-4 z-10">
            <div className="flex gap-3">
              <button onClick={handleMarkReview} className="px-5 py-2.5 rounded-full border border-yellow-600/50 text-yellow-500 hover:bg-yellow-600/10 font-semibold text-sm transition-colors flex items-center gap-2">
                <Bookmark className={`w-4 h-4 ${isReviewed(currentQ) ? 'fill-current' : ''}`} /> Mark for Review
              </button>
              <button onClick={handleClear} className="px-5 py-2.5 rounded-full border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700/50 font-semibold text-sm transition-colors">
                Clear Response
              </button>
            </div>
            <button 
              onClick={handleNext}
              className="px-8 py-2.5 rounded-full bg-[#0d59f2] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-[#0d59f2]/25 hover:shadow-[#0d59f2]/40 transition-all flex items-center gap-2"
            >
              Save & Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* RIGHT: Question Palette */}
        <aside className="w-80 bg-[#161920] border-l border-[#282e39] hidden lg:flex flex-col shrink-0">
          <div className="p-5 border-b border-[#282e39]">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-1">Question Palette</h3>
            <p className="text-slate-500 text-xs">Navigate through the section</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            
            {/* Status Guide */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#00d26a] shadow-[0_0_8px_#00d26a]"></div><span className="text-xs text-slate-400">Answered</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f8312f] shadow-[0_0_8px_#f8312f]"></div><span className="text-xs text-slate-400">Not Answered</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#0d59f2] shadow-[0_0_8px_#0d59f2]"></div><span className="text-xs text-slate-400">Current</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-600"></div><span className="text-xs text-slate-400">Review</span></div>
              <div className="flex items-center gap-2 col-span-2"><div className="w-3 h-3 rounded-full bg-[#3b4354]"></div><span className="text-xs text-slate-400">Not Visited</span></div>
            </div>

            {/* Grid Buttons */}
            <div className="grid grid-cols-5 gap-3 pb-8">
              {Array.from({ length: totalQuestions }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpTo(idx)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${getPaletteStyle(idx)}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Section Summary */}
          <div className="p-5 border-t border-[#282e39] bg-[#161920]">
            <div className="bg-[#1a1d24] rounded-xl p-4 border border-[#282e39]">
              <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Section Summary</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-white">{Object.keys(answers).length}<span className="text-sm text-slate-500 font-normal">/{totalQuestions}</span></p>
                  <p className="text-xs text-slate-500">Attempted</p>
                </div>
                <div className="h-10 w-px bg-[#282e39]"></div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalQuestions - Object.keys(answers).length}</p>
                  <p className="text-xs text-slate-500">Remaining</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}