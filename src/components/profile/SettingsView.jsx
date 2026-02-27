import React, { useState } from 'react';
import { ArrowLeft, Share2, Star, AlertOctagon, X, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeProvider';

export default function SettingsView({ setActiveView, handleLogout, navigate }) {
  const { fontSize, changeFontSize } = useTheme();
  
  // Rate Us State
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  // Delete Account State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

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

  const handleRatingSubmit = () => {
    if(rating === 0) {
      alert("Please select a star rating first!");
      return;
    }
    alert(`Thank you for rating us ${rating} stars! Your feedback helps us improve.`);
    setIsRatingModalOpen(false);
    setRating(0);
    setFeedbackText('');
  };

  const confirmDeleteAccount = () => {
    alert("Account and all associated data permanently deleted. You will be logged out.");
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6 animate-slide-in pb-10 relative z-0">
        <div className="flex items-center gap-3 px-2 pt-2 mb-2">
          <button onClick={() => setActiveView('hub')} className="p-2 -ml-2 rounded-full hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-600 dark:text-slate-300 transition-colors tap-effect">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-zinc-900 dark:text-white">Settings</h1>
        </div>
        
        <div className="flex flex-col gap-5">
          {/* Display Settings */}
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

          {/* App Actions */}
          <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[1.5rem] p-2 shadow-sm flex flex-col">
            <button onClick={handleShareApp} className="flex items-center justify-between p-3.5 hover:bg-zinc-50 dark:hover:bg-[#18181b] rounded-xl transition-colors tap-effect text-sm font-bold text-zinc-900 dark:text-white w-full">
              <div className="flex items-center gap-3"><Share2 className="w-4 h-4 text-blue-500" /> Share App</div>
            </button>
            <div className="h-px bg-zinc-100 dark:bg-white/5 mx-3"></div>
            
            <button onClick={() => setIsRatingModalOpen(true)} className="flex items-center justify-between p-3.5 hover:bg-zinc-50 dark:hover:bg-[#18181b] rounded-xl transition-colors tap-effect text-sm font-bold text-zinc-900 dark:text-white w-full">
              <div className="flex items-center gap-3"><Star className="w-4 h-4 text-amber-500" /> Rate Us</div>
            </button>
          </div>

          {/* Danger Zone - Delete Account */}
          <div className="bg-white dark:bg-[#121214] border border-red-200 dark:border-red-900/30 rounded-[1.5rem] p-5 shadow-sm mt-4">
             <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">Danger Zone</h3>
             <div className="flex justify-start">
                <button onClick={() => setIsDeleteModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-bold hover:bg-rose-500 hover:text-white transition-colors tap-effect">
                  <AlertOctagon className="w-4 h-4" /> Delete Account
                </button>
             </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">PrepIQ App v1.0.0</p>
          </div>
        </div>
      </div>

      {/* --- THE RATE US MODAL (Z-Index Fixed) --- */}
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
            </div>

            <div className="flex justify-center gap-2 sm:gap-4 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110 tap-effect outline-none">
                  <Star className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-300 ${rating >= star ? 'text-amber-500 fill-amber-500 drop-shadow-md' : 'text-zinc-300 dark:text-slate-700'}`} />
                </button>
              ))}
            </div>

            <textarea 
              value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} 
              placeholder="Tell us what you love or what we can improve..." 
              className="w-full bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white font-medium focus:outline-none focus:border-amber-500 resize-none mb-4" 
              rows="3"
            ></textarea>
            
            <button onClick={handleRatingSubmit} className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-black transition-all shadow-md hover:shadow-blue-500/30 tap-effect">
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {/* --- GITHUB STYLE DELETE ACCOUNT MODAL (Fixed: Z-Index, Button Size, Card Design) --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          {/* Updated Card Design to match Chapter Practice Style */}
          <div className="bg-white dark:bg-[#121214] w-full max-w-[400px] rounded-[1.5rem] p-6 shadow-sm border border-zinc-200 dark:border-white/5 relative">
            <button onClick={() => { setIsDeleteModalOpen(false); setDeleteConfirmText(''); }} className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-[#27272a] text-zinc-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-4">
              {/* Icon and Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-200 dark:border-rose-500/20">
                  <Trash2 className="w-5 h-5 text-rose-500" />
                </div>
                <h2 className="text-lg font-black text-zinc-900 dark:text-white leading-tight">Delete Account</h2>
              </div>
              
              {/* Warning Box */}
              <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 p-4 rounded-xl mb-5">
                 <p className="text-sm text-rose-800 dark:text-rose-300 font-medium leading-relaxed">
                   <strong>Warning:</strong> This action is permanent. All your data, including test history and saved questions, will be wiped.
                 </p>
                 <p className="text-sm text-rose-800 dark:text-rose-300 font-medium leading-relaxed mt-2">
                   Active <strong>Premium Subscriptions</strong> will be lost and cannot be recovered.
                 </p>
              </div>

              {/* Input Label */}
              <label className="block text-sm font-bold text-zinc-700 dark:text-slate-300 mb-2">
                Type <span className="text-rose-600 dark:text-rose-400 font-black select-all">delete</span> to confirm:
              </label>
              <input 
                type="text" 
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white font-medium focus:outline-none focus:border-rose-500 mb-5"
                placeholder="Type delete"
              />
            </div>

            {/* Small, Inline Delete Button */}
            <div className="flex justify-end">
              <button 
                onClick={confirmDeleteAccount} 
                disabled={deleteConfirmText.trim().toLowerCase() !== 'delete'}
                className={`inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md tap-effect ${
                  deleteConfirmText.trim().toLowerCase() === 'delete' 
                    ? 'bg-rose-600 hover:bg-rose-700 text-white hover:shadow-rose-500/30 cursor-pointer' 
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed shadow-none'
                }`}
              >
                Delete my account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}