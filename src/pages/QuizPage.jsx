// src/pages/QuizPage.jsx
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
      <div className="h-screen bg-slate-50 dark:bg-[#050508] flex flex-col items-center justify-center text-slate-900 dark:text-white transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-[#2525f4]/30 border-t-[#2525f4] rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold tracking-tight">Loading Exam Engine...</h2>
      </div>
    );
  }

  // 🚫 EMPTY SECTION/DB SCREEN
  if (state.questions.length === 0) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-[#050508] flex flex-col items-center justify-center text-slate-900 dark:text-white p-6 transition-colors duration-300">
        <div className="glass-card p-10 rounded-3xl flex flex-col items-center text-center max-w-lg border border-slate-200 dark:border-white/5 shadow-2xl">
          <Database className="w-20 h-20 text-slate-400 dark:text-slate-600 mb-6" />
          <h2 className="text-3xl font-black mb-3">No Questions Found!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
            {state.isFullMock 
              ? "Not enough questions available for a Full Mock Test." 
              : "No questions available for this specific subject yet."} 
            <br className="hidden sm:block" /> Please add more questions from the Admin Panel.
          </p>
          <button onClick={() => state.navigate('/admin')} className="px-8 py-4 rounded-2xl bg-[#2525f4] hover:bg-blue-600 text-white font-bold transition-all btn-press shadow-[0_0_20px_rgba(37,37,244,0.3)]">
            Go to Admin Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-[#050508] text-slate-900 dark:text-slate-100 font-sans h-[100dvh] flex flex-col overflow-hidden selection:bg-[#2525f4]/30 relative transition-colors duration-300">
      <QuizHeader {...state} />

      <div className="flex-1 flex overflow-hidden relative">
        {state.showResult ? (
          <QuizResultScreen totalQuestions={state.totalQuestions} finalScore={state.finalScore} navigate={state.navigate} />
        ) : (
          <>
            <QuizPauseOverlay isPaused={state.isPaused} setIsPaused={state.setIsPaused} />

            <main className={`flex-1 flex flex-col relative transition-all duration-300 ${state.isPaused ? 'blur-md scale-[0.98] opacity-50' : ''}`}>
              <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
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