import React from 'react';
import { RotateCcw, Trash2, Database } from 'lucide-react';

export default function AdminActionBar({ questions, selectedForDelete, handleSelectAll, clearScreen, deleteSelected, pushToPostgreSQL, isLoading }) {
  return (
    <div className="h-16 border-b border-[#2a2f3a] bg-[#0f1115]/95 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={questions.length > 0 && selectedForDelete.length === questions.length}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-slate-600 bg-[#181b21] text-[#0d59f2] focus:ring-0 focus:ring-offset-0 custom-checkbox transition-all cursor-pointer" 
          />
          Select All
        </label>
        <div className="h-4 w-[1px] bg-[#2a2f3a]"></div>
        <span className="text-sm text-slate-400">{questions.length} Items on Screen</span>
      </div>
      
      <div className="flex items-center gap-3">
        <button onClick={clearScreen} disabled={questions.length === 0} className="px-4 py-2 rounded-lg border border-[#2a2f3a] text-slate-300 hover:text-yellow-400 hover:bg-[#181b21] cursor-pointer text-sm font-medium flex items-center gap-2 transition-colors">
          <RotateCcw className="w-4 h-4" /> Clear
        </button>
        <button onClick={deleteSelected} disabled={selectedForDelete.length === 0} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex items-center gap-2 ${selectedForDelete.length > 0 ? 'border-[#2a2f3a] text-slate-300 hover:text-red-400 hover:bg-[#181b21] cursor-pointer' : 'border-transparent text-slate-600 cursor-not-allowed'}`}>
          <Trash2 className="w-4 h-4" /> Remove Selected
        </button>
        <button onClick={pushToPostgreSQL} disabled={questions.length === 0 || isLoading} className="px-6 py-2 rounded-full bg-emerald-500 text-slate-900 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          {isLoading ? <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div> : <Database className="w-4 h-4" />}
          3. Save to Database
        </button>
      </div>
    </div>
  );
}