import React from 'react';
import { GraduationCap, ListOrdered, Timer as TimerIcon, Pause, Play } from 'lucide-react';

export default function QuizHeader({ currentQ, totalQuestions, timeLeft, isPaused, setIsPaused, handleFinishTest, showResult, navigate }) {
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="flex-none h-16 border-b border-[#282e39] bg-[#1a1d24] px-4 md:px-6 flex items-center justify-between z-20 shrink-0 relative">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-white">
          <GraduationCap className="text-[#0d59f2] w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">PrepIQ</h1>
        </div>
        {!showResult && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#282e39] border border-[#3b4354]">
            <ListOrdered className="text-gray-400 w-4 h-4" />
            <span className="text-sm font-medium text-gray-300">Q. {currentQ + 1} / {totalQuestions}</span>
          </div>
        )}
      </div>

      {!showResult && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${isPaused ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : 'bg-[#1a1d24] border-[#0d59f2]/30 text-[#0d59f2]'}`}>
            <TimerIcon className="w-4 h-4" />
            <span className="text-lg font-mono font-bold tracking-widest">{formatTime(timeLeft)}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {showResult ? (
          <button onClick={() => navigate('/practice')} className="h-9 px-4 rounded-full bg-[#282e39] hover:bg-[#3b4354] text-white text-sm font-bold transition-all cursor-pointer">Exit to Dashboard</button>
        ) : (
          <>
            <button onClick={() => setIsPaused(!isPaused)} className={`flex items-center justify-center h-9 px-4 rounded-full text-sm font-semibold transition-colors border cursor-pointer ${isPaused ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-[#282e39] hover:bg-[#3b4354] text-white border-transparent'}`}>
              {isPaused ? <><Play className="w-4 h-4 sm:mr-2 fill-current" /> <span className="hidden sm:inline">Resume</span></> : <><Pause className="w-4 h-4 sm:mr-2 fill-current" /> <span className="hidden sm:inline">Pause</span></>}
            </button>
            <button onClick={handleFinishTest} className="flex items-center justify-center h-9 px-4 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 hover:border-red-500 text-sm font-bold transition-all cursor-pointer">Submit Test</button>
          </>
        )}
      </div>
    </header>
  );
}