import React from 'react';
import { Languages, Sparkles } from 'lucide-react';
import MathText from '../common/MathText';
import GeometryVisualizer from '../common/GeometryVisualizer';

export default function QuestionCard({ currentQ, currentQuestionData, showQHindi, isTranslatingQ, hindiQuestionText, handleTranslateQuestion, openAiChatForQuestion }) {
  return (
    <div className="bg-[#1a1d24] rounded-2xl p-6 border border-[#282e39] shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/5 blur-2xl rounded-bl-full pointer-events-none"></div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0d59f2]/10 text-[#0d59f2] border border-[#0d59f2]/20 uppercase tracking-wider">
          Question {currentQ + 1}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={handleTranslateQuestion} disabled={isTranslatingQ} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 ${showQHindi ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-[#282e39] border-slate-600 text-slate-300 hover:bg-[#3b4354]'}`}>
            {isTranslatingQ ? <><div className="w-3 h-3 border border-slate-400 border-t-white rounded-full animate-spin" /> ...</> : <><Languages className="w-3 h-3" /> {showQHindi ? 'English' : 'Hindi'}</>}
          </button>
          <button onClick={openAiChatForQuestion} className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:scale-105 transition-all duration-300 border border-white/20 overflow-hidden cursor-pointer">
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
            <Sparkles className="w-4 h-4 relative z-10" />
            <span className="relative z-10 hidden sm:inline">Ask AI Tutor</span>
            <span className="relative z-10 sm:hidden">AI</span>
          </button>
        </div>
      </div>

      <div className="text-base md:text-xl font-medium leading-relaxed text-slate-200 relative z-10 min-h-[140px] flex items-start">
        {showQHindi ? (
           <div key="hindi" className="fade-in-text font-display w-full">
             <MathText text={hindiQuestionText} />
           </div>
        ) : (
           <div key="english" className="fade-in-text w-full">
             <MathText text={currentQuestionData.question} />
           </div>
        )}
      </div>
      <GeometryVisualizer type={currentQuestionData.geometryType} dataStr={currentQuestionData.geometryData} />
    </div>
  );
}