import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subjectsData } from '../data/syllabusData';
import { getQuestions } from '../data/questionsLoader'; // ✅ IMPORT ADDED
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [subjectId]);

  if (!subject) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white pt-20">
        <h1 className="text-4xl font-bold mb-4 text-slate-300">Subject Not Found</h1>
        <p className="text-slate-500 mb-8">The module you are looking for doesn't exist.</p>
        <button onClick={() => navigate('/subjects')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors">
          View All Subjects
        </button>
      </div>
    );
  }

  const SubjectIcon = IconMap[subject.iconName] || BookOpen;

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans relative overflow-hidden pt-28 pb-20 selection:bg-blue-500/30 selection:text-white">
      
      <style>{`
        .mesh-gradient-bg {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.05), transparent 30%), 
                radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.05), transparent 30%);
        }
        .topic-card {
            background: rgba(22, 22, 22, 0.6);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .topic-card:hover {
            background: rgba(28, 30, 38, 0.8);
            border-color: rgba(59, 130, 246, 0.3);
            transform: translateY(-3px);
            box-shadow: 0 10px 30px -10px rgba(59, 130, 246, 0.15);
        }
      `}</style>

      <div className="mesh-gradient-bg"></div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <button onClick={() => navigate('/')} className="hover:text-blue-500 transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => navigate('/subjects')} className="hover:text-blue-500 transition-colors">Subjects</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-300">{subject.title}</span>
        </nav>

        <div className="relative bg-[#161616]/80 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 md:p-12 mb-12 overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
          
          <div className="w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl relative group">
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <SubjectIcon className="w-12 h-12 text-blue-400 relative z-10" />
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                {subject.title}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold w-max mx-auto md:mx-0">
                <CheckCircle className="w-3.5 h-3.5" /> Updated Syllabus
              </span>
            </div>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-6">
              {subject.description} Explore the modules below, practice topic-wise questions, and track your progress in real-time.
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button onClick={() => navigate('/subjects')} className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-sm font-medium transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Subjects
              </button>
              <button onClick={() => navigate(`/sectional-tests/${subject.id}`)} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)] cursor-pointer">
                Start Mock Test <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {subject.categories.map((category, index) => (
            <section key={category.id} className="relative">
              
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#27272a] flex items-center justify-center text-sm text-slate-400 font-mono border border-white/5">
                    {index + 1}
                  </span>
                  {category.title}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {category.topics.map((topic) => {
                  
                  // 🔥 NAYA LOGIC: Yahan actual questions ki length count ho rahi hai
                  const actualQuestions = getQuestions(subject.id, topic.id);
                  const questionCount = actualQuestions.length;

                  return (
                    <div key={topic.id} className="topic-card rounded-2xl p-6 group flex flex-col h-full relative overflow-hidden">
                      
                      {/* 🔥 Agar questionCount 0 se jyada hai toh NEW blink karega */}
                      {questionCount > 0 && (
                        <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold bg-[#00d26a]/15 text-[#00d26a] border border-[#00d26a]/30 shadow-[0_0_10px_rgba(0,210,106,0.2)] animate-pulse uppercase tracking-widest">
                          New Data
                        </div>
                      )}

                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-colors">
                          <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div className="pr-8">
                          <h3 className="text-lg font-bold text-slate-100 mb-1 leading-tight group-hover:text-white transition-colors">
                            {topic.title}
                          </h3>
                          <p className={`text-xs flex items-center gap-1.5 font-medium ${questionCount > 0 ? 'text-[#00d26a]' : 'text-slate-500'}`}>
                            {questionCount} Questions Available
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Progress</span>
                          <span className="text-[11px] font-bold text-slate-500">0%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#27272a] rounded-full overflow-hidden mb-5">
                          <div className="h-full bg-blue-500 w-0 rounded-full"></div>
                        </div>
                        
                        <button 
                          onClick={() => navigate(`/quiz/${subject.id}/${topic.id}`)}
                          className="w-full py-2.5 rounded-xl bg-[#1e2128] border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/10 text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group/btn"
                        >
                          {questionCount > 0 ? 'Practice Now' : 'Check Soon'} <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
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