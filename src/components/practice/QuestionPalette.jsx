import React from 'react';
import { X } from 'lucide-react';

export default function QuestionPalette({ totalQuestions, currentQ, answers, review, visited, jumpTo, isMobilePaletteOpen, setIsMobilePaletteOpen }) {
  const getPaletteStyle = (index) => {
    if (currentQ === index) return "bg-[#0d59f2] text-white font-bold shadow-[0_0_10px_#0d59f2] ring-1 ring-white/20 scale-105 border-transparent";
    if (answers[index] !== undefined) return "bg-[#00d26a]/20 border-[#00d26a]/40 text-[#00d26a]";
    if (review[index]) return "bg-[#eab308]/20 border-[#eab308]/40 text-[#eab308]";
    if (visited[index]) return "bg-[#f8312f]/20 border-[#f8312f]/40 text-[#f8312f]";
    return "bg-[#282e39] text-slate-500 border-transparent hover:bg-[#3b4354]";
  };

  return (
    <>
      {isMobilePaletteOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobilePaletteOpen(false)}></div>}
      <aside className={`fixed lg:static top-0 right-0 h-full z-50 w-72 bg-[#161920] border-l border-[#282e39] flex flex-col shrink-0 overflow-hidden transition-transform duration-300 ease-in-out ${isMobilePaletteOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-[#282e39] flex justify-between items-center bg-[#1a1d24] shrink-0">
          <h3 className="text-white font-bold text-xs uppercase tracking-widest">Questions</h3>
          <button onClick={() => setIsMobilePaletteOpen(false)} className="lg:hidden p-1 bg-[#282e39] rounded-full text-gray-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#161920]">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#00d26a]"></div><span className="text-[10px] text-slate-400 uppercase">Answered</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#eab308]"></div><span className="text-[10px] text-slate-400 uppercase">Review</span></div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: totalQuestions }).map((_, idx) => (
              <button key={idx} onClick={() => jumpTo(idx)} className={`w-10 h-10 rounded-lg border text-xs font-bold transition-all cursor-pointer ${getPaletteStyle(idx)}`}>
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-[#282e39] bg-[#1a1d24] shrink-0">
          <div className="flex justify-around text-center">
            <div><p className="text-lg font-bold text-white">{Object.keys(answers).length}</p><p className="text-[9px] text-slate-500 uppercase">Attempted</p></div>
            <div className="w-px bg-[#282e39]"></div>
            <div><p className="text-lg font-bold text-slate-500">{totalQuestions - Object.keys(answers).length}</p><p className="text-[9px] text-slate-500 uppercase">Left</p></div>
          </div>
        </div>
      </aside>
    </>
  );
}