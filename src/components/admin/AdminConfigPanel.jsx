// src/components/admin/AdminConfigPanel.jsx
import React, { useState } from 'react';
import { Upload, Sparkles, FolderDown, ChevronDown, ChevronUp } from 'lucide-react';
import { subjectsData } from '../../data/syllabusData.jsx'; // 🔥 Added .jsx to prevent import crashes

export default function AdminConfigPanel({
  mainCategory, setMainCategory, subCategory, setSubCategory, chapter, setChapter,
  difficulty, setDifficulty, qCount, setQCount, generateQuestions, isLoading,
  handleBulkJsonUpload, bulkJsonRef, downloadJson
}) {
  const [isOpen, setIsOpen] = useState(true);
  
  // 🛡️ CRASH-PROOF SHIELD: Data na aane par app black screen nahi hogi
  const safeSubjects = Array.isArray(subjectsData) && subjectsData.length > 0 ? subjectsData : [];
  const currentSubject = safeSubjects.find(s => s.title === mainCategory) || safeSubjects[0] || {};
  
  const safeCategories = Array.isArray(currentSubject.categories) && currentSubject.categories.length > 0 ? currentSubject.categories : [];
  const currentCategory = safeCategories.find(c => c.title === subCategory) || safeCategories[0] || {};
  
  const safeTopics = Array.isArray(currentCategory.topics) ? currentCategory.topics : [];

  // ── Auto-Cascade Logic for Dropdowns ──
  const handleSubjectChange = (e) => {
    const val = e.target.value;
    setMainCategory(val);
    const subj = safeSubjects.find(s => s.title === val);
    if (subj && subj.categories?.length > 0) {
      setSubCategory(subj.categories[0].title);
      if (subj.categories[0].topics?.length > 0) {
        setChapter(subj.categories[0].topics[0].title);
      } else { setChapter(''); }
    } else { setSubCategory(''); setChapter(''); }
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSubCategory(val);
    const cat = safeCategories.find(c => c.title === val);
    if (cat && cat.topics?.length > 0) {
      setChapter(cat.topics[0].title);
    } else { setChapter(''); }
  };

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
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Subject</label>
              <select value={mainCategory || ''} onChange={handleSubjectChange} className="bg-[#0f1115] border border-[#2a3241] text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#258cf4] transition-colors cursor-pointer">
                {safeSubjects.map((s, i) => <option key={`sub-${i}`} value={s.title}>{s.title}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <select value={subCategory || ''} onChange={handleCategoryChange} className="bg-[#0f1115] border border-[#2a3241] text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#258cf4] transition-colors cursor-pointer">
                {safeCategories.map((c, i) => <option key={`cat-${i}`} value={c.title}>{c.title}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chapter</label>
              <select value={chapter || ''} onChange={(e) => setChapter(e.target.value)} className="bg-[#0f1115] border border-[#2a3241] text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#258cf4] transition-colors cursor-pointer">
                {safeTopics.map((t, i) => <option key={`top-${i}`} value={t.title}>{t.title}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Difficulty</label>
              <select value={difficulty || 'Medium'} onChange={(e) => setDifficulty(e.target.value)} className="bg-[#0f1115] border border-[#2a3241] text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#258cf4] transition-colors cursor-pointer">
                <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Count</label>
              <input type="number" min="1" max="100" value={qCount || 1} onChange={(e) => setQCount(parseInt(e.target.value) || 1)} className="bg-[#0f1115] border border-[#2a3241] text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#258cf4] transition-colors" />
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