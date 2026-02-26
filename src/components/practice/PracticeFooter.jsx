import React from 'react';
import { Bookmark, ArrowRight, ChevronLeft } from 'lucide-react';

export default function PracticeFooter({ currentQ, totalQuestions, handlePrev, handleNext, handleClear, handleMarkReview, isAnswered, isReviewMarked }) {
  return (
    <div className="bg-white dark:bg-[#121214] border-t border-zinc-200 dark:border-white/5 p-3 md:p-4 px-4 md:px-6 flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 z-20 shrink-0 w-full transition-colors duration-500 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.02)] dark:shadow-none">
      
      <div className="flex items-center gap-2">
        <button onClick={handlePrev} disabled={currentQ === 0} className="px-5 py-2.5 rounded-full bg-zinc-100 dark:bg-[#18181b] hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-700 dark:text-slate-300 font-bold text-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors tap-effect">
          <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Prev</span>
        </button>
        
        <button onClick={handleMarkReview} className={`p-2.5 rounded-full border cursor-pointer transition-colors shadow-sm tap-effect ${isReviewMarked ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400' : 'bg-zinc-50 dark:bg-[#18181b] border-zinc-200 dark:border-white/5 text-zinc-400 dark:text-slate-500 hover:bg-zinc-100 dark:hover:bg-[#27272a] hover:text-zinc-700 dark:hover:text-slate-300'}`} title="Save / Mark for Review">
          <Bookmark className={`w-5 h-5 ${isReviewMarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <button onClick={handleClear} disabled={!isAnswered} className="px-5 py-2.5 rounded-full border border-zinc-200 dark:border-slate-700 text-zinc-500 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-zinc-50 dark:hover:bg-[#18181b] hover:text-zinc-900 dark:hover:text-white transition-colors tap-effect" title="Clear your selected answer">
        Clear
      </button>

      <button onClick={handleNext} className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex items-center gap-2 shadow-lg hover:shadow-blue-500/30 cursor-pointer transition-all tap-effect group">
        {currentQ === totalQuestions - 1 ? 'Finish Practice' : 'Next'} 
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>
      
    </div>
  );
}