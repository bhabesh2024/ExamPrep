import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import MathText from '../common/MathText';

export default function OptionsList({ currentQuestionData, answers, currentQ, handleSelect, isAnswered }) {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="grid gap-4">
      {currentQuestionData.options.map((opt, idx) => {
        const selected = answers[currentQ] === idx;
        const isCorrect = isAnswered && opt === currentQuestionData.answer;
        const isWrongSelected = selected && !isCorrect;
        
        return (
          <button key={idx}
            onClick={() => !isAnswered && handleSelect(idx)}
            disabled={isAnswered}
            className={`relative flex items-center p-3.5 md:p-4 rounded-xl border-2 transition-all duration-300 text-left group overflow-hidden
              ${!isAnswered ? 'cursor-pointer hover:border-[#3b4354] hover:bg-[#1f2229]' : 'cursor-default'}
              ${isCorrect ? 'border-[#00d26a] bg-[#00d26a]/10' : ''}
              ${isWrongSelected ? 'border-[#f8312f] bg-[#f8312f]/10' : ''}
              ${!isCorrect && !isWrongSelected ? 'border-[#282e39] bg-[#1a1d24]' : ''}`}>
            {isCorrect && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#00d26a] fill-current" />}
            {isWrongSelected && <X className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#f8312f]" />}
            <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm shrink-0 transition-colors duration-300 relative z-10
              ${isCorrect ? 'bg-[#00d26a] text-white' : ''}
              ${isWrongSelected ? 'bg-[#f8312f] text-white' : ''}
              ${!isCorrect && !isWrongSelected ? 'bg-[#282e39] text-gray-400' : ''}`}>
              {letters[idx]}
            </div>
            <div className={`ml-4 md:ml-5 text-base md:text-lg font-medium transition-colors duration-300 relative z-10 pr-8
              ${isCorrect ? 'text-[#00d26a]' : ''}
              ${isWrongSelected ? 'text-[#f8312f]' : ''}
              ${!isCorrect && !isWrongSelected ? 'text-slate-300' : ''}`}>
              <MathText text={opt} />
            </div>
          </button>
        );
      })}
    </div>
  );
}