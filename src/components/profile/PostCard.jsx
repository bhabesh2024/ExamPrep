import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Eye, GraduationCap, BadgeCheck } from 'lucide-react';

export default function PostCard({ post, isLiked, isSaved, hasViewed, onToggleLike, onToggleSave, markViewed }) {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (!hasViewed) {
      markViewed(post.id);
    }
  }, [hasViewed, post.id, markViewed]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PrepIQ Question',
          text: `Can you solve this?\n\n${post.question}\n\nJoin PrepIQ to answer!`,
          url: window.location.origin, 
        });
      } catch (error) {}
    } else {
      alert("Post link copied!");
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
                key={index}
                onClick={() => setSelectedOption(index)}
                disabled={showResult}
                className={`w-full text-left px-4 py-3 rounded-xl border font-semibold text-sm transition-all duration-300 ${
                  !showResult 
                    ? 'border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#18181b] hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-200 dark:hover:border-blue-500/30 text-zinc-700 dark:text-slate-300 cursor-pointer tap-effect' 
                    : isCorrect 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 cursor-default'
                      : isSelected 
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 cursor-default'
                        : 'border-zinc-100 dark:border-white/5 bg-transparent text-zinc-400 dark:text-slate-600 cursor-default opacity-50'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🚀 Interaction Bar (Buttonless Design) */}
      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-white/5 pt-4 mt-2">
        <div className="flex items-center gap-5 sm:gap-6">
          <div onClick={() => onToggleLike(post.id)} className="flex items-center gap-1.5 group cursor-pointer tap-effect">
            <Heart className={`w-5 h-5 transition-all ${isLiked ? 'text-rose-500 fill-rose-500 scale-110' : 'text-zinc-400 dark:text-slate-500 group-hover:text-rose-500'}`} />
            <span className={`text-xs font-bold select-none ${isLiked ? 'text-rose-500' : 'text-zinc-500 dark:text-slate-400'}`}>
              {post.likes + (isLiked ? 1 : 0)}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 group cursor-pointer tap-effect">
            <MessageCircle className="w-5 h-5 text-zinc-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors" />
            <span className="text-xs font-bold text-zinc-500 dark:text-slate-400 select-none">{post.comments}</span>
          </div>

          <div className="flex items-center gap-1.5 cursor-default">
            <Eye className="w-5 h-5 text-zinc-400 dark:text-slate-500" />
            <span className="text-xs font-bold text-zinc-500 dark:text-slate-400 select-none">
              {post.views + (hasViewed ? 1 : 0)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Share2 onClick={handleShare} className="w-5 h-5 text-zinc-400 dark:text-slate-500 hover:text-blue-500 transition-colors cursor-pointer tap-effect" />
          <Bookmark onClick={() => onToggleSave(post.id)} className={`w-5 h-5 cursor-pointer transition-transform tap-effect ${isSaved ? 'text-amber-500 fill-amber-500 scale-110' : 'text-zinc-400 dark:text-slate-500 hover:text-amber-500'}`} />
        </div>
      </div>

    </div>
  );
}