import React from 'react';
import { GraduationCap, ListOrdered, ArrowLeft } from 'lucide-react';

// 🔥 handleExit ko props mein receive kiya
export default function PracticeHeader({ topicId, showResult, isLoadingQuestions, totalQuestions, currentQ, setIsMobilePaletteOpen, handleExit }) {
  const safeTopicId = topicId ? topicId.replace(/-/g, ' ') : 'Topic';

  return (
    <header className="flex-none h-14 md:h-16 border-b border-[#282e39] bg-[#1a1d24] px-3 md:px-6 flex items-center justify-between z-20 relative">
      <div className="flex items-center gap-3 md:gap-4">
        {/* 🔥 Yahan navigate(-1) ki jagah handleExit lagaya */}
        <button onClick={handleExit} className="p-2 -ml-2 rounded-full hover:bg-[#282e39] text-slate-400 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="h-6 w-px bg-[#282e39] hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <GraduationCap className="text-[#0d59f2] w-6 h-6" />
          <h1 className="text-base md:text-lg font-bold text-white hidden sm:block capitalize">{safeTopicId} Practice</h1>
        </div>
        {!showResult && !isLoadingQuestions && totalQuestions > 0 && (
          <button onClick={() => setIsMobilePaletteOpen(true)} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#282e39] border border-[#3b4354] hover:bg-[#3b4354] transition-colors lg:pointer-events-none ml-2 cursor-pointer">
            <ListOrdered className="w-4 h-4 text-[#0d59f2] lg:text-gray-400" />
            <span className="text-xs font-medium text-gray-300">Q. {currentQ + 1}/{totalQuestions}</span>
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-[#00d26a]/10 border border-[#00d26a]/20 text-[#00d26a] text-xs font-bold uppercase tracking-widest">
          {showResult ? 'Practice Complete' : 'Learning Mode'}
        </span>
        {/* 🔥 Yahan bhi navigate(-1) ki jagah handleExit lagaya */}
        <button onClick={handleExit} className="h-8 md:h-9 px-4 rounded-full bg-[#282e39] hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30 text-white text-xs md:text-sm font-bold transition-all cursor-pointer">
          Exit
        </button>
      </div>
    </header>
  );
}