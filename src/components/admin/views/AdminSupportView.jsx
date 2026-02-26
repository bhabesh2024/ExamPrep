// src/components/admin/views/AdminSupportView.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Check, Trash2, Send, Loader2, Filter } from 'lucide-react'; 

export default function AdminSupportView() {
  const [tickets, setTickets] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [activeTicket, setActiveTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 NEW: Filter & Bulk Selection States
  const [filterStatus, setFilterStatus] = useState('ALL'); 
  const [selectedTickets, setSelectedTickets] = useState([]);

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/support');
      if (Array.isArray(res.data)) {
        setTickets(res.data);
      } else {
        setTickets([]);
      }
    } catch (err) { 
      console.error(err); 
      setTickets([]); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async (id) => {
    if (!replyText) return;
    try {
      await axios.patch(`/api/support/${id}`, { adminReply: replyText, status: 'RESOLVED' });
      setReplyText('');
      setActiveTicket(null);
      fetchTickets();
    } catch (err) { alert('Reply fail ho gaya'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ticket?')) return;
    try {
      await axios.delete(`/api/support/${id}`);
      // Remove from selected list if deleted individually
      setSelectedTickets(prev => prev.filter(ticketId => ticketId !== id));
      fetchTickets();
    } catch (err) { alert('Delete fail ho gaya'); }
  };

  // 🔥 NEW: Bulk Delete Function
  const handleBulkDelete = async () => {
    if (selectedTickets.length === 0) return;
    if (!window.confirm(`Kya aap sachme ${selectedTickets.length} selected tickets ko delete karna chahte hain?`)) return;
    
    try {
      await axios.post('/api/support/bulk-delete', { ticketIds: selectedTickets });
      setSelectedTickets([]);
      fetchTickets();
    } catch (err) { 
      alert('Bulk delete fail ho gaya'); 
    }
  };

  // Derived filtered tickets
  const filteredTickets = Array.isArray(tickets) 
    ? tickets.filter(t => filterStatus === 'ALL' || t.status === filterStatus) 
    : [];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTickets(filteredTickets.map(t => t.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectTicket = (id) => {
    setSelectedTickets(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 md:p-8 overflow-y-auto h-full text-slate-200 custom-scrollbar">
      <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
        <MessageSquare className="text-blue-500 w-8 h-8" />
        Help & Support Queries
      </h2>

      {/* 🔥 NEW: Controls Bar (Filter & Bulk Action) */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6 bg-[#181b21] p-4 rounded-xl border border-[#2a3241]">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-slate-300">
            <Filter className="w-4 h-4 text-blue-400" />
            <select 
              value={filterStatus} 
              onChange={(e) => { setFilterStatus(e.target.value); setSelectedTickets([]); }}
              className="bg-[#0f1115] border border-[#2a3241] rounded-lg px-3 py-1.5 focus:outline-none text-sm text-white"
            >
              <option value="ALL">All Queries</option>
              <option value="OPEN">Unresolved (OPEN)</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
          
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300 cursor-pointer">
            <input 
              type="checkbox" 
              checked={filteredTickets.length > 0 && selectedTickets.length === filteredTickets.length}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded bg-[#0f1115] border-[#2a3241] accent-blue-500"
            />
            Select All Filtered
          </label>
        </div>

        {selectedTickets.length > 0 && (
          <button 
            onClick={handleBulkDelete}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected ({selectedTickets.length})
          </button>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-[#258cf4] mb-4" />
            <p>Loading queries...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          filteredTickets.map(ticket => (
            <div key={ticket.id} className="bg-[#181b21] p-5 rounded-xl border border-[#2a3241] relative">
              {/* 🔥 NEW: Individual Checkbox */}
              <div className="absolute top-5 left-4">
                <input 
                  type="checkbox" 
                  checked={selectedTickets.includes(ticket.id)}
                  onChange={() => handleSelectTicket(ticket.id)}
                  className="w-4 h-4 rounded bg-[#0f1115] border-[#2a3241] accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-start mb-4 pl-8">
                <div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${ticket.status === 'OPEN' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {ticket.status || 'UNKNOWN'}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{ticket.subject}</h3>
                  <p className="text-sm text-slate-400">
                    By: {ticket?.user?.name || 'Unknown User'} ({ticket?.user?.email || 'No Email'})
                  </p>
                </div>
                <button onClick={() => handleDelete(ticket.id)} className="text-red-400 hover:text-red-300 bg-red-400/10 p-2 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="pl-8">
                <p className="text-slate-300 bg-[#0f1115] p-4 rounded-lg border border-[#2a3241]">{ticket.message}</p>

                {ticket.adminReply ? (
                  <div className="mt-4 bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <p className="text-xs text-blue-400 font-bold mb-1">Your Reply:</p>
                    <p className="text-slate-200">{ticket.adminReply}</p>
                  </div>
                ) : (
                  <div className="mt-4">
                    {activeTicket === ticket.id ? (
                      <div className="flex gap-2">
                        <input 
                          type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 bg-[#0f1115] border border-[#2a3241] rounded-lg px-4 py-2 focus:outline-none text-white"
                          placeholder="Type your reply here..."
                        />
                        <button onClick={() => handleReply(ticket.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                          <Send className="w-4 h-4" /> Send
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setActiveTicket(ticket.id)} className="text-blue-400 text-sm hover:underline font-medium">
                        Reply to User
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-[#2a3241] rounded-xl bg-[#181b21]">
            <Check className="w-12 h-12 text-emerald-500/50 mb-4" />
            <p>No support queries found for this filter. All good!</p>
          </div>
        )}
      </div>
    </div>
  );
}