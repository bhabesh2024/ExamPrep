import React, { useState } from 'react';
import { Languages, Sparkles, Share2, Check, Landmark, BookOpen, Flag, AlertTriangle, Type } from 'lucide-react';
import MathText from '../common/MathText';
import GeometryVisualizer from '../common/GeometryVisualizer';
import axios from 'axios';

export default function QuestionCard({ currentQ, currentQuestionData, showQHindi, isTranslatingQ, hindiQuestionText, handleTranslateQuestion, subjectId, topicId }) {
  const [copied, setCopied] = useState(false);
  const [showFlagMenu, setShowFlagMenu] = useState(false);

  // 🧠 RESTORED: Ask AI Logic
  const handleGoogleSearch = () => {
    const question = currentQuestionData?.question || '';
    const options = currentQuestionData?.options ? currentQuestionData.options.map((opt, i) => `${['A','B','C','D'][i]}) ${opt}`).join('\n') : '';
    const query = `Explain this MCQ with correct answer and reasoning:\n\nQuestion: ${question}\n\nOptions:\n${options}`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&udm=50`, '_blank');
  };

  // 🔗 RESTORED: Share Logic
  const handleShare = async () => {
    const question = currentQuestionData?.question || '';
    const options = currentQuestionData?.options ? currentQuestionData.options.map((opt, i) => `${['A','B','C','D'][i]}) ${opt}`).join('\n') : '';
    const shareUrl = topicId && subjectId ? `${window.location.origin}/quiz/${subjectId}/${topicId}?q=${currentQ + 1}` : window.location.href;
    const shareText = `📚 PrepIQ Practice Question\n\n${question}\n\n${options}\n\nPractice more at PrepIQ 👇`;

    if (navigator.share) {
      try { await navigator.share({ title: 'PrepIQ Question', text: shareText, url: shareUrl }); return; } catch (e) { }
    }
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      const ta = document.createElement('textarea'); ta.value = `${shareText}\n${shareUrl}`;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };

  // 🚩 RESTORED: Flag Logic
  const submitFlag = async (reason) => {
    if(!currentQuestionData?.id) {
      alert("This question is a draft and not in DB yet."); 
      return;
    }
    try {
      await axios.post('/api/admin/flag', { questionId: currentQuestionData.id, reason });
      alert("Issue reported to Admin. Thank you!");
      setShowFlagMenu(false);
    } catch(e) { 
      alert("Failed to report. Please try again."); 
    }
  };

  return (
    <div className="bg-white dark:bg-[#121214] rounded-[2rem] p-5 sm:p-8 border border-zinc-200 dark:border-white/5 shadow-md relative flex flex-col transition-colors duration-500">
      
      <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-32 bg-blue-50 dark:bg-blue-500/10 blur-2xl rounded-bl-full transition-colors"></div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-6 sm:mb-8 relative z-20 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 uppercase tracking-widest shadow-sm transition-colors">
            Question {currentQ + 1}
          </span>
          {currentQuestionData?.examReference && currentQuestionData.examReference !== "Expected" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-500/20 uppercase tracking-widest shadow-sm transition-colors">
              <Landmark className="w-3 h-3" /> {currentQuestionData.examReference}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap relative">
          <button onClick={handleTranslateQuestion} disabled={isTranslatingQ} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 tap-effect disabled:opacity-60 shadow-sm ${showQHindi ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400' : 'bg-zinc-50 dark:bg-[#18181b] border-zinc-200 dark:border-white/5 text-zinc-700 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-[#27272a]'}`}>
            {isTranslatingQ ? <><div className="w-3 h-3 border border-zinc-400 border-t-zinc-800 rounded-full animate-spin" /> ...</> : <><Languages className="w-3.5 h-3.5" /> {showQHindi ? 'English' : 'Hindi'}</>}
          </button>
          
          <button onClick={handleGoogleSearch} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-[11px] font-black uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-300 tap-effect">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>
          
          <button onClick={handleShare} className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 tap-effect shadow-sm ${copied ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-50 dark:bg-[#18181b] border-zinc-200 dark:border-white/5 text-zinc-700 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-[#27272a]'}`}>
            {copied ? <><Check className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Copied!</span></> : <><Share2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Share</span></>}
          </button>

          <div className="relative">
            <button onClick={() => setShowFlagMenu(!showFlagMenu)} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 tap-effect shadow-sm bg-zinc-50 dark:bg-[#18181b] border-zinc-200 dark:border-white/5 text-zinc-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500/30">
              <Flag className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Report</span>
            </button>
            
            {showFlagMenu && (
              <div className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-2xl p-2 shadow-xl z-[999] transition-colors">
                <p className="text-[10px] text-zinc-400 dark:text-slate-500 font-bold uppercase tracking-widest px-3 pb-2 border-b border-zinc-100 dark:border-[#27272a] mb-1.5">Select Issue</p>
                <button onClick={() => submitFlag("Wrong Answer")} className="flex items-center gap-2 w-full text-left px-3 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl text-sm font-semibold text-zinc-700 dark:text-slate-300 transition-colors">
                  <AlertTriangle className="w-4 h-4" /> Wrong Answer
                </button>
                <button onClick={() => submitFlag("Translation Error")} className="flex items-center gap-2 w-full text-left px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl text-sm font-semibold text-zinc-700 dark:text-slate-300 transition-colors">
                  <Languages className="w-4 h-4" /> Translation Error
                </button>
                <button onClick={() => submitFlag("Typo / Formatting")} className="flex items-center gap-2 w-full text-left px-3 py-2.5 hover:bg-zinc-50 dark:hover:bg-[#27272a] hover:text-zinc-900 dark:hover:text-white rounded-xl text-sm font-semibold text-zinc-700 dark:text-slate-300 transition-colors">
                  <Type className="w-4 h-4" /> Typo / Formatting
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {currentQuestionData?.passage && (
          <div className="mb-6 rounded-2xl bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 overflow-hidden flex flex-col shadow-sm transition-colors">
            <div className="flex items-center gap-2 px-5 py-3 bg-zinc-100 dark:bg-[#27272a]/50 border-b border-zinc-200 dark:border-white/5 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-widest shrink-0 transition-colors">
              <BookOpen className="w-4 h-4" /> Direction / Passage
            </div>
            <div className="p-5 md:p-6 max-h-56 overflow-y-auto custom-scrollbar">
              <div className="text-sm md:text-base text-zinc-700 dark:text-slate-300 leading-relaxed font-medium">
                {showQHindi && currentQuestionData.passageHindi ? (
                  <MathText text={currentQuestionData.passageHindi} />
                ) : (
                  <MathText text={currentQuestionData.passage} />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-lg md:text-xl font-bold leading-relaxed text-zinc-900 dark:text-white min-h-[80px] flex items-start transition-colors">
          {showQHindi ? (
            <div key="hindi" className="fade-in-text font-display w-full"><MathText text={hindiQuestionText} /></div>
          ) : (
            <div key="english" className="fade-in-text w-full"><MathText text={currentQuestionData.question} /></div>
          )}
        </div>
        
        <GeometryVisualizer type={currentQuestionData.geometryType} dataStr={currentQuestionData.geometryData} />
      </div>
    </div>
  );
}