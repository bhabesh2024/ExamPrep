import React from 'react';
import { GraduationCap, ListOrdered, Timer as TimerIcon, Pause, Play, CheckSquare } from 'lucide-react';

export default function QuizHeader({ currentQ, totalQuestions, timeLeft, isPaused, setIsPaused, handleFinishTest, showResult, navigate }) {
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="flex-none h-16 sm:h-20 border-b border-zinc-200 dark:border-white/5 bg-white dark:bg-[#121214] px-4 md:px-6 flex items-center justify-between z-20 shrink-0 transition-colors duration-500 shadow-sm relative">
      
      {/* LEFT: Logo & Q-Count */}
      <div className="flex flex-1 items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 cursor-pointer tap-effect" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-md hidden sm:flex">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white hidden md:block transition-colors">PrepIQ</h1>
        </div>
        {!showResult && (
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 transition-colors">
            <ListOrdered className="text-zinc-500 dark:text-slate-400 w-4 h-4" />
            <span className="text-sm font-bold text-zinc-700 dark:text-slate-300">Q. {currentQ + 1} / {totalQuestions}</span>
          </div>
        )}
      </div>

      {/* CENTER: Fixed Timer (Absolute positioning removed, using strict flex center) */}
      {!showResult && (
        <div className="flex flex-1 justify-start sm:justify-center">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-colors duration-300 shadow-sm ${isPaused ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-500' : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400'}`}>
            <TimerIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-base sm:text-lg font-mono font-black tracking-widest">{formatTime(timeLeft)}</span>
          </div>
        </div>
      )}

      {/* RIGHT: Actions */}
      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
        {showResult ? (
          <button onClick={() => navigate('/practice')} className="h-10 px-5 rounded-full bg-zinc-100 dark:bg-[#27272a] hover:bg-zinc-200 dark:hover:bg-[#3f3f46] text-zinc-900 dark:text-white text-sm font-bold transition-all tap-effect shadow-sm border border-transparent dark:border-white/5">
            Exit to Dashboard
          </button>
        ) : (
          <>
            <button onClick={() => setIsPaused(!isPaused)} className={`flex items-center justify-center h-10 px-4 sm:px-5 rounded-full text-sm font-bold transition-all tap-effect shadow-sm border ${isPaused ? 'bg-amber-500 hover:bg-amber-600 text-white border-transparent' : 'bg-zinc-100 dark:bg-[#27272a] hover:bg-zinc-200 dark:hover:bg-[#3f3f46] text-zinc-700 dark:text-slate-200 border-zinc-200 dark:border-transparent'}`}>
              {isPaused ? <><Play className="w-4 h-4 sm:mr-2 fill-current" /> <span className="hidden sm:inline">Resume</span></> : <><Pause className="w-4 h-4 sm:mr-2 fill-current" /> <span className="hidden sm:inline">Pause</span></>}
            </button>
            <button onClick={handleFinishTest} className="flex items-center justify-center h-10 px-4 sm:px-5 rounded-full bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white border border-rose-200 dark:border-rose-500/30 hover:border-rose-500 text-sm font-bold transition-all tap-effect shadow-sm group">
              <span className="hidden sm:inline">Submit</span>
              <CheckSquare className="w-4 h-4 sm:hidden group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}