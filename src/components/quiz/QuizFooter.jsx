import React from 'react';
import { ChevronRight, Eraser } from 'lucide-react';

export default function QuizFooter({ handleClear, handleNext, currentQ, totalQuestions }) {
  return (
    <footer className="h-16 sm:h-20 border-t border-zinc-200 dark:border-white/5 bg-white dark:bg-[#121214] px-4 md:px-6 flex items-center justify-between z-10 shrink-0 transition-colors duration-500 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.02)] dark:shadow-none">
      
      <button
        onClick={handleClear}
        className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-zinc-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold text-sm transition-all tap-effect"
      >
        <Eraser className="w-4 h-4" /> 
        <span className="hidden sm:inline">Clear Response</span>
        <span className="sm:hidden">Clear</span>
      </button>

      <button
        onClick={handleNext}
        className="flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-all shadow-md hover:shadow-blue-500/30 tap-effect group"
      >
        {currentQ === totalQuestions - 1 ? 'Save & Finish' : 'Save & Next'}
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>

    </footer>
  );
}