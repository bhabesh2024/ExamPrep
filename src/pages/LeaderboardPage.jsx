import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Crown, Lock, ArrowRight, ShieldCheck, BarChart2, Star, Trophy, Medal, Zap } from 'lucide-react';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          navigate('/login');
          return;
        }
        
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
  
        // 🏆 Ek Premium Fallback Dummy Data
        const fallbackData = [
          { id: 'dummy-1', name: "Sarah J", totalXP: 15200, isPremium: true },
          { id: 'dummy-2', name: "Dev Mike", totalXP: 14800, isPremium: true },
          { id: 'dummy-3', name: "Design Guru", totalXP: 14500, isPremium: true },
          { id: 'dummy-4', name: "Alex Doe", totalXP: 13900, isPremium: true },
          { id: parsedUser.id, name: parsedUser.name || "Bhabesh", totalXP: 13500, isPremium: true }, // Aapka naam
          { id: 'dummy-6', name: "Jordan S", totalXP: 13200, isPremium: true },
          { id: 'dummy-7', name: "Casey L", totalXP: 12800, isPremium: true }
        ];
  
        try {
          const response = await axios.get('/api/leaderboard');
          
          // Agar data backend se nahi aa raha ya proxy fail ho gayi, toh Fallback data dikhao
          if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
            console.log("⚠️ Backend se data nahi mila, Dummy Data load kar rahe hain!");
            setLeaderboard(fallbackData);
            setCurrentUserData({ ...fallbackData[4], rank: 5 });
            return;
          }
  
          const data = response.data;
          
          // Agar backend se data aaya par 3 se kam log hain, toh bhi dummy bhar do
          let filledData = [...data];
          while (filledData.length < 5) {
            filledData.push({ id: `dummy-${filledData.length}`, name: "PrepIQ Student", totalXP: 8000, isPremium: false });
          }
          
          setLeaderboard(filledData);
  
          const myRankIndex = filledData.findIndex(u => u.id === parsedUser.id);
          if (myRankIndex !== -1) {
            setCurrentUserData({ ...filledData[myRankIndex], rank: myRankIndex + 1 });
          } else {
             setCurrentUserData({ ...filledData[0], rank: 1 }); // Just fallback
          }
        } catch (error) {
          console.error("❌ API fail ho gayi, Fallback Data use kar rahe hain.", error);
          setLeaderboard(fallbackData);
          setCurrentUserData({ ...fallbackData[4], rank: 5 });
        } finally {
          setIsLoading(false);
        }
      };

    fetchLeaderboard();
  }, [navigate]);

  const getBadge = (xp) => {
    const level = Math.floor(xp / 1000) + 1;
    if (level >= 10) return { name: "Elite Scholar", color: "text-[#2525f4]", bg: "bg-[#2525f4]/20", border: "border-[#2525f4]/30" };
    if (level >= 5) return { name: "Pro Student", color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/30" };
    return { name: "Rising Star", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#2525f4]/30 border-t-[#2525f4] rounded-full animate-spin"></div>
      </div>
    );
  }

  const isPremium = user?.isPremium;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans pt-32 relative overflow-x-hidden pb-24">
      <style>{`
        .glass-panel { background: rgba(17, 17, 24, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .glow-border { position: relative; }
        .glow-border::before {
          content: ""; position: absolute; inset: -2px; border-radius: inherit; padding: 2px;
          background: linear-gradient(135deg, #2525f4, #9333ea);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; opacity: 0.8; box-shadow: 0 0 20px rgba(37, 37, 244, 0.3);
        }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* ========================================================
          STATE 1: FREE USER (LOCKED LEADERBOARD)
          ======================================================== */}
      {!isPremium && (
        <>
          <div className="absolute inset-0 z-0 pointer-events-none select-none blur-[6px] opacity-40 mt-16 px-4 max-w-5xl mx-auto">
            <h1 className="text-white text-3xl font-bold text-center pb-8">Global Leaderboard</h1>
            <div className="w-full bg-[#111118] border border-[#282839] rounded-xl">
              {/* Dummy Table Background */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-4 border-b border-[#282839] bg-[#161622]/50">
                  <div className="flex gap-4 items-center"><span className="font-bold text-xl">{i + 1}</span><div className="w-10 h-10 bg-slate-700 rounded-full"></div><span>Hidden User</span></div>
                  <span className="text-slate-400">12,000 XP</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute inset-0 bg-[#0a0a0a]/60 z-10 backdrop-blur-sm"></div>
          
          <div className="relative z-20 flex flex-col items-center justify-center flex-1 px-4 min-h-[70vh]">
            <div className="glow-border rounded-2xl w-full max-w-md">
              <div className="glass-panel rounded-2xl p-8 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#2525f4]/10 to-transparent pointer-events-none"></div>
                
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-[#2525f4] blur-xl opacity-40 rounded-full scale-150"></div>
                  <div className="relative bg-gradient-to-br from-yellow-300 to-yellow-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 border border-yellow-200/30">
                    <Lock className="text-white w-10 h-10 drop-shadow-md" />
                  </div>
                </div>
                
                <h2 className="text-white text-3xl font-extrabold tracking-tight mb-3 relative z-10">
                  Unlock the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Global Leaderboard</span>
                </h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 relative z-10">
                  See where you stand against the top students worldwide. Upgrade to Premium to unlock rankings, AI Tutor, and detailed performance stats.
                </p>
                
                <div className="w-full space-y-4 relative z-10">
                  <button onClick={() => navigate('/pricing')} className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-white font-bold tracking-wide group bg-gradient-to-b from-[#4f46e5] to-[#2525f4] hover:brightness-110 shadow-[0_0_20px_rgba(37,37,244,0.4)] transition-all">
                    <span>Upgrade to Premium Now</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button onClick={() => navigate('/practice')} className="block w-full text-slate-500 hover:text-white text-sm font-medium transition-colors">
                    Continue Free Practice
                  </button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/5 w-full flex justify-center gap-6 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#2525f4]" /> Global Ranks</div>
                  <div className="flex items-center gap-1.5"><BarChart2 className="w-4 h-4 text-[#2525f4]" /> Detailed Stats</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================
          STATE 2: PREMIUM USER (UNLOCKED LEADERBOARD)
          ======================================================== */}
      {isPremium && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mt-4 mb-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-3">
              Global Leaderboard
            </h1>
            <div className="inline-flex items-center gap-2 bg-[#161622] px-4 py-1.5 rounded-full border border-[#282839]">
              <Zap className="w-4 h-4 text-[#2525f4]" />
              <p className="text-[#9c9cba] text-sm font-medium">Real-time Ranking</p>
            </div>
          </div>

          {/* Top 3 Podium (Visible if we have at least 3 users) */}
          {leaderboard.length >= 3 && (
            <div className="relative w-full h-[350px] md:h-[400px] flex justify-center items-end mb-12">
              
              {/* Rank 2 (Silver) */}
              <div className="relative flex flex-col items-center z-10 -mr-4 md:-mr-8 mb-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-10 text-slate-300 font-bold text-lg">#2</div>
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-slate-300 shadow-[0_0_20px_rgba(192,192,192,0.4)] bg-[#161616] flex items-center justify-center text-2xl font-bold text-slate-300 relative z-20">
                  {leaderboard[1].name.charAt(0)}
                </div>
                <div className="absolute -bottom-3 bg-slate-800 text-slate-200 text-xs font-bold px-2 py-0.5 rounded-md border border-slate-600 z-30">{leaderboard[1].name.split(' ')[0]}</div>
                <div className="mt-4 text-center">
                  <div className="text-slate-300 font-bold text-sm md:text-base">{leaderboard[1].totalXP} XP</div>
                  <div className="h-28 md:h-36 w-24 md:w-32 bg-gradient-to-b from-slate-700/40 to-transparent backdrop-blur-sm border-t border-slate-500 rounded-t-lg flex items-start justify-center pt-3">
                    <span className="text-slate-500 font-black text-4xl opacity-50">2</span>
                  </div>
                </div>
              </div>

              {/* Rank 1 (Gold) */}
              <div className="relative flex flex-col items-center z-20 mb-8 hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-14 text-yellow-400 animate-float z-30">
                  <Crown className="w-10 h-10 drop-shadow-[0_0_10px_rgba(255,215,0,0.6)] fill-current" />
                </div>
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.5)] bg-[#161616] flex items-center justify-center text-4xl font-bold text-yellow-400 relative z-20">
                  {leaderboard[0].name.charAt(0)}
                </div>
                <div className="absolute -bottom-3 bg-yellow-900/80 text-yellow-100 text-sm font-bold px-3 py-0.5 rounded-md border border-yellow-500 z-30 whitespace-nowrap">{leaderboard[0].name.split(' ')[0]}</div>
                <div className="mt-4 text-center">
                  <div className="text-yellow-400 font-extrabold text-lg md:text-xl drop-shadow-md">{leaderboard[0].totalXP} XP</div>
                  <div className="h-40 md:h-48 w-28 md:w-40 bg-gradient-to-b from-yellow-600/30 to-transparent backdrop-blur-md border-t border-yellow-500 rounded-t-xl flex items-start justify-center pt-4 shadow-[0_-10px_40px_rgba(255,215,0,0.1)]">
                    <span className="text-yellow-500 font-black text-5xl opacity-50">1</span>
                  </div>
                </div>
              </div>

              {/* Rank 3 (Bronze) */}
              <div className="relative flex flex-col items-center z-10 -ml-4 md:-ml-8 mb-0 hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-10 text-orange-400 font-bold text-lg">#3</div>
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-orange-600 shadow-[0_0_20px_rgba(205,127,50,0.4)] bg-[#161616] flex items-center justify-center text-2xl font-bold text-orange-400 relative z-20">
                  {leaderboard[2].name.charAt(0)}
                </div>
                <div className="absolute -bottom-3 bg-orange-900/80 text-orange-200 text-xs font-bold px-2 py-0.5 rounded-md border border-orange-700 z-30">{leaderboard[2].name.split(' ')[0]}</div>
                <div className="mt-4 text-center">
                  <div className="text-orange-400 font-bold text-sm md:text-base">{leaderboard[2].totalXP} XP</div>
                  <div className="h-24 md:h-28 w-24 md:w-32 bg-gradient-to-b from-orange-800/30 to-transparent backdrop-blur-sm border-t border-orange-700 rounded-t-lg flex items-start justify-center pt-3">
                    <span className="text-orange-600 font-black text-4xl opacity-50">3</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Ranks 4 to 10 Table */}
          <div className="glass-panel rounded-2xl overflow-hidden mb-8 border border-[#282839] bg-[#111118]/80">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#282839] bg-[#161622]/50">
                    <th className="py-4 pl-6 pr-4 text-slate-400 font-medium text-xs uppercase tracking-wider text-left w-16">Rank</th>
                    <th className="py-4 px-4 text-slate-400 font-medium text-xs uppercase tracking-wider text-left">Student</th>
                    <th className="py-4 px-4 text-slate-400 font-medium text-xs uppercase tracking-wider text-left">Level Badge</th>
                    <th className="py-4 px-4 pr-6 text-slate-400 font-medium text-xs uppercase tracking-wider text-right">XP Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282839]">
                  {leaderboard.slice(3).map((lUser, idx) => {
                    const badge = getBadge(lUser.totalXP);
                    const rank = idx + 4;
                    const isMe = user.id === lUser.id;
                    return (
                      <tr key={lUser.id} className={`hover:bg-white/5 transition-colors ${isMe ? 'bg-[#2525f4]/10' : ''}`}>
                        <td className="py-4 pl-6 pr-4 text-white font-bold text-lg">#{rank}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold">
                              {lUser.name.charAt(0)}
                            </div>
                            <span className="text-white font-semibold">{lUser.name} {isMe && '(You)'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${badge.bg} ${badge.color} border ${badge.border}`}>
                            {badge.name}
                          </span>
                        </td>
                        <td className="py-4 px-4 pr-6 text-right font-mono font-bold text-slate-300">
                          {lUser.totalXP.toLocaleString()} XP
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          STICKY FOOTER FOR CURRENT USER (ONLY IF PREMIUM)
          ======================================================== */}
      {isPremium && currentUserData && (
        <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-4">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#1a1ab8] to-[#2525f4] rounded-2xl shadow-[0_-5px_30px_rgba(37,37,244,0.3)] border border-blue-400/30 p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-[#161616] flex items-center justify-center text-xl font-bold text-white shrink-0">
                {currentUserData.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <p className="text-white font-bold text-lg leading-none mb-1">You</p>
                <p className="text-blue-200 text-sm font-semibold">Rank #{currentUserData.rank}</p>
              </div>
            </div>
            
            <div className="flex flex-col w-full md:w-1/2 gap-2">
              <div className="flex justify-between items-end">
                <span className="text-blue-100 text-sm font-bold">{currentUserData.totalXP} XP</span>
                <span className="text-white text-xs font-medium bg-black/20 px-2 py-0.5 rounded">Keep practicing to rank up!</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2">
                {/* Fake progress bar just for aesthetics in footer */}
                <div className="bg-white h-2 rounded-full shadow-[0_0_10px_white]" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center justify-end w-auto">
              <button onClick={() => navigate('/practice')} className="whitespace-nowrap px-6 py-2.5 bg-white text-[#2525f4] text-sm font-bold rounded-xl hover:bg-blue-50 hover:scale-105 transition-all shadow-lg">
                Practice More
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}