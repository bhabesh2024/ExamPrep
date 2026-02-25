// src/components/admin/AdminQuestionList.jsx
import React from 'react';
import { Database } from 'lucide-react';
import AdminQuestionCard from './AdminQuestionCard';

export default function AdminQuestionList(state) {
  const {
    questions,
    setQuestions,
    updateQuestion,
    selectedForDelete,
    setSelectedForDelete,
    modifyQuestionWithAI,
    isLoading
  } = state;

  // Agar questions nahi hain, toh ek sundar khali (empty) state dikhao
  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-[#2a3241] rounded-2xl bg-[#181b21]/30">
        <Database className="w-12 h-12 mb-4 opacity-30 text-[#258cf4]" />
        <p className="text-lg font-medium text-slate-300">No questions found</p>
        <p className="text-sm mt-1 opacity-70">Generate with AI or Import a JSON file to see questions here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ab ye sirf aur sirf Question Cards ko render karega, koi extra Select All nahi */}
      {questions.map((q, index) => (
        <AdminQuestionCard
          key={index}
          q={q}
          index={index}
          updateQuestion={updateQuestion}
          questions={questions}
          setQuestions={setQuestions}
          selectedForDelete={selectedForDelete}
          setSelectedForDelete={setSelectedForDelete}
          modifyQuestionWithAI={modifyQuestionWithAI}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}