// src/components/admin/AdminConfigPanel.jsx
import React, { useState } from 'react';
import { Upload, FileDown, Sparkles, FolderDown, ChevronDown, ChevronUp } from 'lucide-react';
import { subjectsData } from '../../data/syllabusData';

export default function AdminConfigPanel({
  mainCategory, setMainCategory, subCategory, setSubCategory, chapter, setChapter,
  difficulty, setDifficulty, qCount, setQCount, generateQuestions, isLoading,
  handleBulkJsonUpload, bulkJsonRef, downloadJson
}) {
  const [isOpen, setIsOpen] = useState(true);
  
  // Safe Fallbacks (Agar undefined ho toh crash na kare)
  const currentSubject = subjectsData.find(s => s.title === mainCategory) || subjectsData[0];
  const currentCategory = currentSubject?.categories?.find(c => c.title === subCategory) || currentSubject?.categories?.[0];
  const topics = currentCategory?.topics || [];

  return (
    <div className="bg-[#181b21] border border-[#2a3241] rounded-2xl shadow-xl mb-8 relative z-40">
      {/* Clickable Header for Toggle */}
      <div 
        className="px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors rounded-t-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-bold text-white tracking-wide">Content Configuration</h2>
        <button className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-[#258cf4] text-[10px] font-bold uppercase tracking-widest rounded border border-blue-500/20">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {isOpen ? 'Hide Filters' : 'Setup Filters'}
        </button>
      </div>

      {isOpen && (
        <div className="p-6 pt-0 border-t border-[#2a3241]">
          {/* ── Dropdowns ── */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            
            {/* Main Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Subject</label>
              <select 
                value={mainCategory || ''} 
                onChange={(e) => setMainCategory(e.target.value)} 
                className="bg-[#0f1115] border border-[#2a3241] text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#258cf4] transition-colors cursor-pointer"
              >
                {subjectsData.map((s, i) => (
                  <option key={`sub-${i}`} value={s.title} className="bg-[#0f1115] text-white py-2">{s.title}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <select 
                value={subCategory || ''} 
                onChange={(e) => setSubCategory(e.target.value)} 
                className="bg-[#0f1115] border border-[#2a3241] text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#258cf4] transition-colors cursor-pointer"
              >
                {currentSubject?.categories?.map((c, i) => (
                  <option key={`cat-${i}`} value={c.title} className="bg-[#0f1115] text-white py-2">{c.title}</option>
                ))}
              </select>
            </div>

            {/* Chapter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chapter</label>
              <select 
                value={chapter || ''} 
                onChange={(e) => setChapter(e.target.value)} 
                className="bg-[#0f1115] border border-[#2a3241] text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#258cf4] transition-colors cursor-pointer"
              >
                {topics.map((t, i) => (
                  <option key={`top-${i}`} value={t.title} className="bg-[#0f1115] text-white py-2">{t.title}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Difficulty</label>
              <select 
                value={difficulty || 'Medium'} 
                onChange={(e) => setDifficulty(e.target.value)} 
                className="bg-[#0f1115] border border-[#2a3241] text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#258cf4] transition-colors cursor-pointer"
              >
                <option value="Easy" className="bg-[#0f1115] text-white">Easy</option>
                <option value="Medium" className="bg-[#0f1115] text-white">Medium</option>
                <option value="Hard" className="bg-[#0f1115] text-white">Hard</option>
              </select>
            </div>

            {/* AI Count */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Count</label>
              <input 
                type="number" min="1" max="100" 
                value={qCount} 
                onChange={(e) => setQCount(parseInt(e.target.value) || 1)} 
                className="bg-[#0f1115] border border-[#2a3241] text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#258cf4] transition-colors" 
              />
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="mt-6 pt-6 border-t border-[#2a3241] flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3">
              <input type="file" accept=".json" ref={bulkJsonRef} onChange={handleBulkJsonUpload} className="hidden" />
              <button onClick={() => bulkJsonRef.current?.click()} className="px-4 py-2 bg-[#2a3241] hover:bg-[#3b4754] text-slate-200 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors border border-[#2a3241] cursor-pointer">
                <Upload className="w-4 h-4" /> Import JSON
              </button>
              <button onClick={downloadJson} className="px-4 py-2 bg-[#2a3241] hover:bg-[#3b4754] text-slate-200 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors border border-[#2a3241] cursor-pointer">
                <FolderDown className="w-4 h-4" /> Download Empty Template
              </button>
            </div>
            
            <button onClick={generateQuestions} disabled={isLoading} className="bg-[#258cf4] hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(37,140,244,0.3)] hover:shadow-[0_0_25px_rgba(37,140,244,0.5)] transition-all disabled:opacity-50 cursor-pointer">
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Processing...' : 'Generate with AI'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}