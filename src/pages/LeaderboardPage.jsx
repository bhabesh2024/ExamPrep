import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Flame, Activity } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('/api/leaderboard');
        setLeaderboard(res.data);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const myData = leaderboard.find(u => u.id === currentUser.id) || null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-slate-200 font-sans transition-colors duration-500 relative">
      <Navbar />

      <div className="pt-28 pb-32 max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 dark:bg-blue-600/20 blur-[80px] rounded-full pointer-events-none transition-colors"></div>
          <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-[#16202a] border border-blue-100 dark:border-[#258cf4]/30 rounded-2xl mb-4 shadow-lg dark:shadow-[0_0_30px_rgba(37,140,244,0.15)] relative z-10 transition-colors">
            <Trophy className="w-10 h-10 text-blue-600 dark:text-[#258cf4]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-3 relative z-10 transition-colors">Global Leaderboard</h1>
          <p className="text-zinc-500 dark:text-slate-400 text-lg relative z-10 transition-colors">Compete with the brightest minds across India.</p>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-500 dark:text-slate-400 font-medium">Crunching the latest ranks...</p>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-[#121217]/80 backdrop-blur-xl border border-zinc-200 dark:border-slate-800/80 rounded-[2rem] p-4 sm:p-8 shadow-xl dark:shadow-2xl relative z-10 transition-colors">
            
            {/* TOP 3 PODIUM */}
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mb-12 pt-8">
              {leaderboard[1] && (
                <div className="flex flex-col items-center order-2 md:order-1 relative w-full md:w-auto">
                  <div className="absolute -top-6 text-zinc-400 dark:text-slate-300"><Medal className="w-8 h-8 drop-shadow-md" /></div>
                  <img src={leaderboard[1].avatar} alt="avatar" className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-[#1a1d24] border-4 border-zinc-300 dark:border-slate-300 shadow-md mb-3 z-10" />
                  <div className="bg-zinc-50 dark:bg-[#1a1d24] border border-zinc-200 dark:border-slate-700/50 w-full md:w-32 py-4 rounded-t-2xl flex flex-col items-center transition-colors">
                    <span className="font-bold text-zinc-900 dark:text-white text-sm truncate w-full text-center px-2">{leaderboard[1].name}</span>
                    <span className="text-blue-600 dark:text-[#258cf4] font-black">{leaderboard[1].score} XP</span>
                  </div>
                </div>
              )}

              {leaderboard[0] && (
                <div className="flex flex-col items-center order-1 md:order-2 relative w-full md:w-auto z-20 md:-translate-y-8">
                  <div className="absolute -top-8 text-amber-500 dark:text-yellow-400 animate-bounce"><Trophy className="w-10 h-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" /></div>
                  <img src={leaderboard[0].avatar} alt="avatar" className="w-28 h-28 rounded-full bg-zinc-100 dark:bg-[#1a1d24] border-4 border-amber-400 shadow-[0_0_20px_rgba(250,204,21,0.3)] mb-3 z-10" />
                  <div className="bg-gradient-to-t from-amber-100 dark:from-yellow-500/20 to-white dark:to-[#1a1d24] border border-amber-200 dark:border-yellow-500/30 w-full md:w-40 py-6 rounded-t-2xl flex flex-col items-center shadow-xl transition-colors">
                    <span className="font-black text-zinc-900 dark:text-white text-base truncate w-full text-center px-2">{leaderboard[0].name}</span>
                    <span className="text-amber-600 dark:text-yellow-400 font-black text-lg">{leaderboard[0].score} XP</span>
                  </div>
                </div>
              )}

              {leaderboard[2] && (
                <div className="flex flex-col items-center order-3 relative w-full md:w-auto">
                  <div className="absolute -top-6 text-orange-600 dark:text-amber-600"><Medal className="w-8 h-8 drop-shadow-md" /></div>
                  <img src={leaderboard[2].avatar} alt="avatar" className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-[#1a1d24] border-4 border-orange-400 dark:border-amber-600 shadow-md mb-3 z-10" />
                  <div className="bg-zinc-50 dark:bg-[#1a1d24] border border-zinc-200 dark:border-slate-700/50 w-full md:w-32 py-4 rounded-t-2xl flex flex-col items-center transition-colors">
                    <span className="font-bold text-zinc-900 dark:text-white text-sm truncate w-full text-center px-2">{leaderboard[2].name}</span>
                    <span className="text-blue-600 dark:text-[#258cf4] font-black">{leaderboard[2].score} XP</span>
                  </div>
                </div>
              )}
            </div>

            {/* THE LIST */}
            <div className="space-y-3">
              <div className="flex px-4 py-2 text-xs font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-wider border-b border-zinc-200 dark:border-slate-800 transition-colors">
                <div className="w-16">Rank</div>
                <div className="flex-1">Student</div>
                <div className="w-24 text-right">Score (XP)</div>
              </div>

              {leaderboard.slice(3).map((user) => {
                const isMe = currentUser.id === user.id;
                
                return (
                  <div key={user.id} className={`flex items-center px-4 py-3 rounded-2xl transition-all ${isMe ? 'bg-blue-50 dark:bg-[#258cf4]/10 border border-blue-200 dark:border-[#258cf4]/30 shadow-sm' : 'bg-white dark:bg-[#101922] border border-zinc-100 dark:border-slate-800/50 hover:bg-zinc-50 dark:hover:bg-[#16202a]'}`}>
                    <div className={`w-16 font-black text-lg ${isMe ? 'text-blue-600 dark:text-[#258cf4]' : 'text-zinc-400 dark:text-slate-500'}`}>
                      #{user.rank}
                    </div>
                    
                    <div className="flex-1 flex items-center gap-3">
                      <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-slate-800 shadow-sm" />
                      <div className="flex flex-col">
                        <span className={`font-bold text-sm ${isMe ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-slate-300'}`}>
                          {user.name} {isMe && <span className="ml-2 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold shadow-sm">You</span>}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-500 font-bold mt-0.5">
                          <Activity className="w-3 h-3" /> Active recently
                        </span>
                      </div>
                    </div>

                    <div className={`w-24 text-right font-black ${isMe ? 'text-zinc-900 dark:text-white' : 'text-blue-600 dark:text-[#258cf4]'}`}>
                      {user.score}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* STICKY CURRENT USER BAR */}
      {myData && (
        <div className="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-[#121217]/95 backdrop-blur-md border-t border-zinc-200 dark:border-[#258cf4]/30 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(37,140,244,0.15)] animate-[slideInUp_0.5s_ease-out] transition-colors">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="font-black text-3xl text-blue-600 dark:text-[#258cf4] w-16">#{myData.rank}</div>
              <img src={myData.avatar} className="w-12 h-12 rounded-full border-2 border-blue-500 dark:border-[#258cf4] shadow-sm" alt="You" />
              <div className="flex flex-col">
                <span className="font-bold text-zinc-900 dark:text-white text-base">Your Rank</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold"><Flame className="w-3 h-3 fill-current" /> Keep Practicing!</span>
              </div>
            </div>
            <div className="font-black text-2xl text-amber-500 dark:text-yellow-400">
              {myData.score} <span className="text-sm text-amber-600 dark:text-yellow-600">XP</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}