import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../../context/ThemeProvider'; 
import { GraduationCap, Search, ChevronDown, Sun, Moon, Home, BookOpen, User, Bell, LogOut, Sparkles, LayoutGrid, Globe, Calculator, Brain as BrainIcon, ArrowRight, X } from 'lucide-react';
import { subjectsData } from '../../data/syllabusData.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); 
  
  const [user, setUser] = useState(null);
  
  // 🔍 Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifMenu] = useState(false);
  const desktopNotifRef = useRef(null);
  const mobileNotifRef = useRef(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') setUser(JSON.parse(storedUser));
    } catch (e) { localStorage.removeItem('user'); }
  }, [location.pathname]); 

  const fetchNotifications = async (userId) => {
    try {
      const res = await axios.get(`/api/notifications?userId=${userId}`);
      if (Array.isArray(res.data)) setNotifications(res.data);
    } catch (e) { console.error("Notification fetch failed"); }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchNotifications(user.id); 
      const interval = setInterval(() => fetchNotifications(user.id), 5000); 
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
  };

  const isActive = (path) => location.pathname === path;

  // 🔍 Dynamic Search Data Preparation
  const searchableItems = useMemo(() => {
    const items = [];
    if(subjectsData) {
      subjectsData.forEach(sub => {
        items.push({ name: sub.title, type: 'Subject', path: `/practice/${sub.id}` });
        sub.categories?.forEach(cat => {
          cat.topics?.forEach(topic => {
            items.push({ name: topic.title, type: sub.title, path: `/quiz/${sub.id}/${topic.id}` });
          });
        });
      });
    }
    return items;
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const filtered = searchableItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 6));
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleResultClick = (path) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setIsSearchOpen(false);
      if ((desktopNotifRef.current && !desktopNotifRef.current.contains(event.target)) &&
          (mobileNotifRef.current && !mobileNotifRef.current.contains(event.target))) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NotificationDropdown = () => (
    <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-2xl z-[999] overflow-hidden flex flex-col border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#18181b] transition-colors duration-500">
      <div className="p-4 border-b border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-[#121214] flex justify-between items-center transition-colors">
        <span className="font-bold text-zinc-900 dark:text-white">Notifications</span>
        {unreadCount > 0 && <span className="text-[10px] bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">{unreadCount} New</span>}
      </div>
      <div className="max-h-72 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
        {notifications.length === 0 ? (
          <div className="text-center p-6 text-sm text-zinc-500 dark:text-slate-500 font-medium">No new notifications</div>
        ) : (
          notifications.map(n => (
            <div key={n.id} onClick={() => !n.isRead && markAsRead(n.id)} className={`p-3 rounded-xl cursor-pointer transition-colors border ${n.isRead ? 'bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-500 dark:text-slate-400' : 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-zinc-800 dark:text-slate-200'}`}>
              <h4 className={`text-sm ${n.isRead ? 'font-medium' : 'font-bold text-blue-600 dark:text-blue-400'}`}>{n.title}</h4>
              <p className="text-xs mt-1 line-clamp-2 opacity-80">{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .dropdown-trigger:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-menu { opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>

      {/* DESKTOP TOP NAVBAR */}
      <header className="fixed top-0 w-full z-50 glass border-b border-zinc-200 dark:border-white/5 hidden md:block transition-colors duration-500">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          
          <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0 tap-effect">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white transition-colors duration-500">PrepIQ</span>
          </div>

          <div className="flex-1 max-w-md mx-8 relative z-[100]" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-slate-500 transition-colors" />
            <input 
              value={searchQuery} 
              onChange={handleSearch} 
              onFocus={() => searchQuery.length > 0 && setIsSearchOpen(true)}
              className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-[#121214] text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 text-sm rounded-full py-2.5 pl-10 pr-10 outline-none transition-all duration-300 shadow-sm"
              placeholder="Search exams, subjects, topics..." 
              type="text"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}

            {isSearchOpen && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden animate-fade-in flex flex-col">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleResultClick(result.path)}
                        className="flex items-center justify-between w-full text-left px-4 py-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-[#27272a] transition-colors group tap-effect"
                      >
                        <div className="flex items-center gap-3">
                          <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-500" />
                          <span className="font-semibold text-sm text-zinc-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{result.name}</span>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 shrink-0 bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded">{result.type}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center flex flex-col items-center">
                    <Search className="w-6 h-6 text-zinc-300 dark:text-slate-600 mb-2" />
                    <p className="text-sm text-zinc-500 dark:text-slate-400 font-medium">No matches found for <span className="text-zinc-900 dark:text-white font-bold">"{searchQuery}"</span></p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6 text-sm font-semibold text-zinc-500 dark:text-slate-400">
              <button onClick={() => navigate('/')} className={`hover:text-zinc-900 dark:hover:text-white transition-colors ${isActive('/') && 'text-zinc-900 dark:text-white font-bold'}`}>Home</button>
              <button onClick={() => navigate('/practice')} className={`hover:text-zinc-900 dark:hover:text-white transition-colors ${isActive('/practice') && 'text-zinc-900 dark:text-white font-bold'}`}>Practice</button>
              <button onClick={() => navigate('/pricing')} className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing <Sparkles className="w-3 h-3 text-amber-500" /></button>
              <button onClick={() => navigate('/about')} className={`hover:text-zinc-900 dark:hover:text-white transition-colors ${isActive('/about') && 'text-zinc-900 dark:text-white font-bold'}`}>About</button>
              
              <div className="group dropdown-trigger relative h-20 flex items-center cursor-pointer">
                <button className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white transition-colors outline-none">
                  Subjects <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                
                <div className="dropdown-menu absolute top-full right-[-80px] w-[500px] pt-2 z-50">
                  <div className="glass-card p-5 shadow-2xl border border-zinc-200 dark:border-white/10 relative overflow-hidden bg-white dark:bg-[#121214]">
                    <div className="grid grid-cols-2 gap-3 text-left">
                      <button onClick={() => navigate('/practice/gk')} className="flex items-start gap-3 p-3 rounded-xl transition-all w-full text-left hover:bg-zinc-50 dark:hover:bg-white/5 border border-transparent hover:border-zinc-200 dark:hover:border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0"><Globe className="w-5 h-5" /></div>
                        <div><h4 className="font-bold text-sm text-zinc-900 dark:text-white">General Knowledge</h4><p className="text-xs mt-0.5 text-zinc-500 dark:text-slate-400">Current affairs & history</p></div>
                      </button>
                      <button onClick={() => navigate('/practice/maths')} className="flex items-start gap-3 p-3 rounded-xl transition-all w-full text-left hover:bg-zinc-50 dark:hover:bg-white/5 border border-transparent hover:border-zinc-200 dark:hover:border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0"><Calculator className="w-5 h-5" /></div>
                        <div><h4 className="font-bold text-sm text-zinc-900 dark:text-white">Mathematics</h4><p className="text-xs mt-0.5 text-zinc-500 dark:text-slate-400">Algebra & geometry</p></div>
                      </button>
                      <button onClick={() => navigate('/practice/reasoning')} className="flex items-start gap-3 p-3 rounded-xl transition-all w-full text-left hover:bg-zinc-50 dark:hover:bg-white/5 border border-transparent hover:border-zinc-200 dark:hover:border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0"><BrainIcon className="w-5 h-5" /></div>
                        <div><h4 className="font-bold text-sm text-zinc-900 dark:text-white">Reasoning</h4><p className="text-xs mt-0.5 text-zinc-500 dark:text-slate-400">Logical thinking</p></div>
                      </button>
                      <button onClick={() => navigate('/practice/english')} className="flex items-start gap-3 p-3 rounded-xl transition-all w-full text-left hover:bg-zinc-50 dark:hover:bg-white/5 border border-transparent hover:border-zinc-200 dark:hover:border-white/10">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0"><BookOpen className="w-5 h-5" /></div>
                        <div><h4 className="font-bold text-sm text-zinc-900 dark:text-white">English</h4><p className="text-xs mt-0.5 text-zinc-500 dark:text-slate-400">Grammar & vocabulary</p></div>
                      </button>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-white/5 flex justify-between items-center">
                      <button onClick={() => navigate('/subjects')} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
                        View all subjects <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            <div className="flex items-center gap-3 pl-6 border-l border-zinc-200 dark:border-white/10">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-[#27272a] text-zinc-500 dark:text-slate-400 transition-colors tap-effect">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {user && (
                <div className="relative" ref={desktopNotifRef}>
                  <button onClick={() => setShowNotifMenu(!showNotifs)} className="relative p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-[#27272a] text-zinc-500 dark:text-slate-400 transition-colors tap-effect">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-[#09090b] rounded-full animate-pulse"></span>}
                  </button>
                  {showNotifs && <NotificationDropdown />}
                </div>
              )}

              {user ? (
                <div className="flex items-center gap-2 ml-1">
                  <button onClick={() => navigate('/profile')} className="flex items-center gap-2 bg-zinc-100 dark:bg-[#18181b] hover:bg-zinc-200 dark:hover:bg-[#27272a] py-1.5 px-3 rounded-full transition-colors tap-effect border border-transparent dark:border-white/5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">{user.name?.charAt(0)}</div>
                    <span className="text-sm font-bold text-zinc-800 dark:text-slate-200">{user.name?.split(' ')[0]}</span>
                  </button>
                  
                  {/* 🔥 THE RESTORED LOGOUT BUTTON FOR DESKTOP */}
                  <button onClick={handleLogout} className="hidden md:flex p-2 rounded-full text-zinc-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors tap-effect" title="Logout">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all tap-effect shadow-md flex items-center gap-2">
                  <User className="w-4 h-4" /> Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE TOP BAR */}
      <header className="fixed top-0 w-full z-40 glass border-b border-zinc-200 dark:border-white/5 md:hidden h-16 flex items-center justify-between px-4 transition-colors duration-500">
        <div onClick={() => navigate('/')} className="flex items-center gap-2 tap-effect">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="text-lg font-black text-zinc-900 dark:text-white">PrepIQ</span>
        </div>
        
        <div className="flex items-center gap-2">
          {user && (
            <div className="relative" ref={mobileNotifRef}>
              <button onClick={() => setShowNotifMenu(!showNotifs)} className="relative p-2 rounded-full text-zinc-500 dark:text-slate-400 tap-effect">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border border-white dark:border-[#09090b] rounded-full"></span>}
              </button>
              {showNotifs && <NotificationDropdown />}
            </div>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-full bg-zinc-100 dark:bg-[#18181b] text-zinc-600 dark:text-slate-300 tap-effect">
             {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* NATIVE MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 w-full z-50 glass border-t border-zinc-200 dark:border-white/5 pb-safe pt-2 px-6 md:hidden flex justify-between items-center text-[10px] font-bold text-zinc-500 dark:text-slate-400 transition-colors duration-500">
        <button onClick={() => navigate('/')} className={`flex flex-col items-center gap-1 p-2 w-16 tap-effect transition-colors ${isActive('/') ? 'text-blue-600 dark:text-blue-400' : 'hover:text-zinc-900 dark:hover:text-slate-200'}`}>
          <Home className={`w-6 h-6 ${isActive('/') && 'fill-blue-600/20'}`} />
          <span>Home</span>
        </button>
        
        <button onClick={() => navigate('/practice')} className={`flex flex-col items-center gap-1 p-2 w-16 tap-effect transition-colors ${isActive('/practice') ? 'text-blue-600 dark:text-blue-400' : 'hover:text-zinc-900 dark:hover:text-slate-200'}`}>
          <BookOpen className={`w-6 h-6 ${isActive('/practice') && 'fill-blue-600/20'}`} />
          <span>Practice</span>
        </button>

        <button onClick={() => navigate('/subjects')} className={`flex flex-col items-center gap-1 p-2 w-16 tap-effect transition-colors ${isActive('/subjects') ? 'text-blue-600 dark:text-blue-400' : 'hover:text-zinc-900 dark:hover:text-slate-200'}`}>
          <LayoutGrid className={`w-6 h-6 ${isActive('/subjects') && 'fill-blue-600/20'}`} />
          <span>Subjects</span>
        </button>

        <button onClick={() => navigate('/profile')} className={`flex flex-col items-center gap-1 p-2 w-16 tap-effect transition-colors ${isActive('/profile') ? 'text-blue-600 dark:text-blue-400' : 'hover:text-zinc-900 dark:hover:text-slate-200'}`}>
          {user ? (
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] text-white ${isActive('/profile') ? 'bg-blue-600 border-blue-400 shadow-sm' : 'bg-zinc-400 dark:bg-slate-600 border-transparent'}`}>
              {user.name?.charAt(0)}
            </div>
          ) : (
            <User className={`w-6 h-6 ${isActive('/profile') && 'fill-blue-600/20'}`} />
          )}
          <span>Profile</span>
        </button>
      </nav>
    </>
  );
}