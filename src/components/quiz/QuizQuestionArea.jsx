import React, { useState } from 'react';
import { Bookmark, CheckCircle2, Sparkles, Share2, Check, Landmark, BookOpen, Flag, AlertTriangle, Languages, Type } from 'lucide-react';
import MathText from '../common/MathText';
import GeometryVisualizer from '../common/GeometryVisualizer';
import axios from 'axios';

export default function QuizQuestionArea({ currentQ, currentQuestionData, handleMarkReview, review, handleSelect, answers, testId }) {
  const letters = ['A', 'B', 'C', 'D'];
  const [copied, setCopied] = useState(false);
  const [showFlagMenu, setShowFlagMenu] = useState(false);

  // Handlers remain same...
  const handleGoogleSearch = () => { /* ... existing logic ... */ };
  const handleShare = async () => { /* ... existing logic ... */ };
  const submitFlag = async (reason) => { /* ... existing logic ... */ };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-8 transition-colors duration-500">
      <div className="bg-white dark:bg-[#18181b] rounded-2xl p-5 sm:p-8 border border-zinc-200 dark:border-white/5 shadow-sm transition-colors duration-500">
        
        <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-widest uppercase">
              Question {currentQ + 1}
            </span>
            {currentQuestionData?.examReference && currentQuestionData.examReference !== "Expected" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-bold border border-amber-200 dark:border-amber-500/20 uppercase tracking-widest transition-colors duration-500">
                <Landmark className="w-3 h-3" /> {currentQuestionData.examReference}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 relative">
            <button onClick={handleGoogleSearch} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 tap-effect">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
            <button onClick={handleShare} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-300 tap-effect ${copied ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-100 dark:bg-[#27272a] border-transparent text-zinc-600 dark:text-slate-300 hover:bg-zinc-200 dark:hover:bg-[#3f3f46]'}`}>
              {copied ? <><Check className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Copied!</span></> : <><Share2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Share</span></>}
            </button>
            <button onClick={handleMarkReview} className="p-2 hover:bg-zinc-100 dark:hover:bg-[#27272a] rounded-full text-zinc-400 dark:text-slate-500 hover:text-zinc-900 dark:hover:text-white transition-colors tap-effect">
              <Bookmark className={`w-5 h-5 ${review[currentQ] ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            {/* 🛡️ FLAG DROPDOWN (Emojis Removed, Premium Icons Added) */}
            <div className="relative">
              <button onClick={() => setShowFlagMenu(!showFlagMenu)} className="p-2 hover:bg-zinc-100 dark:hover:bg-[#27272a] rounded-full text-zinc-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors tap-effect">
                <Flag className="w-5 h-5" />
              </button>
              {showFlagMenu && (
                <div className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-xl p-2 shadow-xl z-50 transition-colors duration-500">
                  <p className="text-[10px] text-zinc-400 dark:text-slate-500 uppercase tracking-widest px-2 pb-2 border-b border-zinc-100 dark:border-[#27272a] mb-1 font-bold">Report Issue</p>
                  <button onClick={() => submitFlag("Wrong Answer")} className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg text-sm text-zinc-600 dark:text-slate-300 font-medium transition-colors">
                    <AlertTriangle className="w-4 h-4" /> Wrong Answer
                  </button>
                  <button onClick={() => submitFlag("Translation Error")} className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg text-sm text-zinc-600 dark:text-slate-300 font-medium transition-colors">
                    <Languages className="w-4 h-4" /> Translation Error
                  </button>
                  <button onClick={() => submitFlag("Typo / Formatting")} className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white rounded-lg text-sm text-zinc-600 dark:text-slate-300 font-medium transition-colors">
                    <Type className="w-4 h-4" /> Typo / Formatting
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {currentQuestionData?.passage && (
          <div className="mb-6 rounded-xl bg-zinc-50 dark:bg-[#121214] border border-zinc-200 dark:border-white/5 overflow-hidden flex flex-col transition-colors duration-500">
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-[#18181b] border-b border-zinc-200 dark:border-white/5 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-widest">
              <BookOpen className="w-4 h-4" /> Direction / Passage
            </div>
            <div className="p-5 md:p-6 max-h-56 overflow-y-auto custom-scrollbar">
              <div className="text-sm md:text-base text-zinc-700 dark:text-slate-300 leading-relaxed font-medium">
                <MathText text={currentQuestionData.passage} />
              </div>
            </div>
          </div>
        )}

        {/* Question Text */}
        <div className="text-lg md:text-xl font-bold leading-relaxed text-zinc-900 dark:text-white transition-colors duration-500">
          <MathText text={currentQuestionData?.question || ''} />
        </div>
        {currentQuestionData?.questionHindi && (
          <div className="text-md md:text-lg font-medium leading-relaxed text-zinc-500 dark:text-slate-400 mt-3 font-display transition-colors duration-500">
            <MathText text={currentQuestionData.questionHindi} />
          </div>
        )}
        <GeometryVisualizer type={currentQuestionData?.geometryType} dataStr={currentQuestionData?.geometryData} />
      </div>

      {/* 🧈 Buttery Smooth Options */}
      <div className="grid gap-3 md:gap-4">
        {currentQuestionData?.options?.map((opt, idx) => {
          const selected = answers[currentQ] === idx;
          return (
            <button 
              key={idx} 
              onClick={() => handleSelect(idx)} 
              className={`relative flex items-center p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden cursor-pointer tap-effect ${selected ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-sm scale-[1.01] z-10' : 'border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18181b] hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-zinc-50 dark:hover:bg-[#1f1f22]'}`}
            >
              {selected && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 dark:text-blue-400 fill-current" />}
              
              <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm shrink-0 transition-all duration-300 ${selected ? 'bg-blue-600 text-white shadow-md scale-110' : 'bg-zinc-100 dark:bg-[#27272a] text-zinc-500 dark:text-slate-400 group-hover:bg-zinc-200 dark:group-hover:bg-[#3f3f46]'}`}>
                {letters[idx]}
              </div>
              
              <div className={`ml-4 md:ml-5 text-base md:text-lg font-semibold transition-colors duration-300 pr-8 ${selected ? 'text-blue-900 dark:text-white' : 'text-zinc-700 dark:text-slate-300 group-hover:text-zinc-900 dark:group-hover:text-white'}`}>
                <MathText text={opt} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}