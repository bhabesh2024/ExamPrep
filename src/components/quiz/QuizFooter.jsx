import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function QuizFooter({ handleClear, handleNext, currentQ, totalQuestions }) {
  return (
    <div className="bg-[#1a1d24] border-t border-[#282e39] p-3 md:p-4 px-4 md:px-6 flex justify-between items-center gap-4 shrink-0 z-10 w-full">
      <button onClick={handleClear} className="px-5 py-2.5 rounded-full border border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700/50 font-semibold text-sm transition-colors cursor-pointer">
        Clear
      </button>
      <button onClick={handleNext} className="px-8 py-2.5 rounded-full bg-[#0d59f2] hover:bg-blue-600 text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(13,89,242,0.3)]">
        {currentQ === totalQuestions - 1 ? 'Finish' : 'Save & Next'} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}