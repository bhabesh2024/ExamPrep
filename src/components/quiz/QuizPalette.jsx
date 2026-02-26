import React from 'react';

export default function QuizPalette({ totalQuestions, currentQ, answers, review, visited, jumpTo, isPaused }) {
  
  // 🎨 Tailwind optimized color codes for Light/Dark mode compatibility
  const getPaletteStyle = (index) => {
    if (currentQ === index) return "bg-blue-600 text-white font-bold shadow-md ring-2 ring-blue-600/20 scale-110 z-10 border-transparent";
    if (answers[index] !== undefined) return "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/20";
    if (review[index]) return "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-100 dark:hover:bg-amber-500/20";
    if (visited[index]) return "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20";
    return "bg-zinc-50 dark:bg-[#27272a] text-zinc-500 dark:text-slate-400 font-medium hover:bg-zinc-200 dark:hover:bg-[#3f3f46] hover:text-zinc-900 dark:hover:text-white border-zinc-200 dark:border-transparent";
  };

  return (
    <aside className={`w-80 bg-white dark:bg-[#121214] border-l border-zinc-200 dark:border-white/5 hidden lg:flex flex-col shrink-0 h-full transition-all duration-500 ${isPaused ? 'blur-sm' : ''}`}>
      
      <div className="p-5 border-b border-zinc-200 dark:border-white/5 shrink-0 bg-zinc-50 dark:bg-[#18181b] transition-colors duration-500">
        <h3 className="text-zinc-900 dark:text-white font-bold text-sm uppercase tracking-widest">Question Palette</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white dark:bg-transparent transition-colors duration-500">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div><span className="text-xs font-semibold text-zinc-500 dark:text-slate-400">Answered</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></div><span className="text-xs font-semibold text-zinc-500 dark:text-slate-400">Not Answered</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm"></div><span className="text-xs font-semibold text-zinc-500 dark:text-slate-400">Current</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div><span className="text-xs font-semibold text-zinc-500 dark:text-slate-400">Review</span></div>
        </div>
        
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: totalQuestions }).map((_, idx) => (
            <button key={idx} onClick={() => jumpTo(idx)} className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm transition-all duration-200 cursor-pointer tap-effect ${getPaletteStyle(idx)}`}>
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#18181b] shrink-0 transition-colors duration-500">
        <div className="bg-white dark:bg-[#121214] rounded-2xl p-4 border border-zinc-200 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-center text-center px-4">
            <div>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{Object.keys(answers).length}</p>
              <p className="text-[10px] text-zinc-500 dark:text-slate-400 uppercase tracking-widest font-bold mt-1">Attempted</p>
            </div>
            <div className="h-10 w-px bg-zinc-200 dark:bg-white/10"></div>
            <div>
              <p className="text-2xl font-black text-zinc-400 dark:text-slate-600">{totalQuestions - Object.keys(answers).length}</p>
              <p className="text-[10px] text-zinc-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-1">Left</p>
            </div>
          </div>
        </div>
      </div>
      
    </aside>
  );
}