import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Search, ChevronDown, Sun, Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to check active links
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#181b21]/60 backdrop-blur-xl border-b border-white/5 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LOGO SECTION */}
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-300">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">PrepIQ</span>
            </div>

            {/* DESKTOP LINKS & DROPDOWN */}
            <div className="hidden md:flex items-center space-x-8 h-full">
              <button 
                onClick={() => navigate('/')} 
                className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Home
              </button>
              
              {/* 👇 Practice ki jagah Test 👇 */}
              <button 
                onClick={() => navigate('/test')} 
                className={`text-sm font-medium transition-colors ${isActive('/test') ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Test
              </button>
              
              {/* SUBJECTS DROPDOWN */}
              <div className="relative group h-full flex items-center">
                <button className="flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white transition-colors focus:outline-none">
                  Subjects
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-48 rounded-xl bg-[#181b21]/95 backdrop-blur-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100 shadow-2xl overflow-hidden">
                  <div className="py-2">
                    <button onClick={() => navigate('/test/Maths')} className="block w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                      Mathematics
                    </button>
                    <button onClick={() => navigate('/test/Science')} className="block w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                      Sciences
                    </button>
                    <button onClick={() => navigate('/test/Humanities')} className="block w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                      Humanities
                    </button>
                    <button onClick={() => navigate('/test/English')} className="block w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                      Languages
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-white transition-colors hidden sm:block">
                <Search className="w-5 h-5" />
              </button>
              <button className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-yellow-300 transition-colors border border-white/5">
                <Sun className="w-5 h-5" />
              </button>

              {/* MOBILE MENU TOGGLE */}
              <button 
                className="md:hidden text-slate-400 hover:text-white transition-colors ml-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0f1115]/95 backdrop-blur-xl md:hidden pt-20 px-6 flex flex-col">
          <nav className="flex flex-col gap-4 text-lg font-medium text-slate-300 mt-4">
            <button 
              onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} 
              className="text-left py-3 border-b border-white/5 hover:text-white"
            >
              Home
            </button>
            {/* 👇 Practice ki jagah Test 👇 */}
            <button 
              onClick={() => { navigate('/test'); setIsMobileMenuOpen(false); }} 
              className="text-left py-3 border-b border-white/5 hover:text-white"
            >
              Test
            </button>
            <div className="py-3 border-b border-white/5">
              <span className="text-slate-500 text-sm uppercase tracking-wider font-bold mb-3 block">Subjects</span>
              <div className="flex flex-col gap-3 pl-4">
                <button onClick={() => { navigate('/test/Maths'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white">Mathematics</button>
                <button onClick={() => { navigate('/test/Science'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white">Sciences</button>
                <button onClick={() => { navigate('/test/Humanities'); setIsMobileMenuOpen(false); }} className="text-left hover:text-white">Humanities</button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}