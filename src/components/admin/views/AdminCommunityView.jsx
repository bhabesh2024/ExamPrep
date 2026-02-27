import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Trash2, MessageSquare, CheckCircle2, Eye, Heart, Layers, Code, UploadCloud, Edit2, X, Search, Check, Database } from 'lucide-react';

export default function AdminCommunityView() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState('single');

  // Single Post States
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);

  // Bulk Upload State
  const [bulkJson, setBulkJson] = useState('');

  // Edit Modal States
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({});

  // 🔥 NEW: DATA MANAGEMENT STATES
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/community/posts');
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); setPosts([]); }
  };

  const handleOptionChange = (text, index) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  // 🚀 SINGLE POST HANDLER
  const handleCreateSinglePost = async (e) => {
    e.preventDefault();
    if (!question || options.some(opt => !opt)) { alert("Please fill all fields."); return; }
    setIsLoading(true);
    try {
      await axios.post('/api/community/posts', { question, options, correctOptionIndex: Number(correctIndex) });
      setQuestion(''); setOptions(['', '', '', '']); setCorrectIndex(0);
      fetchPosts();
      alert("🚀 Single MCQ Published successfully!");
    } catch (e) { alert("Failed to post."); }
    setIsLoading(false);
  };

  // 🚀 BULK JSON UPLOAD HANDLER
  const handleBulkUpload = async () => {
    if (!bulkJson.trim()) { alert("Please paste your JSON data first."); return; }
    let parsedData;
    try {
      parsedData = JSON.parse(bulkJson); 
      if (!Array.isArray(parsedData)) throw new Error("JSON must be an array []");
    } catch (e) { alert("❌ Invalid JSON Format!\n\nError: " + e.message); return; }

    setIsLoading(true);
    try {
      const res = await axios.post('/api/community/bulk', parsedData);
      setBulkJson('');
      fetchPosts();
      alert(`✅ Success! ${res.data.count} Posts uploaded.`);
    } catch (e) { alert("Failed to bulk upload."); }
    setIsLoading(false);
  };

  // 🔥 EDITING HANDLERS
  const openEditModal = (post) => {
    setEditingPost(post);
    setEditForm({
      question: post.question || '', questionHindi: post.questionHindi || '',
      explanation: post.explanation || '', explanationHindi: post.explanationHindi || '',
      options: [...post.options], correctOptionIndex: post.correctOptionIndex
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(`/api/community/posts/${editingPost.id}`, editForm);
      setEditingPost(null);
      fetchPosts();
      alert("✅ Post Updated Successfully!");
    } catch (error) {
      const errorMsg = error.response?.data?.details || error.message;
      alert("❌ Failed to update post.\n\nReason: " + errorMsg);
    }
    setIsLoading(false);
  };

  // 🔥 DATA MANAGEMENT LOGIC (Search & Select)
  const filteredPosts = posts.filter(p => 
    p.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.topic && p.topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPosts.length && filteredPosts.length > 0) {
      setSelectedIds([]); // Deselect all
    } else {
      setSelectedIds(filteredPosts.map(p => p.id)); // Select all filtered
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if(!window.confirm(`🚨 Are you sure you want to permanently delete ${selectedIds.length} selected posts?`)) return;
    setIsLoading(true);
    try {
      // Execute all deletes in parallel for blazing fast speed
      await Promise.all(selectedIds.map(id => axios.delete(`/api/community/posts/${id}`)));
      setSelectedIds([]); // Clear selection
      fetchPosts();
      alert(`✅ ${selectedIds.length} posts deleted successfully!`);
    } catch (e) {
      alert("❌ Failed to delete some posts. Refresh and try again.");
    }
    setIsLoading(false);
  };

  const handleDeleteSingle = async (id) => {
    if(window.confirm("Are you sure you want to delete this post?")) {
      await axios.delete(`/api/community/posts/${id}`);
      fetchPosts();
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-200 relative">
      
      {/* 🌟 Header */}
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-blue-500" /> Community Hub
        </h1>
        <p className="text-slate-400 mt-2 font-medium">Manage your community feed, bulk upload CA, and organize data.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        
        {/* 🔥 Premium Create Post Card */}
        <div className="xl:col-span-5 h-max">
          <div className="bg-[#13151a] border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="flex bg-[#0f1115] p-1.5 rounded-2xl mb-6 relative z-10 w-full border border-slate-800">
              <button onClick={() => setUploadMode('single')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${uploadMode === 'single' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                <Layers className="w-4 h-4" /> Single
              </button>
              <button onClick={() => setUploadMode('bulk')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${uploadMode === 'bulk' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                <Code className="w-4 h-4" /> Bulk JSON
              </button>
            </div>
            
            {/* Forms stay exactly the same, just compressed into a slightly smaller column */}
            {uploadMode === 'single' && (
              <form onSubmit={handleCreateSinglePost} className="space-y-5 relative z-10 animate-fade-in">
                <div>
                  <textarea required value={question} onChange={e => setQuestion(e.target.value)} placeholder="Type MCQ here..." className="w-full bg-[#0f1115] border border-slate-700 rounded-2xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none transition-all shadow-inner" rows="3"></textarea>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {options.map((opt, idx) => {
                    const isSelected = correctIndex === idx;
                    return (
                      <div key={idx} onClick={() => setCorrectIndex(idx)} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-[#0f1115] border-slate-800 hover:border-slate-600'}`}>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'}`}>
                          {isSelected && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <input required type="text" value={opt} onChange={e => handleOptionChange(e.target.value, idx)} onClick={(e) => e.stopPropagation()} placeholder={`Option ${['A', 'B', 'C', 'D'][idx]}`} className="w-full bg-transparent border-none text-sm text-white focus:outline-none" />
                      </div>
                    );
                  })}
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-400 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,140,244,0.3)]">
                  {isLoading ? 'Publishing...' : <><Send className="w-4 h-4" /> Publish Post</>}
                </button>
              </form>
            )}

            {uploadMode === 'bulk' && (
              <div className="space-y-5 relative z-10 animate-fade-in">
                <textarea 
                  value={bulkJson} onChange={e => setBulkJson(e.target.value)} 
                  placeholder={`[\n  {\n    "publishDate": "2026-02-26",\n    "isCurrentAffair": true,\n    "region": "Assam",\n    "topic": "Sports",\n    "question": "English Q?",\n    "questionHindi": "Hindi Q?",\n    "options": ["A", "B", "C", "D"],\n    "correctOptionIndex": 0,\n    "explanation": "Eng Exp",\n    "explanationHindi": "Hindi Exp"\n  }\n]`} 
                  className="w-full bg-[#0f1115] border border-slate-700 rounded-2xl p-4 text-emerald-400 font-mono text-xs placeholder-slate-700 focus:outline-none focus:border-amber-500 resize-none transition-all custom-scrollbar" 
                  rows="14"
                ></textarea>
                <button onClick={handleBulkUpload} disabled={isLoading} className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-orange-400 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  {isLoading ? 'Uploading...' : <><UploadCloud className="w-5 h-5" /> Process Bulk Upload</>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 📜 THE PREMIUM DATA MANAGER (Right Side) */}
        <div className="xl:col-span-7">
          <div className="bg-[#13151a] border border-slate-800 rounded-3xl p-6 shadow-2xl h-[700px] flex flex-col relative overflow-hidden">
            
            {/* Toolbar Area */}
            <div className="flex flex-col gap-4 mb-5 border-b border-slate-800 pb-5">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-white text-lg flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-500" /> Database ({filteredPosts.length})
                </h3>
                
                {/* Bulk Action Buttons (Only visible if items selected) */}
                {selectedIds.length > 0 && (
                  <div className="flex items-center gap-3 animate-fade-in">
                    <span className="text-xs font-bold text-amber-500">{selectedIds.length} Selected</span>
                    <button onClick={handleBulkDelete} disabled={isLoading} className="flex items-center gap-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm">
                      <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                    </button>
                  </div>
                )}
              </div>

              {/* Search & Select All Tools */}
              <div className="flex items-center gap-4">
                <button onClick={toggleSelectAll} className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedIds.length === filteredPosts.length && filteredPosts.length > 0 ? 'bg-blue-600 border-blue-600' : 'bg-[#0f1115] border-slate-600 group-hover:border-blue-500'}`}>
                    {selectedIds.length === filteredPosts.length && filteredPosts.length > 0 && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">All</span>
                </button>
                
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} 
                    placeholder="Search by question, tag, or topic..." 
                    className="w-full bg-[#0f1115] border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-inner" 
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Feed List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {filteredPosts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <Database className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm font-medium">No records found matching your criteria.</p>
                </div>
              ) : (
                filteredPosts.map(post => {
                  const isSelected = selectedIds.includes(post.id);
                  return (
                    <div key={post.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 group ${isSelected ? 'bg-blue-900/10 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-[#0f1115] border-slate-800 hover:border-slate-700 hover:bg-[#15171e]'}`}>
                      
                      {/* Checkbox Col */}
                      <div className="pt-1.5 cursor-pointer" onClick={() => toggleSelect(post.id)}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600 shadow-md scale-110' : 'bg-[#13151a] border-slate-600 group-hover:border-blue-500'}`}>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>

                      {/* Content Col */}
                      <div className="flex-1 min-w-0">
                        {/* Tags */}
                        {post.isCurrentAffair && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">CA</span>
                            <span className="text-[9px] bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{post.region}</span>
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{post.topic}</span>
                            {post.questionHindi ? (
                               <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">HINDI ADDED</span>
                            ) : (
                               <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">NO HINDI</span>
                            )}
                          </div>
                        )}
                        
                        <p className={`font-bold text-sm mb-3 leading-relaxed pr-10 line-clamp-3 transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                          {post.question}
                        </p>
                        
                        <div className="flex items-center gap-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-500/70" /> {post.likes}</span>
                          <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-blue-500/70" /> {post.views}</span>
                          <span className="flex items-center gap-1.5 text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Action Col (Hover) */}
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); openEditModal(post); }} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-all" title="Edit Post">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteSingle(post.id); }} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-all" title="Delete Post">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 🔥 EDIT MODAL OVERLAY (Kept Exactly as before) */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#13151a] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative">
            <div className="sticky top-0 bg-[#13151a] border-b border-slate-800 p-5 flex items-center justify-between z-10">
              <h2 className="text-xl font-black text-white flex items-center gap-2"><Edit2 className="w-5 h-5 text-blue-500" /> Edit Post & Add Translation</h2>
              <button onClick={() => setEditingPost(null)} className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-full transition-all"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Question (English)</label>
                <textarea required value={editForm.question} onChange={e => setEditForm({...editForm, question: e.target.value})} className="w-full bg-[#0f1115] border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-blue-500 outline-none" rows="2"></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Question (Hindi Translation)</label>
                <textarea value={editForm.questionHindi} onChange={e => setEditForm({...editForm, questionHindi: e.target.value})} placeholder="Paste Hindi translation here..." className="w-full bg-[#0f1115] border border-slate-700 rounded-xl p-3 text-emerald-400 text-sm focus:border-emerald-500 outline-none" rows="2"></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Options</label>
                <div className="grid grid-cols-2 gap-3">
                  {editForm.options.map((opt, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-[#0f1115] border border-slate-700 p-2 rounded-lg">
                      <input type="radio" checked={editForm.correctOptionIndex === idx} onChange={() => setEditForm({...editForm, correctOptionIndex: idx})} className="w-4 h-4 accent-blue-500" />
                      <input value={opt} onChange={e => { const newOpts = [...editForm.options]; newOpts[idx] = e.target.value; setEditForm({...editForm, options: newOpts}); }} className="bg-transparent text-sm text-white outline-none w-full" />
                    </div>
                  ))}
                </div>
              </div>
               <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Explanation (English)</label>
                <textarea value={editForm.explanation} onChange={e => setEditForm({...editForm, explanation: e.target.value})} className="w-full bg-[#0f1115] border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-blue-500 outline-none" rows="2"></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Explanation (Hindi Translation)</label>
                <textarea value={editForm.explanationHindi} onChange={e => setEditForm({...editForm, explanationHindi: e.target.value})} placeholder="Paste Hindi explanation here..." className="w-full bg-[#0f1115] border border-slate-700 rounded-xl p-3 text-emerald-400 text-sm focus:border-emerald-500 outline-none" rows="2"></textarea>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}