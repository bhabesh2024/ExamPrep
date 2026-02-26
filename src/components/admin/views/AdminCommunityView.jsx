import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Trash2, MessageSquare } from 'lucide-react';

export default function AdminCommunityView() {
  const [posts, setPosts] = useState([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/community/posts');
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (e) { 
        console.error(e);
        setPosts([]);
    }
  };

  const handleOptionChange = (text, index) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!question || options.some(opt => !opt)) {
      alert("Please fill question and all 4 options."); return;
    }
    setIsLoading(true);
    try {
      await axios.post('/api/community/posts', {
        question, options, correctOptionIndex: Number(correctIndex)
      });
      setQuestion(''); setOptions(['', '', '', '']); setCorrectIndex(0);
      fetchPosts();
      alert("Post published to Community!");
    } catch (e) { alert("Failed to post"); }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this post?")) {
      await axios.delete(`/api/community/posts/${id}`);
      fetchPosts();
    }
  };

  return (
    <div className="space-y-6 text-zinc-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" /> Create Community Post
        </h2>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <textarea 
            required 
            value={question} 
            onChange={e => setQuestion(e.target.value)} 
            placeholder="Type the MCQ Question here..." 
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:border-blue-500 resize-none text-zinc-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            rows="3">
          </textarea>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="radio" name="correctOption" checked={correctIndex === idx} onChange={() => setCorrectIndex(idx)} className="w-4 h-4 cursor-pointer accent-blue-600" />
                <input 
                  required 
                  type="text" 
                  value={opt} 
                  onChange={e => handleOptionChange(e.target.value, idx)} 
                  placeholder={`Option ${idx + 1}`} 
                  className={`flex-1 rounded-lg p-2 text-sm outline-none transition-all text-zinc-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 ${correctIndex === idx ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/50 dark:border-emerald-700' : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`} 
                />
              </div>
            ))}
          </div>
          
          <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50">
            {isLoading ? 'Posting...' : <><Send className="w-4 h-4" /> Publish to Feed</>}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Recent Posts ({posts.length})</h3>
        <div className="space-y-4">
          {(posts.length > 0 ? posts : []).map(post => (
            <div key={post.id} className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex justify-between items-start">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-2">{post.question}</p>
                <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>👍 {post.likes} Likes</span>
                  <span>👁️ {post.views} Views</span>
                </div>
              </div>
              <button onClick={() => handleDelete(post.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
           {posts.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-center py-4">No community posts yet. Create one above!</p>}
        </div>
      </div>
    </div>
  );
}