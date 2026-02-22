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
import AiChatWindow from '../components/practice/AiChatWindow';

export default function ChapterPracticePage() {
  // Saara Dimaag Hook se aa raha hai! 🧠
  const state = useChapterPracticeLogic();

  return (
    <div className="bg-[#0f1115] text-slate-100 font-sans h-screen flex flex-col overflow-hidden relative">
      <style>{`
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #282e39; border-radius: 10px; }
        .chat-bubble { animation: fadeIn 0.3s ease-out forwards; }
        .fade-in-text { animation: fadeInText 0.4s ease-in-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInText { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <PracticeHeader 
        topicId={state.topicId} showResult={state.showResult} isLoadingQuestions={state.isLoadingQuestions} 
        totalQuestions={state.totalQuestions} currentQ={state.currentQ} setIsMobilePaletteOpen={state.setIsMobilePaletteOpen} 
      />

      <div className="flex-1 flex overflow-hidden relative">
        {state.showResult ? (
          <PracticeResultScreen {...state} />
        ) : (
          <>
            <main className="flex-1 flex flex-col relative overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-10 custom-scrollbar">
                <div className="max-w-3xl mx-auto flex flex-col gap-6">

                  {state.isLoadingQuestions && <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-2 border-[#0d59f2]/30 border-t-[#0d59f2] rounded-full animate-spin"></div></div>}
                  
                  {/* 🔥 YAHAN UPDATE HUA HAI: ROLE-BASED EMPTY SCREEN 🔥 */}
                  {!state.isLoadingQuestions && state.allQuestions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                      <AlertCircle className="w-12 h-12 text-slate-500" />
                      
                      {state.isAdmin ? (
                        <>
                          {/* 👑 ADMIN VIEW */}
                          <div>
                            <p className="text-white font-bold text-lg mb-1">Database is Empty</p>
                            <p className="text-slate-400 text-sm">Admin Panel se is chapter ke liye questions save karein.</p>
                          </div>
                          <button onClick={() => state.navigate('/admin')} className="px-5 py-2 rounded-full bg-[#0d59f2] text-white text-sm font-bold hover:bg-[#0b4ecf] cursor-pointer">
                            Go to Admin Panel
                          </button>
                        </>
                      ) : (
                        <>
                          {/* 👨‍🎓 STUDENT VIEW */}
                          <div>
                            <p className="text-white font-bold text-lg mb-1">Questions Coming Soon!</p>
                            <p className="text-slate-400 text-sm">Our experts are preparing the best questions for this chapter.</p>
                          </div>
                          <button onClick={() => state.navigate('/practice')} className="px-5 py-2 rounded-full border border-slate-600 hover:bg-[#282e39] text-white text-sm font-bold cursor-pointer transition-colors">
                            Go Back to Subjects
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {!state.isLoadingQuestions && state.currentQuestionData && (<>
                    <QuestionCard {...state} />
                    <OptionsList {...state} />
                    <ExplanationBox {...state} />
                  </>)}
                </div>
              </div>

              <AiChatWindow {...state} />
              
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