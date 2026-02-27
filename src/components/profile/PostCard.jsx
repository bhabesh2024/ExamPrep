import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Share2, Bookmark, Eye, GraduationCap, BadgeCheck, Send, User } from 'lucide-react';

export default function PostCard({ post, isLiked, isSaved, hasViewed, onToggleLike, onToggleSave, markViewed }) {
  const [selectedOption, setSelectedOption] = useState(null);
  
  // 🔥 COMMENTS STATE
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [localCommentCount, setLocalCommentCount] = useState(post.comments);
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!hasViewed) markViewed(post.id);
  }, [hasViewed, post.id, markViewed]);

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'PrepIQ Question', text: `Can you solve this?\n\n${post.question}\n\nJoin PrepIQ to answer!`, url: window.location.origin }); } catch (error) {}
    } else { alert("Post link copied!"); }
  };

  // 🔥 FETCH COMMENTS FUNCTION
  const handleToggleComments = async () => {
    if (!showComments && commentsList.length === 0) {
      try {
        const res = await axios.get(`/api/community/posts/${post.id}/comments`);
        setCommentsList(res.data);
      } catch (e) { console.error("Failed to load comments"); }
    }
    setShowComments(!showComments);
  };

  // 🔥 SUBMIT NEW COMMENT FUNCTION
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsPostingComment(true);
    try {
      const res = await axios.post(`/api/community/posts/${post.id}/comments`, {
        text: newComment,
        author: currentUser?.name || 'Anonymous Student',
        userId: currentUser?.id
      });
      // Add new comment to the top of the list locally
      setCommentsList([res.data, ...commentsList]);
      setLocalCommentCount(prev => prev + 1); // Update count visually
      setNewComment('');
    } catch (e) {
      alert("Failed to post comment");
    } finally {
      setIsPostingComment(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[1.5rem] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* 👑 Admin Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-zinc-900 dark:text-white text-sm">PrepIQ</span>
              <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-100 dark:fill-blue-500/20" />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 uppercase tracking-widest">{post.time}</span>
          </div>
        </div>
      </div>

      {/* 📝 MCQ Content */}
      <div className="mb-5">
        <p className="text-sm sm:text-base font-bold text-zinc-800 dark:text-slate-200 leading-relaxed mb-4">
          {post.question}
        </p>
        
        <div className="space-y-2">
          {post.options.map((opt, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = post.correctOptionIndex === index;
            const showResult = selectedOption !== null;

            return (
              <button 
                key={index} onClick={() => setSelectedOption(index)} disabled={showResult}
                className={`w-full text-left px-4 py-3 rounded-xl border font-semibold text-sm transition-all duration-300 ${
                  !showResult 
                    ? 'border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#18181b] hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-200 dark:hover:border-blue-500/30 text-zinc-700 dark:text-slate-300 cursor-pointer tap-effect' 
                    : isCorrect ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 cursor-default'
                    : isSelected ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 cursor-default'
                    : 'border-zinc-100 dark:border-white/5 bg-transparent text-zinc-400 dark:text-slate-600 cursor-default opacity-50'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🚀 Interaction Bar */}
      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-white/5 pt-4 mt-2">
        <div className="flex items-center gap-5 sm:gap-6">
          <div onClick={() => onToggleLike(post.id)} className="flex items-center gap-1.5 group cursor-pointer tap-effect">
            <Heart className={`w-5 h-5 transition-all ${isLiked ? 'text-rose-500 fill-rose-500 scale-110' : 'text-zinc-400 dark:text-slate-500 group-hover:text-rose-500'}`} />
            <span className={`text-xs font-bold select-none ${isLiked ? 'text-rose-500' : 'text-zinc-500 dark:text-slate-400'}`}>{post.likes + (isLiked ? 1 : 0)}</span>
          </div>
          
          {/* 🔥 Comment Button now toggles section */}
          <div onClick={handleToggleComments} className="flex items-center gap-1.5 group cursor-pointer tap-effect">
            <MessageCircle className={`w-5 h-5 transition-colors ${showComments ? 'text-blue-500' : 'text-zinc-400 dark:text-slate-500 group-hover:text-blue-500'}`} />
            <span className={`text-xs font-bold select-none ${showComments ? 'text-blue-500' : 'text-zinc-500 dark:text-slate-400'}`}>{localCommentCount}</span>
          </div>

          <div className="flex items-center gap-1.5 cursor-default">
            <Eye className="w-5 h-5 text-zinc-400 dark:text-slate-500" />
            <span className="text-xs font-bold text-zinc-500 dark:text-slate-400 select-none">{post.views + (hasViewed ? 1 : 0)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Share2 onClick={handleShare} className="w-5 h-5 text-zinc-400 dark:text-slate-500 hover:text-blue-500 transition-colors cursor-pointer tap-effect" />
          <Bookmark onClick={() => onToggleSave(post.id)} className={`w-5 h-5 cursor-pointer transition-transform tap-effect ${isSaved ? 'text-amber-500 fill-amber-500 scale-110' : 'text-zinc-400 dark:text-slate-500 hover:text-amber-500'}`} />
        </div>
      </div>

      {/* 💬 COMMENTS SECTION (Expands on click) */}
      {showComments && (
        <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-white/5 animate-fade-in">
          
          {/* Add Comment Input */}
          <form onSubmit={handlePostComment} className="flex gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..." 
                className="w-full bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-full py-2 pl-4 pr-12 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                type="submit" 
                disabled={isPostingComment || !newComment.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
            {commentsList.length === 0 ? (
              <p className="text-center text-xs text-zinc-500 dark:text-slate-500 py-2">No comments yet. Be the first to start the discussion!</p>
            ) : (
              commentsList.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-white/5">
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{comment.author.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-2xl rounded-tl-none px-4 py-2.5 flex-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">{comment.author}</span>
                      <span className="text-[9px] font-medium text-zinc-400 dark:text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-slate-300 leading-relaxed break-words">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}