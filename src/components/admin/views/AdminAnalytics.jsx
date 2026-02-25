// src/components/admin/views/AdminAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, TrendingUp, Search, ShieldAlert } from 'lucide-react';
import axios from 'axios';

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ totalQuestions: 0, activeUsers: 0, premiumUsers: 0, testsAttempted: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Real Analytics Data (Backend me /api/admin/stats route banana hoga)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        if(res.data) setStats(res.data);
      } catch (err) { console.error("Stats load failed", err); }
    };
    // fetchStats(); // Uncomment when backend route is ready
  }, []);

  const handleSearchUser = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setIsLoading(true);
    try {
      // Backend me /api/admin/user?email=... route banana hoga
      const res = await axios.get(`/api/admin/user?email=${searchQuery}`);
      setSearchedUser(res.data);
    } catch (err) {
      alert("User not found!");
      setSearchedUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = [
    { title: 'Total DB Questions', value: stats.totalQuestions || '...', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Total Registered Users', value: stats.activeUsers || '...', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Premium Members', value: stats.premiumUsers || '...', icon: CheckCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'Total Tests Attempted', value: stats.testsAttempted || '...', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full text-slate-200 custom-scrollbar">
      <h2 className="text-3xl font-bold mb-8 text-white tracking-tight">System Analytics</h2>
      
      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((m, i) => (
          <div key={i} className="bg-[#181b21]/80 backdrop-blur-xl p-5 rounded-2xl border border-[#2a3241] shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-400">{m.title}</span>
              <div className={`p-2 rounded-xl ${m.bg}`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{m.value}</div>
          </div>
        ))}
      </div>

      {/* User Search & Action Area */}
      <div className="bg-[#181b21]/80 backdrop-blur-xl p-6 rounded-2xl border border-[#2a3241] shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-white">User Management Search</h3>
        <form onSubmit={handleSearchUser} className="flex gap-3 mb-6">
          <input 
            type="text" 
            placeholder="Enter user email to search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-[#0f1115] border border-[#2a3241] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#258cf4]"
          />
          <button type="submit" disabled={isLoading} className="bg-[#258cf4] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
            <Search className="w-5 h-5" /> {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {searchedUser && (
          <div className="p-5 bg-[#0f1115] border border-[#2a3241] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">
                {searchedUser.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-lg font-bold text-white">{searchedUser.name}</p>
                <p className="text-sm text-slate-400">{searchedUser.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold border ${searchedUser.isPremium ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                  {searchedUser.isPremium ? 'PREMIUM USER' : 'FREE USER'}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
               <button className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-sm font-bold hover:bg-purple-500/20 transition-all">
                 Toggle Premium
               </button>
               <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-bold hover:bg-red-500/20 transition-all flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4" /> Ban User
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}