import React from 'react';
import { User, Lock } from 'lucide-react';

export default function GuestView({ navigate }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-slate-100 font-sans flex items-center justify-center pt-20 pb-20 transition-colors duration-500 px-4">
      <div className="max-w-md w-full bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-8 text-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>
        <div className="w-20 h-20 bg-zinc-50 dark:bg-[#18181b] rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-200 dark:border-white/10 shadow-sm">
          <Lock className="w-8 h-8 text-zinc-400 dark:text-slate-500" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-3">Your Learning Hub</h2>
        <p className="text-zinc-500 dark:text-slate-400 font-medium text-sm mb-8">Sign in to track your performance, view your mock test history, and earn XP points.</p>
        <button onClick={() => navigate('/login')} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-black transition-all shadow-md hover:shadow-blue-500/30 tap-effect w-full sm:w-auto">
          Sign In / Sign Up
        </button>
      </div>
    </div>
  );
}