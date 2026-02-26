import React, { useState } from 'react';
import { ArrowLeft, Share2, Star, MessageSquare, LogOut, GraduationCap, AlertOctagon, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider';

export default function SettingsView({ setActiveView, handleLogout, navigate }) {
  const { fontSize, changeFontSize } = useTheme();
  
  // 🔥 Rate Us State
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PrepIQ - Best Exam Prep App',
          text: 'Join me on PrepIQ and crack your next exam with premium mock tests!',
          url: window.location.origin, 
        });
      } catch (error) {
        console.log('Share canceled or failed', error);
      }
    } else {
      alert("App link copied: " + window.location.origin);
    }
  };

  const handleDeleteAccount = () => {
    if(window.confirm("🚨 Are you sure you want to delete your account? This action cannot be undone and all your test history will be permanently lost.")) {
      alert("Account deletion request processed. You will be logged out.");
      localStorage.clear();
      navigate('/login');
    }
  };

  const handleRatingSubmit = () => {
    if(rating === 0) {
      alert("Please select a star rating first!");
      return;
    }
    // API Call goes here (e.g. POST /api/feedback)
    alert(`Thank you for rating us ${rating} stars! Your feedback helps us improve.`);
    setIsRatingModalOpen(false);
    setRating(0);
    setFeedbackText('');
  };

  return (
    <>
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6 animate-slide-in pb-10">
        <div className="flex items-center gap-3 px-2 pt-2 mb-2">
          <button onClick={() => setActiveView('hub')} className="p-2 -ml-2 rounded-full hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-600 dark:text-slate-300 transition-colors tap-effect">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">Settings</h1>
        </div>
        
        <div className="flex flex-col gap-5">
          <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[1.5rem] p-5 shadow-sm">
            <h3 className="text-[10px] font-black text-zinc-500 dark:text-slate-500 uppercase tracking-widest mb-4">Display & Text</h3>
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-900 dark:text-white text-sm">Font Size</span>
              <div className="flex bg-zinc-100 dark:bg-[#18181b] rounded-xl p-1 border border-zinc-200 dark:border-white/5">
                <button onClick={() => changeFontSize('small')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all tap-effect ${fontSize === 'small' ? 'bg-white dark:bg-[#27272a] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}>A-</button>
                <button onClick={() => changeFontSize('normal')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all tap-effect ${fontSize === 'normal' ? 'bg-white dark:bg-[#27272a] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}>A</button>
                <button onClick={() => changeFontSize('large')} className={`px-4 py-1.5 rounded-lg text-base font-bold transition-all tap-effect ${fontSize === 'large' ? 'bg-white dark:bg-[#27272a] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'}`}>A+</button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[1.5rem] p-2 shadow-sm flex flex-col">
            <button onClick={() => setActiveView('support')} className="flex items-center justify-between p-3.5 hover:bg-zinc-50 dark:hover:bg-[#18181b] rounded-xl transition-colors tap-effect text-sm font-bold text-zinc-900 dark:text-white w-full">
              <div className="flex items-center gap-3"><MessageSquare className="w-4 h-4 text-emerald-500" /> Help & Support</div>
            </button>
            <div className="h-px bg-zinc-100 dark:bg-white/5 mx-3"></div>
            <button onClick={handleShareApp} className="flex items-center justify-between p-3.5 hover:bg-zinc-50 dark:hover:bg-[#18181b] rounded-xl transition-colors tap-effect text-sm font-bold text-zinc-900 dark:text-white w-full">
              <div className="flex items-center gap-3"><Share2 className="w-4 h-4 text-blue-500" /> Share App</div>
            </button>
            <div className="h-px bg-zinc-100 dark:bg-white/5 mx-3"></div>
            
            {/* 🔥 Rate Us Trigger */}
            <button onClick={() => setIsRatingModalOpen(true)} className="flex items-center justify-between p-3.5 hover:bg-zinc-50 dark:hover:bg-[#18181b] rounded-xl transition-colors tap-effect text-sm font-bold text-zinc-900 dark:text-white w-full">
              <div className="flex items-center gap-3"><Star className="w-4 h-4 text-amber-500" /> Rate Us</div>
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-2">
            <button onClick={handleLogout} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 text-zinc-700 dark:text-slate-300 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-[#27272a] transition-colors tap-effect">
              <LogOut className="w-4 h-4" /> Log Out
            </button>
            <button onClick={handleDeleteAccount} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-bold hover:bg-rose-500 hover:text-white transition-colors tap-effect">
              <AlertOctagon className="w-4 h-4" /> Delete Account
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">PrepIQ App v1.0.0</p>
          </div>
        </div>
      </div>

      {/* 🔥 THE RATE US MODAL 🔥 */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#121214] w-full max-w-sm rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-white/10 relative">
            <button onClick={() => setIsRatingModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-[#27272a] text-zinc-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-500/20 shadow-sm">
                <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Enjoying PrepIQ?</h2>
              <p className="text-sm font-medium text-zinc-500 dark:text-slate-400">Tap a star to rate your experience.</p>
            </div>

            {/* Star Rating Selection */}
            <div className="flex justify-center gap-2 sm:gap-4 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)} 
                  className="transition-transform hover:scale-110 tap-effect outline-none"
                >
                  <Star className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-300 ${rating >= star ? 'text-amber-500 fill-amber-500 drop-shadow-md' : 'text-zinc-300 dark:text-slate-700'}`} />
                </button>
              ))}
            </div>

            <textarea 
              value={feedbackText} 
              onChange={(e) => setFeedbackText(e.target.value)} 
              placeholder="Tell us what you love or what we can improve..." 
              className="w-full bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white font-medium focus:outline-none focus:border-amber-500 resize-none mb-4 custom-scrollbar" 
              rows="3"
            ></textarea>
            
            <button 
              onClick={handleRatingSubmit} 
              className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-black transition-all shadow-md hover:shadow-blue-500/30 tap-effect"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </>
  );
}