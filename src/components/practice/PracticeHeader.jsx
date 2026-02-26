import React from 'react';
import { GraduationCap, ListOrdered, ArrowLeft } from 'lucide-react';

export default function PracticeHeader({ topicId, showResult, isLoadingQuestions, totalQuestions, currentQ, setIsMobilePaletteOpen, handleExit }) {
  const safeTopicId = topicId ? topicId.replace(/-/g, ' ') : 'Topic';

  return (
    <header className="flex-none h-14 md:h-16 border-b border-zinc-200 dark:border-white/5 bg-white dark:bg-[#121214] px-3 md:px-6 flex items-center justify-between z-20 relative transition-colors duration-500 shadow-sm">
      <div className="flex items-center gap-3 md:gap-4">
        
        <button onClick={handleExit} className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-[#27272a] text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white transition-colors tap-effect">
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 hidden sm:block"></div>
        
        <div className="flex items-center gap-2">
          <GraduationCap className="text-blue-600 dark:text-blue-400 w-6 h-6" />
          <h1 className="text-base md:text-lg font-black text-zinc-900 dark:text-white hidden sm:block capitalize transition-colors">{safeTopicId} Practice</h1>
        </div>

        {!showResult && !isLoadingQuestions && totalQuestions > 0 && (
          <button onClick={() => setIsMobilePaletteOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 hover:bg-zinc-200 dark:hover:bg-[#27272a] transition-colors lg:pointer-events-none ml-2 tap-effect">
            <ListOrdered className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-zinc-700 dark:text-slate-300">Q. {currentQ + 1}/{totalQuestions}</span>
          </button>
        )}

      </div>
      <div className="flex items-center gap-3">
        <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm">
          {showResult ? 'Practice Complete' : 'Learning Mode'}
        </span>
        
        <button onClick={handleExit} className="h-8 md:h-9 px-5 rounded-full bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white border border-rose-200 dark:border-rose-500/30 hover:border-rose-500 text-xs md:text-sm font-bold transition-all tap-effect shadow-sm">
          Exit
        </button>
      </div>
    </header>
  );
}