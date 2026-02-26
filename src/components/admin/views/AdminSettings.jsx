// src/components/admin/views/AdminSettings.jsx
import React, { useState } from 'react';
import { BookOpen, BellRing, Plus, Send, Loader2 } from 'lucide-react';
import axios from 'axios'; // 🔥 Axios import kiya

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('syllabus');
  const [showAddModal, setShowAddModal] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [isSending, setIsSending] = useState(false); // 🔥 Sending state

  // 🔥 MAIN FIX: Dummy alert ki jagah Real API call lagayi
  const handleSendNotification = async () => {
    if (!notificationMsg) return;
    setIsSending(true);
    try {
      await axios.post('/api/admin/broadcast', { message: notificationMsg });
      alert("✅ Notification Sent to all users!"); 
      setNotificationMsg('');
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto text-slate-200 custom-scrollbar">
      <h2 className="text-3xl font-bold mb-8 text-white tracking-tight">System Settings & Updates</h2>
      
      {/* Settings Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#2a3241] pb-3">
        <button onClick={() => setActiveTab('syllabus')} className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'syllabus' ? 'bg-[#258cf4] text-white shadow-[0_0_15px_rgba(37,140,244,0.3)]' : 'text-slate-400 hover:bg-white/5'}`}>
          <BookOpen className="w-4 h-4" /> Syllabus Manager
        </button>
        <button onClick={() => setActiveTab('notifications')} className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'notifications' ? 'bg-[#258cf4] text-white shadow-[0_0_15px_rgba(37,140,244,0.3)]' : 'text-slate-400 hover:bg-white/5'}`}>
          <BellRing className="w-4 h-4" /> Broadcast Notifications
        </button>
      </div>

      <div className="bg-[#181b21]/80 backdrop-blur-xl border border-[#2a3241] rounded-2xl p-6 shadow-xl min-h-[400px]">
        
        {/* SYLLABUS TAB */}
        {activeTab === 'syllabus' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Dynamic Syllabus Data</h3>
                <p className="text-slate-400 text-sm mt-1">Add new Subjects or Chapters to the database.</p>
              </div>
              <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 transition-all">
                <Plus className="w-4 h-4" /> Add New Subject
              </button>
            </div>
            
            {showAddModal && (
              <div className="p-5 bg-[#0f1115] border border-[#2a3241] rounded-xl mb-6">
                <h4 className="font-bold text-white mb-4">Add Subject Form</h4>
                <input type="text" placeholder="Subject Name (e.g. Current Affairs 2026)" className="w-full bg-[#181b21] border border-[#2a3241] text-white px-4 py-2 rounded-lg mb-3 focus:outline-none focus:border-[#258cf4]" />
                <button onClick={() => { alert("Subject Added"); setShowAddModal(false); }} className="px-6 py-2 bg-[#258cf4] text-white rounded-lg font-bold">Save Subject</button>
                <button onClick={() => setShowAddModal(false)} className="px-6 py-2 bg-transparent text-slate-400 ml-3">Cancel</button>
              </div>
            )}
            <p className="text-sm text-yellow-500 bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">Note: To make dynamic subjects work permanently, you need to link this to a Prisma PostgreSQL table instead of the local <code>syllabusData.jsx</code> file.</p>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Send Update to All Users</h3>
            <p className="text-slate-400 text-sm mb-6">Users will see this alert via the Bell Icon in their Navigation bar.</p>
            
            <textarea 
              value={notificationMsg}
              onChange={(e) => setNotificationMsg(e.target.value)}
              placeholder="Type your announcement here (e.g., 'New Current Affairs questions added for March 2026!')" 
              className="w-full h-32 bg-[#0f1115] border border-[#2a3241] text-white px-4 py-3 rounded-xl mb-4 focus:outline-none focus:border-[#258cf4]"
            ></textarea>
            
            <button 
              onClick={handleSendNotification} 
              disabled={isSending}
              className="px-6 py-3 bg-[#258cf4] hover:bg-blue-600 disabled:bg-[#258cf4]/50 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} 
              {isSending ? 'Broadcasting...' : 'Broadcast Message'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}