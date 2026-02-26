import React from 'react';
import { ArrowLeft, MessageSquare, ArrowRight, Rss } from 'lucide-react';
import PostCard from './PostCard';

export default function CommunityView({ setActiveView, feedData, savedPosts, likedPosts, viewedPosts, handleToggleLike, handleToggleSave, handleMarkViewed }) {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-slide-in pb-10">
      
      <div className="flex items-center gap-3 px-2 pt-2 mb-2">
        <button onClick={() => setActiveView('hub')} className="p-2 -ml-2 rounded-full hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-600 dark:text-slate-300 transition-colors tap-effect">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-zinc-900 dark:text-white">Community</h1>
      </div>

      {/* 🚀 PREMIUM WHATSAPP CARD */}
      <a href="#" target="_blank" className="relative overflow-hidden flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[1.5rem] shadow-md hover:shadow-emerald-500/30 transition-all duration-300 tap-effect group border border-emerald-400">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-sm">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div className="text-left text-white">
            <h4 className="font-black text-lg md:text-xl tracking-tight">Join Premium WhatsApp</h4>
            <p className="text-xs md:text-sm text-emerald-50 font-medium opacity-90 mt-0.5">Daily MCQs & Direct Admin Updates</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center relative z-10">
          <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </div>
      </a>

      {/* 📜 OFFICIAL FEED SECTION */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-6 px-2">
          <Rss className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">Official Feed</h2>
        </div>

        <div className="flex flex-col gap-5">
          {feedData.map(post => (
            <PostCard 
              key={post.id} post={post}
              isLiked={likedPosts.includes(post.id)} isSaved={savedPosts.includes(post.id)} hasViewed={viewedPosts.includes(post.id)}
              onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} markViewed={handleMarkViewed}
            />
          ))}
        </div>
      </div>
      
    </div>
  );
}