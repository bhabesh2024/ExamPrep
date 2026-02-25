// src/components/admin/AdminQuestionList.jsx
import React from 'react';
import { Database, Plus } from 'lucide-react'; // 🔥 Plus icon add kiya
import AdminQuestionCard from './AdminQuestionCard';

export default function AdminQuestionList(state) {
  const {
    questions,
    setQuestions,
    handleQuestionChange, // 🔥 FIX: Hook me iska naam handleQuestionChange hai
    selectedForDelete,
    setSelectedForDelete,
    modifyQuestionWithAI,
    addNewQuestion, // 🔥 Naya function Add manually ke liye
    isLoading
  } = state;

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-[#2a3241] rounded-2xl bg-[#181b21]/30">
        <Database className="w-12 h-12 mb-4 opacity-30 text-[#258cf4]" />
        <p className="text-lg font-medium text-slate-300">No questions found</p>
        <p className="text-sm mt-1 opacity-70">Generate with AI or Fetch from DB.</p>
        
        {addNewQuestion && (
          <button onClick={addNewQuestion} className="mt-6 px-6 py-2 bg-[#258cf4]/10 hover:bg-[#258cf4]/20 text-[#258cf4] font-bold rounded-lg transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Question Manually
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
        <AdminQuestionCard
          key={index}
          q={q}
          index={index}
          // 🔥 Safe prop mapping so typing doesn't crash
          updateQuestion={handleQuestionChange || state.updateQuestion} 
          questions={questions}
          setQuestions={setQuestions}
          selectedForDelete={selectedForDelete || []}
          setSelectedForDelete={setSelectedForDelete}
          modifyQuestionWithAI={modifyQuestionWithAI}
          isLoading={isLoading}
        />
      ))}

      {/* 🔥 NAYA FEATURE: Bottom me Add New Question ka button */}
      {addNewQuestion && (
        <button 
          onClick={addNewQuestion} 
          className="w-full py-4 border-2 border-dashed border-[#2a3241] text-slate-400 hover:text-white hover:border-[#258cf4] hover:bg-[#258cf4]/5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer font-bold"
        >
          <Plus className="w-5 h-5" /> Add Another Question
        </button>
      )}
    </div>
  );
}