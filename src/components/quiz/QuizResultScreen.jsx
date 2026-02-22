import React from 'react';
import { Trophy, ArrowRight } from 'lucide-react';

export default function QuizResultScreen({ totalQuestions, finalScore, navigate }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center bg-[#0f1115]">
      <div className="w-full max-w-2xl bg-[#1a1d24] border border-[#282e39] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0d59f2] via-purple-500 to-[#eab308]"></div>
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-[#0d59f2]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#0d59f2]/30 shadow-[0_0_40px_rgba(13,89,242,0.2)]">
            <Trophy className="w-12 h-12 text-[#0d59f2]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Mock Test Submitted!</h2>
          <p className="text-slate-400">Your score has been successfully saved to your profile.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#161920] border border-[#282e39] rounded-2xl p-5 text-center"><p className="text-4xl font-black text-white mb-1">{totalQuestions}</p><p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Total</p></div>
          <div className="bg-[#00d26a]/10 border border-[#00d26a]/30 rounded-2xl p-5 text-center shadow-[inset_0_0_20px_rgba(0,210,106,0.05)]"><p className="text-4xl font-black text-[#00d26a] mb-1">{finalScore.correct}</p><p className="text-[10px] text-[#00d26a]/70 uppercase tracking-widest font-bold">Correct</p></div>
          <div className="bg-[#f8312f]/10 border border-[#f8312f]/30 rounded-2xl p-5 text-center"><p className="text-4xl font-black text-[#f8312f] mb-1">{finalScore.wrong}</p><p className="text-[10px] text-[#f8312f]/70 uppercase tracking-widest font-bold">Wrong</p></div>
          <div className="bg-slate-500/10 border border-slate-500/30 rounded-2xl p-5 text-center"><p className="text-4xl font-black text-slate-300 mb-1">{finalScore.skipped}</p><p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Skipped</p></div>
        </div>
        <div className="flex justify-center">
          <button onClick={() => navigate('/practice')} className="px-8 py-3.5 rounded-full bg-[#0d59f2] hover:bg-[#0b4ecf] text-white font-bold transition-all shadow-[0_0_20px_rgba(13,89,242,0.4)] flex items-center justify-center gap-2 cursor-pointer">
            <ArrowRight className="w-5 h-5" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}