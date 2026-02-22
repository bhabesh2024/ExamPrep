import React from 'react';
import { Flag, Bookmark, CheckCircle2 } from 'lucide-react';
import MathText from '../common/MathText';
import GeometryVisualizer from '../common/GeometryVisualizer';

export default function QuizQuestionArea({ currentQ, currentQuestionData, handleMarkReview, review, handleSelect, answers }) {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-8">
      {/* Question Card */}
      <div className="bg-[#1a1d24] rounded-xl p-6 border border-[#282e39] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[#0d59f2] font-semibold text-sm tracking-wider uppercase">Question {currentQ + 1}</span>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-[#282e39] rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"><Flag className="w-5 h-5" /></button>
            <button onClick={handleMarkReview} className="p-1.5 hover:bg-[#282e39] rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer">
              <Bookmark className={`w-5 h-5 ${review[currentQ] ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </button>
          </div>
        </div>
        <div className="text-lg md:text-xl font-medium leading-relaxed text-slate-200">
          <MathText text={currentQuestionData?.question || ''} />
        </div>
        {currentQuestionData?.questionHindi && (
          <div className="text-md md:text-lg font-medium leading-relaxed text-slate-400 mt-2 font-display">
            <MathText text={currentQuestionData.questionHindi} />
          </div>
        )}
        <GeometryVisualizer type={currentQuestionData?.geometryType} dataStr={currentQuestionData?.geometryData} />
      </div>

      {/* Options List */}
      <div className="grid gap-3 md:gap-4">
        {currentQuestionData?.options?.map((opt, idx) => {
          const selected = answers[currentQ] === idx;
          return (
            <button key={idx} onClick={() => handleSelect(idx)}
              className={`relative flex items-center p-3.5 md:p-4 rounded-xl border-2 transition-all duration-300 text-left group overflow-hidden cursor-pointer
                ${selected ? 'border-[#0d59f2] bg-[#0d59f2]/10 shadow-[0_0_15px_-3px_rgba(13,89,242,0.3),inset_0_0_10px_rgba(13,89,242,0.15)] scale-[1.01] z-10' : 'border-[#282e39] bg-[#1a1d24] hover:border-[#3b4354] hover:bg-[#1f2229]'}`}>
              {selected && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#0d59f2] fill-current drop-shadow-[0_0_5px_rgba(13,89,242,0.5)]" />}
              <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm shrink-0 transition-colors duration-300 relative z-10 ${selected ? 'bg-[#0d59f2] text-white shadow-[0_0_8px_#0d59f2]' : 'bg-[#282e39] text-gray-400 group-hover:bg-[#3b4354]'}`}>{letters[idx]}</div>
              <div className={`ml-4 md:ml-5 text-base md:text-lg font-medium transition-colors duration-300 relative z-10 pr-8 ${selected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}><MathText text={opt} /></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}