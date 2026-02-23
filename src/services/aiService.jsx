// src/services/aiService.jsx
import { AI_STRICT_RULES } from '../config/aiPrompts'; // 🔥 Config Import

const API_URL = import.meta.env.DEV 
  ? "/api/groq/openai/v1/chat/completions"
  : "https://api.groq.com/openai/v1/chat/completions";

// 🛡️ THE BRAHMASTRA FILTER: AI ki galtiyo ko automatically theek karne wala logic
export const applyStrictMathFilter = (text) => {
  if (typeof text !== 'string') return text;

  let processed = text;

  // 1. Hindi Numerals to English (९६०० -> 9600)
  const hindiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  processed = processed.replace(/[०-९]/g, (match) => hindiDigits.indexOf(match));

  // 2. "\frac" parsing bug fix
  processed = processed.replace(/\x0C/g, '\\f');
  processed = processed.replace(/rac/g, '\\frac'); 
  processed = processed.replace(/\\\\frac/g, '\\frac'); 

  // 3. Fix naked geometry commands
  processed = processed
    .replace(/\\triangle\s*/g, 'Triangle ')
    .replace(/\\angle\s*/g, 'Angle ');

  // 4. MISSING DOLLAR FIX
  if ((processed.includes('\\frac') || processed.includes('\\times')) && !processed.includes('$')) {
    processed = processed.replace(/(\\frac{[^}]+}{[^}]+}(?:\s*\\times\s*\\frac{[^}]+}{[^}]+})*)/g, '$$$1$$');
  }

  // 🚀 5. FUTURE-PROOF ANTI-HTML SHIELD 🚀
  // A. <br> ya <br/> ya </br> ko asli Nayi Line (\n) mein badlo
  processed = processed.replace(/<\/?br\s*\/?>/gi, '\n');
  
  // B. Faltu formatting tags (bold, italic, para, span) ko completely hata do bina Math ke < > ko tode
  processed = processed.replace(/<\/?(b|i|strong|em|u|p|span|div)[^>]*>/gi, '');

  return processed;
};

// 🧹 MARKDOWN CLEANER
export const cleanMarkdown = (text) => {
  if (typeof text !== 'string') return text;

  const latexBlocks = [];
  const save = (match) => {
    const idx = latexBlocks.length;
    latexBlocks.push(match);
    return `@@LATEX${idx}@@`;
  };

  let clean = text.replace(/\$\$[\s\S]+?\$\$/g, save).replace(/\$[^$\n]+?\$/g, save);       

  clean = clean
    .replace(/\*\*([^*]+)\*\*/g, '$1')     
    .replace(/\*([^*\n]+)\*/g, '$1')       
    .replace(/^#{1,6}\s+/gm, '')           
    .replace(/^[ \t]*[-–]\s+/gm, '')       
    .replace(/^[ \t]*\*\s+/gm, '')         
    .replace(/`([^`]+)`/g, '$1')           
    .replace(/__([^_]+)__/g, '$1')         
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') 
    .trim();

  latexBlocks.forEach((block, i) => {
    clean = clean.replace(`@@LATEX${i}@@`, block);
  });

  return clean;
};

// 🤖 MAIN AI FETCH FUNCTION
export const fetchAiResponse = async (userMessage, context = "", isQuestionGeneration = false) => {
  const apiKey = import.meta.env.VITE_AI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return "⚠️ API Key missing! .env file mein VITE_AI_API_KEY set karein.";
  }

  try {
    // 🔥 MINIMAL PROMPTS INJECTED HERE 🔥
    let systemPrompt = isQuestionGeneration 
      ? AI_STRICT_RULES.QUESTION_GENERATOR 
      : `${AI_STRICT_RULES.TUTOR_CHAT}\nContext: ${context}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.2, 
        max_tokens: isQuestionGeneration ? 2500 : 1000 
      })
    });

    if (!response.ok) throw new Error("API Error");

    const data = await response.json();
    let content = data.choices[0]?.message?.content;
    
    if (content) {
      if (isQuestionGeneration) {
        try {
          const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          return JSON.parse(cleanedContent);
        } catch (e) {
          return [];
        }
      }
      
      // 1. Apply Strict Filter
      let filteredContent = applyStrictMathFilter(content);
      // 2. Clean Markdown and Return
      return cleanMarkdown(filteredContent);
    } else {
      return isQuestionGeneration ? [] : "Sorry, no response. Try again!";
    }

  } catch (error) {
    return isQuestionGeneration ? [] : `⚠️ Error: ${error.message}`;
  }
};