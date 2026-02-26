import React from 'react';
import { Settings, CheckCircle2, Crown, Play, Trophy, Lock, BarChart3, MessageSquare, ShoppingBag, Users, Bookmark, ChevronRight, LogOut } from 'lucide-react';

export default function HubView({ user, level, userXP, xpForNextLevel, xpProgressPercent, setActiveView, navigate, handleLogout }) {
  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center px-2 pt-2">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">Profile Hub</h1>
        <button onClick={() => setActiveView('settings')} className="p-2 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 rounded-full hover:bg-zinc-100 dark:hover:bg-[#27272a] transition-all shadow-sm tap-effect">
          <Settings className="w-5 h-5 text-zinc-700 dark:text-slate-300" />
        </button>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 p-6 sm:p-8 shadow-sm transition-colors duration-500">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 dark:bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 bg-gradient-to-br from-blue-600 via-violet-500 to-transparent shadow-sm">
              <div className="w-full h-full rounded-full bg-white dark:bg-[#18181b] flex items-center justify-center text-3xl font-black text-zinc-900 dark:text-white shadow-inner">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#121214] rounded-full p-1">
              <div className="bg-blue-600 w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                <CheckCircle2 className="text-white w-3 h-3" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-start w-full">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white mb-2">{user?.name}</h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
              {user?.isPremium ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                  <Crown className="w-3 h-3" /> Premium
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-[#27272a] border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                  Free Plan
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                Level {level}
              </span>
            </div>
            <div className="w-full max-w-sm mt-1">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-zinc-500 dark:text-slate-400">XP Progress</span>
                <span className="text-blue-600 dark:text-blue-400">{userXP} / {xpForNextLevel}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 dark:bg-[#27272a] rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${Math.max(xpProgressPercent, 5)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-6 flex flex-wrap justify-center sm:justify-start gap-3 border-t border-zinc-100 dark:border-white/5 pt-6">
          <button onClick={() => navigate('/practice')} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-sm hover:shadow-blue-500/30 tap-effect w-full sm:w-auto">
            <Play className="w-3.5 h-3.5 fill-current" /> Resume Practice
          </button>
          {user?.isPremium ? (
            <button onClick={() => navigate('/leaderboard')} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-sm font-bold transition-all shadow-sm tap-effect w-full sm:w-auto">
              <Trophy className="w-3.5 h-3.5" /> Leaderboard
            </button>
          ) : (
            <button onClick={() => { alert("Premium feature. Upgrade to Pro!"); navigate('/pricing'); }} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white text-sm font-bold transition-all tap-effect w-full sm:w-auto">
              <Lock className="w-3.5 h-3.5" /> Leaderboard (Pro)
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button onClick={() => setActiveView('performance')} className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 p-4 rounded-[1.5rem] flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group tap-effect">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0"><BarChart3 className="w-5 h-5" /></div>
            <div className="text-left"><h3 className="font-bold text-zinc-900 dark:text-white text-sm">Performance</h3><p className="text-[10px] font-medium text-zinc-500 dark:text-slate-400">Test history</p></div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
        </button>

        <button onClick={() => setActiveView('saved')} className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 p-4 rounded-[1.5rem] flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group tap-effect">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0"><Bookmark className="w-5 h-5" /></div>
            <div className="text-left"><h3 className="font-bold text-zinc-900 dark:text-white text-sm">Saved Items</h3><p className="text-[10px] font-medium text-zinc-500 dark:text-slate-400">Bookmarked questions</p></div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
        </button>

        <button onClick={() => setActiveView('community')} className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 p-4 rounded-[1.5rem] flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group tap-effect">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0"><Users className="w-5 h-5" /></div>
            <div className="text-left"><h3 className="font-bold text-zinc-900 dark:text-white text-sm">Community</h3><p className="text-[10px] font-medium text-zinc-500 dark:text-slate-400">Feed & Discussions</p></div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-purple-500 transition-colors" />
        </button>

        <button onClick={() => setActiveView('support')} className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 p-4 rounded-[1.5rem] flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group tap-effect">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0"><MessageSquare className="w-5 h-5" /></div>
            <div className="text-left"><h3 className="font-bold text-zinc-900 dark:text-white text-sm">Support</h3><p className="text-[10px] font-medium text-zinc-500 dark:text-slate-400">Tickets & queries</p></div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
        </button>

        <button onClick={() => setActiveView('orders')} className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 p-4 rounded-[1.5rem] flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group tap-effect">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0"><ShoppingBag className="w-5 h-5" /></div>
            <div className="text-left"><h3 className="font-bold text-zinc-900 dark:text-white text-sm">My Orders</h3><p className="text-[10px] font-medium text-zinc-500 dark:text-slate-400">Subscriptions</p></div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-orange-500 transition-colors" />
        </button>
      </div>

      <button onClick={handleLogout} className="md:hidden mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold hover:bg-rose-500 hover:text-white transition-colors tap-effect w-full">
        <LogOut className="w-4 h-4" /> Log Out
      </button>
    </div>
  );
}