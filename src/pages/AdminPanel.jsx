import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import QuestionBankView from '../components/admin/views/QuestionBankView';
import DuplicateManager from '../components/admin/DuplicateManager/DuplicateManager';
import AdminAnalytics from '../components/admin/views/AdminAnalytics';
import AdminSettings from '../components/admin/views/AdminSettings';
import useAdminLogic from '../hooks/useAdminLogic';
import FlaggedQuestionsView from '../components/admin/views/FlaggedQuestionsView';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('questions');
  const adminState = useAdminLogic(); // Pura backend logic yahan se load hoga

  return (
    <div className="flex h-screen bg-[#0f1115] text-slate-200 font-sans overflow-hidden">
      {/* Naya Premium Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Dynamic Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {activeTab === 'questions' && <QuestionBankView state={adminState} />}
        {activeTab === 'duplicates' && <DuplicateManager />}
        {activeTab === 'analytics' && <AdminAnalytics />}
        {activeTab === 'settings' && <AdminSettings />}
        {activeTab === 'flags' && <FlaggedQuestionsView />}
      </main>
    </div>
  );
}