import React from 'react';
import { ArrowLeft, CheckCircle2, Crown, User, ShoppingBag } from 'lucide-react';

export default function OrdersView({ user, setActiveView, navigate }) {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-slide-in pb-10">
      <div className="flex items-center gap-3 px-2 pt-2 mb-2">
        <button onClick={() => setActiveView('hub')} className="p-2 -ml-2 rounded-full hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-600 dark:text-slate-300 transition-colors tap-effect">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-zinc-900 dark:text-white">My Orders</h1>
      </div>

      <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[1.5rem] p-6 shadow-sm">
        <h3 className="text-[10px] font-black text-zinc-500 dark:text-slate-400 uppercase tracking-widest mb-4">Current Subscription</h3>
        
        {!user?.isPremium ? (
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-[#18181b] flex items-center justify-center"><User className="w-5 h-5 text-zinc-500" /></div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Free Basic Plan</h4>
                <p className="text-xs font-medium text-zinc-500">Limited Access</p>
              </div>
            </div>
            <button onClick={() => navigate('/pricing')} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors tap-effect mt-2 shadow-sm">
              Upgrade to Pro
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <Crown className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h4 className="text-lg font-black text-zinc-900 dark:text-white">PrepIQ Pro Plan</h4>
                <p className="text-xs font-medium text-emerald-500 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3" /> Active Status</p>
              </div>
            </div>
            <div className="mt-2 p-3 rounded-xl bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-zinc-500 dark:text-slate-400 uppercase tracking-widest font-bold">Valid Until</p>
                <p className="text-xs font-bold text-zinc-900 dark:text-white mt-0.5">
                  {user?.premiumExpiry ? new Date(user.premiumExpiry).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Lifetime Access'}
                </p>
              </div>
              <span className="px-2 py-1 bg-zinc-200 dark:bg-[#27272a] rounded-lg text-[10px] font-bold text-zinc-700 dark:text-slate-300">Paid</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}