import React, { useState } from 'react';
import { Bookmark, CheckCircle2, Sparkles, Share2, Check, Landmark, BookOpen, Flag } from 'lucide-react';
import MathText from '../common/MathText';
import GeometryVisualizer from '../common/GeometryVisualizer';
import axios from 'axios';

export default function QuizQuestionArea({ currentQ, currentQuestionData, handleMarkReview, review, handleSelect, answers, testId }) {
  const letters = ['A', 'B', 'C', 'D'];
  const [copied, setCopied] = useState(false);
  const [showFlagMenu, setShowFlagMenu] = useState(false);

  const handleGoogleSearch = () => {
    const question = currentQuestionData?.question || '';
    const options = currentQuestionData?.options ? currentQuestionData.options.map((opt, i) => `${letters[i]}) ${opt}`).join('\n') : '';
    const query = `Explain this MCQ with correct answer and reasoning:\n\nQuestion: ${question}\n\nOptions:\n${options}`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&udm=50`, '_blank');
  };

  const handleShare = async () => {
    const question = currentQuestionData?.question || '';
    const options = currentQuestionData?.options ? currentQuestionData.options.map((opt, i) => `${letters[i]}) ${opt}`).join('\n') : '';
    const shareUrl = testId ? `${window.location.origin}/practice/start/full/${testId}?q=${currentQ + 1}` : window.location.href;
    const shareText = `📚 PrepIQ Mock Test Question\n\n${question}\n\n${options}\n\nPractice more at PrepIQ 👇`;

    if (navigator.share) {
      try { await navigator.share({ title: 'PrepIQ Question', text: shareText, url: shareUrl }); return; } catch (e) { }
    }
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    } catch (e) {
      const ta = document.createElement('textarea'); ta.value = `${shareText}\n${shareUrl}`;
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const submitFlag = async (reason) => {
    if(!currentQuestionData?.id) {
      alert("Draft question. Cannot be flagged yet."); 
      return;
    }
    try {
      await axios.post('/api/admin/flag', { questionId: currentQuestionData.id, reason });
      alert("Issue reported to Admin!");
      setShowFlagMenu(false);
    } catch(e) { 
      alert("Error reporting issue."); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-8">
      <div className="bg-[#1a1d24] rounded-xl p-4 sm:p-6 border border-[#282e39] shadow-lg">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#0d59f2] font-semibold text-sm tracking-wider uppercase">
              Question {currentQ + 1}
            </span>
            {currentQuestionData?.examReference && currentQuestionData.examReference !== "Expected" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider ml-1">
                <Landmark className="w-3 h-3" /> {currentQuestionData.examReference}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 relative">
            <button onClick={handleGoogleSearch} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask Google AI</span>
              <span className="sm:hidden">AI</span>
            </button>
            <button onClick={handleShare} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 cursor-pointer hover:scale-105 ${copied ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-[#282e39] border-slate-600 text-slate-300 hover:bg-[#3b4354] hover:text-white'}`}>
              {copied ? <><Check className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Copied!</span></> : <><Share2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Share</span></>}
            </button>
            <button onClick={handleMarkReview} className="p-1.5 hover:bg-[#282e39] rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer">
              <Bookmark className={`w-5 h-5 ${review[currentQ] ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </button>

            {/* 🔥 FLAG DROPDOWN */}
            <div className="relative">
              <button onClick={() => setShowFlagMenu(!showFlagMenu)} className="p-1.5 hover:bg-[#282e39] rounded-full text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                <Flag className="w-5 h-5" />
              </button>
              {showFlagMenu && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-[#1a1d24] border border-[#282e39] rounded-xl p-2 shadow-2xl z-50">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest px-2 pb-2 border-b border-[#282e39] mb-1">Select Issue</p>
                  <button onClick={() => submitFlag("Wrong Answer")} className="block w-full text-left px-3 py-2 hover:bg-[#282e39] rounded-lg text-sm text-slate-200 cursor-pointer transition-colors">❌ Wrong Answer</button>
                  <button onClick={() => submitFlag("Translation Error")} className="block w-full text-left px-3 py-2 hover:bg-[#282e39] rounded-lg text-sm text-slate-200 cursor-pointer transition-colors">🌐 Translation Error</button>
                  <button onClick={() => submitFlag("Typo / Formatting")} className="block w-full text-left px-3 py-2 hover:bg-[#282e39] rounded-lg text-sm text-slate-200 cursor-pointer transition-colors">✍️ Typo / Formatting</button>
                </div>
              )}
            </div>
            
          </div>
        </div>

        {currentQuestionData?.passage && (
          <div className="mb-6 rounded-xl bg-[#111318]/80 border border-[#2a2f3a] overflow-hidden flex flex-col shadow-inner">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1d24] border-b border-[#2a2f3a] text-[#0d59f2] text-[11px] font-black uppercase tracking-widest shrink-0">
              <BookOpen className="w-4 h-4" /> Direction / Passage
            </div>
            <div className="p-4 md:p-5 max-h-56 overflow-y-auto custom-scrollbar">
              <div className="text-sm md:text-base text-slate-300 leading-relaxed font-medium">
                <MathText text={currentQuestionData.passage} />
              </div>
            </div>
          </div>
        )}

        <div className="text-lg md:text-xl font-medium leading-relaxed text-slate-200">
          <MathText text={currentQuestionData?.question || ''} />
        </div>
        {currentQuestionData?.questionHindi && (
          <div className="text-md md:text-lg font-medium leading-relaxed text-slate-400 mt-2 font-display">
            <MathText text={currentQuestionData.questionHindi} />
          </div>
        )}
        <GeometryVisualizer type={currentQuestionData?.geometryType} dataStr={currentQuestionData?.geometryData} />
      </div>

      <div className="grid gap-3 md:gap-4">
        {currentQuestionData?.options?.map((opt, idx) => {
          const selected = answers[currentQ] === idx;
          return (
            <button key={idx} onClick={() => handleSelect(idx)} className={`relative flex items-center p-3.5 md:p-4 rounded-xl border-2 transition-all duration-300 text-left group overflow-hidden cursor-pointer ${selected ? 'border-[#0d59f2] bg-[#0d59f2]/10 shadow-[0_0_15px_-3px_rgba(13,89,242,0.3),inset_0_0_10px_rgba(13,89,242,0.15)] scale-[1.01] z-10' : 'border-[#282e39] bg-[#1a1d24] hover:border-[#3b4354] hover:bg-[#1f2229]'}`}>
              {selected && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#0d59f2] fill-current drop-shadow-[0_0_5px_rgba(13,89,242,0.5)]" />}
              <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm shrink-0 transition-colors duration-300 ${selected ? 'bg-[#0d59f2] text-white shadow-[0_0_8px_#0d59f2]' : 'bg-[#282e39] text-gray-400 group-hover:bg-[#3b4354]'}`}>{letters[idx]}</div>
              <div className={`ml-4 md:ml-5 text-base md:text-lg font-medium transition-colors duration-300 pr-8 ${selected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                <MathText text={opt} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}