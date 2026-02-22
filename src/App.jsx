import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Home from './pages/Home'; 
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import PracticePage from './pages/PracticePage';
import MockStartScreen from './pages/MockStartScreen'; 
import SectionalTestList from './pages/SectionalTestList';
import QuizPage from './pages/QuizPage';
import ChapterPracticePage from './pages/ChapterPracticePage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
// 👇 Yahan Admin Panel import karein 👇
import AdminPanel from './pages/AdminPanel'; 
import LeaderboardPage from './pages/LeaderboardPage';
import PricingPage from './pages/PricingPage';
export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans selection:bg-[#0d59f2] selection:text-white flex flex-col">
      <div className="flex-grow flex flex-col h-full">
        <Routes>
          {/* Main Layout routes with Navbar */}
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/practice" element={<><Navbar /><PracticePage /></>} />
          <Route path="/practice/start/:type/:testId" element={<><Navbar /><MockStartScreen /></>} />
          <Route path="/practice/subject/:subjectId" element={<><Navbar /><SectionalTestList /></>} />
          <Route path="/subjects" element={<><Navbar /><SubjectsPage /></>} />
          <Route path="/practice/:subjectId" element={<><Navbar /><SubjectDetailPage /></>} />
          <Route path="/about" element={<><Navbar /><AboutPage /></>} />
          <Route path="/login" element={<AuthPage />} />
          {/* Immersive Quiz/Practice Routes without Navbar */}
          <Route path="/practice/run/:type/:testId" element={<QuizPage />} />
          <Route path="/quiz/:subjectId/:topicId" element={<ChapterPracticePage />} />
          <Route path="/profile" element={<><Navbar /><ProfilePage /></>} />
          <Route path="/leaderboard" element={<><Navbar /><LeaderboardPage /></>} />
          {/* 👇 SECRET ADMIN ROUTE (No Navbar) 👇 */}
          <Route path="/pricing" element={<><Navbar /><PricingPage /></>} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </div>
  );
}