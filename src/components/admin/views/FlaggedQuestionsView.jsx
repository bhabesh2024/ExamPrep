// src/components/admin/views/FlaggedQuestionsView.jsx
import React from 'react';
import { Flag, CheckCircle, Trash2 } from 'lucide-react';

export default function FlaggedQuestionsView() {
  // Mock Data (Replace with API fetch from DB later)
  const flags = [
    { id: 1, qText: "What is the capital of India?", issue: "Option is wrong, it should be New Delhi, not Mumbai.", reporter: "bhabesh@mail.com", date: "Today" }
  ];

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto text-slate-200 custom-scrollbar">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Flag className="text-red-500 w-8 h-8" /> User Reported Issues
        </h1>
        <p className="text-slate-400 mt-1 pl-11 text-sm">Review questions flagged by students for errors.</p>
      </header>

      <div className="space-y-4">
        {flags.length === 0 ? (
          <p className="text-slate-500 text-center py-10">No questions flagged. Great job!</p>
        ) : (
          flags.map(flag => (
            <div key={flag.id} className="bg-[#181b21]/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-5 shadow-lg flex justify-between gap-6">
              <div className="flex-1">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded border border-red-500/20 mb-3 inline-block">Reported</span>
                <p className="text-white font-medium mb-2">Q: "{flag.qText}"</p>
                <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2a3241]">
                  <p className="text-sm text-yellow-500 font-medium">Issue: {flag.issue}</p>
                </div>
                <p className="text-xs text-slate-500 mt-3">Reported by: {flag.reporter} • {flag.date}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="px-4 py-2 bg-[#258cf4] text-white rounded-lg text-xs font-bold hover:bg-blue-600">Edit Question</button>
                <button className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-500/20 flex items-center justify-center gap-1"><CheckCircle className="w-3 h-3"/> Mark Resolved</button>
                <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500/20 flex items-center justify-center gap-1"><Trash2 className="w-3 h-3"/> Delete Q</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}