// src/components/admin/AdminQuestionCard.jsx
import React from 'react';
import { Trash2, Sparkles, Languages, Download } from 'lucide-react'; // 🔥 Download icon add kiya

export default function AdminQuestionCard({
  q, index, updateQuestion, questions, setQuestions,
  selectedForDelete = [], setSelectedForDelete, modifyQuestionWithAI, isLoading
}) {
  if (!q) return null; 

  const isSelected = selectedForDelete.includes(index);
  
  const handleSelect = (e) => {
    if (e.target.checked) setSelectedForDelete([...selectedForDelete, index]);
    else setSelectedForDelete(selectedForDelete.filter(i => i !== index));
  };

  const removeSingle = () => setQuestions(questions.filter((_, i) => i !== index));

  // 🔥 Individual Question Download Function
  const downloadSingleJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(q, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `question_${index + 1}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Safe Options Parsing
  let safeOptions = ['', '', '', ''];
  if (Array.isArray(q.options) && q.options.length >= 4) {
    safeOptions = q.options.slice(0, 4);
  } else if (typeof q.options === 'string') {
    try { 
      const parsed = JSON.parse(q.options); 
      if (Array.isArray(parsed)) safeOptions = [parsed[0]||'', parsed[1]||'', parsed[2]||'', parsed[3]||''];
    } catch(e) {}
  }

  return (
    <div className={`bg-[#181b21] border ${isSelected ? 'border-[#258cf4]' : 'border-[#2a3241]'} rounded-2xl overflow-hidden mb-6 shadow-xl transition-colors relative group`}>
      
      {/* ── Card Header ── */}
      <div className="px-5 py-3 bg-white/5 border-b border-[#2a3241] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={isSelected} onChange={handleSelect} className="w-4 h-4 rounded border-[#2a3241] bg-[#0f1115] text-[#258cf4] focus:ring-[#258cf4] cursor-pointer" />
          <span className="text-[#258cf4] font-bold font-mono text-sm">Q{index + 1}</span>
          <span className="px-2 py-0.5 rounded-full bg-[#0f1115] border border-[#2a3241] text-xs text-slate-400">
            {q.subject || 'Subject'} • {q.subtopic || 'Topic'}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button onClick={downloadSingleJSON} className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer" title="Download this Question as JSON">
            <Download className="w-4 h-4" />
          </button>
          {modifyQuestionWithAI && (
            <button onClick={() => modifyQuestionWithAI(index)} disabled={isLoading} className="p-1.5 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors cursor-pointer" title="Enhance via AI">
              <Sparkles className="w-4 h-4" />
            </button>
          )}
          <button onClick={removeSingle} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer" title="Delete Question">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Card Body (Editable Fields) ── */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">English Question (Manual Edit)</label>
            <textarea 
              value={q.question || ''} 
              onChange={e => updateQuestion && updateQuestion(index, 'question', e.target.value)} 
              className="w-full bg-[#0f1115] border border-[#2a3241] text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-[#258cf4] min-h-[80px]" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Options</label>
            {safeOptions.map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center gap-3 bg-[#0f1115] border border-[#2a3241] rounded-xl p-2.5">
                <input 
                  type="radio" 
                  name={`ans-${index}`} 
                  checked={String(q.answer).trim() === String(opt).trim() && opt !== ''} 
                  onChange={() => updateQuestion && updateQuestion(index, 'answer', opt)} 
                  className="w-4 h-4 text-[#258cf4] cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={opt || ''} 
                  onChange={e => {
                    if (!updateQuestion) return;
                    const newOpts = [...safeOptions];
                    newOpts[oIdx] = e.target.value;
                    updateQuestion(index, 'options', newOpts);
                    // Agar ye purana answer match kar raha tha, toh answer bhi update karo
                    if (String(q.answer).trim() === String(opt).trim()) {
                      updateQuestion(index, 'answer', e.target.value);
                    }
                  }} 
                  className="flex-1 bg-transparent border-none text-sm text-slate-200 focus:outline-none p-0" 
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">English Explanation</label>
            <textarea 
              value={q.explanation || ''} 
              onChange={e => updateQuestion && updateQuestion(index, 'explanation', e.target.value)} 
              className="w-full bg-[#0f1115] border border-[#2a3241] text-slate-400 text-sm rounded-xl p-3 min-h-[60px]" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Hindi Question</label>
            <textarea 
              value={q.questionHindi || ''} 
              onChange={e => updateQuestion && updateQuestion(index, 'questionHindi', e.target.value)} 
              className="w-full bg-[#0f1115] border border-[#2a3241] text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-[#258cf4] min-h-[80px]" 
            />
          </div>

          <div className="h-[238px] bg-[#0f1115]/50 border border-dashed border-[#2a3241] rounded-xl flex flex-col items-center justify-center text-slate-500 p-4 text-center">
            <Languages className="w-6 h-6 mb-2 opacity-50" />
            <p className="text-xs">Hindi options translation is handled automatically.<br/>Use "Translate All" from the action bar.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Hindi Explanation</label>
            <textarea 
              value={q.explanationHindi || ''} 
              onChange={e => updateQuestion && updateQuestion(index, 'explanationHindi', e.target.value)} 
              className="w-full bg-[#0f1115] border border-[#2a3241] text-slate-400 text-sm rounded-xl p-3 min-h-[60px]" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}