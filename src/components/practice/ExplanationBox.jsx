import React from 'react';
import { Lightbulb, Languages } from 'lucide-react';
import MathText from '../common/MathText';

export default function ExplanationBox({ isAnswered, explanationRef, handleViewInHindi, isTranslating, showHindi, hindiExplanation, currentQuestionData }) {
  if (!isAnswered || !currentQuestionData) return null;

  return (
    <div ref={explanationRef} className="mt-2 bg-[#151921] border border-[#282e39] rounded-2xl p-6 relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#00d26a]"></div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-bold text-[#00d26a] flex items-center gap-2">
          <Lightbulb className="w-5 h-5" /> Explanation
        </h3>
        <button onClick={handleViewInHindi} disabled={isTranslating} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${showHindi ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-[#282e39] border-slate-600 text-slate-300'}`}>
          {isTranslating ? <><div className="w-3 h-3 border border-slate-400 border-t-white rounded-full animate-spin" /> ...</> : <><Languages className="w-4 h-4" /> {showHindi ? 'English' : 'Hindi'}</>}
        </button>
      </div>
      <div className="text-slate-300 leading-relaxed text-sm md:text-base min-h-[60px]">
        {showHindi ? (
           <div key="expl-hi" className="fade-in-text font-display leading-relaxed"><MathText text={hindiExplanation} /></div>
        ) : (
           <div key="expl-en" className="fade-in-text"><MathText text={currentQuestionData.explanation} /></div>
        )}
      </div>
    </div>
  );
}