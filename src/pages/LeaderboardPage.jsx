import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Star, Flame, Activity } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Current logged in user nikal rahe hain taaki usko highlight kar sakein
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-blue-500/30">
      <Navbar />

      <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="inline-flex items-center justify-center p-4 bg-[#16202a] border border-[#258cf4]/30 rounded-2xl mb-4 shadow-[0_0_30px_rgba(37,140,244,0.15)] relative z-10">
            <Trophy className="w-10 h-10 text-[#258cf4]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 relative z-10">Global Leaderboard</h1>
          <p className="text-slate-400 text-lg relative z-10">Compete with the brightest minds across India.</p>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#258cf4]/30 border-t-[#258cf4] rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium">Crunching the latest ranks...</p>
          </div>
        ) : (
          <div className="bg-[#121217]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-4 sm:p-8 shadow-2xl relative z-10">
            
            {/* TOP 3 PODIUM (Ekdum Premium Feel) */}
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mb-12 pt-8">
              {/* Rank 2 (Silver) */}
              {leaderboard[1] && (
                <div className="flex flex-col items-center order-2 md:order-1 relative w-full md:w-auto">
                  <div className="absolute -top-6 text-slate-300"><Medal className="w-8 h-8 drop-shadow-lg" /></div>
                  <img src={leaderboard[1].avatar} alt="avatar" className="w-20 h-20 rounded-full bg-[#1a1d24] border-4 border-slate-300 shadow-lg mb-3 z-10" />
                  <div className="bg-[#1a1d24] border border-slate-700/50 w-full md:w-32 py-4 rounded-t-xl flex flex-col items-center">
                    <span className="font-bold text-white text-sm truncate w-full text-center px-2">{leaderboard[1].name}</span>
                    <span className="text-[#258cf4] font-black">{leaderboard[1].score} XP</span>
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold) */}
              {leaderboard[0] && (
                <div className="flex flex-col items-center order-1 md:order-2 relative w-full md:w-auto z-20 md:-translate-y-8">
                  <div className="absolute -top-8 text-yellow-400 animate-bounce"><Trophy className="w-10 h-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" /></div>
                  <img src={leaderboard[0].avatar} alt="avatar" className="w-28 h-28 rounded-full bg-[#1a1d24] border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)] mb-3 z-10" />
                  <div className="bg-gradient-to-t from-yellow-500/20 to-[#1a1d24] border border-yellow-500/30 w-full md:w-40 py-6 rounded-t-xl flex flex-col items-center shadow-2xl">
                    <span className="font-black text-white text-base truncate w-full text-center px-2">{leaderboard[0].name}</span>
                    <span className="text-yellow-400 font-black text-lg">{leaderboard[0].score} XP</span>
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {leaderboard[2] && (
                <div className="flex flex-col items-center order-3 relative w-full md:w-auto">
                  <div className="absolute -top-6 text-amber-600"><Medal className="w-8 h-8 drop-shadow-lg" /></div>
                  <img src={leaderboard[2].avatar} alt="avatar" className="w-20 h-20 rounded-full bg-[#1a1d24] border-4 border-amber-600 shadow-lg mb-3 z-10" />
                  <div className="bg-[#1a1d24] border border-slate-700/50 w-full md:w-32 py-4 rounded-t-xl flex flex-col items-center">
                    <span className="font-bold text-white text-sm truncate w-full text-center px-2">{leaderboard[2].name}</span>
                    <span className="text-[#258cf4] font-black">{leaderboard[2].score} XP</span>
                  </div>
                </div>
              )}
            </div>

            {/* THE LIST (Rank 4 to 150) */}
            <div className="space-y-3">
              <div className="flex px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                <div className="w-16">Rank</div>
                <div className="flex-1">Student</div>
                <div className="w-24 text-right">Score (XP)</div>
              </div>

              {leaderboard.slice(3).map((user) => {
                const isMe = currentUser.id === user.id && user.isReal;
                
                return (
                  <div 
                    key={user.id} 
                    className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                      isMe 
                        ? 'bg-[#258cf4]/10 border border-[#258cf4]/30 shadow-[0_0_15px_rgba(37,140,244,0.1)]' 
                        : 'bg-[#101922] border border-slate-800/50 hover:bg-[#16202a]'
                    }`}
                  >
                    <div className={`w-16 font-black text-lg ${isMe ? 'text-[#258cf4]' : 'text-slate-500'}`}>
                      #{user.rank}
                    </div>
                    
                    <div className="flex-1 flex items-center gap-3">
                      <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full bg-slate-800" />
                      <div className="flex flex-col">
                        <span className={`font-bold text-sm ${isMe ? 'text-white' : 'text-slate-300'}`}>
                          {user.name} {isMe && <span className="ml-2 text-[10px] bg-[#258cf4] text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">You</span>}
                        </span>
                        {/* Fake active status tag for realistic feel */}
                        <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium mt-0.5">
                          <Activity className="w-3 h-3" /> Active recently
                        </span>
                      </div>
                    </div>

                    <div className={`w-24 text-right font-black ${isMe ? 'text-white' : 'text-[#258cf4]'}`}>
                      {user.score}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}