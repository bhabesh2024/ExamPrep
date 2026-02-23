import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Timer, Target, Award, AlertCircle, FileText, CheckCircle2, TrendingUp, Lock } from 'lucide-react';

export default function MockStartScreen() {
  const { type, testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isFullMock = type === 'full';
  
  const formatTitle = (id) => {
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const testTitle = isFullMock ? formatTitle(testId) : `${formatTitle(testId)} Sectional Test`;
  const totalQs = isFullMock ? 150 : 50;
  
  const duration = isFullMock ? 180 : 60; 
  const cutOff = isFullMock ? "75%" : "80%"; 
  const totalMarks = isFullMock ? 150 : 50;

  // 🔒 PREMIUM LOCK LOGIC 🔒
  // Extract index from URL (e.g., adre-mock-3 -> index 3, maths-5 -> index 5)
  const testIndex = parseInt(testId.split('-').pop()) || 1; 
  
  // Full mock: test > 2 premium hai. Sectional mock: test > 4 premium hai.
  const isTestPremium = isFullMock ? testIndex > 2 : testIndex > 4;

  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  const isUserPremium = user?.isPremium === true;
  
  // Test locked tabhi hoga jab test premium ho aur user premium naa ho
  const isLocked = isTestPremium && !isUserPremium;

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans relative overflow-hidden pt-28 pb-20 selection:bg-blue-500/30 selection:text-white">
      
      <style>{`
        .mesh-gradient-bg {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.05), transparent 30%), 
                radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.05), transparent 30%);
        }
        .glass-panel {
            background: rgba(24, 27, 33, 0.6);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      <div className="mesh-gradient-bg"></div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Practice Zone
        </button>

        <div className="glass-panel rounded-[2rem] p-6 md:p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="border-b border-white/10 pb-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                <FileText className="w-3.5 h-3.5" /> {isFullMock ? 'Full Length Exam' : 'Sectional Exam'}
              </div>
              
              {/* Top Right Badge */}
              {isTestPremium ? (
                <span className="px-3 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> PRO TEST
                </span>
              ) : (
                <span className="px-3 py-1 rounded bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                  FREE TEST
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
              {testTitle}
            </h1>
            <p className="text-slate-400">Please read the instructions carefully before starting the test.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="bg-[#1e2128] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">Questions</p>
                <p className="text-lg font-bold text-white">{totalQs}</p>
              </div>
            </div>

            <div className="bg-[#1e2128] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">Duration</p>
                <p className="text-lg font-bold text-white">{duration} Mins</p>
              </div>
            </div>

            <div className="bg-[#1e2128] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">Max Marks</p>
                <p className="text-lg font-bold text-white">{totalMarks}</p>
              </div>
            </div>

            <div className="bg-[#1e2128] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-[20px] pointer-events-none"></div>
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 relative z-10">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">Target Cut-off</p>
                <p className="text-lg font-bold text-purple-400">{cutOff}+</p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-yellow-500" /> General Instructions:
            </h3>
            <ul className="space-y-4 text-slate-300 text-sm md:text-base">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>The clock will be set at the server. The countdown timer at the top right of screen will display the remaining time available for you to complete the examination.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>Each question carries <strong>1 Mark</strong>. There is a negative marking of <strong>0.25 Marks</strong> for each wrong answer.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <span><strong className="text-purple-400">Target Score:</strong> You need to score at least <strong>{cutOff}</strong> to clear the mock cut-off line.</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isLocked ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></span> 
              {isLocked ? 'Premium Test Locked' : 'Server connection stable'}
            </p>
            
            {/* 🔒 Dynamic Action Button 🔒 */}
            {isLocked ? (
               <button 
                 onClick={() => navigate('/pricing')}
                 className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-[#0a0a0a] font-black text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(234,179,8,0.5)] group cursor-pointer"
               >
                 <Lock className="w-5 h-5 fill-current" /> Unlock with Pro Plan
               </button>
            ) : (
               <button 
                 onClick={() => navigate(`/practice/run/${type}/${testId}`)}
                 className="w-full sm:w-auto px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] group cursor-pointer"
               >
                 Begin Test Now <Play className="w-5 h-5 fill-current transition-transform group-hover:translate-x-1" />
               </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}