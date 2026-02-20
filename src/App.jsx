import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Home from './pages/Home'; 
import SubjectsPage from './pages/SubjectsPage'; // 👈 Import new page

const AboutPage = () => <div className="pt-32 text-center text-3xl font-bold text-purple-400">ℹ️ About Us (Coming Soon)</div>;
const PracticePage = () => <div className="pt-32 text-center text-3xl font-bold text-green-400">📝 Quiz UI (Next Step)</div>;

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans selection:bg-[#0d59f2] selection:text-white flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice/*" element={<PracticePage />} />
          <Route path="/subjects" element={<SubjectsPage />} /> {/* 👈 Naya Route */}
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </div>
  );
}