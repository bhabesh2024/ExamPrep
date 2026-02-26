import React from 'react';
import { Trophy, ArrowRight, BarChart3, CheckCircle2, XCircle, SkipForward } from 'lucide-react';

export default function QuizResultScreen({ totalQuestions, finalScore, navigate }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center bg-[#FAFAFA] dark:bg-[#09090B] transition-colors duration-500">
      
      <div className="w-full max-w-2xl bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-3xl p-8 md:p-12 shadow-xl dark:shadow-2xl relative overflow-hidden animate-[fadeIn_0.5s_ease-out] transition-colors duration-500">
        
        {/* Top Gradient Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-blue-100 dark:border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.1)] dark:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-colors duration-500">
            <Trophy className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 transition-colors duration-500">Mock Test Submitted!</h2>
          <p className="text-zinc-500 dark:text-slate-400 font-medium transition-colors duration-500">Your score has been successfully saved to your profile.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
          {/* Total Questions */}
          <div className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-colors duration-500 shadow-sm hover:-translate-y-1 hover:shadow-md">
            <BarChart3 className="w-5 h-5 text-zinc-400 dark:text-slate-500 mb-2" />
            <p className="text-3xl font-black text-zinc-900 dark:text-white mb-1">{totalQuestions}</p>
            <p className="text-[10px] text-zinc-500 dark:text-slate-500 uppercase tracking-widest font-bold">Total</p>
          </div>

          {/* Correct */}
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-colors duration-500 shadow-sm hover:-translate-y-1 hover:shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-1">{finalScore.correct}</p>
            <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest font-bold">Correct</p>
          </div>

          {/* Wrong */}
          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-colors duration-500 shadow-sm hover:-translate-y-1 hover:shadow-md">
            <XCircle className="w-5 h-5 text-rose-500 mb-2" />
            <p className="text-3xl font-black text-rose-600 dark:text-rose-400 mb-1">{finalScore.wrong}</p>
            <p className="text-[10px] text-rose-600/70 dark:text-rose-400/70 uppercase tracking-widest font-bold">Wrong</p>
          </div>

          {/* Skipped */}
          <div className="bg-zinc-100 dark:bg-slate-500/10 border border-zinc-300 dark:border-slate-500/30 rounded-2xl p-5 text-center flex flex-col items-center justify-center transition-colors duration-500 shadow-sm hover:-translate-y-1 hover:shadow-md">
            <SkipForward className="w-5 h-5 text-zinc-500 dark:text-slate-400 mb-2" />
            <p className="text-3xl font-black text-zinc-700 dark:text-slate-300 mb-1">{finalScore.skipped}</p>
            <p className="text-[10px] text-zinc-500 dark:text-slate-500 uppercase tracking-widest font-bold">Skipped</p>
          </div>
        </div>
        
        <div className="flex justify-center relative z-10">
          <button onClick={() => navigate('/practice')} className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer tap-effect group">
            Back to Dashboard <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        
      </div>
    </div>
  );
}