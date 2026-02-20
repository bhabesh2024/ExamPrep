import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Timer, Target, Award, Play, ArrowRight, Brain, Calculator, BookOpen, Globe, FlaskConical, Terminal, Activity } from 'lucide-react';
import { subjectsData } from '../data/syllabusData';

// Icons Mapping
const IconMap = {
  Calculator, BookOpen, Globe, Brain, FlaskConical, Terminal, Activity
};

// Colors Mapping for Sectional Mocks
const ColorStyles = {
  blue: { text: "text-blue-400", bgLight: "bg-blue-500/10", borderLight: "border-blue-500/20", glow: "rgba(59,130,246,0.15)", gradient: "from-blue-500/20 to-transparent" },
  pink: { text: "text-pink-400", bgLight: "bg-pink-500/10", borderLight: "border-pink-500/20", glow: "rgba(236,72,153,0.15)", gradient: "from-pink-500/20 to-transparent" },
  emerald: { text: "text-emerald-400", bgLight: "bg-emerald-500/10", borderLight: "border-emerald-500/20", glow: "rgba(16,185,129,0.15)", gradient: "from-emerald-500/20 to-transparent" },
  orange: { text: "text-orange-400", bgLight: "bg-orange-500/10", borderLight: "border-orange-500/20", glow: "rgba(249,115,22,0.15)", gradient: "from-orange-500/20 to-transparent" },
  violet: { text: "text-violet-400", bgLight: "bg-violet-500/10", borderLight: "border-violet-500/20", glow: "rgba(139,92,246,0.15)", gradient: "from-violet-500/20 to-transparent" },
  sky: { text: "text-sky-400", bgLight: "bg-sky-500/10", borderLight: "border-sky-500/20", glow: "rgba(14,165,233,0.15)", gradient: "from-sky-500/20 to-transparent" },
  rose: { text: "text-rose-400", bgLight: "bg-rose-500/10", borderLight: "border-rose-500/20", glow: "rgba(244,63,94,0.15)", gradient: "from-rose-500/20 to-transparent" }
};

export default function PracticePage() {
  const navigate = useNavigate();
  const [showAllMocks, setShowAllMocks] = useState(false);

  // Generate All 50 Full Mocks
  const allFullMocks = Array.from({ length: 50 }, (_, i) => ({
    id: `adre-mock-${i + 1}`,
    title: `ADRE Full Mock Test ${i + 1}`,
    questions: 150,
    time: "180 Mins", // 👈 3 Hours update kar diya
    marks: 150,
    isPremium: i > 1
  }));

  const displayedMocks = showAllMocks ? allFullMocks : allFullMocks.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans relative overflow-hidden pt-28 pb-20 selection:bg-blue-500/30 selection:text-white">
      
      <style>{`
        .mesh-gradient-bg {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08), transparent 25%), 
                radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 25%);
        }
        .glass-card {
            background: rgba(24, 27, 33, 0.4);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
        }
        .glass-card:hover {
            background: rgba(24, 27, 33, 0.7);
            border-color: rgba(59, 130, 246, 0.3);
            transform: translateY(-4px);
            box-shadow: 0 10px 30px -10px rgba(59, 130, 246, 0.15);
        }
      `}</style>

      <div className="mesh-gradient-bg"></div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="mb-12 relative">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-[80px] -z-10"></div>
          
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
            <button onClick={() => navigate('/')} className="hover:text-blue-500 transition-colors">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-300">Practice Zone</span>
          </nav>

          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              Practice Zone
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
              Simulate the real exam environment. Attempt full-length mocks or target specific subjects with our sectional tests.
            </p>
          </div>
        </div>

        {/* SECTION 1: Full Length Mocks */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Full Length Mock Tests
            </h2>
            <button 
              onClick={() => setShowAllMocks(!showAllMocks)}
              className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {showAllMocks ? 'Show Less' : 'View All 50 Tests'} 
              <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${showAllMocks ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMocks.map((mock) => (
              <div key={mock.id} className="glass-card rounded-2xl p-6 relative group overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-blue-500/20 transition-colors"></div>
                
                {mock.isPremium && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-500 text-[10px] font-bold border border-yellow-500/20 tracking-wider">
                    PRO
                  </div>
                )}
                {!mock.isPremium && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20 tracking-wider">
                    FREE
                  </div>
                )}

                <h3 className="text-lg font-bold text-white mb-4 pr-12 group-hover:text-blue-400 transition-colors">{mock.title}</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Target className="w-4 h-4 text-slate-500" />
                    {mock.questions} Qs
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Timer className="w-4 h-4 text-slate-500" />
                    {mock.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                    <Award className="w-4 h-4 text-slate-500" />
                    {mock.marks} Marks
                  </div>
                </div>

                <div className="mt-auto">
                  <button 
                    onClick={() => navigate(`/practice/start/full/${mock.id}`)}
                    className="w-full py-3 rounded-xl bg-[#1e2128] border border-white/5 hover:border-blue-500/50 hover:bg-blue-600 text-white text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer"
                  >
                    Start Test <Play className="w-4 h-4 fill-current transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Subject-wise Sectional Mocks */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-white">Sectional Mocks</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjectsData.map((subject) => {
              const Icon = IconMap[subject.iconName] || BookOpen;
              const style = ColorStyles[subject.color] || ColorStyles.blue;

              return (
                <div 
                  key={subject.id}
                  onClick={() => navigate(`/practice/subject/${subject.id}`)}
                  className="glass-card rounded-xl p-5 cursor-pointer group flex items-center gap-4 hover:border-white/20"
                >
                  <div className={`w-12 h-12 rounded-lg ${style.bgLight} border ${style.borderLight} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${style.text}`} />
                  </div>
                  <div>
                    <h3 className="text-slate-200 font-bold group-hover:text-white transition-colors">{subject.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">20 Tests</p> {/* 👈 20 Tests update kar diya */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}