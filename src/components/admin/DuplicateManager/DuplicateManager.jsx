// src/components/admin/DuplicateManager/DuplicateManager.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Search, Trash2, ShieldCheck, Database, Zap, AlertCircle } from 'lucide-react';
import { subjectsData } from '../../../data/syllabusData.jsx';

// ── Helpers ──
const getCategories = (subjectTitle) => {
  const subj = subjectsData.find(s => s.title === subjectTitle);
  return subj ? subj.categories : [];
};
const getTopics = (subjectTitle, categoryTitle) => {
  const subj = subjectsData.find(s => s.title === subjectTitle);
  if (!subj) return [];
  const cat = subj.categories.find(c => c.title === categoryTitle);
  return cat ? cat.topics : [];
};

export default function DuplicateManager() {
  // ── Dropdown state ──
  const [selectedSubject, setSelectedSubject] = useState(subjectsData[0]?.title || '');
  const [selectedCategory, setSelectedCategory] = useState(subjectsData[0]?.categories[0]?.title || '');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');

  // ── Result state ──
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('idle'); // idle | loading | success | error

  const categories = getCategories(selectedSubject);
  const topics = getTopics(selectedSubject, selectedCategory);

  // ── Dropdown handlers ──
  const handleSubjectChange = (e) => {
    const val = e.target.value;
    setSelectedSubject(val);
    const cats = getCategories(val);
    const firstCat = cats[0]?.title || '';
    setSelectedCategory(firstCat);
    const firstTopics = getTopics(val, firstCat);
    setSelectedChapter(firstTopics[0]?.title || '');
    setSelectedChapterId(firstTopics[0]?.id || '');
    setDuplicateGroups([]); setStatusMsg('');
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    const firstTopics = getTopics(selectedSubject, val);
    setSelectedChapter(firstTopics[0]?.title || '');
    setSelectedChapterId(firstTopics[0]?.id || '');
    setDuplicateGroups([]); setStatusMsg('');
  };

  const handleChapterChange = (e) => {
    const topic = topics.find(t => t.title === e.target.value);
    setSelectedChapter(topic?.title || '');
    setSelectedChapterId(topic?.id || '');
    setDuplicateGroups([]); setStatusMsg('');
  };

  // ── API calls ──
  const findDuplicates = async () => {
    if (!selectedChapterId) { setStatusMsg('Please select a chapter first!'); setStatusType('error'); return; }
    setIsLoading(true); setStatusMsg('Scanning database for semantic matches...'); setStatusType('loading'); setDuplicateGroups([]);
    try {
      const res = await axios.get(`/api/questions/duplicates?chapterId=${encodeURIComponent(selectedChapterId)}`);
      const dupes = res.data.duplicates || [];
      setDuplicateGroups(dupes);
      if (dupes.length === 0) {
        setStatusMsg(`✅ No duplicates found in "${selectedChapter}". Database is clean.`); setStatusType('success');
      } else {
        setStatusMsg(`⚠️ Found ${res.data.totalGroups} duplicate groups in "${selectedChapter}"`); setStatusType('error');
      }
    } catch (_) { setStatusMsg('❌ Server error while scanning.'); setStatusType('error'); }
    finally { setIsLoading(false); }
  };

  const deleteDuplicateGroup = async (duplicateIds, groupIndex) => {
    if (!window.confirm(`Delete ${duplicateIds.length} duplicate copies?\n(Original ID will be kept safe)`)) return;
    setIsLoading(true);
    try {
      const res = await axios.post('/api/questions/bulk-delete', { ids: duplicateIds });
      setDuplicateGroups(prev => prev.filter((_, i) => i !== groupIndex));
      setStatusMsg(`✅ Removed ${res.data.deletedCount} duplicate copies!`); setStatusType('success');
    } catch (_) { setStatusMsg('❌ Failed to delete copies.'); setStatusType('error'); }
    finally { setIsLoading(false); }
  };

  const autoCleanChapter = async () => {
    const totalExtra = duplicateGroups.reduce((acc, g) => acc + g.duplicateIds.length, 0);
    if (!window.confirm(`⚠️ Are you sure you want to delete ALL ${totalExtra} extra copies in "${selectedChapter}"?\nOnly the first instance of each question will be kept.`)) return;
    setIsLoading(true); setStatusMsg('Running Auto-clean...'); setStatusType('loading');
    const allIds = duplicateGroups.flatMap(g => g.duplicateIds);
    try {
      const res = await axios.post('/api/questions/bulk-delete', { ids: allIds });
      setDuplicateGroups([]);
      setStatusMsg(`✅ Auto-clean complete! ${res.data.deletedCount} duplicates removed.`); setStatusType('success');
    } catch (_) { setStatusMsg('❌ Auto-clean failed.'); setStatusType('error'); }
    finally { setIsLoading(false); }
  };

  const totalExtra = duplicateGroups.reduce((acc, g) => acc + g.duplicateIds.length, 0);

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto bg-[#0f1115] text-slate-100 w-full relative custom-scrollbar">
      
      {/* ── Header Area ── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Scan for Duplicates</h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#0d59f2]"></span>
            Analyze chapter database for identical question entries
          </p>
        </div>
        <div className="flex gap-3">
          {duplicateGroups.length > 0 && (
            <button onClick={autoCleanChapter} disabled={isLoading} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all">
              <Zap className="w-5 h-5" />
              Auto-Clean {totalExtra} Copies
            </button>
          )}
          <button onClick={findDuplicates} disabled={isLoading || !selectedChapterId} className="bg-[#0d59f2] hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(13,89,242,0.3)] hover:shadow-[0_0_25px_rgba(13,89,242,0.5)] transition-all disabled:opacity-50">
            <Search className="w-5 h-5" />
            {isLoading && statusType === 'loading' ? 'Scanning...' : 'Scan Chapter'}
          </button>
        </div>
      </header>

      {/* ── Selection & Filter Bar ── */}
      <div className="bg-[#181b21]/60 backdrop-blur-md border border-[#2a3241] rounded-xl p-4 md:p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Subject', value: selectedSubject, onChange: handleSubjectChange, options: subjectsData.map(s => s.title) },
            { label: 'Category', value: selectedCategory, onChange: handleCategoryChange, options: categories.map(c => c.title) },
            { label: 'Chapter', value: selectedChapter, onChange: handleChapterChange, options: topics.map(t => t.title) },
          ].map(({ label, value, onChange, options }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</label>
              <select value={value} onChange={onChange} className="bg-[#0f1115] border border-[#2a3241] text-slate-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#0d59f2] focus:ring-1 focus:ring-[#0d59f2] transition-all">
                {options.length === 0 && <option value="">-- None --</option>}
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>
        
        {/* Status Message Display */}
        {statusMsg && (
          <div className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 border
            ${statusType === 'loading' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
              statusType === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
              statusType === 'error' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}`}>
            {statusType === 'loading' ? <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div> :
             statusType === 'success' ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {statusMsg}
          </div>
        )}
      </div>

      {/* ── Results Area (Side-by-Side Cards) ── */}
      {duplicateGroups.length > 0 && (
        <div className="space-y-6 pb-10">
          {duplicateGroups.map((group, i) => (
            <div key={i} className="bg-[#181b21]/60 backdrop-blur-md border border-[#2a3241] rounded-2xl overflow-hidden shadow-2xl">
              
              {/* Card Header */}
              <div className="px-5 py-3 border-b border-[#2a3241] flex flex-wrap justify-between items-center gap-4 bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-500 text-[10px] font-bold border border-yellow-500/20 uppercase tracking-widest">
                    Exact Match
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Found {group.count} identical copies</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => deleteDuplicateGroup(group.duplicateIds, i)} disabled={isLoading} className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Remove {group.duplicateIds.length} Duplicates
                  </button>
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#2a3241]">
                
                {/* Left: Original (Keep) */}
                <div className="p-5 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Original Entry to Keep
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-[#0f1115] px-2 py-0.5 rounded border border-[#2a3241]">ID: {group.keepId}</span>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-emerald-500/20 mb-2 relative z-10 group-hover:border-emerald-500/40 transition-colors">
                    <p className="text-sm leading-relaxed text-slate-200 font-medium">{group.question}</p>
                  </div>
                  {/* Subtle background glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                </div>

                {/* Right: Duplicates (Delete) */}
                <div className="p-5 relative overflow-hidden bg-red-500/5 group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" /> Copies to Delete
                    </span>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-red-500/20 mb-4 relative z-10">
                    <p className="text-sm leading-relaxed text-slate-400 italic">Identical question text detected in the database.</p>
                  </div>
                  
                  <div className="space-y-2 relative z-10">
                    <p className="text-xs text-slate-500 font-medium">IDs scheduled for removal:</p>
                    <div className="flex flex-wrap gap-2">
                      {group.duplicateIds.map(id => (
                        <span key={id} className="text-[11px] font-mono px-2.5 py-1 rounded bg-red-950/30 border border-red-500/20 text-red-300">
                          #{id}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}