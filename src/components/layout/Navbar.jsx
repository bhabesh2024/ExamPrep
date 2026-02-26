import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap, Search, ChevronDown, Sun, Moon, Menu, X, Globe, Calculator, Brain, BookOpen, FlaskConical, Terminal, ArrowRight, LogOut, User, Sparkles, Bell } from 'lucide-react';
import { subjectsData } from '../../data/syllabusData.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // 🔥 Notification States
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifMenu] = useState(false);
  const desktopNotifRef = useRef(null);
  const mobileNotifRef = useRef(null);

  // Theme Logic
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Auth Logic
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      localStorage.removeItem('user');
    }
  }, [location.pathname]); 

  // 🔥 FETCH NOTIFICATIONS (Safe Array Check)
  const fetchNotifications = async (userId) => {
    try {
      const res = await axios.get(`/api/notifications?userId=${userId}`);
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (e) { console.error("Notification fetch failed"); }
  };

  // 🔥 NAYA FEATURE: AUTO POLLING (Har 5 second me auto check karega)
  useEffect(() => {
    if (user && user.id) {
      fetchNotifications(user.id); // Pehli baar turant fetch kare
      const interval = setInterval(() => {
        fetchNotifications(user.id);
      }, 5000); // 5 sec background checking
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const searchableItems = useMemo(() => {
    const items = [];
    subjectsData.forEach(sub => {
      items.push({ name: sub.title, type: 'Subject', path: `/practice/${sub.id}` });
      sub.categories.forEach(cat => {
        items.push({ name: cat.title, type: 'Category', path: `/practice/${sub.id}`, parent: sub.title });
        cat.topics.forEach(top => {
          items.push({ name: top.title, type: 'Topic', path: `/quiz/${sub.title}/${top.title}`, parent: `${sub.title} > ${cat.title}` });
        });
      });
    });
    return items;
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const results = searchableItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6); 
      setSearchResults(results);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (
        (desktopNotifRef.current && !desktopNotifRef.current.contains(event.target)) &&
        (mobileNotifRef.current && !mobileNotifRef.current.contains(event.target))
      ) {
        setShowNotifMenu(false);
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

  const navBg = isDarkMode ? 'rgba(10, 10, 10, 0.8)' : 'rgba(255, 255, 255, 0.88)';
  const navBorder = isDarkMode ? 'border-[#27272a]' : 'border-slate-200';
  const logoText = isDarkMode ? 'text-white' : 'text-slate-900';
  const navLinks = isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900';
  const inputBg = isDarkMode ? 'bg-[#161616]/80 text-slate-100 placeholder-slate-500 focus:bg-[#161616] focus:border-[#0d59f2]/50' : 'bg-slate-100 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0d59f2]/50';
  const dropdownBg = isDarkMode ? 'bg-[#181b21] border-[#27272a]' : 'bg-white border-slate-200 shadow-xl';
  const resultHover = isDarkMode ? 'hover:bg-white/5 border-[#2a2f3a]' : 'hover:bg-slate-50 border-slate-100';
  const textPrimary = isDarkMode ? 'text-slate-200' : 'text-slate-800';
  const textSecondary = isDarkMode ? 'text-slate-500' : 'text-slate-500';
  const mobileMenuBg = isDarkMode ? 'bg-[#0a0a0a]/98' : 'bg-white/98';
  const mobileLinkHover = isDarkMode ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900';

  const NotificationDropdown = () => (
    <div className={`absolute top-full right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[999] overflow-hidden flex flex-col border ${isDarkMode ? 'bg-[#15171c] border-[#282e39]' : 'bg-white border-slate-200'}`}>
      <div className={`p-4 border-b font-bold flex justify-between items-center ${isDarkMode ? 'border-[#282e39] bg-[#1a1d24] text-white' : 'border-slate-100 bg-slate-50 text-slate-800'}`}>
        <span>Notifications</span>
        {unreadCount > 0 && <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">{unreadCount} New</span>}
      </div>
      <div className="max-h-72 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
        {notifications.length === 0 ? (
          <div className={`text-center p-6 text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No new notifications</div>
        ) : (
          notifications.map(n => (
            <div key={n.id} onClick={() => !n.isRead && markAsRead(n.id)} className={`p-3 rounded-xl cursor-pointer transition-colors border ${n.isRead ? (isDarkMode ? 'bg-transparent border-transparent hover:bg-white/5 opacity-60 text-slate-400' : 'bg-transparent border-transparent hover:bg-slate-50 opacity-70 text-slate-500') : (isDarkMode ? 'bg-[#0d59f2]/10 border-[#0d59f2]/20 hover:bg-[#0d59f2]/20 text-slate-200' : 'bg-blue-50 border-blue-100 hover:bg-blue-100 text-slate-800')}`}>
              <h4 className={`text-sm ${n.isRead ? '' : 'font-bold text-[#0d59f2]'}`}>{n.title}</h4>
              <p className="text-xs mt-1 line-clamp-2">{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .glass-nav { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .dropdown-trigger:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-menu { opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .search-scrollbar::-webkit-scrollbar { width: 4px; }
        .search-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
      `}</style>

      <header className={`fixed top-0 w-full z-50 glass-nav border-b ${navBorder}`} style={{ background: navBg }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#0d59f2] to-violet-600 flex items-center justify-center text-white shadow-lg shadow-[#0d59f2]/20">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={`text-lg sm:text-xl font-bold tracking-tight ${logoText}`}>PrepIQ</span>
            </div>

            <div className="hidden md:flex flex-1 items-center justify-center px-4 lg:px-8 gap-4" ref={searchRef}>
              <div className="relative w-full max-w-md group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0d59f2] transition-colors z-10">
                  <Search className="w-5 h-5" />
                </div>
                <input 
                  value={searchQuery} onChange={handleSearch} onFocus={() => searchQuery.trim().length > 0 && setIsSearchOpen(true)}
                  className={`block w-full pl-10 pr-3 py-2.5 border border-transparent rounded-full leading-5 sm:text-sm transition-all shadow-inner outline-none ${inputBg}`}
                  placeholder="Search exams, topics..." type="text"
                />
                
                {isSearchOpen && (
                  <div className={`absolute top-full left-0 right-0 mt-2 border rounded-xl shadow-2xl overflow-hidden z-50 ${dropdownBg}`}>
                    {searchResults.length > 0 ? (
                      <ul className="max-h-80 overflow-y-auto search-scrollbar">
                        {searchResults.map((result, idx) => (
                          <li key={idx} onClick={() => handleResultClick(result.path)} className={`px-4 py-3 cursor-pointer border-b last:border-0 transition-colors flex flex-col group/result ${resultHover}`}>
                            <span className={`text-sm font-semibold group-hover/result:text-[#0d59f2] transition-colors ${textPrimary}`}>{result.name}</span>
                            <span className={`text-xs mt-0.5 ${textSecondary}`}>{result.type} {result.parent ? `in ${result.parent}` : ''}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className={`px-4 py-8 flex flex-col items-center justify-center ${textSecondary}`}>
                        <Search className="w-8 h-8 mb-2 opacity-20" />
                        <span className="text-sm">No results found</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <button 
                aria-label="Toggle Theme"
                className={`h-10 w-[64px] rounded-full relative cursor-pointer flex items-center shrink-0 hidden lg:flex border transition-colors ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-200 border-slate-300'}`}
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                <div className="absolute inset-0 flex justify-between items-center px-1.5 text-[18px]">
                  <Sun className={`w-4 h-4 ${isDarkMode ? 'text-amber-500/80' : 'text-amber-500'}`} />
                  <Moon className={`w-4 h-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-400/50'}`} />
                </div>
                <div className={`absolute h-7 w-7 rounded-full flex items-center justify-center text-white transition-transform duration-300 ${isDarkMode ? 'translate-x-[28px] bg-gradient-to-br from-indigo-500 to-indigo-800 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'translate-x-[2px] bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`}>
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
              </button>
            </div>

            <div className="flex items-center shrink-0">
              <nav className={`hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium mr-6 ${navLinks}`}>
                <button onClick={() => navigate('/')} className={`hover:text-white transition-colors cursor-pointer ${isActive('/') ? (isDarkMode ? 'text-white' : 'text-slate-900') : ''}`}>Home</button>
                <button onClick={() => navigate('/practice')} className={`transition-colors cursor-pointer ${isActive('/practice') ? (isDarkMode ? 'text-white' : 'text-slate-900') : ''}`}>Practice</button>
                <button onClick={() => navigate('/pricing')} className={`transition-colors cursor-pointer flex items-center gap-1 ${isActive('/pricing') ? (isDarkMode ? 'text-white' : 'text-slate-900') : ''}`}>
                  Pricing <Sparkles className="w-3 h-3 text-yellow-400" />
                </button>
                <button onClick={() => navigate('/about')} className={`transition-colors cursor-pointer ${isActive('/about') ? (isDarkMode ? 'text-white' : 'text-slate-900') : ''}`}>About</button>
                
                <div className="group dropdown-trigger relative h-16 sm:h-20 flex items-center">
                  <button className={`flex items-center gap-1 transition-colors focus:outline-none cursor-pointer ${isDarkMode ? 'hover:text-white group-hover:text-white' : 'hover:text-slate-900 group-hover:text-slate-900'}`}>
                    Subjects <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  
                  <div className="dropdown-menu absolute top-full right-[-100px] w-[580px] xl:w-[600px] pt-4">
                    <div className={`rounded-2xl border p-5 xl:p-6 shadow-2xl relative overflow-hidden ${isDarkMode ? 'bg-[#0d0d0d] border-[#27272a]' : 'bg-white border-slate-200'}`}>
                      <div className="relative z-10 grid grid-cols-2 gap-3 xl:gap-4 text-left">
                        <button onClick={() => { navigate('/practice/gk'); setIsMobileMenuOpen(false); }} className={`flex items-start gap-3 p-3 rounded-xl transition-all w-full text-left border border-transparent ${isDarkMode ? 'hover:bg-white/5 hover:border-white/5' : 'hover:bg-slate-50 hover:border-slate-100'}`}>
                          <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0"><Globe className="w-5 h-5 xl:w-6 xl:h-6" /></div>
                          <div><h4 className={`font-semibold text-sm xl:text-base ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>General Knowledge</h4><p className={`text-xs mt-1 ${textSecondary}`}>Current affairs & history.</p></div>
                        </button>
                        <button onClick={() => { navigate('/practice/maths'); setIsMobileMenuOpen(false); }} className={`flex items-start gap-3 p-3 rounded-xl transition-all w-full text-left border border-transparent ${isDarkMode ? 'hover:bg-white/5 hover:border-white/5' : 'hover:bg-slate-50 hover:border-slate-100'}`}>
                          <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0"><Calculator className="w-5 h-5 xl:w-6 xl:h-6" /></div>
                          <div><h4 className={`font-semibold text-sm xl:text-base ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Mathematics</h4><p className={`text-xs mt-1 ${textSecondary}`}>Algebra & geometry prep.</p></div>
                        </button>
                        <button onClick={() => { navigate('/practice/reasoning'); setIsMobileMenuOpen(false); }} className={`flex items-start gap-3 p-3 rounded-xl transition-all w-full text-left border border-transparent ${isDarkMode ? 'hover:bg-white/5 hover:border-white/5' : 'hover:bg-slate-50 hover:border-slate-100'}`}>
                          <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shrink-0"><Brain className="w-5 h-5 xl:w-6 xl:h-6" /></div>
                          <div><h4 className={`font-semibold text-sm xl:text-base ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Reasoning</h4><p className={`text-xs mt-1 ${textSecondary}`}>Logical & critical thinking.</p></div>
                        </button>
                        <button onClick={() => { navigate('/practice/english'); setIsMobileMenuOpen(false); }} className={`flex items-start gap-3 p-3 rounded-xl transition-all w-full text-left border border-transparent ${isDarkMode ? 'hover:bg-white/5 hover:border-white/5' : 'hover:bg-slate-50 hover:border-slate-100'}`}>
                          <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shrink-0"><BookOpen className="w-5 h-5 xl:w-6 xl:h-6" /></div>
                          <div><h4 className={`font-semibold text-sm xl:text-base ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>English</h4><p className={`text-xs mt-1 ${textSecondary}`}>Grammar & vocabulary.</p></div>
                        </button>
                      </div>
                      <div className={`mt-4 pt-4 border-t flex justify-between items-center relative z-10 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                        <button onClick={() => { navigate('/subjects'); setIsMobileMenuOpen(false); }} className="text-xs font-medium text-[#0d59f2] hover:text-[#3b82f6] flex items-center gap-1 transition-colors">
                          View all subjects <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>

              <div className={`hidden lg:flex items-center pl-5 xl:pl-6 border-l ${isDarkMode ? 'border-[#27272a]' : 'border-slate-200'}`}>
                
                {user && (
                  <div className="relative" ref={desktopNotifRef}>
                    <button 
                      onClick={() => setShowNotifMenu(!showNotifs)}
                      className={`relative p-2 mr-3 transition-colors cursor-pointer rounded-full ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`} 
                      title="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className={`absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 rounded-full animate-pulse ${isDarkMode ? 'border-[#0a0a0a]' : 'border-white'}`}></span>
                      )}
                    </button>
                    {showNotifs && <NotificationDropdown />}
                  </div>
                )}

                {user ? (
                  <div className="flex items-center gap-3 xl:gap-4">
                    <button 
                      onClick={() => navigate('/profile')} 
                      className={`flex items-center gap-2 transition-colors py-1.5 px-3 rounded-full border cursor-pointer ${isDarkMode ? 'bg-[#161616] hover:bg-[#27272a] border-[#27272a]' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'}`}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                        {user.name ? user.name.charAt(0) : 'U'}
                      </div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{user.name?.split(' ')[0]}</span>
                    </button>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10" title="Logout">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => navigate('/login')} 
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 xl:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>

              <div className="lg:hidden flex items-center gap-2 sm:gap-4 ml-auto pl-3">
                {user && (
                  <div className="relative" ref={mobileNotifRef}>
                    <button 
                      onClick={() => setShowNotifMenu(!showNotifs)}
                      className={`relative p-2 transition-colors cursor-pointer rounded-full ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 rounded-full animate-pulse ${isDarkMode ? 'border-[#0a0a0a]' : 'border-white'}`}></span>
                      )}
                    </button>
                    {showNotifs && <NotificationDropdown />}
                  </div>
                )}
                <button className={`transition-colors cursor-pointer ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className={`fixed inset-0 z-40 backdrop-blur-2xl lg:hidden pt-20 sm:pt-24 px-5 sm:px-6 flex flex-col h-screen overflow-y-auto ${mobileMenuBg}`}>
          
          {user ? (
            <div 
              onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }} 
              className={`flex items-center justify-between p-4 rounded-xl border mb-5 sm:mb-6 cursor-pointer transition-colors ${isDarkMode ? 'bg-[#161616] hover:bg-[#27272a] border-[#27272a]' : 'bg-slate-100 hover:bg-slate-200 border-slate-200'}`}
            >
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-lg font-bold text-white uppercase">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{user.name}</h3>
                    <p className="text-slate-400 text-xs">View Dashboard & Progress</p>
                  </div>
               </div>
               <ArrowRight className="w-5 h-5 text-slate-500" />
            </div>
          ) : (
             <div className="mb-5 sm:mb-6">
                <button 
                  onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Sign In / Create Account
                </button>
             </div>
          )}

          <div className="relative w-full mb-5 sm:mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              value={searchQuery} onChange={handleSearch}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl leading-5 outline-none ${isDarkMode ? 'border-[#27272a] bg-[#161616] text-slate-100 placeholder-slate-500 focus:border-[#0d59f2]' : 'border-slate-200 bg-slate-100 text-slate-800 placeholder-slate-400 focus:border-[#0d59f2]'}`}
              placeholder="Search subjects..." type="text"
            />
          </div>

          <div className={`flex items-center justify-between p-4 rounded-xl border mb-4 ${isDarkMode ? 'bg-[#161616] border-[#27272a]' : 'bg-slate-100 border-slate-200'}`}>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`h-8 w-14 rounded-full relative transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-amber-400'}`}
            >
              <div className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
            </button>
          </div>

          <nav className={`flex flex-col gap-1 text-base font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className={`text-left py-3 px-4 rounded-xl transition-colors ${mobileLinkHover}`}>Home</button>
            <button onClick={() => { navigate('/practice'); setIsMobileMenuOpen(false); }} className={`text-left py-3 px-4 rounded-xl transition-colors ${mobileLinkHover}`}>Practice</button>
            <button onClick={() => { navigate('/pricing'); setIsMobileMenuOpen(false); }} className={`text-left py-3 px-4 rounded-xl transition-colors flex items-center justify-between ${mobileLinkHover}`}>
              <span>Pricing</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </button>
            <button onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }} className={`text-left py-3 px-4 rounded-xl transition-colors ${mobileLinkHover}`}>About</button>
            <button onClick={() => { navigate('/subjects'); setIsMobileMenuOpen(false); }} className="text-left py-3 px-4 rounded-xl text-[#0d59f2] transition-colors">View All Subjects →</button>
            <button onClick={() => { navigate('/contact'); setIsMobileMenuOpen(false); }} className={`text-left py-3 px-4 rounded-xl transition-colors ${mobileLinkHover}`}>Contact</button>
            
            {user && (
              <button 
                onClick={handleLogout} 
                className="text-left py-3 px-4 rounded-xl hover:bg-red-500/10 text-red-400 mt-3 flex items-center gap-2 transition-colors border border-red-500/20 bg-red-500/5"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            )}
          </nav>

          <div className={`mt-auto pt-6 pb-8 border-t mt-6 flex flex-wrap gap-3 ${isDarkMode ? 'border-[#27272a]' : 'border-slate-200'}`}>
            <button onClick={() => { navigate('/terms'); setIsMobileMenuOpen(false); }} className="text-xs text-slate-500 hover:text-[#0d59f2]">Terms</button>
            <button onClick={() => { navigate('/privacy'); setIsMobileMenuOpen(false); }} className="text-xs text-slate-500 hover:text-[#0d59f2]">Privacy</button>
            <button onClick={() => { navigate('/cookie-policy'); setIsMobileMenuOpen(false); }} className="text-xs text-slate-500 hover:text-[#0d59f2]">Cookie Policy</button>
          </div>
        </div>
      )}
    </>
  );
}