// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { Database, Layers, BarChart2, Settings, LogOut, GraduationCap, Flag } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'questions', label: 'Question Bank', icon: Database },
    { id: 'duplicates', label: 'Duplicate Mgr', icon: Layers },
    { id: 'flags', label: 'Flagged Issues', icon: Flag },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#181b21] border-r border-[#2a3241] flex flex-col flex-none z-20">
      {/* App Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#2a3241]">
        <GraduationCap className="w-8 h-8 text-[#258cf4] mr-3" />
        <span className="font-bold text-lg text-white tracking-wide">PrepIQ Admin</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm cursor-pointer
                ${isActive 
                  ? 'bg-[#258cf4] text-white shadow-[0_0_15px_rgba(37,140,244,0.3)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout Bottom */}
      <div className="p-4 border-t border-[#2a3241]">
        <button 
          onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin-login'); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium text-sm cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}