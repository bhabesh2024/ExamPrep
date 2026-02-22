import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function AdminHeader({ status, statusType }) {
  return (
    <header className="h-16 border-b border-[#2a2f3a] bg-[#0f1115]/80 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-white tracking-tight">PrepIQ DB Manager</h1>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Live</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-400 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusType === 'loading' ? 'bg-yellow-500 animate-pulse' : statusType === 'error' ? 'bg-red-500' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`}></span>
          {status}
        </div>
        <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium cursor-pointer">
          <HelpCircle className="w-5 h-5" /> Help
        </button>
      </div>
    </header>
  );
}