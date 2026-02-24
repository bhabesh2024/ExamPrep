// src/components/admin/DuplicateManager/DuplicateManager.jsx
import React, { useState } from 'react';
import axios from 'axios';
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
  const [selectedSubject,   setSelectedSubject]   = useState(subjectsData[0]?.title || '');
  const [selectedCategory,  setSelectedCategory]  = useState(subjectsData[0]?.categories[0]?.title || '');
  const [selectedChapter,   setSelectedChapter]   = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');

  // ── Result state ──
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [isLoading,       setIsLoading]       = useState(false);
  const [statusMsg,       setStatusMsg]       = useState('');
  const [statusType,      setStatusType]      = useState('idle'); // idle | loading | success | error

  const categories = getCategories(selectedSubject);
  const topics     = getTopics(selectedSubject, selectedCategory);

  // ── Dropdown handlers ──
  const handleSubjectChange = (e) => {
    const val = e.target.value;
    setSelectedSubject(val);
    const cats = getCategories(val);
    const firstCat = cats[0]?.title || '';
    setSelectedCategory(firstCat);
    const firstTopics = getTopics(val, firstCat);
    setSelectedChapter(firstTopics[0]?.title || '');
    setSelectedChapterId(firstTopics[0]?.id   || '');
    setDuplicateGroups([]); setStatusMsg('');
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    const firstTopics = getTopics(selectedSubject, val);
    setSelectedChapter(firstTopics[0]?.title || '');
    setSelectedChapterId(firstTopics[0]?.id   || '');
    setDuplicateGroups([]); setStatusMsg('');
  };

  const handleChapterChange = (e) => {
    const topic = topics.find(t => t.title === e.target.value);
    setSelectedChapter(topic?.title  || '');
    setSelectedChapterId(topic?.id   || '');
    setDuplicateGroups([]); setStatusMsg('');
  };

  // ── API calls ──
  const findDuplicates = async () => {
    if (!selectedChapterId) { setStatusMsg('Pehle chapter select karo!'); setStatusType('error'); return; }
    setIsLoading(true); setStatusMsg('Dhoondh raha hai...'); setStatusType('loading'); setDuplicateGroups([]);
    try {
      const res = await axios.get(`/api/questions/duplicates?chapterId=${encodeURIComponent(selectedChapterId)}`);
      const dupes = res.data.duplicates || [];
      setDuplicateGroups(dupes);
      if (dupes.length === 0) {
        setStatusMsg(`✅ "${selectedChapter}" mein koi duplicate nahi! Chapter clean hai.`); setStatusType('success');
      } else {
        setStatusMsg(`⚠️ ${res.data.totalGroups} duplicate groups mile — "${selectedChapter}" mein`); setStatusType('error');
      }
    } catch (_) { setStatusMsg('❌ Server error. Backend console check karo.'); setStatusType('error'); }
    finally { setIsLoading(false); }
  };

  const deleteDuplicateGroup = async (duplicateIds, groupIndex) => {
    if (!window.confirm(`${duplicateIds.length} duplicate copies delete karein?\n(Original pehla wala raha jayega)`)) return;
    setIsLoading(true);
    try {
      const res = await axios.post('/api/questions/bulk-delete', { ids: duplicateIds });
      setDuplicateGroups(prev => prev.filter((_, i) => i !== groupIndex));
      setStatusMsg(`✅ ${res.data.deletedCount} copies delete ho gayi!`); setStatusType('success');
    } catch (_) { setStatusMsg('❌ Delete fail hua.'); setStatusType('error'); }
    finally { setIsLoading(false); }
  };

  const autoCleanChapter = async () => {
    const totalExtra = duplicateGroups.reduce((acc, g) => acc + g.duplicateIds.length, 0);
    if (!window.confirm(`⚠️ "${selectedChapter}" ke saare ${totalExtra} extra copies delete karein?\nHar group mein sirf pehla question rakhega.`)) return;
    setIsLoading(true); setStatusMsg('Auto-cleaning...'); setStatusType('loading');
    const allIds = duplicateGroups.flatMap(g => g.duplicateIds);
    try {
      const res = await axios.post('/api/questions/bulk-delete', { ids: allIds });
      setDuplicateGroups([]);
      setStatusMsg(`✅ Done! ${res.data.deletedCount} copies delete ho gayi.`); setStatusType('success');
    } catch (_) { setStatusMsg('❌ Auto-clean fail hua.'); setStatusType('error'); }
    finally { setIsLoading(false); }
  };

  const totalExtra = duplicateGroups.reduce((acc, g) => acc + g.duplicateIds.length, 0);
  const statusColor = { idle: 'text-slate-400', loading: 'text-yellow-400', success: 'text-green-400', error: 'text-red-400' }[statusType];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white">Duplicate Question Cleaner</h2>
        <p className="text-slate-400 text-sm mt-1">Chapter select karo → Duplicates dhundho → Delete karo</p>
      </div>

      {/* Dropdowns */}
      <div className="bg-[#161b27] border border-slate-700 rounded-xl p-4 space-y-4">
        <p className="text-slate-300 text-sm font-semibold">Chapter Select Karo</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Subject',  value: selectedSubject,  onChange: handleSubjectChange,  options: subjectsData.map(s => s.title) },
            { label: 'Category', value: selectedCategory, onChange: handleCategoryChange, options: categories.map(c => c.title) },
            { label: 'Chapter',  value: selectedChapter,  onChange: handleChapterChange,  options: topics.map(t => t.title) },
          ].map(({ label, value, onChange, options }) => (
            <div key={label} className="flex flex-col gap-1">
              <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</label>
              <select value={value} onChange={onChange}
                className="bg-[#0f1115] border border-slate-600 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
                {options.length === 0 && <option value="">-- Pehle {label} Chuno --</option>}
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
        </div>

        {selectedChapterId && (
          <p className="text-xs text-slate-500">Chapter ID: <span className="text-blue-400 font-mono">{selectedChapterId}</span></p>
        )}

        <div className="flex items-center gap-3 flex-wrap pt-1">
          <button onClick={findDuplicates} disabled={isLoading || !selectedChapterId}
            className="px-5 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 text-white rounded-lg font-semibold text-sm transition-all">
            {isLoading && statusType === 'loading' ? 'Dhoondh raha hai...' : 'Is Chapter ke Duplicates Dhundho'}
          </button>
          {duplicateGroups.length > 0 && (
            <button onClick={autoCleanChapter} disabled={isLoading}
              className="px-5 py-2 bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white rounded-lg font-semibold text-sm transition-all">
              Saare {totalExtra} Extra Copies Delete Karo
            </button>
          )}
        </div>
      </div>

      {/* Status */}
      {statusMsg && <p className={`text-sm font-medium ${statusColor}`}>{statusMsg}</p>}

      {/* Results */}
      {duplicateGroups.length > 0 && (
        <div className="space-y-3">
          <p className="text-yellow-400 text-sm font-semibold">
            {duplicateGroups.length} duplicate groups — "{selectedChapter}"
          </p>
          {duplicateGroups.map((group, i) => (
            <div key={i} className="bg-[#1a1f2e] border border-yellow-500/30 rounded-xl p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-slate-200 text-sm font-medium leading-snug">📄 {group.question}</p>
                <div className="flex items-center gap-4 flex-wrap text-xs">
                  <span className="text-slate-500">Total copies: <span className="text-yellow-400 font-bold">{group.count}</span></span>
                  <span className="text-slate-500">Rakhenge: <span className="text-green-400 font-mono">ID #{group.keepId}</span></span>
                  <span className="text-slate-500">Delete honge: <span className="text-red-400 font-mono">{group.duplicateIds.map(id => `#${id}`).join(', ')}</span></span>
                </div>
              </div>
              <button onClick={() => deleteDuplicateGroup(group.duplicateIds, i)} disabled={isLoading}
                className="shrink-0 px-3 py-2 bg-red-800 hover:bg-red-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-all">
                Delete {group.duplicateIds.length} copies
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}