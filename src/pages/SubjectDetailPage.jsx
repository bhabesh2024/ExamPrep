import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { subjectsData } from '../data/syllabusData';
import { 
  ChevronRight, ArrowLeft, ArrowRight, CheckCircle, Calculator, 
  BookOpen, Globe, Brain, FlaskConical, Terminal, Activity, FileText, Sparkles
} from 'lucide-react';

const IconMap = { Calculator, BookOpen, Globe, Brain, FlaskConical, Terminal, Activity };

export default function SubjectDetailPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const subject = subjectsData.find(s => s.id.toLowerCase() === (subjectId || '').toLowerCase());

  const [userProgress, setUserProgress] = useState({});
  const [dbQuestionCounts, setDbQuestionCounts] = useState({});
  
  // 🔥 SMART CURRENT AFFAIRS STATES
  const isCA = subjectId?.toLowerCase().includes('current-affairs') || subjectId?.toLowerCase() === 'ca';
  const caRegion = subjectId?.toLowerCase().includes('assam') ? 'Assam' : 'General';
  const [dynamicCACategories, setDynamicCACategories] = useState([]);
  const [isLoadingCA, setIsLoadingCA] = useState(isCA);

  useEffect(() => {
    window.scrollTo(0, 0);

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
      } catch (error) {}
    };

    const fetchQuestionCounts = async () => {
      if (isCA) return; 
      try {
        const res = await axios.get('/api/questions/counts');
        if (res.data) setDbQuestionCounts(res.data);
      } catch (error) {}
    };

    // 🔥 FETCH SMART CURRENT AFFAIRS DATA
    const fetchCAData = async () => {
      if (!isCA) return;
      try {
        const res = await axios.get(`/api/ca/hub/${caRegion}`);
        const data = res.data;
        const autoCategories = [];

        if (data.daily?.length > 0) {
          autoCategories.push({ id: 'ca-daily', title: 'Daily Current Affairs', topics: data.daily });
        }
        if (data.weekly?.length > 0) {
          autoCategories.push({ id: 'ca-weekly', title: 'Weekly Mega Tests', topics: data.weekly });
        }
        if (data.monthly?.length > 0) {
          autoCategories.push({ id: 'ca-monthly', title: 'Monthly Revisions', topics: data.monthly });
        }
        if (data.topics?.length > 0) {
          autoCategories.push({ id: 'ca-topics', title: 'Topic-wise Current Affairs', topics: data.topics });
        }
        setDynamicCACategories(autoCategories);
      } catch (error) {
        console.error("Failed to load CA Hub");
      } finally {
        setIsLoadingCA(false);
      }
    };

    fetchUserProgress();
    fetchQuestionCounts(); 
    fetchCAData();
  }, [subjectId, isCA, caRegion]);

  if (!subject) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex flex-col items-center justify-center pt-20 transition-colors duration-500">
        <h1 className="text-4xl font-black mb-4 text-zinc-900 dark:text-white">Subject Not Found</h1>
        <button onClick={() => navigate('/subjects')} className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition-all shadow-lg tap-effect">View All Subjects</button>
      </div>
    );
  }

  const SubjectIcon = IconMap[subject.iconName] || BookOpen;
  
  // 🔥 COMPLETE REPLACEMENT LOGIC FOR CA
  const categoriesToRender = isCA ? dynamicCACategories : (subject.categories || []);

  const handlePracticeClick = (topicObj) => {
    if (isCA) {
      // Pass all metadata to the URL for the practice engine
      let url = `/quiz/${subject.id}/${topicObj.id}?isCA=true&caType=${topicObj.caType}&caValue=${topicObj.caValue}&caRegion=${caRegion}`;
      if (topicObj.caTopic) url += `&caTopic=${encodeURIComponent(topicObj.caTopic)}`;
      navigate(url);
    } else {
      navigate(`/quiz/${subject.id}/${topicObj.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-slate-200 font-sans relative overflow-hidden pt-28 pb-20 transition-colors duration-500">
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] transition-colors duration-500"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[100px] transition-colors duration-500"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <nav className="flex items-center gap-2 text-xs text-zinc-500 dark:text-slate-500 mb-8 font-medium transition-colors">
          <button onClick={() => navigate('/')} className="hover:text-blue-600 dark:hover:text-blue-400 tap-effect">Home</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => navigate('/subjects')} className="hover:text-blue-600 dark:hover:text-blue-400 tap-effect">Subjects</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-800 dark:text-slate-300 font-bold">{subject.title}</span>
        </nav>

        {/* HERO SECTION */}
        <div className={`bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-8 md:p-12 mb-12 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start shadow-xl transition-all duration-500 ${isCA ? 'ring-1 ring-amber-500/30' : ''}`}>
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none transition-colors ${isCA ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}></div>
          
          <div className="w-24 h-24 shrink-0 rounded-2xl bg-zinc-50 dark:bg-slate-900/50 border border-zinc-200 dark:border-white/10 flex items-center justify-center shadow-md relative group transition-colors">
            <SubjectIcon className={`w-12 h-12 relative z-10 ${isCA ? 'text-amber-500' : 'text-blue-600 dark:text-blue-400'}`} />
          </div>

          <div className="text-center md:text-left flex-1 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
                {subject.title}
              </h1>
              {isCA ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-500 text-xs font-bold w-max mx-auto md:mx-0 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" /> Auto-Updating Feed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold w-max mx-auto md:mx-0 shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5" /> Updated Syllabus
                </span>
              )}
            </div>
            <p className="text-sm md:text-base text-zinc-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
              {isCA ? "Tests are automatically generated and merged (Daily to Weekly to Monthly) based on admin community posts." : subject.description}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button onClick={() => navigate('/subjects')} className="px-6 py-3.5 rounded-xl bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-800 dark:text-slate-200 text-sm font-bold transition-all flex items-center gap-2 tap-effect shadow-sm">
                <ArrowLeft className="w-4 h-4" /> Back to Subjects
              </button>
            </div>
          </div>
        </div>

        {/* LOADING SHIMMER */}
        {isLoadingCA && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-zinc-500 dark:text-slate-400 animate-pulse">Syncing latest Current Affairs...</p>
          </div>
        )}

        {/* CATEGORIES RENDER */}
        {!isLoadingCA && (
          <div className="space-y-12 relative z-10">
            {categoriesToRender?.length === 0 && isCA && (
               <div className="text-center py-10 bg-white dark:bg-[#121214] rounded-[2rem] border border-zinc-200 dark:border-white/5">
                 <Globe className="w-12 h-12 text-zinc-300 dark:text-slate-700 mx-auto mb-3" />
                 <h3 className="font-black text-zinc-900 dark:text-white">No Current Affairs yet!</h3>
                 <p className="text-zinc-500 text-sm mt-1">Admin needs to post CA in the community feed first.</p>
               </div>
            )}

            {categoriesToRender?.map((category, index) => (
              <section key={category.id}>
                
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black border border-zinc-200 dark:border-white/5 shadow-sm ${isCA ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600' : 'bg-white dark:bg-[#27272a] text-blue-600 dark:text-slate-300'}`}>
                      {index + 1}
                    </span>
                    {category.title}
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 dark:from-white/10 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {category.topics.map((topic) => {
                    const questionCount = isCA ? "Available" : (dbQuestionCounts[topic.id] || 0);
                    const progressValue = userProgress[topic.id] || 0;
                    const canPractice = isCA || questionCount > 0;

                    return (
                      <div key={topic.id} className="glass-card rounded-2xl p-6 group flex flex-col h-full relative hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 tap-effect">
                        
                        {canPractice && (
                          <div className={`absolute top-4 right-4 px-2 py-0.5 rounded text-[9px] font-black shadow-sm uppercase tracking-widest ${isCA ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-500/20 animate-pulse'}`}>
                            {isCA ? 'Live Test' : 'New Data'}
                          </div>
                        )}

                        <div className="flex items-start gap-4 mb-5">
                          <div className={`w-10 h-10 rounded-xl border border-zinc-200 dark:border-white/5 flex items-center justify-center shrink-0 transition-colors duration-300 shadow-sm ${isCA ? 'bg-amber-50 dark:bg-[#18181b] group-hover:bg-amber-500/10' : 'bg-zinc-50 dark:bg-[#18181b] group-hover:bg-blue-500/10'}`}>
                            <FileText className={`w-5 h-5 transition-colors ${isCA ? 'text-amber-500' : 'text-zinc-400 dark:text-slate-500 group-hover:text-blue-500'}`} />
                          </div>
                          <div className="pr-10">
                            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-slate-100 mb-1 leading-tight">
                              {topic.title}
                            </h3>
                            <p className={`text-[11px] flex items-center gap-1.5 font-bold ${canPractice ? (isCA ? 'text-amber-600' : 'text-emerald-600 dark:text-emerald-400') : 'text-zinc-400 dark:text-slate-500'}`}>
                              {isCA ? 'Auto-Merged Test' : `${questionCount} Questions`}
                            </p>
                          </div>
                        </div>

                        <div className="mt-auto pt-5 border-t border-zinc-100 dark:border-white/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-zinc-500 dark:text-slate-400 uppercase tracking-widest">Progress</span>
                            <span className={`text-[11px] font-black ${progressValue === 100 ? 'text-emerald-600 dark:text-emerald-400' : progressValue > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-slate-500'}`}>
                              {progressValue}%
                            </span>
                          </div>
                          <div className="h-2 w-full bg-zinc-100 dark:bg-[#27272a] rounded-full overflow-hidden mb-5 relative">
                            <div 
                              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-inner ${progressValue === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : isCA ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-blue-600 to-blue-400'}`}
                              style={{ width: `${progressValue}%` }}
                            ></div>
                          </div>
                          
                          <button 
                            onClick={() => handlePracticeClick(topic)}
                            className={`w-full py-3 rounded-xl border font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm ${
                              canPractice 
                                ? (isCA ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 hover:bg-amber-500 text-amber-700 dark:text-amber-400 hover:text-white' : 'bg-zinc-50 dark:bg-[#18181b] border-zinc-200 dark:border-white/5 hover:border-blue-500 hover:bg-blue-600 text-zinc-700 dark:text-slate-300 hover:text-white')
                                : 'bg-zinc-100 dark:bg-zinc-900 border-transparent text-zinc-400 cursor-not-allowed'
                            }`}
                          >
                            {canPractice ? 'Practice Now' : 'Check Soon'} 
                            {canPractice && <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />}
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </section>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}