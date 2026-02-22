import React from 'react';
import { Bot, Send, X, GraduationCap } from 'lucide-react';
import MathText from '../common/MathText';

export default function AiChatWindow({ isAiChatOpen, setIsAiChatOpen, chatHistory, messagesEndRef, handleChatSubmit, chatInput, setChatInput, currentQuestionData, currentQ }) {
  if (!isAiChatOpen) return null;

  return (
    <div className="absolute bottom-[80px] right-4 lg:right-6 w-[90%] md:w-96 max-w-sm bg-[#161920]/95 backdrop-blur-xl border border-[#282e39] rounded-2xl shadow-2xl flex flex-col z-40 h-[480px] overflow-hidden">
       <div className="p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"><Bot className="w-5 h-5 text-white" /></div>
          <div>
            <h3 className="font-bold text-white text-sm">PrepIQ AI Tutor</h3>
            <span className="text-[10px] text-purple-300 font-medium tracking-wide">Q.{currentQ + 1} Assistance</span>
          </div>
        </div>
        <button onClick={() => setIsAiChatOpen(false)} className="text-gray-400 hover:text-white p-1.5 cursor-pointer"><X className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`chat-bubble flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
             <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-slate-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'}`}>
                {msg.role === 'user' ? <GraduationCap className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
              </div>
            <div className={`rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-[#0d59f2]/20 border border-[#0d59f2]/30 text-blue-100 rounded-tr-none' : 'bg-[#282e39] border border-white/5 text-slate-200 rounded-tl-none'}`}><MathText text={msg.text} /></div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-[#282e39] bg-[#161920] shrink-0">
        <form onSubmit={handleChatSubmit} className="relative">
          <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="w-full bg-[#0f1115] text-slate-200 text-sm rounded-full py-2.5 pl-4 pr-12 border border-[#282e39] outline-none" placeholder="Ask anything..." />
          <button type="submit" disabled={!chatInput.trim()} className="absolute right-1.5 top-1.5 p-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white cursor-pointer"><Send className="w-4 h-4" /></button>
        </form>
      </div>
    </div>
  );
}