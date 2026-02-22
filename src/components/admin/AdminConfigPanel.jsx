import React from 'react';
import { ChevronDown, Database, Upload, Languages, CloudUpload, FileText, X, Sparkles } from 'lucide-react';

export default function AdminConfigPanel(props) {
  const {
    mainSubjects, mainCategory, handleMainCategoryChange, getCategories, subCategory, handleSubCategoryChange,
    getChapters, chapter, setChapter, difficulty, setDifficulty, qCount, setQCount,
    fetchFromDatabase, isLoading, loadLocalJsonData, bulkJsonRef, handleBulkJsonUpload, autoTranslateAllToHindi,
    questions, file, fileInputRef, handleDragOver, handleDragLeave, handleDrop, handleFileSelect, removeFile,
    isDragging, generateQuestions, isEditingLoading
  } = props;

  return (
    <section className="w-[400px] h-full flex flex-col border-r border-[#2a2f3a] bg-[#111318]/50 shrink-0 overflow-y-auto p-6 gap-6 custom-scrollbar backdrop-blur-md">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-white">Database Routing</h2>
        <p className="text-sm text-slate-400">Select where to save or fetch questions.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[#0d59f2] font-medium text-sm">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0d59f2] text-white text-xs">1</span>
          <span>Category Map</span>
        </div>
        <div className="space-y-3 pl-8 border-l border-[#2a2f3a] ml-3">
          <label className="block">
            <span className="text-xs font-medium text-slate-400 mb-1.5 block">Main Subject</span>
            <div className="relative">
              <select value={mainCategory} onChange={handleMainCategoryChange} className="w-full appearance-none bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] outline-none transition-all cursor-pointer">
                {mainSubjects.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-400 mb-1.5 block">Category</span>
            <div className="relative">
              <select value={subCategory} onChange={handleSubCategoryChange} className="w-full appearance-none bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] outline-none transition-all cursor-pointer">
                {getCategories(mainCategory).map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-400 mb-1.5 block">Chapter</span>
            <div className="relative">
              <select value={chapter} onChange={(e) => setChapter(e.target.value)} className="w-full appearance-none bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] outline-none transition-all cursor-pointer">
                {getChapters(mainCategory, subCategory).map(chap => <option key={chap} value={chap}>{chap}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-slate-400 mb-1.5 block">Difficulty</span>
              <div className="relative">
                <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)} className="w-full appearance-none bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] outline-none transition-all cursor-pointer">
                  <option>Easy</option><option>Medium</option><option>Hard</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-400 mb-1.5 block">AI Q-Count</span>
              <div className="relative">
                <select value={qCount} onChange={(e)=>setQCount(Number(e.target.value))} className="w-full appearance-none bg-[#181b21] border border-[#2a2f3a] rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#0d59f2] outline-none transition-all cursor-pointer">
                  <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </label>
          </div>
          <button onClick={fetchFromDatabase} disabled={isLoading} className="w-full py-2.5 mt-2 rounded-xl border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
            <Database className="w-4 h-4" /> Fetch DB Questions
          </button>
          
          <div className="mt-4 pt-4 border-t border-[#2a2f3a]">
            <button onClick={loadLocalJsonData} className="w-full h-10 mb-3 border border-[#0d59f2]/50 bg-[#0d59f2]/10 hover:bg-[#0d59f2]/20 text-blue-400 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all text-xs cursor-pointer">
              <Upload className="w-4 h-4" /> 1. Load Local JSON Data
            </button>
            <button onClick={autoTranslateAllToHindi} disabled={isLoading || questions.length === 0} className="w-full h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer text-xs">
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Languages className="w-4 h-4" />}
              2. Auto-Translate to Hindi
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[#0d59f2] font-medium text-sm">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0d59f2] text-white text-xs">2</span>
          <span>AI Generator File</span>
        </div>
        <div className="pl-8 border-l border-[#2a2f3a] ml-3">
          {!file ? (
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current.click()} className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 group cursor-pointer transition-all ${isDragging ? 'border-[#0d59f2] bg-[#0d59f2]/10' : 'border-[#2a2f3a] bg-[#181b21]/50 hover:bg-[#181b21] hover:border-[#0d59f2]/50'}`}>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept=".pdf, image/*" />
              <div className="p-2 rounded-full bg-[#111318] group-hover:bg-[#0d59f2]/20 transition-colors"><CloudUpload className="w-6 h-6 text-slate-400 group-hover:text-[#0d59f2]" /></div>
              <p className="text-sm font-medium text-slate-300">Click or drag PDF/Image</p>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-3 p-3 bg-[#181b21] rounded-lg border border-[#2a2f3a]">
              <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500 shrink-0"><FileText className="w-5 h-5" /></div>
              <p className="text-xs font-medium text-white truncate flex-1">{file.name}</p>
              <button onClick={removeFile} className="text-slate-500 hover:text-white cursor-pointer shrink-0"><X className="w-5 h-5" /></button>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 mt-auto space-y-3">
        <button onClick={generateQuestions} disabled={isLoading || isEditingLoading} className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold rounded-full shadow-[0_0_20px_rgba(13,89,242,0.5)] flex items-center justify-center gap-2 transition-all cursor-pointer">
          {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles className="w-5 h-5" />}
          {isLoading ? 'Processing...' : 'Generate AI MCQs'}
        </button>
      </div>
    </section>
  );
}