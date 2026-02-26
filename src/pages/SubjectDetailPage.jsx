import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { subjectsData } from '../data/syllabusData';
import { 
  ChevronRight, ArrowLeft, ArrowRight, Play, CheckCircle, Calculator, 
  BookOpen, Globe, Brain, FlaskConical, Terminal, Activity, FileText 
} from 'lucide-react';

const IconMap = {
  Calculator, BookOpen, Globe, Brain, FlaskConical, Terminal, Activity
};

export default function SubjectDetailPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const subject = subjectsData.find(s => s.id.toLowerCase() === (subjectId || '').toLowerCase());

  // 🚀 User Progress & DB Question Counts State
  const [userProgress, setUserProgress] = useState({});
  const [dbQuestionCounts, setDbQuestionCounts] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);

    // 1. Fetch User Progress (Scores)
    const fetchUserProgress = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'undefined') return; 
      try {
        const userObj = JSON.parse(userStr);
        const res = await axios.get(`/api/results?userId=${userObj.id}`);
        if (res.data && res.data.length > 0) {
          const progressMap = {};
          res.data.forEach(result => {
            const percentage = Math.round((result.score / result.total) * 100) || 0;
            if (!progressMap[result.topic] || percentage > progressMap[result.topic]) {
              progressMap[result.topic] = Math.min(percentage, 100);
            }
          });
          setUserProgress(progressMap);
        }
      } catch (error) { 
        console.error("Failed to fetch user progress:", error); 
      }
    };

    // 2. Fetch Actual Question Counts from Database
    const fetchQuestionCounts = async () => {
      try {
        const res = await axios.get('/api/questions/counts');
        if (res.data) setDbQuestionCounts(res.data);
      } catch (error) { 
        console.error("Failed to fetch question counts:", error); 
      }
    };

    fetchUserProgress();
    fetchQuestionCounts(); 
  }, [subjectId]);

  if (!subject) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex flex-col items-center justify-center pt-20 transition-colors duration-500">
        <h1 className="text-4xl font-black mb-4 text-zinc-900 dark:text-white transition-colors">Subject Not Found</h1>
        <p className="text-zinc-500 dark:text-slate-400 font-medium mb-8 transition-colors">The module you are looking for doesn't exist.</p>
        <button onClick={() => navigate('/subjects')} className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition-all shadow-lg tap-effect">
          View All Subjects
        </button>
      </div>
    );
  }

  const SubjectIcon = IconMap[subject.iconName] || BookOpen;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-slate-200 font-sans relative overflow-hidden pt-28 pb-20 transition-colors duration-500">
      
      {/* 🌟 Dynamic Ambient Backgrounds */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] transition-colors duration-500"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[100px] transition-colors duration-500"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 dark:text-slate-500 mb-8 font-medium transition-colors">
          <button onClick={() => navigate('/')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors tap-effect">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => navigate('/subjects')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors tap-effect">Subjects</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-800 dark:text-slate-300 font-bold">{subject.title}</span>
        </nav>

        {/* HERO SECTION */}
        <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-8 md:p-12 mb-12 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start shadow-xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-500/10 rounded-full blur-[80px] pointer-events-none transition-colors"></div>
          
          <div className="w-24 h-24 shrink-0 rounded-2xl bg-zinc-50 dark:bg-slate-900/50 border border-zinc-200 dark:border-white/10 flex items-center justify-center shadow-md relative group transition-colors">
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <SubjectIcon className="w-12 h-12 text-blue-600 dark:text-blue-400 relative z-10" />
          </div>

          <div className="text-center md:text-left flex-1 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight transition-colors">
                {subject.title}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold w-max mx-auto md:mx-0 shadow-sm transition-colors">
                <CheckCircle className="w-3.5 h-3.5" /> Updated Syllabus
              </span>
            </div>
            <p className="text-sm md:text-base text-zinc-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-8 transition-colors">
              {subject.description} Explore the modules below, practice topic-wise questions, and track your progress in real-time.
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button onClick={() => navigate('/subjects')} className="px-6 py-3.5 rounded-xl bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-800 dark:text-slate-200 text-sm font-bold transition-all flex items-center gap-2 tap-effect shadow-sm">
                <ArrowLeft className="w-4 h-4" /> Back to Subjects
              </button>
              <button onClick={() => navigate(`/practice/subject/${subject.id}`)} className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black transition-all flex items-center gap-2 shadow-md hover:shadow-blue-500/30 tap-effect group">
                Start Mock Test <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORIES & MODULES */}
        <div className="space-y-12 relative z-10">
          {subject.categories.map((category, index) => (
            <section key={category.id}>
              
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-3 transition-colors">
                  <span className="w-8 h-8 rounded-lg bg-white dark:bg-[#27272a] flex items-center justify-center text-sm text-blue-600 dark:text-slate-300 font-black border border-zinc-200 dark:border-white/5 shadow-sm transition-colors">
                    {index + 1}
                  </span>
                  {category.title}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 dark:from-white/10 to-transparent transition-colors"></div>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {category.topics.map((topic) => {
                  
                  // DB count and Progress Logic
                  const questionCount = dbQuestionCounts[topic.id] || 0;
                  const progressValue = userProgress[topic.id] || 0;

                  return (
                    <div key={topic.id} className="glass-card rounded-2xl p-6 group flex flex-col h-full relative hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 tap-effect">
                      
                      {/* Pulse Badge for New Content */}
                      {questionCount > 0 && (
                        <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[9px] font-black bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shadow-sm animate-pulse uppercase tracking-widest transition-colors">
                          New Data
                        </div>
                      )}

                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors duration-300 shadow-sm">
                          <FileText className="w-5 h-5 text-zinc-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="pr-10">
                          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-slate-100 mb-1 leading-tight group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                            {topic.title}
                          </h3>
                          <p className={`text-xs flex items-center gap-1.5 font-bold transition-colors ${questionCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-slate-500'}`}>
                            {questionCount} Questions
                          </p>
                        </div>
                      </div>

                      {/* Progress & Action Button */}
                      <div className="mt-auto pt-5 border-t border-zinc-100 dark:border-white/5 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-zinc-500 dark:text-slate-400 uppercase tracking-widest transition-colors">Progress</span>
                          <span className={`text-[11px] font-black transition-colors ${progressValue === 100 ? 'text-emerald-600 dark:text-emerald-400' : progressValue > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-slate-500'}`}>
                            {progressValue}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 dark:bg-[#27272a] rounded-full overflow-hidden mb-5 relative transition-colors">
                          <div 
                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-inner ${progressValue === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-blue-600 to-blue-400'}`}
                            style={{ width: `${progressValue}%` }}
                          ></div>
                        </div>
                        
                        <button 
                          onClick={() => navigate(`/quiz/${subject.id}/${topic.id}`)}
                          className="w-full py-3 rounded-xl bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-600 hover:text-white text-zinc-700 dark:text-slate-300 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm"
                        >
                          {questionCount > 0 ? 'Practice Now' : 'Check Soon'} 
                          <ArrowRight className={`w-4 h-4 transition-transform group-hover/btn:translate-x-1 ${questionCount > 0 ? 'group-hover/btn:text-white' : ''}`} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </section>
          ))}
        </div>

      </main>
    </div>
  );
}