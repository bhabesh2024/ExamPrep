import React from 'react';
import { ArrowLeft, FileQuestion, Calculator, FlaskConical, Brain, Globe, FileText } from 'lucide-react';

export default function PerformanceView({ results, totalTests, totalQuestionsAttempted, overallAccuracy, avgScorePercentage, setActiveView, handleReview }) {
  const getSubjectIcon = (subject) => {
    const s = subject.toLowerCase();
    if (s.includes('math')) return { icon: <Calculator className="w-5 h-5" />, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/20' };
    if (s.includes('sci')) return { icon: <FlaskConical className="w-5 h-5" />, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/20' };
    if (s.includes('reasoning')) return { icon: <Brain className="w-5 h-5" />, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-500/20' };
    if (s.includes('gk')) return { icon: <Globe className="w-5 h-5" />, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/20' };
    return { icon: <FileText className="w-5 h-5" />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/20' };
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-slide-in">
      <div className="flex items-center gap-3 px-2 pt-2 mb-2">
        <button onClick={() => setActiveView('hub')} className="p-2 -ml-2 rounded-full hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-600 dark:text-slate-300 transition-colors tap-effect">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Performance Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 shadow-sm">
          <p className="text-zinc-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Tests</p>
          <p className="text-3xl font-black text-zinc-900 dark:text-white">{totalTests}</p>
        </div>
        <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 shadow-sm">
          <p className="text-zinc-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Questions Solved</p>
          <p className="text-3xl font-black text-zinc-900 dark:text-white">{totalQuestionsAttempted}</p>
        </div>
        <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 shadow-sm">
          <p className="text-zinc-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Accuracy</p>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{overallAccuracy}%</p>
        </div>
        <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 shadow-sm">
          <p className="text-zinc-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Avg Score</p>
          <p className="text-3xl font-black text-zinc-900 dark:text-white">{avgScorePercentage}%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-6 shadow-sm overflow-hidden mt-4">
        <h3 className="text-zinc-900 dark:text-white text-lg font-black mb-6">Recent Test History</h3>
        {results.length === 0 ? (
          <div className="py-10 text-center">
            <FileQuestion className="w-12 h-12 text-zinc-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-zinc-500 dark:text-slate-400 font-medium">No tests taken yet. Start practicing!</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-white/10">
                  <th className="py-3 px-4 text-zinc-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest">Test</th>
                  <th className="py-3 px-4 text-zinc-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest">Date</th>
                  <th className="py-3 px-4 text-zinc-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest">Score</th>
                  <th className="py-3 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => {
                  const UIInfo = getSubjectIcon(result.subject);
                  let displayTopic = result.topic;
                  if (result.subject === 'Mock Test' || /mock/i.test(displayTopic)) {
                    const match = displayTopic.match(/\d+/);
                    displayTopic = match ? `Mock Test - ${match[0]}` : 'Mock Test';
                  }
                  return (
                    <tr key={result.id} className="border-b border-zinc-100 dark:border-white/5">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${UIInfo.bg} ${UIInfo.color} flex items-center justify-center shrink-0`}>{UIInfo.icon}</div>
                          <div><span className="font-bold text-sm text-zinc-900 dark:text-white block">{displayTopic}</span><span className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 uppercase tracking-widest">{result.subject}</span></div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-zinc-600 dark:text-slate-400">{new Date(result.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4 font-black text-zinc-900 dark:text-white">{result.score}<span className="text-zinc-400 text-xs">/{result.total}</span></td>
                      <td className="py-4 px-4 text-right">
                        <button onClick={() => handleReview(result)} className="inline-flex px-4 py-2 rounded-full bg-zinc-100 dark:bg-[#18181b] hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-900 dark:text-white text-xs font-bold transition-colors tap-effect">
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}