import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components import karein
import Navbar from './components/layout/Navbar';
import Home from './pages/Home'; 

// Dummy pages jab tak asli na ban jayein
const TestPage = () => <div className="pt-32 text-center text-3xl font-bold text-blue-400">📝 Test Library (Coming Soon)</div>;
const AboutPage = () => <div className="pt-32 text-center text-3xl font-bold text-purple-400">ℹ️ About Us (Coming Soon)</div>;

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans selection:bg-[#0d59f2] selection:text-white flex flex-col">
      
      {/* Global Navbar */}
      <Navbar />

      {/* Pages Container */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test/*" element={<TestPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>

    </div>
  );
}