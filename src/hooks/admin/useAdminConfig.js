// src/hooks/admin/useAdminConfig.js
// Sirf dropdown state manage karta hai — subject, category, chapter, difficulty
import { useState } from 'react';
import { subjectsData } from '../../data/syllabusData.jsx';

export const getTrueChapterId = (topicTitle) => {
  for (const subj of subjectsData) {
    for (const cat of subj.categories) {
      const found = cat.topics.find(t => t.title === topicTitle);
      if (found) return found.id;
    }
  }
  return topicTitle.toLowerCase().replace(/\s+/g, '-');
};

export const getCategories = (subjectTitle) => {
  const subj = subjectsData.find(s => s.title === subjectTitle);
  return subj ? subj.categories.map(c => c.title) : [];
};

export const getChapters = (subjectTitle, categoryTitle) => {
  const subj = subjectsData.find(s => s.title === subjectTitle);
  if (!subj) return [];
  const cat = subj.categories.find(c => c.title === categoryTitle);
  return cat ? cat.topics.map(t => t.title) : [];
};

export const mainSubjects = subjectsData.map(s => s.title);

export default function useAdminConfig() {
  const [mainCategory, setMainCategory] = useState(mainSubjects[0]);
  const [subCategory,  setSubCategory]  = useState(getCategories(mainSubjects[0])[0] || '');
  const [chapter,      setChapter]      = useState(getChapters(mainSubjects[0], getCategories(mainSubjects[0])[0])[0] || '');
  const [difficulty,   setDifficulty]   = useState('Medium');
  const [qCount,       setQCount]       = useState(10);

  const handleMainCategoryChange = (e) => {
    // FIX: Support event object or direct string value
    const val = e?.target?.value || e; 
    setMainCategory(val);
    const cats = getCategories(val);
    setSubCategory(cats[0] || '');
    setChapter(getChapters(val, cats[0])[0] || '');
  };

  const handleSubCategoryChange = (e) => {
    const val = e?.target?.value || e;
    setSubCategory(val);
    setChapter(getChapters(mainCategory, val)[0] || '');
  };

  return {
    mainSubjects, getCategories, getChapters, getTrueChapterId,
    // FIX: Added setMainCategory aur setSubCategory in return object
    mainCategory, setMainCategory, subCategory, setSubCategory, chapter, setChapter, difficulty, setDifficulty, qCount, setQCount,
    handleMainCategoryChange, handleSubCategoryChange,
  };
}