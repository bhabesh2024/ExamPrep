import React, { useState } from 'react';
import { Bookmark, CheckCircle2, Sparkles, Share2, Check } from 'lucide-react';
import MathText from '../common/MathText';
import GeometryVisualizer from '../common/GeometryVisualizer';

export default function QuizQuestionArea({ currentQ, currentQuestionData, handleMarkReview, review, handleSelect, answers, testId }) {
  const letters = ['A', 'B', 'C', 'D'];
  const [copied, setCopied] = useState(false);

  // Google AI Mode redirect
  const handleGoogleSearch = () => {
    const question = currentQuestionData?.question || '';
    const options = currentQuestionData?.options
      ? currentQuestionData.options.map((opt, i) => `${letters[i]}) ${opt}`).join('\n')
      : '';
    const query = `Explain this MCQ with correct answer and reasoning:\n\nQuestion: ${question}\n\nOptions:\n${options}`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&udm=50`, '_blank');
  };

  // Share button
  const handleShare = async () => {
    const question = currentQuestionData?.question || '';
    const options = currentQuestionData?.options
      ? currentQuestionData.options.map((opt, i) => `${letters[i]}) ${opt}`).join('\n')
      : '';

    const shareUrl = testId
      ? `${window.location.origin}/practice/start/full/${testId}?q=${currentQ + 1}`
      : window.location.href;

    const shareText = `📚 PrepIQ Mock Test Question\n\n${question}\n\n${options}\n\nPractice more at PrepIQ 👇`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'PrepIQ Question', text: shareText, url: shareUrl });
        return;
      } catch (e) { /* user cancelled */ }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = `${shareText}\n${shareUrl}`;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-8">
      {/* Question Card */}
      <div className="bg-[#1a1d24] rounded-xl p-4 sm:p-6 border border-[#282e39] shadow-lg">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <span className="text-[#0d59f2] font-semibold text-sm tracking-wider uppercase">
            Question {currentQ + 1}
          </span>

          <div className="flex items-center gap-2">
            {/* Ask Google AI */}
            <button
              onClick={handleGoogleSearch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask Google AI</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              title="Share this question"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 cursor-pointer hover:scale-105 ${copied ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-[#282e39] border-slate-600 text-slate-300 hover:bg-[#3b4354] hover:text-white'}`}
            >
              {copied
                ? <><Check className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Copied!</span></>
                : <><Share2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Share</span></>
              }
            </button>

            {/* Bookmark */}
            <button
              onClick={handleMarkReview}
              className="p-1.5 hover:bg-[#282e39] rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <Bookmark className={`w-5 h-5 ${review[currentQ] ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </button>
          </div>
        </div>

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

      {/* Options */}
      <div className="grid gap-3 md:gap-4">
        {currentQuestionData?.options?.map((opt, idx) => {
          const selected = answers[currentQ] === idx;
          return (
            <button key={idx} onClick={() => handleSelect(idx)}
              className={`relative flex items-center p-3.5 md:p-4 rounded-xl border-2 transition-all duration-300 text-left group overflow-hidden cursor-pointer
                ${selected
                  ? 'border-[#0d59f2] bg-[#0d59f2]/10 shadow-[0_0_15px_-3px_rgba(13,89,242,0.3),inset_0_0_10px_rgba(13,89,242,0.15)] scale-[1.01] z-10'
                  : 'border-[#282e39] bg-[#1a1d24] hover:border-[#3b4354] hover:bg-[#1f2229]'}`}
            >
              {selected && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#0d59f2] fill-current drop-shadow-[0_0_5px_rgba(13,89,242,0.5)]" />}
              <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm shrink-0 transition-colors duration-300 ${selected ? 'bg-[#0d59f2] text-white shadow-[0_0_8px_#0d59f2]' : 'bg-[#282e39] text-gray-400 group-hover:bg-[#3b4354]'}`}>
                {letters[idx]}
              </div>
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