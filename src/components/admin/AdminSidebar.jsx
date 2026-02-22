import React from 'react';
import { Settings } from 'lucide-react';

export default function AdminSidebar() {
  return (
    <aside className="hidden xl:flex w-20 flex-col items-center justify-between border-r border-[#2a2f3a] bg-[#111318] py-6 h-screen sticky top-0 z-20 shrink-0">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0d59f2] text-white font-bold text-xl shadow-[0_0_20px_rgba(13,89,242,0.5)] cursor-pointer">
          Q
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
          <Settings className="w-5 h-5" />
        </button>
        <div className="h-10 w-10 rounded-full bg-slate-800 border border-[#2a2f3a] flex items-center justify-center font-bold text-slate-400">
          A
        </div>
      </div>
    </aside>
  );
}