// src/hooks/useAdminLogic.jsx
// Ye sirf saare sub-hooks ko combine karta hai.
// Isko directly edit karne ki zarurat bahut kam padegi.
import { useState } from 'react';

import useAdminConfig   from './admin/useAdminConfig.js';
import useAdminQuestions from './admin/useAdminQuestions.js';
import useAdminFileHandling from './admin/useAdminFileHandling.js';
import useAdminAI       from './admin/useAdminAI.js';

export default function useAdminLogic() {
  // ── Shared status state (saare hooks isko use karte hain) ──
  const [status,    setStatus]    = useState('System Operational. Connected to DB.');
  const [statusType, setStatusType] = useState('success');
  const [isLoading,  setIsLoading]  = useState(false);

  const shared = { setStatus, setStatusType, setIsLoading };

  // ── Sub-hooks ──
  const config = useAdminConfig();

  const questionOps = useAdminQuestions({
    mainCategory: config.mainCategory,
    subCategory:  config.subCategory,
    chapter:      config.chapter,
    difficulty:   config.difficulty,
    getTrueChapterId: config.getTrueChapterId,
    ...shared,
  });

  const fileOps = useAdminFileHandling({
    chapter:      config.chapter,
    mainCategory: config.mainCategory,
    subCategory:  config.subCategory,
    difficulty:   config.difficulty,
    setQuestions: questionOps.setQuestions,
    setSelectedForDelete: questionOps.setSelectedForDelete,
    pushToPostgreSQL: questionOps.pushToPostgreSQL,
    ...shared,
  });

  const aiOps = useAdminAI({
    mainCategory: config.mainCategory,
    chapter:      config.chapter,
    difficulty:   config.difficulty,
    qCount:       config.qCount,
    setQuestions: questionOps.setQuestions,
    setEditingIndex:     questionOps.setEditingIndex,
    setEditPromptText:   questionOps.setEditPromptText,
    setIsEditingLoading: questionOps.setIsEditingLoading,
    ...shared,
  });

  // ── Wrapped AI functions (questions state inject karte hain) ──
  const generateQuestions = () =>
    aiOps.generateQuestions(fileOps.extractFileContent, fileOps.file);

  const autoTranslateAllToHindi = () =>
    aiOps.autoTranslateAllToHindi(questionOps.questions, questionOps.setQuestions);

  const translateSelectedToHindi = () =>
    aiOps.translateSelectedToHindi(
      questionOps.questions, questionOps.selectedForDelete,
      questionOps.setQuestions, questionOps.setSelectedForDelete
    );

  const modifyQuestionWithAI = (index) =>
    aiOps.modifyQuestionWithAI(index, questionOps.questions, questionOps.editPromptText, questionOps.setQuestions);

  const downloadJson = () => fileOps.downloadJson(questionOps.questions);

  // ── Sab kuch return karo (components ke liye same interface) ──
  return {
    // Status
    status, statusType, isLoading,

    // Config
    ...config,

    // Questions
    ...questionOps,

    // File handling
    ...fileOps,
    downloadJson,

    // AI
    generateQuestions,
    autoTranslateAllToHindi,
    translateSelectedToHindi,
    modifyQuestionWithAI,
  };
}