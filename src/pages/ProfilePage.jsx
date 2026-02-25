import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  CheckCircle2, Play, FileQuestion, BookOpen, Gauge, 
  TrendingUp, TrendingDown, MoreHorizontal, FileText, 
  FlaskConical, Calculator, Brain, Globe, Trophy, Lock, 
  MessageSquare, Send // 👈 Naye icons for Support feature
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 Support Feature States
  const [tickets, setTickets] = useState([]);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserDataAndResults = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
        return;
      }
      
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      try {
        // Fetch results and support tickets parallely
        const [resResponse, ticketsResponse] = await Promise.all([
          axios.get(`/api/results/${parsedUser.id}`),
          axios.get(`/api/support?userId=${parsedUser.id}`) // 🔥 Fetch User's Tickets
        ]);
        
        setResults(Array.isArray(resResponse.data) ? resResponse.data : []);
        setTickets(Array.isArray(ticketsResponse.data) ? ticketsResponse.data : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDataAndResults();
  }, [navigate]);

  // --- Real Analytics Calculations ---
  const totalTests = results.length;
  const totalQuestionsAttempted = results.reduce((acc, curr) => acc + curr.total, 0);
  const totalCorrectAnswers = results.reduce((acc, curr) => acc + curr.score, 0);
  
  const overallAccuracy = totalQuestionsAttempted > 0 
    ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100) 
    : 0;

  // XP System: 1 Correct Answer = 10 XP
  const userXP = totalCorrectAnswers * 10;
  const level = Math.floor(userXP / 1000) + 1;
  const xpForNextLevel = level * 1000;
  const xpProgressPercent = (userXP % 1000) / 10; 

  const avgScorePercentage = totalTests > 0 
    ? Math.round(results.reduce((acc, curr) => acc + (curr.score / curr.total * 100), 0) / totalTests) 
    : 0;

  // Icon Mapping for Table
  const getSubjectIcon = (subject) => {
    const s = subject.toLowerCase();
    if (s.includes('math')) return { icon: <Calculator className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-500/20' };
    if (s.includes('sci')) return { icon: <FlaskConical className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/20' };
    if (s.includes('reasoning')) return { icon: <Brain className="w-5 h-5" />, color: 'text-pink-400', bg: 'bg-pink-500/20' };
    if (s.includes('gk')) return { icon: <Globe className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    return { icon: <FileText className="w-5 h-5" />, color: 'text-indigo-400', bg: 'bg-indigo-500/20' };
  };

  // Review button
  const handleReview = (result) => {
    if (result.subject === 'Mock Test') {
      const testId = result.topic.toLowerCase().replace(/\s+/g, '-');
      navigate(`/practice/run/full/${testId}`);
    } else {
      navigate(`/quiz/${result.subject}/${result.topic}`);
    }
  };

  // 🔥 Support Ticket Submit Handler
  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      await axios.post('/api/support', {
        userId: user.id,
        subject: supportSubject,
        message: supportMessage
      });
      setSupportSubject('');
      setSupportMessage('');
      
      // Refresh tickets list
      const ticketsResponse = await axios.get(`/api/support?userId=${user.id}`);
      setTickets(ticketsResponse.data);
      alert("✅ Your query has been sent to the Admin!");
    } catch (error) {
      alert("❌ Failed to send query. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#2525f4]/30 border-t-[#2525f4] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] text-slate-100 font-sans min-h-screen flex flex-col pt-16 sm:pt-20">
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #282839; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3b3b54; }
        
        .glass-card {
            background: rgba(22, 22, 22, 0.6);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl flex flex-col gap-8">
          
          {/* Hero / User Identity Section */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#161616] to-[#0f0f16] border border-white/5 p-6 sm:p-10 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#2525f4]/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-purple-600/10 rounded-full blur-[60px]"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full md:w-auto">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-br from-[#2525f4] via-purple-500 to-transparent">
                    <div className="w-full h-full rounded-full bg-[#161616] flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-inner">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#161616] rounded-full p-1">
                    <div className="bg-[#2525f4] w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(37,37,244,0.6)]">
                      <CheckCircle2 className="text-white w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center sm:items-start pt-2 text-center sm:text-left w-full">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{user?.name}</h1>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-4">
                    {user?.isPremium ? (
                      <>
                        <span className="px-3 py-1 rounded-full bg-[#2525f4]/10 border border-[#2525f4]/20 text-[#2525f4] text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(37,37,244,0.1)]">
                          👑 Premium Student
                        </span>
                        {user?.premiumExpiry && (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider">
                            Valid till: {new Date(user.premiumExpiry).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-[#202020] border border-white/10 text-[#9c9cba] text-xs font-medium">
                        PrepIQ Member
                      </span>
                    )}
                  </div>
                  
                  <div className="w-full min-w-[240px] max-w-sm mt-2">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white font-bold">XP Level {level}</span>
                      <span className="text-[#9c9cba]">{userXP} / {xpForNextLevel} XP</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#202020] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#2525f4] to-purple-500 rounded-full shadow-[0_0_10px_rgba(37,37,244,0.5)] transition-all duration-1000"
                        style={{ width: `${Math.max(xpProgressPercent, 5)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-0">
                <button onClick={() => navigate('/practice')} className="bg-[#2525f4] hover:bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,37,244,0.4)] hover:shadow-[0_0_25px_rgba(37,37,244,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2">
                  <Play className="w-5 h-5 fill-current" />
                  Resume Practice
                </button>

                {user?.isPremium ? (
                  <button onClick={() => navigate('/leaderboard')} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-[#0a0a0a] px-6 py-3.5 rounded-xl font-black transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Global Leaderboard
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      alert("Global Leaderboard is a Premium feature. Upgrade to Pro to see where you rank!");
                      navigate('/pricing');
                    }} 
                    className="bg-[#202020] text-[#9c9cba] border border-[#3b3b54] px-6 py-3.5 rounded-xl font-bold transition-all hover:bg-[#2a2a35] hover:text-white flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    Leaderboard (Pro)
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* KPI Cards Row */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="glass-card rounded-2xl p-6 relative group overflow-hidden transition-all hover:bg-[#202020]">
              <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                <FileQuestion className="w-24 h-24" />
              </div>
              <p className="text-[#9c9cba] text-xs font-bold mb-2 uppercase tracking-widest">Total Tests</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-white">{totalTests}</span>
                <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Latest
                </span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 relative group overflow-hidden transition-all hover:bg-[#202020]">
              <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                <BookOpen className="w-24 h-24" />
              </div>
              <p className="text-[#9c9cba] text-xs font-bold mb-2 uppercase tracking-widest">Questions Solved</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-white">{totalQuestionsAttempted}</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 flex items-center justify-between relative transition-all hover:bg-[#202020]">
              <div className="flex flex-col">
                <p className="text-[#9c9cba] text-xs font-bold mb-1 uppercase tracking-widest">Overall Accuracy</p>
                <span className="text-4xl font-black text-white">{overallAccuracy}%</span>
                <span className="text-emerald-500 text-[10px] font-bold mt-1 tracking-wider">Keep it up!</span>
              </div>
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                  <path className="text-[#202020]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                  <path className="text-[#2525f4] drop-shadow-[0_0_4px_rgba(37,37,244,0.8)] transition-all duration-1000" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${overallAccuracy}, 100`} strokeLinecap="round" strokeWidth="3.5"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2 className="text-[#2525f4] w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 relative group overflow-hidden transition-all hover:bg-[#202020]">
              <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                <Gauge className="w-24 h-24" />
              </div>
              <p className="text-[#9c9cba] text-xs font-bold mb-2 uppercase tracking-widest">Avg Performance</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-white">{avgScorePercentage}</span>
                <span className="text-[#9c9cba] text-lg font-medium mb-1">%</span>
              </div>
              <span className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${avgScorePercentage >= 50 ? 'text-emerald-500' : 'text-orange-500'}`}>
                {avgScorePercentage >= 50 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} 
                {avgScorePercentage >= 50 ? 'Good Standing' : 'Needs Improvement'}
              </span>
            </div>
          </section>

          {/* Test History Table */}
          <section className="glass-card rounded-3xl p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-white text-xl font-bold">Recent Test History</h3>
              <button onClick={() => navigate('/practice')} className="text-sm text-[#2525f4] font-bold hover:text-white transition-colors">View All</button>
            </div>
            
            {results.length === 0 ? (
              <div className="py-12 text-center">
                <FileQuestion className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-300 mb-2">No tests taken yet</h3>
                <p className="text-[#9c9cba] mb-6">Start practicing to build your awesome history here.</p>
                <button onClick={() => navigate('/practice')} className="px-6 py-3 bg-[#2525f4] hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg">
                  Go to Practice
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-4 px-4 text-[#9c9cba] font-bold text-xs uppercase tracking-widest">Test Name</th>
                      <th className="py-4 px-4 text-[#9c9cba] font-bold text-xs uppercase tracking-widest">Date</th>
                      <th className="py-4 px-4 text-[#9c9cba] font-bold text-xs uppercase tracking-widest">Score</th>
                      <th className="py-4 px-4 text-[#9c9cba] font-bold text-xs uppercase tracking-widest">Status</th>
                      <th className="py-4 px-4 text-[#9c9cba] font-bold text-xs uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-white">
                    {results.slice(0, 5).map((result) => { // Only show last 5 for neatness
                      const percentage = Math.round((result.score / result.total) * 100);
                      const isGood = percentage >= 60;
                      const UIInfo = getSubjectIcon(result.subject);
                      
                      return (
                        <tr key={result.id} className="border-b border-white/5 group hover:bg-[#202020] transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl ${UIInfo.bg} flex items-center justify-center ${UIInfo.color}`}>
                                {UIInfo.icon}
                              </div>
                              <div>
                                <span className="font-bold block text-base leading-tight mb-1">{result.topic}</span>
                                <span className="text-xs text-[#9c9cba] font-medium uppercase tracking-wider">{result.subject}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm font-medium text-[#9c9cba]">
                            {new Date(result.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-4 px-4 font-black text-lg">
                            {result.score}<span className="text-[#9c9cba] text-sm font-medium">/{result.total}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${isGood ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                              {isGood ? 'Passed' : 'Needs Imp.'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button 
                              onClick={() => handleReview(result)}
                              className="bg-[#202020] hover:bg-[#2525f4] border border-white/10 hover:border-transparent text-white text-xs font-bold py-2.5 px-5 rounded-full transition-all hover:shadow-[0_0_15px_rgba(37,37,244,0.4)] cursor-pointer"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* 🔥 NEW: Help & Support Section */}
          <section className="mb-10">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2 px-2">
              <MessageSquare className="w-6 h-6 text-[#2525f4]" /> 
              Help & Support
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Form Area */}
              <div className="glass-card rounded-3xl p-6">
                <h4 className="text-lg font-bold text-white mb-2">Have a question or issue?</h4>
                <p className="text-[#9c9cba] text-sm mb-6">Drop a message to our admin team. We usually reply within 24 hours.</p>
                
                <form onSubmit={handleSupportSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#9c9cba] uppercase tracking-widest">Subject</label>
                    <input 
                      type="text" 
                      required
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      placeholder="e.g. Account Upgrade Issue"
                      className="bg-[#0f0f16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2525f4] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#9c9cba] uppercase tracking-widest">Message</label>
                    <textarea 
                      required
                      rows="4"
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Describe your issue in detail..."
                      className="bg-[#0f0f16] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#2525f4] transition-colors resize-none custom-scrollbar"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="mt-2 bg-[#2525f4] hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,37,244,0.3)] hover:shadow-[0_0_20px_rgba(37,37,244,0.5)] flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Ticket History Area */}
              <div className="glass-card rounded-3xl p-6 flex flex-col h-[400px]">
                <h4 className="text-lg font-bold text-white mb-4">Your Past Queries</h4>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
                {(!Array.isArray(tickets) || tickets.length === 0) ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <MessageSquare className="w-12 h-12 text-white/10 mb-3" />
                      <p className="text-[#9c9cba] text-sm">No queries submitted yet.</p>
                    </div>
                  ) : (
                    tickets.map(ticket => (
                      <div key={ticket.id} className="bg-[#0f0f16] border border-white/5 rounded-xl p-4 transition-all hover:border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-bold text-white text-sm">{ticket.subject}</h5>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${ticket.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#9c9cba] line-clamp-2 mb-3">{ticket.message}</p>
                        
                        {ticket.adminReply && (
                          <div className="bg-[#2525f4]/10 border border-[#2525f4]/20 rounded-lg p-3 relative">
                            <span className="text-[10px] font-bold text-[#2525f4] uppercase tracking-wider mb-1 block">Admin Reply</span>
                            <p className="text-sm text-slate-200">{ticket.adminReply}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}