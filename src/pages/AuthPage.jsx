import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// 🔥 GraduationCap Icon wapas aa gaya!
import { GraduationCap, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && !formData.agreeTerms) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const res = await axios.post(endpoint, payload);
      
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/subjects'); 
      } else {
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '', agreeTerms: false });
        alert("Account created successfully! Please log in.");
      }
    } catch (err) {
      setError(err.response?.data?.error || 'error occurd please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans flex relative overflow-hidden selection:bg-blue-500/30">
      
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-10 relative z-10 border-r border-white/5 bg-[#121217]/50 backdrop-blur-sm">
        <div>
          
          {/* 🔥 LOGO SECTION (DESKTOP) 🔥 */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-[#258cf4] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">PrepIQ</span>
          </div>

          <div className="mt-20">
            <h1 className="text-5xl font-black text-white mb-5 leading-[1.1]">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#258cf4]">
                Future Exams.
              </span>
            </h1>
            <p className="text-slate-400 text-base max-w-sm leading-relaxed">
              Join thousands of students cracking the toughest competitive exams with our AI-powered platform.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>© 2026 PrepIQ Inc.</span>
          <a href="/privacy" className="hover:text-[#258cf4] transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-[#258cf4] transition-colors">Terms</a>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10 bg-[#0a0a0a]">
        
        {/* 🔥 LOGO SECTION (MOBILE) 🔥 */}
        <div className="lg:hidden flex items-center gap-2 mb-8" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-[#258cf4] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">PrepIQ</span>
        </div>

        {/* COMPACT CARD */}
        <div className="w-full max-w-[380px] bg-[#16202a]/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-1">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-xs text-slate-400">
              {isLogin ? 'Enter your details to access your account' : 'Start your preparation journey today'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-3.5 h-3.5 text-slate-500 group-focus-within:text-[#258cf4] transition-colors" />
                  </div>
                  <input 
                    type="text" name="name" required={!isLogin}
                    value={formData.name} onChange={handleChange}
                    placeholder="Your name"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#101922] border border-slate-700 rounded-xl text-sm text-white focus:ring-1 focus:ring-[#258cf4] focus:border-[#258cf4] outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-3.5 h-3.5 text-slate-500 group-focus-within:text-[#258cf4] transition-colors" />
                </div>
                <input 
                  type="email" name="email" required
                  value={formData.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#101922] border border-slate-700 rounded-xl text-sm text-white focus:ring-1 focus:ring-[#258cf4] focus:border-[#258cf4] outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                {isLogin && <a href="#" className="text-[11px] text-[#258cf4] hover:text-blue-400 font-medium">Forgot?</a>}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-3.5 h-3.5 text-slate-500 group-focus-within:text-[#258cf4] transition-colors" />
                </div>
                <input 
                  type="password" name="password" required
                  value={formData.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#101922] border border-slate-700 rounded-xl text-sm text-white focus:ring-1 focus:ring-[#258cf4] focus:border-[#258cf4] outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start gap-2 pt-1 px-1">
                <div className="flex items-center h-4">
                  <input 
                    type="checkbox" id="terms" name="agreeTerms"
                    checked={formData.agreeTerms} onChange={handleChange}
                    className="w-3.5 h-3.5 border border-slate-600 rounded bg-[#101922] text-[#258cf4] focus:ring-[#258cf4] focus:ring-offset-0 cursor-pointer"
                  />
                </div>
                <label htmlFor="terms" className="text-[11px] text-slate-400 leading-tight">
                  I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#258cf4] hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#258cf4] hover:underline">Privacy Policy</a>.
                </label>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-5 w-full bg-[#258cf4] hover:bg-blue-500 text-white font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 group transition-all shadow-[0_0_15px_rgba(37,140,244,0.3)] hover:shadow-[0_0_25px_rgba(37,140,244,0.5)] border border-blue-400/50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink-0 mx-3 text-[10px] text-slate-500 uppercase font-medium">Or continue with</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button type="button" className="flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-700 bg-[#101922] hover:bg-slate-800 text-slate-300 transition-colors text-xs font-medium cursor-pointer">
                <span className="bg-white rounded-full p-[1px] flex items-center justify-center">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-3 h-3" />
                </span>
                Google
              </button>
              
              {/* MICROSOFT BUTTON */}
              <button type="button" className="flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-700 bg-[#101922] hover:bg-slate-800 text-slate-300 transition-colors text-xs font-medium cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
                Microsoft
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); setFormData({name:'', email:'', password:'', agreeTerms: false}); }}
              className="text-[#258cf4] hover:text-blue-400 font-bold ml-1 hover:underline transition-all cursor-pointer"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}