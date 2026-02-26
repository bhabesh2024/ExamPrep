import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Timer, Target, Award, AlertCircle, FileText, CheckCircle2, TrendingUp, Lock } from 'lucide-react';

export default function MockStartScreen() {
  const { type, testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const isFullMock = type === 'full';
  const formatTitle = (id) => id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const testTitle = isFullMock ? formatTitle(testId) : `${formatTitle(testId)} Sectional Test`;
  const totalQs = isFullMock ? 150 : 50;
  const duration = isFullMock ? 180 : 60; 
  const cutOff = isFullMock ? "75%" : "80%"; 
  const totalMarks = isFullMock ? 150 : 50;

  const testIndex = parseInt(testId.split('-').pop()) || 1; 
  const isTestPremium = isFullMock ? testIndex > 2 : testIndex > 4;

  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  const isUserPremium = user?.isPremium === true;
  const isLocked = isTestPremium && !isUserPremium;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-slate-200 font-sans relative overflow-hidden pt-28 pb-20 transition-colors duration-500">
      
      {/* Dynamic Ambient Backgrounds */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] transition-colors duration-500"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[100px] transition-colors duration-500"></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-8 cursor-pointer tap-effect w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Zone
        </button>

        <div className="glass-card rounded-[2rem] p-6 md:p-10 relative overflow-hidden shadow-xl border border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-[#121214]/80 transition-colors duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-500/5 rounded-full blur-[60px] pointer-events-none transition-colors duration-500"></div>

          <div className="border-b border-zinc-200 dark:border-white/10 pb-8 mb-8 transition-colors duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold transition-colors">
                <FileText className="w-3.5 h-3.5" /> {isFullMock ? 'Full Length Exam' : 'Sectional Exam'}
              </div>
              
              {isTestPremium ? (
                <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 text-xs font-bold border border-amber-200 dark:border-amber-500/20 flex items-center gap-1 transition-colors">
                  <Lock className="w-3 h-3" /> PRO TEST
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-500/20 transition-colors">
                  FREE TEST
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-2 transition-colors duration-500">
              {testTitle}
            </h1>
            <p className="text-zinc-500 dark:text-slate-400 font-medium">Please read the instructions carefully before starting the test.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {/* Stat Cards */}
            <div className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-colors duration-500 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400"><Target className="w-5 h-5" /></div>
              <div><p className="text-[10px] text-zinc-500 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Questions</p><p className="text-lg font-black text-zinc-900 dark:text-white">{totalQs}</p></div>
            </div>

            <div className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-colors duration-500 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400"><Timer className="w-5 h-5" /></div>
              <div><p className="text-[10px] text-zinc-500 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Duration</p><p className="text-lg font-black text-zinc-900 dark:text-white">{duration} Mins</p></div>
            </div>

            <div className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-colors duration-500 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><Award className="w-5 h-5" /></div>
              <div><p className="text-[10px] text-zinc-500 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Max Marks</p><p className="text-lg font-black text-zinc-900 dark:text-white">{totalMarks}</p></div>
            </div>

            <div className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-100 dark:border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2 relative overflow-hidden transition-colors duration-500 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 relative z-10"><TrendingUp className="w-5 h-5" /></div>
              <div className="relative z-10"><p className="text-[10px] text-zinc-500 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Target Cut-off</p><p className="text-lg font-black text-purple-600 dark:text-purple-400">{cutOff}+</p></div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-4 transition-colors duration-500">
              <AlertCircle className="w-5 h-5 text-amber-500" /> General Instructions:
            </h3>
            <ul className="space-y-4 text-zinc-600 dark:text-slate-300 text-sm md:text-base font-medium transition-colors duration-500">
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><span>The clock will be set at the server. The countdown timer at the top right of screen will display the remaining time available for you to complete the examination.</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><span>When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><span>Each question carries <strong>1 Mark</strong>. There is a negative marking of <strong>0.25 Marks</strong> for each wrong answer.</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" /><span><strong className="text-purple-600 dark:text-purple-400">Target Score:</strong> You need to score at least <strong>{cutOff}</strong> to clear the mock cut-off line.</span></li>
            </ul>
          </div>

          <div className="pt-8 border-t border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors duration-500">
            <p className="text-sm font-semibold text-zinc-500 dark:text-slate-400 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isLocked ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span> 
              {isLocked ? 'Premium Test Locked' : 'Server connection stable'}
            </p>
            
            {isLocked ? (
               <button onClick={() => navigate('/pricing')} className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl tap-effect">
                 <Lock className="w-5 h-5 fill-current" /> Unlock with Pro Plan
               </button>
            ) : (
               <button onClick={() => navigate(`/practice/run/${type}/${testId}`)} className="w-full sm:w-auto px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/30 tap-effect group">
                 Begin Test Now <Play className="w-5 h-5 fill-current transition-transform group-hover:translate-x-1" />
               </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}