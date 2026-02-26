import React from 'react';
import { X } from 'lucide-react';

export default function QuestionPalette({ totalQuestions, currentQ, answers, review, visited, jumpTo, isMobilePaletteOpen, setIsMobilePaletteOpen }) {
  
  const getPaletteStyle = (index) => {
    if (currentQ === index) return "bg-blue-600 text-white font-bold shadow-md ring-2 ring-blue-600/20 scale-110 z-10 border-transparent";
    if (answers[index] !== undefined) return "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold";
    if (review[index]) return "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold";
    if (visited[index]) return "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold";
    return "bg-zinc-50 dark:bg-[#18181b] text-zinc-500 dark:text-slate-400 font-medium hover:bg-zinc-200 dark:hover:bg-[#27272a] hover:text-zinc-900 dark:hover:text-white border-zinc-200 dark:border-white/5";
  };

  return (
    <>
      {isMobilePaletteOpen && <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity" onClick={() => setIsMobilePaletteOpen(false)}></div>}
      
      <aside className={`fixed lg:static top-0 right-0 h-full z-50 w-72 bg-white dark:bg-[#121214] border-l border-zinc-200 dark:border-white/5 flex flex-col shrink-0 overflow-hidden transition-transform duration-300 ease-in-out ${isMobilePaletteOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0 lg:shadow-none'}`}>
        
        <div className="p-5 border-b border-zinc-200 dark:border-white/5 flex justify-between items-center bg-zinc-50 dark:bg-[#18181b] shrink-0 transition-colors">
          <h3 className="text-zinc-900 dark:text-white font-black text-sm uppercase tracking-widest">Question Palette</h3>
          <button onClick={() => setIsMobilePaletteOpen(false)} className="lg:hidden p-1.5 bg-zinc-200 dark:bg-[#27272a] rounded-full text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer tap-effect">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white dark:bg-transparent transition-colors">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div><span className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 uppercase tracking-wider">Answered</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></div><span className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 uppercase tracking-wider">Review</span></div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: totalQuestions }).map((_, idx) => (
              <button key={idx} onClick={() => jumpTo(idx)} className={`w-11 h-11 rounded-xl border text-sm transition-all duration-200 cursor-pointer tap-effect ${getPaletteStyle(idx)}`}>
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-5 border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#18181b] shrink-0 transition-colors">
          <div className="flex justify-around text-center bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 p-3 rounded-2xl shadow-sm">
            <div>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400">{Object.keys(answers).length}</p>
              <p className="text-[9px] font-bold text-zinc-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Attempted</p>
            </div>
            <div className="w-px bg-zinc-200 dark:bg-white/10 my-1"></div>
            <div>
              <p className="text-xl font-black text-zinc-400 dark:text-slate-500">{totalQuestions - Object.keys(answers).length}</p>
              <p className="text-[9px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Left</p>
            </div>
          </div>
        </div>
        
      </aside>
    </>
  );
}