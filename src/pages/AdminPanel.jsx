import React from 'react';
import useAdminLogic from '../hooks/useAdminLogic';

// COMPONENTS IMPORT
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminConfigPanel from '../components/admin/AdminConfigPanel';
import AdminQuestionList from '../components/admin/AdminQuestionList';

export default function AdminPanel() {
  // Saara dimaag (logic) ek line mein import ho gaya!
  const adminState = useAdminLogic();

  return (
    <div className="bg-[#0f1115] text-slate-100 min-h-screen overflow-hidden flex font-sans selection:bg-[#0d59f2]/30">
      
      <AdminSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0d59f2]/10 rounded-full blur-[120px]"></div>
        </div>

        <AdminHeader status={adminState.status} statusType={adminState.statusType} />

        <div className="flex flex-1 overflow-hidden relative z-10">
          
          {/* Saara data pass kar diya Spread Operator {...} ke through */}
          <AdminConfigPanel {...adminState} />
          <AdminQuestionList {...adminState} />

        </div>
      </main>
    </div>
  );
}