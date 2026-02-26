import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, ArrowLeft, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PracticeResultScreen({ totalQuestions, correctCount, wrongCount, skippedCount, handleRetake }) {
  const navigate = useNavigate();
  
  // 🔥 Rate Us Logic State
  const [showRateModal, setShowRateModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    // Check if user has already rated
    const hasRated = localStorage.getItem('hasRatedApp');
    if (!hasRated) {
      // Show modal after 1.5 seconds of seeing the result
      const timer = setTimeout(() => {
        setShowRateModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleRatingSubmit = () => {
    if(rating === 0) {
      alert("Please select a star rating first!");
      return;
    }
    // Set in local storage so it never shows again
    localStorage.setItem('hasRatedApp', 'true');
    alert(`Thank you for rating us ${rating} stars! Your feedback is highly appreciated.`);
    setShowRateModal(false);
  };

  const handleDismissRating = () => {
    // If they dismiss, we can ask again next time, or set a "remind later" flag
    setShowRateModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center transition-colors duration-500 relative">
      <div className="w-full max-w-2xl bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-8 md:p-12 shadow-xl dark:shadow-2xl relative overflow-hidden animate-[fadeIn_0.5s_ease-out] transition-colors">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-amber-400"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-blue-100 dark:border-blue-500/20 shadow-sm transition-colors">
            <Trophy className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 transition-colors">Practice Completed!</h2>
          <p className="text-zinc-500 dark:text-slate-400 font-medium transition-colors">Your score has been successfully saved to your profile.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
          <div className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-3xl font-black text-zinc-900 dark:text-white mb-1">{totalQuestions}</p>
            <p className="text-[10px] text-zinc-500 dark:text-slate-500 uppercase tracking-widest font-bold">Total</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-1">{correctCount}</p>
            <p className="text-[10px] text-emerald-600/70 uppercase tracking-widest font-bold">Correct</p>
          </div>
          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-3xl font-black text-rose-600 dark:text-rose-400 mb-1">{wrongCount}</p>
            <p className="text-[10px] text-rose-600/70 uppercase tracking-widest font-bold">Wrong</p>
          </div>
          <div className="bg-zinc-100 dark:bg-slate-500/10 border border-zinc-300 dark:border-slate-500/30 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-3xl font-black text-zinc-700 dark:text-slate-300 mb-1">{skippedCount}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Skipped</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <button onClick={handleRetake} className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black transition-all shadow-md tap-effect">
            <RotateCcw className="w-5 h-5 inline mr-2" /> Retake Practice
          </button>
          <button onClick={() => navigate('/practice')} className="px-8 py-3.5 rounded-xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#18181b] hover:bg-zinc-100 text-zinc-800 dark:text-slate-200 font-bold transition-all shadow-sm tap-effect">
            <ArrowLeft className="w-4 h-4 inline mr-2" /> Back to Subjects
          </button>
        </div>
      </div>

      {/* 🔥 THE AUTO RATE US MODAL 🔥 */}
      {showRateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#121214] w-full max-w-sm rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-white/10 relative">
            <button onClick={handleDismissRating} className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-[#27272a] text-zinc-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6 mt-2">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-500/20 shadow-sm">
                <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
              </div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Enjoying PrepIQ?</h2>
              <p className="text-xs font-medium text-zinc-500 dark:text-slate-400">Rate your experience so far!</p>
            </div>

            <div className="flex justify-center gap-2 sm:gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110 tap-effect outline-none">
                  <Star className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors duration-300 ${rating >= star ? 'text-amber-500 fill-amber-500 drop-shadow-md' : 'text-zinc-300 dark:text-slate-700'}`} />
                </button>
              ))}
            </div>

            <textarea 
              value={feedbackText} 
              onChange={(e) => setFeedbackText(e.target.value)} 
              placeholder="Any suggestions for us?" 
              className="w-full bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white font-medium focus:outline-none focus:border-amber-500 resize-none mb-4 custom-scrollbar" 
              rows="2"
            ></textarea>
            
            <button onClick={handleRatingSubmit} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black transition-all shadow-md tap-effect">
              Submit Review
            </button>
          </div>
        </div>
      )}

    </div>
  );
}