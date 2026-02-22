import React from 'react';
import { useParams } from 'react-router-dom';
import { Database } from 'lucide-react';

import useQuizLogic from '../hooks/useQuizLogic';
import QuizHeader from '../components/quiz/QuizHeader';
import QuizPauseOverlay from '../components/quiz/QuizPauseOverlay';
import QuizResultScreen from '../components/quiz/QuizResultScreen';
import QuizQuestionArea from '../components/quiz/QuizQuestionArea';
import QuizFooter from '../components/quiz/QuizFooter';
import QuizPalette from '../components/quiz/QuizPalette';

export default function QuizPage() {
  const { type, testId } = useParams();
  const state = useQuizLogic(type, testId);

  // ⏳ LOADING SCREEN
  if (state.isLoading) {
    return (
      <div className="h-screen bg-[#0f1115] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-[#0d59f2]/30 border-t-[#0d59f2] rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold">Loading Real Exam Questions...</h2>
      </div>
    );
  }

  // 🚫 EMPTY DB SCREEN
  if (state.questions.length === 0) {
    return (
      <div className="h-screen bg-[#0f1115] flex flex-col items-center justify-center text-white p-6">
        <Database className="w-20 h-20 text-slate-600 mb-6" />
        <h2 className="text-3xl font-bold mb-2">No Questions Available!</h2>
        <p className="text-slate-400 mb-8 text-center max-w-md">Database is empty. Add questions from Admin Panel.</p>
        <button onClick={() => state.navigate('/admin')} className="px-8 py-3 rounded-full bg-[#0d59f2] hover:bg-blue-600 font-bold transition-colors">
          Go to Admin Panel
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f6f8] dark:bg-[#0f1115] text-slate-900 dark:text-slate-100 font-sans h-screen flex flex-col overflow-hidden selection:bg-[#0d59f2]/30 relative">
      <style>{`
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #1a1d24; }
        ::-webkit-scrollbar-thumb { background: #282e39; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3b4354; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <QuizHeader {...state} />

      <div className="flex-1 flex overflow-hidden relative">
        {state.showResult ? (
          <QuizResultScreen totalQuestions={state.totalQuestions} finalScore={state.finalScore} navigate={state.navigate} />
        ) : (
          <>
            <QuizPauseOverlay isPaused={state.isPaused} setIsPaused={state.setIsPaused} />

            <main className={`flex-1 flex flex-col relative transition-filter ${state.isPaused ? 'blur-sm' : ''}`}>
              <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                <QuizQuestionArea {...state} />
              </div>
              <QuizFooter handleClear={state.handleClear} handleNext={state.handleNext} currentQ={state.currentQ} totalQuestions={state.totalQuestions} />
            </main>

            <QuizPalette {...state} />
          </>
        )}
      </div>
    </div>
  );
}