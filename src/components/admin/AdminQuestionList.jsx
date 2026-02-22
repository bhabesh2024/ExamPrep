import React from 'react';
import { Database, PlusCircle } from 'lucide-react';
import AdminActionBar from './AdminActionBar';
import AdminQuestionCard from './AdminQuestionCard';

export default function AdminQuestionList(props) {
  const {
    questions, selectedForDelete, handleSelectAll, clearScreen, deleteSelected, pushToPostgreSQL, isLoading,
    toggleSelect, editingIndex, setEditingIndex, editPromptText, setEditPromptText, isEditingLoading,
    modifyQuestionWithAI, handleDeleteQuestion, handleQuestionChange, handleOptionChange,
    setCorrectAnswer, difficulty, addNewQuestion
  } = props;

  return (
    <section className="flex-1 flex flex-col h-full overflow-hidden bg-[#0f1115]/50">
      <AdminActionBar 
        questions={questions} selectedForDelete={selectedForDelete} handleSelectAll={handleSelectAll} 
        clearScreen={clearScreen} deleteSelected={deleteSelected} pushToPostgreSQL={pushToPostgreSQL} isLoading={isLoading} 
      />

      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar pb-32">
        {questions.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <Database className="w-16 h-16 text-slate-500 mb-4" />
            <p className="text-slate-400">Fetch from DB, Generate by AI, or Load Local JSON.</p>
          </div>
        )}

        {questions.map((q, qIndex) => (
          <AdminQuestionCard 
            key={qIndex} q={q} qIndex={qIndex} isSelected={selectedForDelete.includes(qIndex)}
            toggleSelect={toggleSelect} editingIndex={editingIndex} setEditingIndex={setEditingIndex}
            editPromptText={editPromptText} setEditPromptText={setEditPromptText} isEditingLoading={isEditingLoading}
            modifyQuestionWithAI={modifyQuestionWithAI} handleDeleteQuestion={handleDeleteQuestion}
            handleQuestionChange={handleQuestionChange} handleOptionChange={handleOptionChange}
            setCorrectAnswer={setCorrectAnswer} difficulty={difficulty}
          />
        ))}

        <button onClick={addNewQuestion} className="w-full py-4 border-2 border-dashed border-[#2a2f3a] rounded-xl text-slate-400 hover:text-white hover:border-slate-500 hover:bg-[#181b21] transition-all flex items-center justify-center gap-2 cursor-pointer">
          <PlusCircle className="w-5 h-5" /> Add Blank Question Row
        </button>
      </div>
    </section>
  );
}