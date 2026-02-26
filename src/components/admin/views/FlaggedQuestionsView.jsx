// src/components/admin/views/FlaggedQuestionsView.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Flag, CheckCircle2, AlertTriangle, Edit3, Save, X } from 'lucide-react';

export default function FlaggedQuestionsView() {
  const [flags, setFlags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit States
  const [editingFlagId, setEditingFlagId] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => { fetchFlags(); }, []);

  const fetchFlags = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/admin/flags');
      setFlags(res.data);
    } catch (err) { console.error("Failed to load flags", err); }
    finally { setIsLoading(false); }
  };

  const markResolved = async (id) => {
    try {
      await axios.patch(`/api/admin/flag/${id}`);
      setFlags(flags.filter(f => f.id !== id)); 
      if (editingFlagId === id) {
        setEditingFlagId(null);
        setEditData(null);
      }
    } catch (err) { alert("Failed to resolve"); }
  };

  // 🔥 NAYA: Start Editing Mode
  const startEditing = (flag) => {
    setEditingFlagId(flag.id);
    let safeOptions = ['', '', '', ''];
    try {
      if (typeof flag.question.options === 'string') safeOptions = JSON.parse(flag.question.options);
      else if (Array.isArray(flag.question.options)) safeOptions = flag.question.options;
    } catch(e) {}
    if(safeOptions.length < 4) safeOptions = [...safeOptions, '', '', '', ''].slice(0, 4);

    setEditData({ ...flag.question, options: safeOptions });
  };

  const handleUpdateField = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (idx, value) => {
    const newOpts = [...editData.options];
    newOpts[idx] = value;
    setEditData(prev => {
      // Auto-update answer if it matched the exact old option string
      let newAnswer = prev.answer;
      if (String(prev.answer).trim() === String(prev.options[idx]).trim()) {
        newAnswer = value;
      }
      return { ...prev, options: newOpts, answer: newAnswer };
    });
  };

  // 🔥 NAYA: Push edits directly to DB via the new PUT API
  const saveQuestionEdit = async (flagId, questionId) => {
    try {
      const res = await axios.put(`/api/questions/${questionId}`, editData);
      
      // Update local state smoothly
      setFlags(flags.map(f => {
        if(f.id === flagId) {
          return { ...f, question: res.data };
        }
        return f;
      }));
      
      setEditingFlagId(null);
      setEditData(null);
      alert("✅ Question Updated Successfully in DB!");
    } catch(err) {
      alert("❌ Failed to update question");
    }
  };

  if (isLoading) return <div className="p-8 text-white">Loading flagged issues...</div>;

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full text-slate-200 custom-scrollbar">
      <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
        <Flag className="text-red-500 w-8 h-8" /> Flagged Questions
      </h2>

      {flags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-[#2a3241] rounded-2xl bg-[#181b21]/30">
          <CheckCircle2 className="w-16 h-16 mb-4 text-emerald-500/50" />
          <p className="text-lg font-medium text-slate-300">All Good!</p>
          <p className="text-sm mt-1 opacity-70">No reported issues found in the database.</p>
        </div>
      ) : (
        <div className="space-y-6 pb-20">
          {flags.map(flag => (
            <div key={flag.id} className="bg-[#181b21] border border-red-500/30 rounded-xl p-5 shadow-lg relative">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-red-400 font-bold bg-red-500/10 px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" /> Issue: {flag.reason}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => startEditing(flag)}
                    className="bg-[#258cf4]/10 hover:bg-[#258cf4]/20 text-[#258cf4] border border-[#258cf4]/20 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Question
                  </button>
                  <button 
                    onClick={() => markResolved(flag.id)}
                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                  </button>
                </div>
              </div>

              {/* 🔥 INLINE EDITOR UI */}
              {editingFlagId === flag.id && editData ? (
                <div className="bg-[#0f1115] rounded-xl p-5 border border-[#258cf4] mt-4 shadow-2xl relative z-10 animate-[fadeIn_0.3s_ease-out]">
                  <div className="flex justify-between items-center mb-4 border-b border-[#2a3241] pb-3">
                    <h4 className="text-white font-bold flex items-center gap-2"><Edit3 className="w-4 h-4 text-[#258cf4]"/> Direct Edit: Q-ID {flag.question.id}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => saveQuestionEdit(flag.id, flag.question.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20">
                        <Save className="w-3.5 h-3.5" /> Save Edits
                      </button>
                      <button onClick={() => { setEditingFlagId(null); setEditData(null); }} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer">
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: English */}
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">English Question</label>
                        <textarea value={editData.question || ''} onChange={e => handleUpdateField('question', e.target.value)} className="w-full bg-[#181b21] border border-[#2a3241] text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-[#258cf4] min-h-[80px]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Options (Select Correct)</label>
                        {editData.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-3 bg-[#181b21] border border-[#2a3241] rounded-xl p-2.5 focus-within:border-[#258cf4]">
                            <input type="radio" name={`flag-ans-${flag.id}`} checked={String(editData.answer).trim() === String(opt).trim() && opt !== ''} onChange={() => handleUpdateField('answer', opt)} className="w-4 h-4 text-[#258cf4] cursor-pointer" />
                            <input type="text" value={opt || ''} onChange={e => handleOptionChange(oIdx, e.target.value)} className="flex-1 bg-transparent border-none text-sm text-slate-200 focus:outline-none p-0" placeholder={`Option ${oIdx + 1}`} />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">English Explanation</label>
                        <textarea value={editData.explanation || ''} onChange={e => handleUpdateField('explanation', e.target.value)} className="w-full bg-[#181b21] border border-[#2a3241] text-slate-400 text-sm rounded-xl p-3 min-h-[60px]" />
                      </div>
                    </div>

                    {/* Right: Hindi */}
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Hindi Question</label>
                        <textarea value={editData.questionHindi || ''} onChange={e => handleUpdateField('questionHindi', e.target.value)} className="w-full bg-[#181b21] border border-[#2a3241] text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-[#258cf4] min-h-[80px]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Hindi Explanation</label>
                        <textarea value={editData.explanationHindi || ''} onChange={e => handleUpdateField('explanationHindi', e.target.value)} className="w-full bg-[#181b21] border border-[#2a3241] text-slate-400 text-sm rounded-xl p-3 focus:outline-none focus:border-[#258cf4] min-h-[60px]" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* READ-ONLY VIEW (When Not Editing) */
                flag.question && (
                  <div className="bg-[#0f1115] rounded-lg p-4 border border-[#2a3241]">
                    <div className="text-xs text-slate-500 mb-2 font-mono">Q-ID: {flag.question.id} | Subject: {flag.question.subject}</div>
                    <p className="text-slate-200 text-sm font-medium">{flag.question.question}</p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(() => {
                        let opts = [];
                        try {
                          opts = typeof flag.question.options === 'string' ? JSON.parse(flag.question.options) : flag.question.options;
                        } catch(e){}
                        if(!Array.isArray(opts)) opts = [];
                        return opts.map((opt, i) => (
                          <div key={i} className={`text-xs p-3 rounded-lg border ${String(flag.question.answer).trim() === String(opt).trim() && opt !== '' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold' : 'border-[#2a3241] bg-[#181b21] text-slate-400'}`}>
                            <span className="font-bold mr-2 text-slate-500">{['A','B','C','D'][i]}.</span> {opt}
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                )
              )}

              <p className="text-xs text-slate-500 mt-4">Reported on: {new Date(flag.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}