import React from 'react';
import { useNavigate } from 'react-router-dom';
// 👇 Data file ko import kiya
import { subjectsData } from '../data/syllabusData'; 
import { ChevronRight, ArrowRight, Brain, Calculator, BookOpen, Globe, FlaskConical, Terminal, Activity } from 'lucide-react';

// Icons ko dynamically map karne ke liye
const IconMap = {
  Calculator, BookOpen, Globe, Brain, FlaskConical, Terminal, Activity
};

// Har subject ke alag colors set karne ke liye
const ColorStyles = {
  blue: { text: "text-blue-400", bgLight: "bg-blue-500/10", borderLight: "border-blue-500/20", glow: "rgba(59,130,246,0.15)", btn: "bg-blue-600 hover:bg-blue-500", shadow: "rgba(59,130,246,0.4)", gradient: "from-blue-900 to-blue-500" },
  pink: { text: "text-pink-400", bgLight: "bg-pink-500/10", borderLight: "border-pink-500/20", glow: "rgba(236,72,153,0.15)", btn: "bg-pink-600 hover:bg-pink-500", shadow: "rgba(236,72,153,0.4)", gradient: "from-pink-900 to-pink-500" },
  emerald: { text: "text-emerald-400", bgLight: "bg-emerald-500/10", borderLight: "border-emerald-500/20", glow: "rgba(16,185,129,0.15)", btn: "bg-emerald-600 hover:bg-emerald-500", shadow: "rgba(16,185,129,0.4)", gradient: "from-emerald-900 to-emerald-500" },
  orange: { text: "text-orange-400", bgLight: "bg-orange-500/10", borderLight: "border-orange-500/20", glow: "rgba(249,115,22,0.15)", btn: "bg-orange-600 hover:bg-orange-500", shadow: "rgba(249,115,22,0.4)", gradient: "from-orange-900 to-orange-500" },
  violet: { text: "text-violet-400", bgLight: "bg-violet-500/10", borderLight: "border-violet-500/20", glow: "rgba(139,92,246,0.15)", btn: "bg-violet-600 hover:bg-violet-500", shadow: "rgba(139,92,246,0.4)", gradient: "from-violet-900 to-violet-500" },
  sky: { text: "text-sky-400", bgLight: "bg-sky-500/10", borderLight: "border-sky-500/20", glow: "rgba(14,165,233,0.15)", btn: "bg-sky-600 hover:bg-sky-500", shadow: "rgba(14,165,233,0.4)", gradient: "from-sky-900 to-sky-500" },
  rose: { text: "text-rose-400", bgLight: "bg-rose-500/10", borderLight: "border-rose-500/20", glow: "rgba(244,63,94,0.15)", btn: "bg-rose-600 hover:bg-rose-500", shadow: "rgba(244,63,94,0.4)", gradient: "from-rose-900 to-rose-500" }
};

export default function SubjectsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans relative overflow-hidden pt-28 pb-20 selection:bg-blue-500/30 selection:text-white">
      
      {/* Background and Custom Styles */}
      <style>{`
        .mesh-gradient-bg {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08), transparent 25%), 
                radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 25%);
        }
        .glass-card-subject {
            background: rgba(24, 27, 33, 0.4);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
        }
        .neon-text-glow {
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
        }
      `}</style>

      <div className="mesh-gradient-bg"></div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header Section */}
        <div className="mb-10 relative">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-[80px] -z-10"></div>
          
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
            <button onClick={() => navigate('/')} className="hover:text-blue-500 transition-colors">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-300">Syllabus Library</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2 neon-text-glow">
                Choose a Subject
              </h1>
              <p className="text-slate-400 max-w-2xl">Select a module to continue your progress or start a new learning path.</p>
            </div>
            
            {/* Filter Buttons */}
            <div className="inline-flex bg-[#181b21]/50 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
              <button className="px-4 py-1.5 rounded-lg bg-blue-500/20 text-blue-500 text-sm font-medium border border-blue-500/20 shadow-sm">All</button>
              <button className="px-4 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">Core</button>
              <button className="px-4 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">GK & CA</button>
            </div>
          </div>
        </div>

        {/* 👇 DYNAMIC SUBJECTS GRID 👇 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {subjectsData.map((subject) => {
            const Icon = IconMap[subject.iconName] || BookOpen;
            const style = ColorStyles[subject.color] || ColorStyles.blue;
            
            return (
              <div 
                key={subject.id} 
                className="glass-card-subject rounded-2xl overflow-hidden group flex flex-col h-full relative"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = style.shadow.replace('0.4', '0.4');
                  e.currentTarget.style.boxShadow = `0 0 20px -5px ${style.glow}`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* 👇 UPDATE: Card Top Image/Gradient Area with Unsplash Image 👇 */}
                <div className="h-40 relative overflow-hidden bg-slate-900">
                  {/* Bottom Dark Fading Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181b21] via-[#181b21]/60 to-transparent z-10"></div>
                  
                  {/* Asli Unsplash Image */}
                  <img 
                    src={subject.imageUrl} 
                    alt={subject.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-70"
                  />
                  
                  {/* Color Tint Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} mix-blend-overlay opacity-60 transition-opacity duration-700 group-hover:opacity-90`}></div>
                  
                  {/* Subject Icon (Center) */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-110">
                      <Icon className="w-14 h-14 opacity-40 text-white drop-shadow-2xl" />
                  </div>

                  {/* Module Count Badge */}
                  <div className="absolute top-3 right-3 z-20">
                    <span className={`px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold ${style.text}`}>
                      {subject.categories.length} Modules
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="pr-2">
                      <h3 className={`text-xl font-bold text-white transition-colors mb-1 group-hover:${style.text}`}>
                        {subject.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1">{subject.description}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${style.bgLight} flex items-center justify-center ${style.text} border ${style.borderLight} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Card Footer / Progress */}
                  <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="text-slate-400">Progress</span>
                        <span className={style.text}>0%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#27272a] w-full rounded-full"></div>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/practice/${subject.id}`)}
                      className={`w-full py-2.5 rounded-lg text-white font-medium flex items-center justify-center gap-2 text-sm cursor-pointer transition-all duration-300 ${style.btn}`}
                      onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 15px -3px ${style.shadow}`}
                      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                      View Syllabus <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
        </div>
      </main>

      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="relative group w-14 h-14 rounded-full bg-gradient-to-br from-[#3b82f6] to-blue-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-110 transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer border-none">
          <Brain className="w-7 h-7 z-10" />
          <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
    </div>
  );
}