// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [key, setKey] = useState('');
  const navigate = useNavigate();
  const secretKey = import.meta.env.VITE_ADMIN_SECRET;

  const handleLogin = (e) => {
    e.preventDefault();
    if (key === secretKey) {
      // LocalStorage mein token save kar lo taaki baar baar login na karna pade
      localStorage.setItem('isAdminAuth', secretKey);
      navigate('/admin');
    } else {
      alert("Invalid Admin Key!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-[#161616] p-8 rounded-2xl border border-white/10 text-center">
        <h2 className="text-xl font-bold text-white mb-4">Restricted Access</h2>
        <input 
          type="password" 
          value={key} 
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter Admin Key"
          className="w-full p-3 bg-[#0a0a0a] border border-slate-700 rounded-xl text-white mb-4 outline-none focus:border-blue-500"
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors">
          Verify
        </button>
      </form>
    </div>
  );
}