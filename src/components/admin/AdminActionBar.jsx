// src/components/admin/AdminActionBar.jsx
import React from 'react';
import { Languages, Trash2, Save, Download, Eraser } from 'lucide-react'; // 🔥 Eraser icon import kiya

export default function AdminActionBar({
  questions, setQuestions, selectedForDelete, setSelectedForDelete,
  isLoading, autoTranslateAllToHindi, translateSelectedToHindi, pushToPostgreSQL, downloadJson,
  clearScreen // 🔥 clearScreen prop yaha add kiya
}) {
  if (questions.length === 0) return null;

  const isAllSelected = questions.length > 0 && selectedForDelete.length === questions.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedForDelete([]);
    else setSelectedForDelete(questions.map((_, i) => i));
  };

  const deleteSelected = () => {
    setQuestions(questions.filter((_, i) => !selectedForDelete.includes(i)));
    setSelectedForDelete([]);
  };

  return (
    <div className="sticky top-6 z-40 mb-8 bg-[#181b21]/90 backdrop-blur-xl border border-[#2a3241] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] px-4 py-3 flex flex-wrap items-center justify-between gap-4">
      
      <div className="flex items-center gap-4 pl-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 font-medium">
          <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} className="w-4 h-4 rounded border-[#2a3241] bg-[#0f1115] text-[#258cf4] focus:ring-[#258cf4]" />
          Select All
        </label>
        {selectedForDelete.length > 0 && (
          <span className="text-xs text-slate-500 bg-black/30 px-2 py-1 rounded-md">{selectedForDelete.length} Selected</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {selectedForDelete.length > 0 ? (
          <>
            <button onClick={deleteSelected} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold rounded-lg border border-red-500/20 transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete ({selectedForDelete.length})
            </button>
            <button onClick={translateSelectedToHindi} disabled={isLoading} className="px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 text-sm font-semibold rounded-lg border border-yellow-500/20 transition-colors flex items-center gap-2">
              <Languages className="w-4 h-4" /> Translate Selected
            </button>
          </>
        ) : (
          <button onClick={autoTranslateAllToHindi} disabled={isLoading} className="px-4 py-2 bg-[#2a3241] hover:bg-[#3b4754] text-slate-300 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
            <Languages className="w-4 h-4" /> Translate All
          </button>
        )}

        <button onClick={downloadJson} className="px-4 py-2 bg-[#2a3241] hover:bg-[#3b4754] text-slate-300 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Draft
        </button>

        {/* 🔥 Clear UI Button Added Here */}
        {clearScreen && (
          <button onClick={clearScreen} disabled={isLoading} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold rounded-lg border border-red-500/20 transition-colors flex items-center gap-2">
            <Eraser className="w-4 h-4" /> Clear UI
          </button>
        )}

        <button onClick={() => pushToPostgreSQL(questions)} disabled={isLoading} className="ml-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
          <Save className="w-4 h-4" /> Save to DB
        </button>
      </div>
    </div>
  );
}