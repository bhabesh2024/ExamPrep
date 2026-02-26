// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import QuestionBankView from '../components/admin/views/QuestionBankView';
import DuplicateManager from '../components/admin/DuplicateManager/DuplicateManager';
import AdminAnalytics from '../components/admin/views/AdminAnalytics';
import AdminSettings from '../components/admin/views/AdminSettings';
import FlaggedQuestionsView from '../components/admin/views/FlaggedQuestionsView'; 
import AdminSupportView from '../components/admin/views/AdminSupportView'; 
import useAdminLogic from '../hooks/useAdminLogic';
import AdminCommunityView from '../components/admin/views/AdminCommunityView';

export default function AdminPanel() {
  // 🔥 BUG FIX: Refresh karne par last active tab yaad rakhne ke liye localStorage lagaya
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('prepiq_admin_tab') || 'questions';
  });

  // Jab bhi tab change ho, use localStorage me save kar do
  useEffect(() => {
    localStorage.setItem('prepiq_admin_tab', activeTab);
  }, [activeTab]);

  const adminState = useAdminLogic();

  return (
    <div className="flex h-screen bg-[#0f1115] text-slate-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {activeTab === 'questions' && <QuestionBankView state={adminState} />}
        {activeTab === 'duplicates' && <DuplicateManager />}
        {activeTab === 'flags' && <FlaggedQuestionsView />}  
        {activeTab === 'analytics' && <AdminAnalytics />}
        {activeTab === 'support' && <AdminSupportView />}    
        
        {/* 🔥 NEW: Community Tab Rendered Here */}
        {activeTab === 'community' && <AdminCommunityView />}
        
        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
}