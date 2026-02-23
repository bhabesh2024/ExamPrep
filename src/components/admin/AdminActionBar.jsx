// src/components/admin/AdminActionBar.jsx
import React from 'react';
import { Trash2, Database, Languages, RotateCcw, Download, Upload } from 'lucide-react';

export default function AdminActionBar({ 
  questions, selectedForDelete, handleSelectAll, deleteSelected, 
  pushToPostgreSQL, isLoading, translateSelectedToHindi, clearScreen,
  downloadJson, handleBulkJsonUpload, bulkJsonRef
}) {
  return (
    <div className="h-14 border-b border-[#2a2f3a] bg-[#0f1115]/95 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6 shrink-0">
      
      {/* LEFT SIDE: Checkbox & Count */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={questions.length > 0 && selectedForDelete.length === questions.length}
            onChange={handleSelectAll}
            className="w-3.5 h-3.5 rounded border-slate-600 bg-[#181b21] text-[#0d59f2] focus:ring-0 focus:ring-offset-0 custom-checkbox transition-all cursor-pointer" 
          />
          Select All
        </label>
        <div className="h-4 w-[1px] bg-[#2a2f3a]"></div>
        <span className="text-xs font-medium text-slate-400">{questions.length} Items</span>
      </div>
      
      {/* RIGHT SIDE: Compact Buttons */}
      <div className="flex items-center gap-2">
        
        {/* CLEAR UI */}
        <button onClick={clearScreen} disabled={questions.length === 0} className="px-2.5 py-1.5 rounded-md border border-[#2a2f3a] text-slate-300 hover:text-yellow-400 hover:bg-[#181b21] cursor-pointer text-xs font-medium flex items-center gap-1.5 transition-colors" title="Clear screen">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="h-5 w-[1px] bg-[#2a2f3a] mx-0.5"></div>

        {/* DOWNLOAD JSON */}
        <button onClick={downloadJson} disabled={questions.length === 0} className="px-3 py-1.5 rounded-md border border-[#2a2f3a] text-slate-300 hover:text-white hover:bg-[#181b21] cursor-pointer text-xs font-medium flex items-center gap-1.5 transition-colors" title="Export as JSON">
          <Download className="w-3.5 h-3.5" /> Export
        </button>

        {/* UPLOAD JSON */}
        <input type="file" accept=".json" ref={bulkJsonRef} onChange={handleBulkJsonUpload} className="hidden" />
        <button onClick={() => bulkJsonRef.current?.click()} className="px-3 py-1.5 rounded-md border border-[#2a2f3a] text-slate-300 hover:text-blue-400 hover:bg-[#181b21] cursor-pointer text-xs font-medium flex items-center gap-1.5 transition-colors" title="Import JSON">
          <Upload className="w-3.5 h-3.5" /> Import
        </button>

        <div className="h-5 w-[1px] bg-[#2a2f3a] mx-0.5"></div>

        {/* API TRANSLATE */}
        <button onClick={translateSelectedToHindi} disabled={selectedForDelete.length === 0 || isLoading} className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors flex items-center gap-1.5 ${selectedForDelete.length > 0 ? 'border-[#0d59f2]/50 text-[#0d59f2] hover:bg-[#0d59f2]/10 cursor-pointer' : 'border-transparent text-slate-600 cursor-not-allowed'}`}>
          {isLoading ? <div className="w-3.5 h-3.5 border-2 border-[#0d59f2]/30 border-t-[#0d59f2] rounded-full animate-spin"></div> : <Languages className="w-3.5 h-3.5" />}
          Translate
        </button>

        {/* DELETE FROM DB */}
        <button onClick={deleteSelected} disabled={selectedForDelete.length === 0} className={`px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors flex items-center gap-1.5 ${selectedForDelete.length > 0 ? 'border-red-500/50 text-red-400 hover:bg-red-500/10 cursor-pointer' : 'border-transparent text-slate-600 cursor-not-allowed'}`} title="Delete selected">
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* SAVE TO DB */}
        <button onClick={pushToPostgreSQL} disabled={questions.length === 0 || isLoading} className="px-4 py-1.5 rounded-md bg-emerald-500 text-slate-900 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)] ml-1">
          {isLoading ? <div className="w-3.5 h-3.5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div> : <Database className="w-3.5 h-3.5" />}
          Save to DB
        </button>
      </div>
    </div>
  );
}