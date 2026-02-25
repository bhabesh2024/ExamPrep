// src/components/admin/AdminQuestionCard.jsx
import React from 'react';
import { Trash2, Sparkles, Languages } from 'lucide-react';

export default function AdminQuestionCard({
  q, index, updateQuestion, questions, setQuestions,
  selectedForDelete = [], setSelectedForDelete, modifyQuestionWithAI, isLoading
}) {
  // 🛡️ SAFETY CHECK: Agar question data hi nahi hai, toh card render mat karo (Crash se bachayega)
  if (!q) return null; 

  const isSelected = selectedForDelete.includes(index);
  
  const handleSelect = (e) => {
    if (e.target.checked) setSelectedForDelete([...selectedForDelete, index]);
    else setSelectedForDelete(selectedForDelete.filter(i => i !== index));
  };

  const removeSingle = () => setQuestions(questions.filter((_, i) => i !== index));

  // 🛡️ SAFETY CHECK: Ensure options array hamesha 4 items ka ho, warna map() crash kar dega
  const safeOptions = Array.isArray(q.options) && q.options.length === 4 
    ? q.options 
    : [q.options?.[0] || '', q.options?.[1] || '', q.options?.[2] || '', q.options?.[3] || ''];

  return (
    <div className={`bg-[#181b21] border ${isSelected ? 'border-[#258cf4]' : 'border-[#2a3241]'} rounded-2xl overflow-hidden mb-6 shadow-xl transition-colors relative group`}>
      
      {/* ── Card Header ── */}
      <div className="px-5 py-3 bg-white/5 border-b border-[#2a3241] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={isSelected} onChange={handleSelect} className="w-4 h-4 rounded border-[#2a3241] bg-[#0f1115] text-[#258cf4] focus:ring-[#258cf4]" />
          <span className="text-[#258cf4] font-bold font-mono text-sm">Q{index + 1}</span>
          <span className="px-2 py-0.5 rounded-full bg-[#0f1115] border border-[#2a3241] text-xs text-slate-400">
            {q.subject || 'Subject'} • {q.subtopic || 'Topic'}
          </span>
        </div>
        
        {/* Card Actions */}
        <div className="flex gap-2">
          <button onClick={() => modifyQuestionWithAI && modifyQuestionWithAI(index)} disabled={isLoading} className="p-1.5 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors tooltip-trigger" title="Enhance via AI">
            <Sparkles className="w-4 h-4" />
          </button>
          <button onClick={removeSingle} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors tooltip-trigger" title="Delete Question">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left Side: English ── */}
        <div className="space-y-4">
          <textarea 
            value={q.question || ''} 
            onChange={e => updateQuestion(index, 'question', e.target.value)} 
            placeholder="English Question Text..." 
            className="w-full bg-black/20 border border-[#2a3241] text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-[#258cf4] min-h-[80px]" 
          />
          
          <div className="space-y-2">
            {/* 🛡️ Safe Options Map */}
            {safeOptions.map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center gap-3 bg-black/10 border border-[#2a3241] rounded-lg p-2 focus-within:border-slate-500">
                <input 
                  type="radio" 
                  name={`ans-${index}`} 
                  checked={q.answer === opt && opt !== ''} 
                  onChange={() => updateQuestion(index, 'answer', opt)} 
                  className="w-4 h-4 text-[#258cf4] bg-[#0f1115] border-[#2a3241]" 
                />
                <input 
                  type="text" 
                  value={opt || ''} 
                  onChange={e => {
                    const newOpts = [...safeOptions];
                    newOpts[oIdx] = e.target.value;
                    updateQuestion(index, 'options', newOpts);
                    if (q.answer === opt) updateQuestion(index, 'answer', e.target.value);
                  }} 
                  placeholder={`Option ${oIdx + 1}`} 
                  className="flex-1 bg-transparent border-none text-sm text-slate-300 focus:outline-none focus:ring-0 p-0" 
                />
              </div>
            ))}
          </div>
          
          <textarea 
            value={q.explanation || ''} 
            onChange={e => updateQuestion(index, 'explanation', e.target.value)} 
            placeholder="English Explanation..." 
            className="w-full bg-black/20 border border-[#2a3241] text-slate-400 text-sm rounded-xl p-3 focus:outline-none focus:border-[#258cf4] min-h-[60px]" 
          />
        </div>

        {/* ── Right Side: Hindi ── */}
        <div className="space-y-4">
          <textarea 
            value={q.questionHindi || ''} 
            onChange={e => updateQuestion(index, 'questionHindi', e.target.value)} 
            placeholder="Hindi Question Text..." 
            className="w-full bg-black/20 border border-[#2a3241] text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-[#258cf4] min-h-[80px]" 
          />
          
          <div className="h-[212px] bg-[#0f1115]/50 border border-dashed border-[#2a3241] rounded-xl flex flex-col items-center justify-center text-slate-500 p-4 text-center">
            <Languages className="w-6 h-6 mb-2 opacity-50" />
            <p className="text-xs">Translations map automatically.<br/>Use "Translate All" from the action bar.</p>
          </div>

          <textarea 
            value={q.explanationHindi || ''} 
            onChange={e => updateQuestion(index, 'explanationHindi', e.target.value)} 
            placeholder="Hindi Explanation..." 
            className="w-full bg-black/20 border border-[#2a3241] text-slate-400 text-sm rounded-xl p-3 focus:outline-none focus:border-[#258cf4] min-h-[60px]" 
          />
        </div>
      </div>
    </div>
  );
}