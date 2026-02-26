import React from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectsData } from '../data/syllabusData'; 
import { ChevronRight, ArrowRight, Brain, Calculator, BookOpen, Globe, FlaskConical, Terminal, Activity } from 'lucide-react';

const IconMap = { Calculator, BookOpen, Globe, Brain, FlaskConical, Terminal, Activity };

// 🎨 Clean Tailwind classes for Dynamic Colors (Light/Dark Supported)
const ColorStyles = {
  blue: { text: "text-blue-600 dark:text-blue-400", bgLight: "bg-blue-50 dark:bg-blue-500/10", borderLight: "border-blue-200 dark:border-blue-500/20", btn: "bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500", shadowColor: "group-hover:shadow-blue-500/30", gradient: "from-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-500" },
  pink: { text: "text-pink-600 dark:text-pink-400", bgLight: "bg-pink-50 dark:bg-pink-500/10", borderLight: "border-pink-200 dark:border-pink-500/20", btn: "bg-pink-600 hover:bg-pink-700 dark:hover:bg-pink-500", shadowColor: "group-hover:shadow-pink-500/30", gradient: "from-pink-600 to-pink-400 dark:from-pink-900 dark:to-pink-500" },
  emerald: { text: "text-emerald-600 dark:text-emerald-400", bgLight: "bg-emerald-50 dark:bg-emerald-500/10", borderLight: "border-emerald-200 dark:border-emerald-500/20", btn: "bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500", shadowColor: "group-hover:shadow-emerald-500/30", gradient: "from-emerald-600 to-emerald-400 dark:from-emerald-900 dark:to-emerald-500" },
  orange: { text: "text-orange-600 dark:text-orange-400", bgLight: "bg-orange-50 dark:bg-orange-500/10", borderLight: "border-orange-200 dark:border-orange-500/20", btn: "bg-orange-600 hover:bg-orange-700 dark:hover:bg-orange-500", shadowColor: "group-hover:shadow-orange-500/30", gradient: "from-orange-600 to-orange-400 dark:from-orange-900 dark:to-orange-500" },
  violet: { text: "text-violet-600 dark:text-violet-400", bgLight: "bg-violet-50 dark:bg-violet-500/10", borderLight: "border-violet-200 dark:border-violet-500/20", btn: "bg-violet-600 hover:bg-violet-700 dark:hover:bg-violet-500", shadowColor: "group-hover:shadow-violet-500/30", gradient: "from-violet-600 to-violet-400 dark:from-violet-900 dark:to-violet-500" },
  sky: { text: "text-sky-600 dark:text-sky-400", bgLight: "bg-sky-50 dark:bg-sky-500/10", borderLight: "border-sky-200 dark:border-sky-500/20", btn: "bg-sky-600 hover:bg-sky-700 dark:hover:bg-sky-500", shadowColor: "group-hover:shadow-sky-500/30", gradient: "from-sky-600 to-sky-400 dark:from-sky-900 dark:to-sky-500" },
  rose: { text: "text-rose-600 dark:text-rose-400", bgLight: "bg-rose-50 dark:bg-rose-500/10", borderLight: "border-rose-200 dark:border-rose-500/20", btn: "bg-rose-600 hover:bg-rose-700 dark:hover:bg-rose-500", shadowColor: "group-hover:shadow-rose-500/30", gradient: "from-rose-600 to-rose-400 dark:from-rose-900 dark:to-rose-500" }
};

export default function SubjectsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-slate-200 font-sans relative overflow-hidden pt-28 pb-20 transition-colors duration-500">
      
      {/* Dynamic Ambient Backgrounds */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] transition-colors duration-500"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[100px] transition-colors duration-500"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header Section */}
        <div className="mb-10 relative">
          <nav className="flex items-center gap-2 text-xs text-zinc-500 dark:text-slate-500 mb-6 font-medium">
            <button onClick={() => navigate('/')} className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors tap-effect">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-800 dark:text-slate-300">Syllabus Library</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-2 drop-shadow-sm transition-colors duration-500">
                Choose a Subject
              </h1>
              <p className="text-zinc-600 dark:text-slate-400 max-w-2xl text-sm sm:text-base transition-colors duration-500">
                Select a module to continue your progress or start a new learning path.
              </p>
            </div>
            
            {/* Filter Buttons */}
            <div className="inline-flex bg-zinc-100 dark:bg-[#181b21]/50 p-1.5 rounded-xl border border-zinc-200 dark:border-white/5 shadow-sm">
              <button className="px-4 py-1.5 rounded-lg bg-white dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-bold border border-zinc-200 dark:border-blue-500/20 shadow-sm transition-colors">All</button>
              <button className="px-4 py-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-semibold transition-colors tap-effect">Core</button>
              <button className="px-4 py-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-semibold transition-colors tap-effect">GK & CA</button>
            </div>
          </div>
        </div>

        {/* 🌟 DYNAMIC SUBJECTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {subjectsData.map((subject) => {
            const Icon = IconMap[subject.iconName] || BookOpen;
            const style = ColorStyles[subject.color] || ColorStyles.blue;
            
            return (
              <div 
                key={subject.id} 
                // Group use kiya hai taaki hover effcts CSS se control ho, Javascript inline styles hata diye
                className={`glass-card rounded-2xl overflow-hidden group flex flex-col h-full relative transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${style.shadowColor}`}
              >
                {/* Header Image/Gradient Area */}
                <div className="h-40 relative overflow-hidden bg-zinc-200 dark:bg-slate-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#181b21] via-white/80 dark:via-[#181b21]/60 to-transparent z-10 transition-colors duration-500"></div>
                  
                  <img 
                    src={subject.imageUrl} 
                    alt={subject.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-50 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-50 dark:group-hover:opacity-70"
                  />
                  
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} mix-blend-multiply dark:mix-blend-overlay opacity-40 dark:opacity-60 transition-opacity duration-700 group-hover:opacity-70 dark:group-hover:opacity-90`}></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-110">
                      <Icon className="w-14 h-14 opacity-50 dark:opacity-40 text-zinc-900 dark:text-white drop-shadow-xl" />
                  </div>

                  <div className="absolute top-3 right-3 z-20">
                    <span className={`px-2.5 py-1 rounded-md bg-white/80 dark:bg-black/60 backdrop-blur-md border border-zinc-200 dark:border-white/10 text-[10px] font-bold tracking-wide uppercase ${style.text} shadow-sm`}>
                      {subject.categories.length} Modules
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-grow relative z-20 bg-white dark:bg-transparent transition-colors duration-500">
                  <div className="flex items-start justify-between mb-3">
                    <div className="pr-2">
                      <h3 className={`text-xl font-bold text-zinc-900 dark:text-white transition-colors mb-1 ${style.text.split(' ')[0]} dark:${style.text.split(' ')[1]}`}>
                        {subject.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed">{subject.description}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${style.bgLight} flex items-center justify-center ${style.text} border ${style.borderLight} shrink-0 transition-colors duration-500`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Card Footer / Progress */}
                  <div className="mt-auto space-y-4 pt-4 border-t border-zinc-100 dark:border-white/5 transition-colors duration-500">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-zinc-500 dark:text-slate-400">Progress</span>
                        <span className={style.text}>0%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-300 dark:bg-[#27272a] w-full rounded-full"></div>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/practice/${subject.id}`)}
                      className={`w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 text-sm cursor-pointer transition-all duration-300 shadow-md tap-effect ${style.btn}`}
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
    </div>
  );
}