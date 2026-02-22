import React from 'react';
import { Bookmark, ArrowRight, ChevronLeft } from 'lucide-react';

export default function PracticeFooter({ currentQ, totalQuestions, handlePrev, handleNext, handleClear, handleMarkReview, isAnswered, isReviewMarked }) {
  return (
    <div className="bg-[#1a1d24] border-t border-[#282e39] p-3 md:p-4 px-4 md:px-6 flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 z-20 shrink-0 w-full">
      <div className="flex items-center gap-2">
        <button onClick={handlePrev} disabled={currentQ === 0} className="px-4 py-2 md:py-2.5 rounded-full bg-[#282e39] hover:bg-[#3b4354] text-white font-bold text-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors">
          <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Prev</span>
        </button>
        <button onClick={handleMarkReview} className={`p-2 md:p-2.5 rounded-full border cursor-pointer transition-colors shadow-sm ${isReviewMarked ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500' : 'border-[#282e39] bg-[#282e39] hover:bg-[#3b4354] text-slate-400'}`} title="Save / Mark for Review">
          <Bookmark className={`w-5 h-5 ${isReviewMarked ? 'fill-current' : ''}`} />
        </button>
      </div>
      <button onClick={handleClear} disabled={!isAnswered} className="px-5 py-2 rounded-full border border-slate-600 text-slate-300 disabled:opacity-30 disabled:border-slate-700 disabled:cursor-not-allowed text-xs font-bold uppercase cursor-pointer hover:bg-slate-800 hover:text-white transition-colors" title="Clear your selected answer">
        Clear Answer
      </button>
      <button onClick={handleNext} className="px-6 py-2 md:py-2.5 rounded-full bg-[#0d59f2] hover:bg-[#0b4ecf] text-white font-bold text-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(13,89,242,0.3)] cursor-pointer transition-all">
        {currentQ === totalQuestions - 1 ? 'Finish Practice' : 'Next'} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}