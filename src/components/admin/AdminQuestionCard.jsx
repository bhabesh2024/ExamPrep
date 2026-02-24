import React from 'react';
import { Sparkles, Trash2, CheckCircle2, BookOpen } from 'lucide-react';

export default function AdminQuestionCard({
  q, qIndex, isSelected, toggleSelect, editingIndex, setEditingIndex,
  editPromptText, setEditPromptText, isEditingLoading, modifyQuestionWithAI,
  handleDeleteQuestion, handleQuestionChange, handleOptionChange, setCorrectAnswer, difficulty
}) {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <article className="bg-[#181b21] rounded-2xl border border-[#2a2f3a] p-6 relative group transition-all hover:border-[#0d59f2]/30 mb-6">
      <div className="absolute top-6 right-6 flex gap-2">
        <button onClick={() => setEditingIndex(editingIndex === qIndex ? null : qIndex)} className="h-8 px-3 rounded-full bg-[#111318] border border-[#2a2f3a] flex items-center justify-center text-[#0d59f2] hover:text-white hover:bg-[#0d59f2] hover:border-[#0d59f2] transition-all gap-1.5 text-xs font-medium cursor-pointer" title="Edit with AI">
          <Sparkles className="w-3.5 h-3.5" /> Edit with AI
        </button>
        <button onClick={() => handleDeleteQuestion(qIndex)} className="w-8 h-8 rounded-full bg-[#111318] border border-[#2a2f3a] flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-400 transition-colors cursor-pointer" title="Delete Question">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div className="pt-1">
          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(qIndex)} className="w-5 h-5 rounded border-slate-600 bg-[#111318] text-[#0d59f2] focus:ring-0 focus:ring-offset-0 custom-checkbox cursor-pointer" />
        </div>
        <div className="flex-1 space-y-4">
          {editingIndex === qIndex && (
             <div className="bg-[#0d59f2]/10 border border-[#0d59f2]/30 rounded-xl p-4 flex gap-3 animate-fade-in-up">
               <input type="text" value={editPromptText} onChange={(e) => setEditPromptText(e.target.value)} placeholder="e.g. 'Make it harder' or 'Fix Hindi translation'" className="flex-1 bg-[#111318] border border-[#2a2f3a] rounded-lg px-4 py-2 text-sm text-white focus:border-[#0d59f2] outline-none" disabled={isEditingLoading} />
               <button onClick={() => modifyQuestionWithAI(qIndex)} disabled={isEditingLoading || !editPromptText.trim()} className="bg-[#0d59f2] hover:bg-blue-600 text-white px-6 rounded-lg text-sm font-bold cursor-pointer disabled:opacity-50 transition-colors">
                 {isEditingLoading ? 'Wait...' : 'Apply'}
               </button>
             </div>
          )}

          {/* 🚀 NEW: PASSAGE FIELD 🚀 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4 border-b border-[#2a2f3a]/50">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Passage (English)</label>
              <textarea value={q.passage || ''} onChange={e => handleQuestionChange(qIndex, 'passage', e.target.value)} placeholder="Leave blank if this is a normal MCQ" className="w-full bg-[#111318] border border-blue-900/30 rounded-xl p-3 text-sm text-slate-300 resize-none h-16 focus:ring-1 focus:ring-blue-500 outline-none custom-scrollbar" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Passage (Hindi)</label>
              <textarea value={q.passageHindi || ''} onChange={e => handleQuestionChange(qIndex, 'passageHindi', e.target.value)} placeholder="पैसेज यहाँ लिखें (वैकल्पिक)" className="w-full bg-[#111318] border border-blue-900/30 rounded-xl p-3 text-sm text-slate-300 resize-none h-16 focus:ring-1 focus:ring-blue-500 outline-none custom-scrollbar font-display" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Question (English)</label>
              <textarea value={q.question} onChange={e => handleQuestionChange(qIndex, 'question', e.target.value)} className="w-full bg-[#111318] border border-[#2a2f3a] rounded-xl p-3 text-sm text-white resize-none h-24 focus:ring-1 focus:ring-[#0d59f2] outline-none custom-scrollbar" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Question (Hindi)</label>
              <textarea value={q.questionHindi} onChange={e => handleQuestionChange(qIndex, 'questionHindi', e.target.value)} placeholder="Click 'Auto-Translate' to fill this automatically" className="w-full bg-[#111318] border border-[#2a2f3a] rounded-xl p-3 text-sm text-white resize-none h-24 focus:ring-1 focus:ring-[#0d59f2] outline-none custom-scrollbar font-display" />
            </div>
          </div>
        </div>
      </div>

      <div className="pl-9 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {q.options.map((opt, optIndex) => {
          const isCorrect = opt === q.answer && opt.trim() !== "";
          return (
            <div key={optIndex} className={`flex items-center gap-3 p-2 rounded-lg transition-colors border ${isCorrect ? 'border-transparent bg-[#111318]/50' : 'border-transparent hover:border-[#2a2f3a] hover:bg-[#111318]/50'}`}>
              <input type="radio" name={`q${qIndex}_ans`} checked={isCorrect} onChange={() => setCorrectAnswer(qIndex, opt)} className="w-4 h-4 border-slate-600 bg-[#111318] text-[#0d59f2] focus:ring-offset-0 focus:ring-0 cursor-pointer" />
              <span className="text-xs font-bold text-slate-500 w-4">{letters[optIndex]}</span>
              <input type="text" value={opt} onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)} placeholder={`Option ${letters[optIndex]}`} className={`bg-transparent border-none text-sm w-full focus:ring-0 p-0 placeholder-slate-600 outline-none ${isCorrect ? 'text-white' : 'text-slate-300'}`} />
              {isCorrect && <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" title="Correct Answer" />}
            </div>
          );
        })}
      </div>

      <div className="pl-9 grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 pt-4 border-t border-[#2a2f3a]">
        <div className="space-y-1">
          <label className="text-xs font-medium text-emerald-500 uppercase tracking-wider flex items-center gap-1">Explanation (English)</label>
          <textarea value={q.explanation} onChange={e => handleQuestionChange(qIndex, 'explanation', e.target.value)} className="w-full bg-[#111318] border border-emerald-500/20 rounded-xl p-3 text-xs text-slate-300 resize-none h-16 focus:border-emerald-500 outline-none custom-scrollbar" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-emerald-500 uppercase tracking-wider flex items-center gap-1">Explanation (Hindi)</label>
          <textarea value={q.explanationHindi} onChange={e => handleQuestionChange(qIndex, 'explanationHindi', e.target.value)} placeholder="Click 'Auto-Translate' to fill this automatically" className="w-full bg-[#111318] border border-emerald-500/20 rounded-xl p-3 text-xs text-slate-300 resize-none h-16 focus:border-emerald-500 outline-none custom-scrollbar font-display" />
        </div>
      </div>

      <div className="pl-9 mt-4 flex flex-wrap items-center gap-2 border-t border-[#2a2f3a] pt-4">
        <div className="px-2 py-1 rounded bg-slate-800 border border-slate-700 flex items-center gap-1">
          <span className="text-[10px] text-slate-400">Tag:</span>
          <input type="text" value={q.examReference || ''} onChange={e => handleQuestionChange(qIndex, 'examReference', e.target.value)} className="bg-transparent border-none p-0 text-yellow-400 focus:ring-0 outline-none w-24 text-[10px] font-bold" />
        </div>
        <div className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">Diff: {difficulty}</div>
        <div className="px-2 py-1 rounded bg-indigo-900/30 border border-indigo-500/30 flex items-center gap-2 w-full mt-2 lg:w-auto lg:mt-0">
          <span className="text-[10px] text-indigo-300 font-medium">Geometry/Chart:</span>
          <input type="text" value={q.geometryType || ''} onChange={e => handleQuestionChange(qIndex, 'geometryType', e.target.value)} placeholder="Type" className="bg-transparent border-none p-0 text-indigo-200 focus:ring-0 outline-none w-32 text-[10px]" />
          <input type="text" value={q.geometryData ? (typeof q.geometryData === 'string' ? q.geometryData : JSON.stringify(q.geometryData)) : ''} onChange={e => handleQuestionChange(qIndex, 'geometryData', e.target.value)} placeholder="Data (JSON)" className="bg-transparent border-none p-0 text-indigo-200 focus:ring-0 outline-none w-48 text-[10px] border-l border-indigo-500/30 pl-2 ml-1" />
        </div>
      </div>
    </article>
  );
}