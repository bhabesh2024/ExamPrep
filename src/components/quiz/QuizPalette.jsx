import React from 'react';

export default function QuizPalette({ totalQuestions, currentQ, answers, review, visited, jumpTo, isPaused }) {
  const getPaletteStyle = (index) => {
    if (currentQ === index) return "bg-[#0d59f2] text-white font-bold shadow-[0_0_15px_#0d59f2] ring-2 ring-white/20 scale-110 z-10 border-transparent";
    if (answers[index] !== undefined) return "bg-[#00d26a]/20 border-[#00d26a]/50 text-[#00d26a] font-bold hover:brightness-110";
    if (review[index]) return "bg-[#eab308]/20 border-[#eab308]/50 text-[#eab308] font-bold hover:brightness-110";
    if (visited[index]) return "bg-[#f8312f]/20 border-[#f8312f]/50 text-[#f8312f] font-bold hover:brightness-110";
    return "bg-[#282e39] text-slate-500 font-medium hover:bg-[#3b4354] hover:text-slate-300 border-transparent";
  };

  return (
    <aside className={`w-80 bg-[#161920] border-l border-[#282e39] hidden lg:flex flex-col shrink-0 h-full transition-filter ${isPaused ? 'blur-sm' : ''}`}>
      <div className="p-4 md:p-5 border-b border-[#282e39] shrink-0">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Question Palette</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#00d26a] shadow-[0_0_8px_#00d26a]"></div><span className="text-xs text-slate-400">Answered</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f8312f] shadow-[0_0_8px_#f8312f]"></div><span className="text-xs text-slate-400">Not Answered</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#0d59f2] shadow-[0_0_8px_#0d59f2]"></div><span className="text-xs text-slate-400">Current</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-600"></div><span className="text-xs text-slate-400">Review</span></div>
        </div>
        <div className="grid grid-cols-5 gap-2.5">
          {Array.from({ length: totalQuestions }).map((_, idx) => (
            <button key={idx} onClick={() => jumpTo(idx)} className={`w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-semibold transition-all cursor-pointer ${getPaletteStyle(idx)}`}>
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5 border-t border-[#282e39] bg-[#161920] shrink-0">
        <div className="bg-[#1a1d24] rounded-xl p-4 border border-[#282e39]">
          <div className="flex justify-between items-center text-center px-2">
            <div><p className="text-2xl font-bold text-white">{Object.keys(answers).length}</p><p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Attempted</p></div>
            <div className="h-10 w-px bg-[#282e39]"></div>
            <div><p className="text-2xl font-bold text-slate-500">{totalQuestions - Object.keys(answers).length}</p><p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Left</p></div>
          </div>
        </div>
      </div>
    </aside>
  );
}