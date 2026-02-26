import React from 'react';
import { AlertCircle } from 'lucide-react';

// LOGIC HOOK
import useChapterPracticeLogic from '../hooks/useChapterPracticeLogic';

// COMPONENTS
import PracticeHeader from '../components/practice/PracticeHeader';
import QuestionCard from '../components/practice/QuestionCard';
import OptionsList from '../components/practice/OptionsList';
import PracticeFooter from '../components/practice/PracticeFooter';
import QuestionPalette from '../components/practice/QuestionPalette';
import PracticeResultScreen from '../components/practice/PracticeResultScreen';
import ExplanationBox from '../components/practice/ExplanationBox';

export default function ChapterPracticePage() {
  // Saara Dimaag Hook se aa raha hai! 🧠
  const state = useChapterPracticeLogic();

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-slate-100 font-sans h-screen flex flex-col overflow-hidden relative transition-colors duration-500">
      <style>{`
        .chat-bubble { animation: fadeIn 0.3s ease-out forwards; }
        .fade-in-text { animation: fadeInText 0.4s ease-in-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInText { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <PracticeHeader 
        topicId={state.topicId} showResult={state.showResult} isLoadingQuestions={state.isLoadingQuestions} 
        totalQuestions={state.totalQuestions} currentQ={state.currentQ} setIsMobilePaletteOpen={state.setIsMobilePaletteOpen} handleExit={state.handleExit}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {state.showResult ? (
          <PracticeResultScreen {...state} />
        ) : (
          <>
            <main className="flex-1 flex flex-col relative overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-10 custom-scrollbar">
                <div className="max-w-3xl mx-auto flex flex-col gap-6">

                  {/* LOADING SPINNER */}
                  {state.isLoadingQuestions && (
                    <div className="flex justify-center h-64 items-center">
                      <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {/* 🔥 ROLE-BASED EMPTY SCREEN (Premium Glass Card) 🔥 */}
                  {!state.isLoadingQuestions && state.allQuestions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-72 gap-5 text-center bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-8 shadow-md transition-colors mt-8">
                      <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-[#18181b] flex items-center justify-center mb-2 border border-zinc-200 dark:border-white/5 shadow-sm">
                        <AlertCircle className="w-8 h-8 text-zinc-400 dark:text-slate-500" />
                      </div>
                      
                      {state.isAdmin ? (
                        <>
                          {/* 👑 ADMIN VIEW */}
                          <div>
                            <p className="text-zinc-900 dark:text-white font-black text-xl mb-1.5 transition-colors">Database is Empty</p>
                            <p className="text-zinc-500 dark:text-slate-400 text-sm font-medium transition-colors">Admin Panel se is chapter ke liye questions save karein.</p>
                          </div>
                          <button onClick={() => state.navigate('/admin')} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black hover:shadow-blue-500/30 shadow-md tap-effect transition-all mt-2">
                            Go to Admin Panel
                          </button>
                        </>
                      ) : (
                        <>
                          {/* 👨‍🎓 STUDENT VIEW */}
                          <div>
                            <p className="text-zinc-900 dark:text-white font-black text-xl mb-1.5 transition-colors">Questions Coming Soon!</p>
                            <p className="text-zinc-500 dark:text-slate-400 text-sm font-medium transition-colors">Our experts are preparing the best questions for this chapter.</p>
                          </div>
                          <button onClick={() => state.navigate('/practice')} className="px-6 py-3 rounded-xl bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-800 dark:text-slate-200 text-sm font-black tap-effect transition-all shadow-sm mt-2">
                            Go Back to Subjects
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* MAIN QUESTION RENDER */}
                  {!state.isLoadingQuestions && state.currentQuestionData && (<>
                    <QuestionCard {...state} />
                    <OptionsList {...state} />
                    <ExplanationBox {...state} />
                  </>)}
                </div>
              </div>

              {!state.isLoadingQuestions && state.totalQuestions > 0 && (
                <PracticeFooter {...state} isReviewMarked={state.review[state.currentQ]} />
              )}
            </main>

            {!state.isLoadingQuestions && state.totalQuestions > 0 && (
              <QuestionPalette {...state} jumpTo={state.jumpTo} />
            )}
          </>
        )}
      </div>
    </div>
  );
}