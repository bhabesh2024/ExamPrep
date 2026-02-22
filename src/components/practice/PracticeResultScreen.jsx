import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PracticeResultScreen({ totalQuestions, correctCount, wrongCount, skippedCount, handleRetake }) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[#1a1d24] border border-[#282e39] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00d26a] via-[#0d59f2] to-[#eab308]"></div>
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#0d59f2]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#0d59f2]/30">
            <Trophy className="w-10 h-10 text-[#0d59f2]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Practice Completed!</h2>
          <p className="text-slate-400">Your score has been saved.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#161920] border border-[#282e39] rounded-2xl p-4 text-center"><p className="text-3xl font-bold text-white mb-1">{totalQuestions}</p><p className="text-xs text-slate-500 uppercase tracking-widest">Total</p></div>
          <div className="bg-[#00d26a]/10 border border-[#00d26a]/30 rounded-2xl p-4 text-center"><p className="text-2xl font-bold text-[#00d26a] mb-1">{correctCount}</p><p className="text-[10px] text-[#00d26a]/70 uppercase tracking-widest">Correct</p></div>
          <div className="bg-[#f8312f]/10 border border-[#f8312f]/30 rounded-2xl p-4 text-center"><p className="text-2xl font-bold text-[#f8312f] mb-1">{wrongCount}</p><p className="text-[10px] text-[#f8312f]/70 uppercase tracking-widest">Wrong</p></div>
          <div className="bg-slate-500/10 border border-slate-500/30 rounded-2xl p-4 text-center"><p className="text-2xl font-bold text-slate-300 mb-1">{skippedCount}</p><p className="text-[10px] text-slate-500 uppercase tracking-widest">Skipped</p></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={handleRetake} className="px-8 py-3.5 rounded-full bg-[#0d59f2] hover:bg-[#0b4ecf] text-white font-bold transition-all shadow-[0_0_20px_rgba(13,89,242,0.4)] flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" /> Retake Practice
          </button>
          <button onClick={() => navigate('/practice')} className="px-8 py-3.5 rounded-full border border-slate-600 bg-[#282e39] hover:bg-[#3b4354] text-white font-bold transition-all flex items-center justify-center gap-2">
            Back to Subjects
          </button>
        </div>
      </div>
    </div>
  );
}