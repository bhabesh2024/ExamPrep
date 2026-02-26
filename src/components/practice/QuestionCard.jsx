import React, { useState } from 'react';
import { Languages, Sparkles, Share2, Check, Landmark, BookOpen, Flag } from 'lucide-react';
import MathText from '../common/MathText';
import GeometryVisualizer from '../common/GeometryVisualizer';
import axios from 'axios';

export default function QuestionCard({ currentQ, currentQuestionData, showQHindi, isTranslatingQ, hindiQuestionText, handleTranslateQuestion, subjectId, topicId }) {
  const [copied, setCopied] = useState(false);
  const [showFlagMenu, setShowFlagMenu] = useState(false);

  const handleGoogleSearch = () => {
    const question = currentQuestionData?.question || '';
    const options = currentQuestionData?.options ? currentQuestionData.options.map((opt, i) => `${['A','B','C','D'][i]}) ${opt}`).join('\n') : '';
    const query = `Explain this MCQ with correct answer and reasoning:\n\nQuestion: ${question}\n\nOptions:\n${options}`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&udm=50`, '_blank');
  };

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
    <div className="bg-[#1a1d24] rounded-2xl p-4 sm:p-6 border border-[#282e39] shadow-xl relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 blur-2xl rounded-bl-full pointer-events-none"></div>

      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 relative z-10 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0d59f2]/10 text-[#0d59f2] border border-[#0d59f2]/20 uppercase tracking-wider">
            Question {currentQ + 1}
          </span>
          {currentQuestionData?.examReference && currentQuestionData.examReference !== "Expected" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider shadow-sm">
              <Landmark className="w-3 h-3" /> {currentQuestionData.examReference}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap relative">
          <button onClick={handleTranslateQuestion} disabled={isTranslatingQ} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 ${showQHindi ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-[#282e39] border-slate-600 text-slate-300 hover:bg-[#3b4354]'}`}>
            {isTranslatingQ ? <><div className="w-3 h-3 border border-slate-400 border-t-white rounded-full animate-spin" /> ...</> : <><Languages className="w-3 h-3" /> {showQHindi ? 'English' : 'Hindi'}</>}
          </button>
          
          <button onClick={handleGoogleSearch} className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask Google AI</span>
            <span className="sm:hidden">AI</span>
          </button>
          
          <button onClick={handleShare} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 cursor-pointer hover:scale-105 ${copied ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-[#282e39] border-slate-600 text-slate-300 hover:bg-[#3b4354] hover:border-slate-500 hover:text-white'}`}>
            {copied ? <><Check className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Copied!</span></> : <><Share2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Share</span></>}
          </button>

          {/* 🔥 FLAG BUTTON & DROPDOWN */}
          <div className="relative">
            <button onClick={() => setShowFlagMenu(!showFlagMenu)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 cursor-pointer bg-[#282e39] border-slate-600 text-slate-300 hover:bg-[#3b4354] hover:text-red-400 hover:border-red-500/50">
              <Flag className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Report</span>
            </button>
            
            {showFlagMenu && (
              <div className="absolute top-full mt-2 right-0 w-48 bg-[#1a1d24] border border-[#282e39] rounded-xl p-2 shadow-2xl z-50">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest px-2 pb-2 border-b border-[#282e39] mb-1">Select Issue</p>
                <button onClick={() => submitFlag("Wrong Answer")} className="block w-full text-left px-3 py-2 hover:bg-[#282e39] rounded-lg text-sm text-slate-200 transition-colors cursor-pointer">❌ Wrong Answer</button>
                <button onClick={() => submitFlag("Translation Error")} className="block w-full text-left px-3 py-2 hover:bg-[#282e39] rounded-lg text-sm text-slate-200 transition-colors cursor-pointer">🌐 Translation Error</button>
                <button onClick={() => submitFlag("Typo / Formatting")} className="block w-full text-left px-3 py-2 hover:bg-[#282e39] rounded-lg text-sm text-slate-200 transition-colors cursor-pointer">✍️ Typo / Formatting</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {currentQuestionData?.passage && (
        <div className="mb-6 rounded-xl bg-[#111318]/80 border border-[#2a2f3a] overflow-hidden flex flex-col relative z-10 shadow-inner">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1d24] border-b border-[#2a2f3a] text-[#0d59f2] text-[11px] font-black uppercase tracking-widest shrink-0">
            <BookOpen className="w-4 h-4" /> Direction / Passage
          </div>
          <div className="p-4 md:p-5 max-h-56 overflow-y-auto custom-scrollbar">
            <div className="text-sm md:text-base text-slate-300 leading-relaxed font-medium">
              {showQHindi && currentQuestionData.passageHindi ? (
                <MathText text={currentQuestionData.passageHindi} />
              ) : (
                <MathText text={currentQuestionData.passage} />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="text-base md:text-xl font-medium leading-relaxed text-slate-200 relative z-10 min-h-[80px] flex items-start">
        {showQHindi ? (
          <div key="hindi" className="fade-in-text font-display w-full"><MathText text={hindiQuestionText} /></div>
        ) : (
          <div key="english" className="fade-in-text w-full"><MathText text={currentQuestionData.question} /></div>
        )}
      </div>
      
      <GeometryVisualizer type={currentQuestionData.geometryType} dataStr={currentQuestionData.geometryData} />
    </div>
  );
}