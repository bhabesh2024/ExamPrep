import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import MathText from '../common/MathText';

export default function OptionsList({ currentQuestionData, answers, currentQ, handleSelect, isAnswered }) {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="grid gap-4 mt-2">
      {currentQuestionData.options.map((opt, idx) => {
        const selected = answers[currentQ] === idx;
        const isCorrect = isAnswered && opt === currentQuestionData.answer;
        const isWrongSelected = selected && !isCorrect;
        
        return (
          <button key={idx}
            onClick={() => !isAnswered && handleSelect(idx)}
            disabled={isAnswered}
            className={`relative flex items-center p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden tap-effect
              ${!isAnswered ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-zinc-50 dark:hover:bg-[#18181b]' : 'cursor-default'}
              ${isCorrect ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 shadow-sm z-10' : ''}
              ${isWrongSelected ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-500/10 shadow-sm z-10' : ''}
              ${!isCorrect && !isWrongSelected && selected ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-sm z-10' : ''}
              ${!isCorrect && !isWrongSelected && !selected ? 'border-zinc-200 dark:border-white/5 bg-white dark:bg-[#121214]' : ''}`}
          >
            {isCorrect && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-current" />}
            {isWrongSelected && <X className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-rose-600 dark:text-rose-500" />}
            
            <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm shrink-0 transition-all duration-300 relative z-10
              ${isCorrect ? 'bg-emerald-600 text-white scale-110 shadow-md' : ''}
              ${isWrongSelected ? 'bg-rose-600 text-white scale-110 shadow-md' : ''}
              ${!isCorrect && !isWrongSelected && selected ? 'bg-blue-600 text-white scale-110 shadow-md' : ''}
              ${!isCorrect && !isWrongSelected && !selected ? 'bg-zinc-100 dark:bg-[#27272a] text-zinc-500 dark:text-slate-400 group-hover:bg-zinc-200 dark:group-hover:bg-[#3f3f46]' : ''}`}
            >
              {letters[idx]}
            </div>
            
            <div className={`ml-4 md:ml-5 text-base md:text-lg font-semibold transition-colors duration-300 relative z-10 pr-8
              ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : ''}
              ${isWrongSelected ? 'text-rose-800 dark:text-rose-300' : ''}
              ${!isCorrect && !isWrongSelected && selected ? 'text-blue-900 dark:text-blue-200' : ''}
              ${!isCorrect && !isWrongSelected && !selected ? 'text-zinc-700 dark:text-slate-300 group-hover:text-zinc-900 dark:group-hover:text-white' : ''}`}
            >
              <MathText text={opt} />
            </div>
          </button>
        );
      })}
    </div>
  );
}