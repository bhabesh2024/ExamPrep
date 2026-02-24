// src/pages/AdminPanel.jsx
// Sirf layout, tab switching aur component composition.
// Koi logic yahan nahi hai.
import React, { useState } from 'react';
import useAdminLogic from '../hooks/useAdminLogic.jsx';

import AdminSidebar      from '../components/admin/AdminSidebar';
import AdminHeader       from '../components/admin/AdminHeader';
import AdminConfigPanel  from '../components/admin/AdminConfigPanel';
import AdminQuestionList from '../components/admin/AdminQuestionList';
import DuplicateManager  from '../components/admin/DuplicateManager/DuplicateManager.jsx';

const TABS = [
  { id: 'questions',  label: 'Questions Manager' },
  { id: 'duplicates', label: 'Duplicate Cleaner' },
];

export default function AdminPanel() {
  const adminState = useAdminLogic();
  const [activeTab, setActiveTab] = useState('questions');

  return (
    <div className="bg-[#0f1115] text-slate-100 min-h-screen overflow-hidden flex font-sans selection:bg-[#0d59f2]/30">
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0d59f2]/10 rounded-full blur-[120px]" />
        </div>

        <AdminHeader status={adminState.status} statusType={adminState.statusType} />

        {/* Tab Bar */}
        <div className="relative z-20 flex items-center gap-1 px-4 py-2 bg-[#161b27] border-b-2 border-slate-700 shrink-0">
          <span className="text-slate-500 text-xs mr-2 font-medium uppercase tracking-wider">View:</span>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? tab.id === 'duplicates' ? 'bg-yellow-600 text-white' : 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden relative z-10">
          {activeTab === 'questions' ? (
            <>
              <AdminConfigPanel  {...adminState} />
              <AdminQuestionList {...adminState} />
            </>
          ) : (
            <DuplicateManager />
          )}
        </div>
      </main>
    </div>
  );
}