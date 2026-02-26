import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Trash2, MessageSquare, CheckCircle2, Eye, Heart, Layers, Code, UploadCloud } from 'lucide-react';

export default function AdminCommunityView() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 🌟 Toggle State: 'single' or 'bulk'
  const [uploadMode, setUploadMode] = useState('single');

  // Single Post States
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);

  // Bulk Upload State
  const [bulkJson, setBulkJson] = useState('');

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
    if (!question || options.some(opt => !opt)) {
      alert("Please fill the question and all 4 options."); return;
    }
    setIsLoading(true);
    try {
      await axios.post('/api/community/posts', {
        question, options, correctOptionIndex: Number(correctIndex)
      });
      setQuestion(''); setOptions(['', '', '', '']); setCorrectIndex(0);
      fetchPosts();
      alert("🚀 Single MCQ Published successfully!");
    } catch (e) { alert("Failed to post."); }
    setIsLoading(false);
  };

  // 🚀 BULK JSON UPLOAD HANDLER
  const handleBulkUpload = async () => {
    if (!bulkJson.trim()) {
      alert("Please paste your JSON data first."); return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(bulkJson); // Validate JSON
      if (!Array.isArray(parsedData)) throw new Error("JSON must be an array []");
    } catch (e) {
      alert("❌ Invalid JSON Format! Please check for missing commas or quotes.\n\nError: " + e.message);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('/api/community/bulk', parsedData);
      setBulkJson('');
      fetchPosts();
      alert(`✅ Success! ${res.data.count} Posts uploaded and scheduled.`);
    } catch (e) {
      alert("Failed to bulk upload. Check backend console.");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this post?")) {
      await axios.delete(`/api/community/posts/${id}`);
      fetchPosts();
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-200">
      
      {/* 🌟 Header */}
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-blue-500" /> Community Manager
        </h1>
        <p className="text-slate-400 mt-2 font-medium">Post single MCQs or Bulk Upload Smart Current Affairs.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* 🔥 Premium Create Post Card */}
        <div className="xl:col-span-7">
          <div className="bg-[#13151a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            {/* TOGGLE TABS */}
            <div className="flex bg-[#0f1115] p-1.5 rounded-2xl mb-6 relative z-10 w-max border border-slate-800">
              <button onClick={() => setUploadMode('single')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${uploadMode === 'single' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                <Layers className="w-4 h-4" /> Single Post
              </button>
              <button onClick={() => setUploadMode('bulk')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${uploadMode === 'bulk' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                <Code className="w-4 h-4" /> Bulk Upload (JSON)
              </button>
            </div>
            
            {/* 📝 MODE 1: SINGLE POST FORM */}
            {uploadMode === 'single' && (
              <form onSubmit={handleCreateSinglePost} className="space-y-6 relative z-10 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Question</label>
                  <textarea required value={question} onChange={e => setQuestion(e.target.value)} placeholder="Type MCQ here..." className="w-full bg-[#0f1115] border border-slate-700 rounded-2xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none transition-all shadow-inner" rows="3"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Options & Correct Answer</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {options.map((opt, idx) => {
                      const isSelected = correctIndex === idx;
                      return (
                        <div key={idx} onClick={() => setCorrectIndex(idx)} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-[#0f1115] border-slate-800 hover:border-slate-600'}`}>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'}`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <input required type="text" value={opt} onChange={e => handleOptionChange(e.target.value, idx)} onClick={(e) => e.stopPropagation()} placeholder={`Option ${['A', 'B', 'C', 'D'][idx]}`} className="w-full bg-transparent border-none text-sm text-white focus:outline-none" />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,140,244,0.3)]">
                  {isLoading ? 'Publishing...' : <><Send className="w-4 h-4" /> Publish Post</>}
                </button>
              </form>
            )}

            {/* 💻 MODE 2: BULK JSON UPLOAD */}
            {uploadMode === 'bulk' && (
              <div className="space-y-6 relative z-10 animate-fade-in">
                <div>
                  <label className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    <span>Paste JSON Array</span>
                    <span className="text-amber-500 normal-case tracking-normal">[{'{'}, {'}'}]</span>
                  </label>
                  <textarea 
                    value={bulkJson} onChange={e => setBulkJson(e.target.value)} 
                    placeholder={`[\n  {\n    "publishDate": "2026-02-26",\n    "isCurrentAffair": true,\n    "region": "Assam",\n    "topic": "Sports",\n    "question": "Sample Question?",\n    "options": ["A", "B", "C", "D"],\n    "correctOptionIndex": 0,\n    "explanation": "Detail here"\n  }\n]`} 
                    className="w-full bg-[#0f1115] border border-slate-700 rounded-2xl p-4 text-emerald-400 font-mono text-xs placeholder-slate-700 focus:outline-none focus:border-amber-500 resize-none transition-all custom-scrollbar" 
                    rows="12"
                  ></textarea>
                </div>
                <button onClick={handleBulkUpload} disabled={isLoading} className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  {isLoading ? 'Uploading...' : <><UploadCloud className="w-5 h-5" /> Process Bulk Upload</>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 📜 Live Feed List */}
        <div className="xl:col-span-5">
          <div className="bg-[#13151a] border border-slate-800 rounded-3xl p-6 shadow-2xl h-full max-h-[600px] flex flex-col">
            <h3 className="font-black text-white mb-4">Live Posts ({posts.length})</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
              {posts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <MessageSquare className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-sm font-medium">No posts in the feed yet.</p>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="bg-[#0f1115] border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-colors group relative">
                    
                    {/* Tags for Smart CA */}
                    {post.isCurrentAffair && (
                      <div className="flex gap-2 mb-3">
                        <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">CA</span>
                        <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{post.region}</span>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{post.topic}</span>
                      </div>
                    )}
                    
                    <p className="font-bold text-white text-sm mb-4 leading-relaxed pr-8">{post.question}</p>
                    
                    <div className="flex items-center gap-5 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-500" /> {post.likes}</span>
                      <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-blue-500" /> {post.views}</span>
                    </div>

                    <button onClick={() => handleDelete(post.id)} className="absolute top-4 right-4 p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}