import React from 'react';
import { Lightbulb, Languages } from 'lucide-react';
import MathText from '../common/MathText';

export default function ExplanationBox({ isAnswered, explanationRef, handleViewInHindi, isTranslating, showHindi, hindiExplanation, currentQuestionData }) {
  if (!isAnswered || !currentQuestionData) return null;

  return (
    <div ref={explanationRef} className="mt-4 bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-5 md:p-6 relative overflow-hidden animate-[fadeIn_0.5s_ease-out] transition-colors duration-500">
      
      {/* Left Highlight Bar */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 dark:bg-emerald-400"></div>
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 relative z-10">
        <h3 className="text-lg font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-2 transition-colors">
          <Lightbulb className="w-5 h-5" /> Explanation
        </h3>
        
        <button onClick={handleViewInHindi} disabled={isTranslating} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 tap-effect disabled:opacity-60 shadow-sm ${showHindi ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400' : 'bg-white dark:bg-[#18181b] border-zinc-200 dark:border-white/5 text-zinc-700 dark:text-slate-300 hover:bg-zinc-50 dark:hover:bg-[#27272a]'}`}>
          {isTranslating ? <><div className="w-3 h-3 border border-zinc-400 border-t-zinc-800 rounded-full animate-spin" /> ...</> : <><Languages className="w-3.5 h-3.5" /> {showHindi ? 'English' : 'Hindi'}</>}
        </button>
      </div>
      
      <div className="text-zinc-800 dark:text-slate-200 font-medium leading-relaxed text-sm md:text-base min-h-[60px] relative z-10 transition-colors">
        {showHindi ? (
           <div key="expl-hi" className="fade-in-text font-display leading-relaxed"><MathText text={hindiExplanation} /></div>
        ) : (
           <div key="expl-en" className="fade-in-text"><MathText text={currentQuestionData.explanation} /></div>
        )}
      </div>
      
    </div>
  );
}