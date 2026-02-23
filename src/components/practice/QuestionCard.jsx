import React from 'react';
import { Languages, Search, Sparkles } from 'lucide-react'; // Sparkles icon add kiya AI feel ke liye
import MathText from '../common/MathText';
import GeometryVisualizer from '../common/GeometryVisualizer';

export default function QuestionCard({ currentQ, currentQuestionData, showQHindi, isTranslatingQ, hindiQuestionText, handleTranslateQuestion }) {
  
  // 🔍 Google AI (Gemini) Redirect Function
  const handleGoogleSearch = () => {
    const query = currentQuestionData?.question || '';
    // 👇 Yahan URL change karke Gemini par point kiya hai 👇
    // Note: User ko shayad Google account se login karna pade agar wo pehle se logged in nahi hai.
    window.open(`https://gemini.google.com/app?q=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="bg-[#1a1d24] rounded-2xl p-6 border border-[#282e39] shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 blur-2xl rounded-bl-full pointer-events-none"></div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0d59f2]/10 text-[#0d59f2] border border-[#0d59f2]/20 uppercase tracking-wider">
          Question {currentQ + 1}
        </span>
        <div className="flex items-center gap-2">
          
          <button onClick={handleTranslateQuestion} disabled={isTranslatingQ} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 ${showQHindi ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-[#282e39] border-slate-600 text-slate-300 hover:bg-[#3b4354]'}`}>
            {isTranslatingQ ? <><div className="w-3 h-3 border border-slate-400 border-t-white rounded-full animate-spin" /> ...</> : <><Languages className="w-3 h-3" /> {showQHindi ? 'English' : 'Hindi'}</>}
          </button>
          
          {/* 🔍 Google AI Search Button (Updated UI & Logic) */}
          <button onClick={handleGoogleSearch} className="group relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-300 border border-transparent overflow-hidden cursor-pointer">
            {/* Icon change karke Sparkles lagaya hai AI ke liye */}
            <Sparkles className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10 hidden sm:inline">Ask Google AI</span>
            <span className="relative z-10 sm:hidden">Ask AI</span>
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