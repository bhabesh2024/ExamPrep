import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Flag, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function FlaggedQuestionsView() {
  const [flags, setFlags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchFlags(); }, []);

  const fetchFlags = async () => {
    try {
      const res = await axios.get('/api/admin/flags');
      setFlags(res.data);
    } catch (err) { console.error("Failed to load flags", err); }
    finally { setIsLoading(false); }
  };

  const markResolved = async (id) => {
    try {
      await axios.patch(`/api/admin/flag/${id}`);
      setFlags(flags.filter(f => f.id !== id)); // Remove from screen
    } catch (err) { alert("Failed to resolve"); }
  };

  if (isLoading) return <div className="p-8 text-white">Loading flagged issues...</div>;

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full text-slate-200">
      <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
        <Flag className="text-red-500 w-8 h-8" /> Flagged Questions
      </h2>

      {flags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-[#2a3241] rounded-2xl bg-[#181b21]/30">
          <CheckCircle2 className="w-16 h-16 mb-4 text-emerald-500/50" />
          <p className="text-lg font-medium text-slate-300">All Good!</p>
          <p className="text-sm mt-1 opacity-70">No reported issues found in the database.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {flags.map(flag => (
            <div key={flag.id} className="bg-[#181b21] border border-red-500/30 rounded-xl p-5 shadow-lg relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-red-400 font-bold bg-red-500/10 px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" /> Issue: {flag.reason}
                </div>
                <button 
                  onClick={() => markResolved(flag.id)}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                </button>
              </div>

              {flag.question && (
                <div className="bg-[#0f1115] rounded-lg p-4 border border-[#2a3241]">
                  <div className="text-xs text-slate-500 mb-2 font-mono">Q-ID: {flag.question.id} | Subject: {flag.question.subject}</div>
                  <p className="text-slate-200 text-sm font-medium">{flag.question.question}</p>
                </div>
              )}
              <p className="text-xs text-slate-500 mt-4">Reported on: {new Date(flag.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}