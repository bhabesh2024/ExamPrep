import React from 'react';
import { ArrowLeft, BookmarkX } from 'lucide-react';
import PostCard from './PostCard';

export default function SavedQuestionsView({ setActiveView, feedData, savedPosts, likedPosts, viewedPosts, handleToggleLike, handleToggleSave, handleMarkViewed }) {
  const savedItems = feedData.filter(post => savedPosts.includes(post.id));

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-slide-in pb-10">
      
      <div className="flex items-center gap-3 px-2 pt-2 mb-2">
        <button onClick={() => setActiveView('hub')} className="p-2 -ml-2 rounded-full hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-600 dark:text-slate-300 transition-colors tap-effect">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-zinc-900 dark:text-white">Saved Questions</h1>
      </div>

      <div className="flex flex-col gap-5">
        {savedItems.length === 0 ? (
          <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[1.5rem] p-10 text-center shadow-sm">
            <BookmarkX className="w-12 h-12 text-zinc-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2">No saved questions yet</h3>
            <p className="text-sm font-medium text-zinc-500 dark:text-slate-400">Posts you save from the Community feed will appear here.</p>
            <button onClick={() => setActiveView('community')} className="mt-6 inline-flex items-center px-6 py-2.5 rounded-full bg-zinc-100 dark:bg-[#18181b] hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-800 dark:text-slate-200 text-sm font-bold transition-colors tap-effect">
              Explore Community
            </button>
          </div>
        ) : (
          savedItems.map(post => (
            <PostCard 
              key={post.id} post={post}
              isLiked={likedPosts.includes(post.id)} isSaved={savedPosts.includes(post.id)} hasViewed={viewedPosts.includes(post.id)}
              onToggleLike={handleToggleLike} onToggleSave={handleToggleSave} markViewed={handleMarkViewed}
            />
          ))
        )}
      </div>
    </div>
  );
}