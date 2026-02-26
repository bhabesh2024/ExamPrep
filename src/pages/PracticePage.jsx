import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Timer, Target, Award, Play, ArrowRight, Brain, Calculator, BookOpen, Globe, FlaskConical, Terminal, Activity } from 'lucide-react';
import { subjectsData } from '../data/syllabusData';

const IconMap = { Calculator, BookOpen, Globe, Brain, FlaskConical, Terminal, Activity };

// 🎨 Updated Color Styles for Light + Dark Mode
const ColorStyles = {
  blue: { text: "text-blue-600 dark:text-blue-400", bgLight: "bg-blue-50 dark:bg-blue-500/10", borderLight: "border-blue-200 dark:border-blue-500/20" },
  pink: { text: "text-pink-600 dark:text-pink-400", bgLight: "bg-pink-50 dark:bg-pink-500/10", borderLight: "border-pink-200 dark:border-pink-500/20" },
  emerald: { text: "text-emerald-600 dark:text-emerald-400", bgLight: "bg-emerald-50 dark:bg-emerald-500/10", borderLight: "border-emerald-200 dark:border-emerald-500/20" },
  orange: { text: "text-orange-600 dark:text-orange-400", bgLight: "bg-orange-50 dark:bg-orange-500/10", borderLight: "border-orange-200 dark:border-orange-500/20" },
  violet: { text: "text-violet-600 dark:text-violet-400", bgLight: "bg-violet-50 dark:bg-violet-500/10", borderLight: "border-violet-200 dark:border-violet-500/20" },
  sky: { text: "text-sky-600 dark:text-sky-400", bgLight: "bg-sky-50 dark:bg-sky-500/10", borderLight: "border-sky-200 dark:border-sky-500/20" },
  rose: { text: "text-rose-600 dark:text-rose-400", bgLight: "bg-rose-50 dark:bg-rose-500/10", borderLight: "border-rose-200 dark:border-rose-500/20" }
};

export default function PracticePage() {
  const navigate = useNavigate();
  const [showAllMocks, setShowAllMocks] = useState(false);

  // Logic remains exactly the same
  const allFullMocks = Array.from({ length: 50 }, (_, i) => ({
    id: `adre-mock-${i + 1}`,
    title: `Full Mock Test ${i + 1}`,
    examType: 'ADRE, SSC & State Exams',
    questions: 150,
    time: "180 Mins", 
    marks: 150,
    isPremium: i > 1
  }));

  const displayedMocks = showAllMocks ? allFullMocks : allFullMocks.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-slate-200 font-sans relative overflow-hidden pt-28 pb-20 transition-colors duration-500">
      
      {/* 🌟 Dynamic Ambient Backgrounds */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] transition-colors duration-500"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[100px] transition-colors duration-500"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="mb-12 relative">
          <nav className="flex items-center gap-2 text-xs text-zinc-500 dark:text-slate-500 mb-6 font-medium">
            <button onClick={() => navigate('/')} className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors tap-effect">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-800 dark:text-slate-300">Practice Zone</span>
          </nav>

          <div>
            <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-4 drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-colors duration-500">
              Practice Zone
            </h1>
            <p className="text-lg text-zinc-600 dark:text-slate-400 max-w-2xl transition-colors duration-500">
              Simulate the real exam environment. Attempt full-length mocks or target specific subjects with our sectional tests.
            </p>
          </div>
        </div>

        {/* SECTION 1: Full Length Mocks */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 transition-colors duration-500">
              <Award className="w-6 h-6 text-yellow-500" />
              Full Length Mock Tests
            </h2>
            <button 
              onClick={() => setShowAllMocks(!showAllMocks)}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer tap-effect"
            >
              {showAllMocks ? 'Show Less' : 'View All 50 Tests'} 
              <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${showAllMocks ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedMocks.map((mock) => (
              <div key={mock.id} className="glass-card p-4 sm:p-6 relative group flex flex-col hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-100 dark:group-hover:bg-blue-500/10 transition-colors"></div>
                
                {mock.isPremium ? (
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 text-[10px] font-bold border border-yellow-200 dark:border-yellow-500/20 tracking-wider shadow-sm">
                    PRO
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-500/20 tracking-wider shadow-sm">
                    FREE
                  </div>
                )}

                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white mb-1 pr-12 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{mock.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-slate-500 mb-4 pr-12">{mock.examType}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-slate-400">
                    <Target className="w-4 h-4 text-zinc-400 dark:text-slate-500" /> {mock.questions} Qs
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-slate-400">
                    <Timer className="w-4 h-4 text-zinc-400 dark:text-slate-500" /> {mock.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-slate-400">
                    <Award className="w-4 h-4 text-zinc-400 dark:text-slate-500" /> {mock.marks} Marks
                  </div>
                </div>

                <div className="mt-auto relative z-10">
                  <button 
                    onClick={() => navigate('/practice/start/full/' + mock.id)}
                    className="w-full py-3 rounded-xl bg-zinc-100 dark:bg-[#1e2128] border border-zinc-200 dark:border-white/5 hover:border-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600 text-zinc-700 dark:text-white hover:text-white text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer tap-effect"
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
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors duration-500">Sectional Mocks</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjectsData.map((subject) => {
              const Icon = IconMap[subject.iconName] || BookOpen;
              const style = ColorStyles[subject.color] || ColorStyles.blue;

              return (
                <div 
                  key={subject.id}
                  onClick={() => navigate('/practice/subject/' + subject.id)}
                  className="glass-card p-5 cursor-pointer group flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 tap-effect"
                >
                  <div className={`w-12 h-12 rounded-xl ${style.bgLight} border ${style.borderLight} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${style.text}`} />
                  </div>
                  <div>
                    <h3 className="text-zinc-900 dark:text-slate-200 font-bold group-hover:text-blue-600 dark:group-hover:text-white transition-colors text-sm sm:text-base">{subject.title}</h3>
                    <p className="text-xs text-zinc-500 dark:text-slate-500 mt-0.5 font-medium">20 Tests Available</p>
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