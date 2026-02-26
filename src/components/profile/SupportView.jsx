import React from 'react';
import { ArrowLeft, Send } from 'lucide-react';

export default function SupportView({ setActiveView, supportSubject, setSupportSubject, supportMessage, setSupportMessage, handleSupportSubmit, isSubmitting, tickets }) {
  return (
    <div className="w-full flex flex-col gap-6 animate-slide-in">
      <div className="flex items-center gap-3 px-2 pt-2 mb-2">
        <button onClick={() => setActiveView('hub')} className="p-2 -ml-2 rounded-full hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-600 dark:text-slate-300 transition-colors tap-effect">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Help & Support</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[1.5rem] p-6 sm:p-8 shadow-sm">
          <h4 className="text-lg font-black text-zinc-900 dark:text-white mb-2">Create Ticket</h4>
          <p className="text-zinc-500 dark:text-slate-400 text-xs font-medium mb-6">Describe your issue and we'll resolve it ASAP.</p>
          <form onSubmit={handleSupportSubmit} className="flex flex-col gap-4">
            <input type="text" required value={supportSubject} onChange={(e) => setSupportSubject(e.target.value)} placeholder="Subject (e.g. Account Issue)" className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500" />
            <textarea required rows="4" value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} placeholder="Your message..." className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500 resize-none"></textarea>
            <div className="flex justify-end mt-2">
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md tap-effect">
                <Send className="w-4 h-4" /> {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[1.5rem] p-6 sm:p-8 shadow-sm flex flex-col h-[400px]">
          <h4 className="text-lg font-black text-zinc-900 dark:text-white mb-6">Past Queries</h4>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
            {tickets.length === 0 ? (
              <p className="text-zinc-500 dark:text-slate-500 text-sm text-center mt-10">No queries submitted yet.</p>
            ) : (
              tickets.map(ticket => (
                <div key={ticket.id} className="bg-zinc-50 dark:bg-[#18181b] rounded-xl p-4 border border-zinc-200 dark:border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-zinc-900 dark:text-white text-sm">{ticket.subject}</h5>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${ticket.status === 'RESOLVED' ? 'text-emerald-600 border-emerald-200' : 'text-orange-600 border-orange-200'}`}>{ticket.status}</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-600 dark:text-slate-400 mb-2">{ticket.message}</p>
                  {ticket.adminReply && (
                    <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg p-3 mt-3">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">Admin Reply</span>
                      <p className="text-xs font-medium text-zinc-800 dark:text-slate-200">{ticket.adminReply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}