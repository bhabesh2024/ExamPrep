import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const response = await axios.post(endpoint, formData);

      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSuccess('Logged in successfully!');
        setTimeout(() => navigate('/'), 1000); 
      } else {
        setSuccess('Account created! Please login.');
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '' });
          setSuccess('');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Server error occurred!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow px-4 relative mt-4">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Compact Premium Card */}
      <div className="max-w-[380px] w-full bg-[#111111]/95 backdrop-blur-xl border border-slate-800/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-6 md:p-8 relative z-10">
        
        {/* Header section (Compact) */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-400 mt-1.5 text-xs">
            {isLogin ? 'Enter your credentials to continue' : 'Sign up to track your prep journey'}
          </p>
        </div>

        {/* Minimalist Alerts */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg mb-4 text-xs text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-2 rounded-lg mb-4 text-xs text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {success}
          </div>
        )}

        {/* Tighter Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Full Name</label>
              <input 
                type="text" name="name" required={!isLogin}
                value={formData.name} onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#0a0a0a]/50 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-200 outline-none transition-all placeholder-slate-600 text-sm"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Email Address</label>
            <input 
              type="email" name="email" required
              value={formData.email} onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#0a0a0a]/50 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-200 outline-none transition-all placeholder-slate-600 text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 ml-1">
              <label className="block text-xs font-medium text-slate-400">Password</label>
              {isLogin && <a href="#" className="text-[10px] text-blue-500 hover:text-blue-400">Forgot?</a>}
            </div>
            <input 
              type="password" name="password" required
              value={formData.password} onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#0a0a0a]/50 border border-slate-700/50 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-200 outline-none transition-all placeholder-slate-600 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-2.5 rounded-lg shadow-sm transition-all active:scale-[0.98] mt-2 flex justify-center items-center h-[42px]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        {/* Sleek Toggle */}
        <div className="mt-6 text-center text-xs text-slate-500">
          {isLogin ? "New to PrepIQ? " : "Already registered? "}
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }} 
            className="text-blue-500 font-medium hover:text-blue-400 transition-colors"
          >
            {isLogin ? 'Create an account' : 'Sign in instead'}
          </button>
        </div>
      </div>
    </div>
  );
}