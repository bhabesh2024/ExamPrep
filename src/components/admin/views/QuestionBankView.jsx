// src/components/admin/views/QuestionBankView.jsx
import React from 'react';
import { Database } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import AdminConfigPanel from '../AdminConfigPanel';
import AdminActionBar from '../AdminActionBar';
import AdminQuestionList from '../AdminQuestionList';

export default function QuestionBankView({ state }) {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-[#0f1115] relative custom-scrollbar">
      <div className="max-w-[1400px] mx-auto p-6 md:p-8">
        
        {/* ── Header ── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Database className="text-[#258cf4] w-8 h-8" />
              Question Database
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm ml-11">
              Manage, generate, and organize curriculum content
            </p>
          </div>
          <div className="bg-[#181b21]/60 backdrop-blur-md border border-[#2a3241] rounded-xl px-4 py-2">
            <AdminHeader status={state.status} statusType={state.statusType} isLoading={state.isLoading} />
          </div>
        </header>

        {/* ── Sub-components render here (which are updated above) ── */}
        <AdminConfigPanel 
          {...state} 
          handleFileSelect={state.handleFileSelect}
          handleBulkJsonUpload={state.handleBulkJsonUpload}
          fileInputRef={state.fileInputRef}
          bulkJsonRef={state.bulkJsonRef}
        />

        <AdminActionBar {...state} />

        <div className="pb-20">
          <AdminQuestionList {...state} />
        </div>

      </div>
    </div>
  );
}