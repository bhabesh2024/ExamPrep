import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Search, ChevronDown, Sun, Moon, Menu, X, Globe, Calculator, Brain, BookOpen, FlaskConical, Terminal, ArrowRight } from 'lucide-react';
// 👇 Apna syllabusData import karein 👇
import { subjectsData } from '../../data/syllabusData.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // ── SEARCH BAR STATE ──
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Helper to check active links
  const isActive = (path) => location.pathname === path;

  // ── PREPARE SEARCH DATA ──
  const searchableItems = useMemo(() => {
    const items = [];
    subjectsData.forEach(sub => {
      // Add main subject
      items.push({ name: sub.title, type: 'Subject', path: `/practice/${sub.id}` });
      sub.categories.forEach(cat => {
        // Add categories
        items.push({ name: cat.title, type: 'Category', path: `/practice/${sub.id}`, parent: sub.title });
        cat.topics.forEach(top => {
          // Add topics
          items.push({ name: top.title, type: 'Topic', path: `/quiz/${sub.title}/${top.title}`, parent: `${sub.title} > ${cat.title}` });
        });
      });
    });
    return items;
  }, []);

  // ── SEARCH HANDLER ──
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      const results = searchableItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6); // Limit to 6 results taaki UI kharab na ho
      
      setSearchResults(results);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (path) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        .glass-nav {
            background: rgba(10, 10, 10, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }
        .dropdown-trigger:hover .dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .dropdown-menu {
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dropdown-item:hover .icon-box {
            transform: scale(1.1);
        }
        .page-dimmer {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease;
        }
        .dropdown-trigger:hover ~ .page-dimmer {
            opacity: 1;
            visibility: visible;
        }
        .search-scrollbar::-webkit-scrollbar { width: 4px; }
        .search-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
      `}</style>

      <header className="fixed top-0 w-full z-50 glass-nav border-b border-[#27272a]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20">
            
            {/* LOGO SECTION */}
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0d59f2] to-violet-600 flex items-center justify-center text-white shadow-lg shadow-[#0d59f2]/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">PrepIQ</span>
            </div>

            {/* ── DESKTOP SEARCH BAR ── */}
            <div className="hidden md:flex flex-1 items-center justify-center px-8 gap-4" ref={searchRef}>
              <div className="relative w-full max-w-md group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0d59f2] transition-colors z-10">
                  <Search className="w-5 h-5" />
                </div>
                <input 
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => searchQuery.trim().length > 0 && setIsSearchOpen(true)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-transparent rounded-full leading-5 bg-[#161616]/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-[#161616] focus:border-[#0d59f2]/50 focus:ring-1 focus:ring-[#0d59f2]/50 sm:text-sm transition-all shadow-inner" 
                  placeholder="Search exams, topics, or questions..." 
                  type="text"
                />
                
                {/* ── SEARCH RESULTS DROPDOWN ── */}
                {isSearchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#181b21] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
                    {searchResults.length > 0 ? (
                      <ul className="max-h-80 overflow-y-auto search-scrollbar">
                        {searchResults.map((result, idx) => (
                          <li 
                            key={idx} 
                            onClick={() => handleResultClick(result.path)}
                            className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-[#2a2f3a] last:border-0 transition-colors flex flex-col group/result"
                          >
                            <span className="text-sm font-semibold text-slate-200 group-hover/result:text-[#0d59f2] transition-colors">{result.name}</span>
                            <span className="text-xs text-slate-500 mt-0.5">
                              {result.type} {result.parent ? `in ${result.parent}` : ''}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-8 flex flex-col items-center justify-center text-slate-500">
                        <Search className="w-8 h-8 mb-2 opacity-20" />
                        <span className="text-sm">No results found for "{searchQuery}"</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Theme Toggle */}
              <div aria-label="Toggle Dark Mode" className="bg-white/5 border border-white/10 backdrop-blur-sm h-10 w-[64px] rounded-full relative cursor-pointer flex items-center shrink-0" role="button" onClick={() => setIsDarkMode(!isDarkMode)}>
                <div className="absolute inset-0 flex justify-between items-center px-1.5 text-[18px]">
                  <Sun className="w-4 h-4 text-amber-500/80" />
                  <Moon className="w-4 h-4 text-indigo-400/80" />
                </div>
                <div className={`absolute h-7 w-7 rounded-full flex items-center justify-center text-white transition-transform duration-300 ${isDarkMode ? 'translate-x-[28px] bg-gradient-to-br from-indigo-500 to-indigo-800 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'translate-x-[2px] bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`}>
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
              </div>
            </div>

            {/* DESKTOP NAVIGATION */}
            <div className="flex items-center gap-6 shrink-0">
              <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
                <button onClick={() => navigate('/')} className={`hover:text-white transition-colors cursor-pointer ${isActive('/') ? 'text-white' : ''}`}>Home</button>
                <button onClick={() => navigate('/practice')} className={`hover:text-white transition-colors cursor-pointer ${isActive('/practice') ? 'text-white' : ''}`}>Practice</button>
                <button onClick={() => navigate('/about')} className={`hover:text-white transition-colors cursor-pointer ${isActive('/about') ? 'text-white' : ''}`}>About</button>
                
                {/* ADVANCED SUBJECTS DROPDOWN */}
                <div className="group dropdown-trigger relative h-20 flex items-center">
                  <button className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none group-hover:text-white cursor-pointer">
                    Subjects
                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  
                  <div className="dropdown-menu absolute top-full right-0 w-[600px] pt-4">
                    <div className="glass-nav rounded-2xl border border-[#27272a] p-6 shadow-2xl shadow-violet-500/10 relative overflow-hidden bg-[#0a0a0a]">
                      {/* Glow Effects */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[60px] pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0d59f2]/10 rounded-full blur-[60px] pointer-events-none"></div>
                      
                      <div className="relative z-10 grid grid-cols-2 gap-4 text-left">
                        {/* Subject Cards */}
                        <button onClick={() => { navigate('/practice/gk'); setIsMobileMenuOpen(false); }} className="dropdown-item flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5 hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] w-full text-left cursor-pointer">
                          <div className="icon-box w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 transition-transform duration-300 shrink-0">
                            <Globe className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold group-hover/item:text-emerald-300 transition-colors">General Knowledge</h4>
                            <p className="text-slate-400 text-xs mt-1">Current affairs, history & geography.</p>
                          </div>
                        </button>
                        
                        <button onClick={() => { navigate('/practice/maths'); setIsMobileMenuOpen(false); }} className="dropdown-item flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5 hover:shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] w-full text-left cursor-pointer">
                          <div className="icon-box w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 shrink-0">
                            <Calculator className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold group-hover/item:text-blue-300 transition-colors">Mathematics</h4>
                            <p className="text-slate-400 text-xs mt-1">Algebra, geometry & calculus prep.</p>
                          </div>
                        </button>

                        <button onClick={() => { navigate('/practice/reasoning'); setIsMobileMenuOpen(false); }} className="dropdown-item flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5 hover:shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)] w-full text-left cursor-pointer">
                          <div className="icon-box w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 transition-transform duration-300 shrink-0">
                            <Brain className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold group-hover/item:text-orange-300 transition-colors">Reasoning</h4>
                            <p className="text-slate-400 text-xs mt-1">Logical deduction & critical thinking.</p>
                          </div>
                        </button>

                        <button onClick={() => { navigate('/practice/english'); setIsMobileMenuOpen(false); }} className="dropdown-item flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5 hover:shadow-[0_0_15px_-3px_rgba(236,72,153,0.3)] w-full text-left cursor-pointer">
                          <div className="icon-box w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 transition-transform duration-300 shrink-0">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold group-hover/item:text-pink-300 transition-colors">English</h4>
                            <p className="text-slate-400 text-xs mt-1">Grammar, vocabulary & comprehension.</p>
                          </div>
                        </button>

                        <button onClick={() => { navigate('/practice/science'); setIsMobileMenuOpen(false); }} className="dropdown-item flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5 hover:shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)] w-full text-left cursor-pointer">
                          <div className="icon-box w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20 transition-transform duration-300 shrink-0">
                            <FlaskConical className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold group-hover/item:text-violet-300 transition-colors">Science</h4>
                            <p className="text-slate-400 text-xs mt-1">Physics, chemistry & biology topics.</p>
                          </div>
                        </button>

                        <button onClick={() => { navigate('/practice/computer'); setIsMobileMenuOpen(false); }} className="dropdown-item flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5 hover:shadow-[0_0_15px_-3px_rgba(14,165,233,0.3)] w-full text-left cursor-pointer">
                          <div className="icon-box w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 transition-transform duration-300 shrink-0">
                            <Terminal className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold group-hover/item:text-sky-300 transition-colors">Computer Science</h4>
                            <p className="text-slate-400 text-xs mt-1">Programming logic & systems.</p>
                          </div>
                        </button>
                      </div>

                      {/* View All Subjects Link */}
                      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
                        <button 
                          onClick={() => { navigate('/subjects'); setIsMobileMenuOpen(false); }} 
                          className="text-xs font-medium text-[#0d59f2] hover:text-[#3b82f6] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          View all subjects <ArrowRight className="w-3 h-3" />
                        </button>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Updated weekly</span>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>

              {/* MOBILE MENU ICON */}
              <button className="lg:hidden text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
            
            {/* Background Dimmer when Dropdown is open */}
            <div className="page-dimmer fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1] pointer-events-none top-20 hidden lg:block"></div>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU DRAWER ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl lg:hidden pt-24 px-6 flex flex-col">
          
          {/* MOBILE SEARCH BAR */}
          <div className="relative w-full mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-3 border border-[#27272a] rounded-xl leading-5 bg-[#161616] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0d59f2]" 
              placeholder="Search subjects or topics..." 
              type="text"
            />
            {/* MOBILE SEARCH RESULTS */}
            {searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#181b21] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <ul className="max-h-60 overflow-y-auto search-scrollbar">
                    {searchResults.map((result, idx) => (
                      <li 
                        key={idx} 
                        onClick={() => handleResultClick(result.path)}
                        className="px-4 py-3 hover:bg-[#27272a]/50 cursor-pointer border-b border-[#2a2f3a] last:border-0 transition-colors flex flex-col"
                      >
                        <span className="text-sm font-semibold text-slate-200">{result.name}</span>
                        <span className="text-xs text-slate-500 mt-0.5">
                          {result.type} {result.parent ? `in ${result.parent}` : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-4 text-center text-slate-500 text-sm">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-6 text-xl font-medium text-slate-300">
            <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-[#27272a] hover:text-white cursor-pointer">Home</button>
            <button onClick={() => { navigate('/practice'); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-[#27272a] hover:text-white cursor-pointer">Practice</button>
            <button onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-[#27272a] hover:text-white cursor-pointer">About</button>
            <button onClick={() => { navigate('/subjects'); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-[#27272a] hover:text-[#0d59f2] cursor-pointer">View All Subjects →</button>
          </nav>
        </div>
      )}
    </>
  );
}