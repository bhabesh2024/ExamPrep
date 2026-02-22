import axios from 'axios';
import { getQuestions as getQuestionsFromJSON } from '../data/questionsLoader';

export const getQuestions = async (subjectId, topicId) => {
  try {
    // Backend se data fetch kar rahe hain
    const response = await axios.get(`/api/questions/${topicId}`);
    
    if (response.data && response.data.length > 0) {
      console.log("✅ Questions fetched from PostgreSQL Database");
      
      // 🛠️ YAHAN HAI JADOO: String ko wapas Array mein convert kar rahe hain
      const parsedQuestions = response.data.map(q => ({
        ...q,
        // Agar options string hai, toh JSON.parse karke wapas array bana do
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        // Geometry data ke sath bhi same
        geometryData: (q.geometryData && typeof q.geometryData === 'string') ? JSON.parse(q.geometryData) : q.geometryData
      }));

      return parsedQuestions;
    }
  } catch (error) {
    console.warn("⚠️ Backend fetch error, falling back to local JSON:", error.message);
  }

  // Fallback: DB khali ho toh JSON
  console.log(`JSON se load kar raha hoon for "${topicId}"...`);
  return getQuestionsFromJSON(subjectId, topicId);
};