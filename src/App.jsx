import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Home from './pages/Home'; 
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import PracticePage from './pages/PracticePage';
import MockStartScreen from './pages/MockStartScreen'; // 👈 Import MockStartScreen
import SectionalTestList from './pages/SectionalTestList';

const AboutPage = () => <div className="pt-32 text-center text-3xl font-bold text-purple-400">ℹ️ About Us (Coming Soon)</div>;

// Dummy Quiz Page jab tak hum agla step na karein
const QuizPage = () => <div className="pt-32 text-center text-3xl font-bold text-green-400">📝 Actual Quiz Engine (Coming Next!)</div>;

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans selection:bg-[#0d59f2] selection:text-white flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<PracticePage />} />
          
          {/* 👇 Naye Routes 👇 */}
          <Route path="/practice/start/:type/:testId" element={<MockStartScreen />} />
          <Route path="/practice/run/:type/:testId" element={<QuizPage />} />
          <Route path="/practice/subject/:subjectId" element={<><Navbar /><SectionalTestList /></>} />
          
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/practice/:subjectId" element={<SubjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </div>
  );
}