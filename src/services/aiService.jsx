// src/services/aiService.jsx

const API_URL = import.meta.env.DEV 
  ? "/api/groq/openai/v1/chat/completions"
  : "https://api.groq.com/openai/v1/chat/completions";

// ✅ Markdown cleaner — LaTeX safe
// Bug fix: placeholder @@LATEX0@@ uses NO underscores
// (previous %%LATEX_BLOCK_0%% was broken by _italic_ cleaner eating the underscores)
const cleanMarkdown = (text) => {
  if (typeof text !== 'string') return text;

  const latexBlocks = [];

  // Step 1: Save all LaTeX blocks with underscore-free placeholders
  const save = (match) => {
    const idx = latexBlocks.length;
    latexBlocks.push(match);
    return `@@LATEX${idx}@@`;
  };

  let clean = text
    .replace(/\$\$[\s\S]+?\$\$/g, save)   // Block LaTeX $$ ... $$
    .replace(/\$[^$\n]+?\$/g, save);       // Inline LaTeX $ ... $

  // Step 2: Remove markdown (LaTeX is safely stored, won't be touched)
  clean = clean
    .replace(/\*\*([^*]+)\*\*/g, '$1')     // **bold** → plain
    .replace(/\*([^*\n]+)\*/g, '$1')       // *italic* → plain
    .replace(/^#{1,6}\s+/gm, '')           // # Headings
    .replace(/^[ \t]*[-–]\s+/gm, '')       // - bullet at line start
    .replace(/^[ \t]*\*\s+/gm, '')         // * bullet at line start
    .replace(/`([^`]+)`/g, '$1')           // `code`
    .replace(/__([^_]+)__/g, '$1')         // __bold__ (double underscore only)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [link](url) → text
    .trim();

  // Step 3: Restore LaTeX exactly
  latexBlocks.forEach((block, i) => {
    clean = clean.replace(`@@LATEX${i}@@`, block);
  });

  return clean;
};

export const fetchAiResponse = async (userMessage, context = "", isQuestionGeneration = false) => {
  const apiKey = import.meta.env.VITE_AI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_groq_api_key_here") {
    return "⚠️ API Key nahi mili! .env file mein VITE_AI_API_KEY set karein aur server restart karein (npm run dev).";
  }

  try {
    let systemPrompt = `You are an expert AI Tutor for competitive exams named "PrepIQ AI". Be helpful, concise, and highly professional.
    Context: ${context}
    
    LANGUAGE RULE: Respond in the SAME language the user writes in (e.g., if Hindi, respond in Hindi).

    STRICT PROFESSIONAL & FORMATTING RULES:
    1. OUTPUT PLAIN TEXT ONLY. No Markdown. No ** bold. No * italic. No # headings. No - or * bullet lists.
    2. NEVER SHOW YOUR THOUGHT PROCESS OR MISTAKES. Do not write things like "Wait, I made a mistake", "Let's go back", or "Let's try again". Calculate everything silently and ONLY output the final, 100% accurate, confident step-by-step solution.
    3. USE WORDS FOR SHAPES: Do NOT use LaTeX symbols for shapes. Write "Triangle BDE" instead of "$\\triangle BDE$". Write "Angle" instead of "$\\angle$".
    4. MATH & REASONING — MANDATORY LATEX: You MUST use LaTeX ONLY for numbers, fractions, and formulas:
       - Fractions → $\\frac{a}{b}$
       - Equations → $a^2 + b^2 = c^2$
       - Numbers and Variables → $56$, $42$, $x$
    5. BE MATHEMATICALLY ACCURATE: Do not fake calculations. Solve logically.
    6. For steps, use simple numbers "1." "2." "3." only.`;

    if (isQuestionGeneration) {
      systemPrompt = `You are an expert exam question generator for Indian competitive exams. 
      You MUST return ONLY a valid JSON array. Do not include markdown like \`\`\`json or any conversational text.
      
      Strictly follow this JSON format for EACH question:
      [
        {
          "question": "Question text. Use $...$ for math. Use words for shapes (e.g., Triangle instead of \\triangle).",
          "questionHindi": "Accurate Hindi translation.",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "answer": "Exact matching string from options",
          "explanation": "Step-by-step plain text. Use 1. 2. 3. for steps. Use LaTeX for math. No markdown. NO MISTAKES OR SELF-CORRECTIONS.",
          "explanationHindi": "Step-by-step explanation in Hindi.",
          "geometryType": null, 
          "geometryData": null  
        }
      ]
      
      LaTeX Rules (MANDATORY):
      - Fractions: $\\frac{num}{den}$
      - Equations: $a^2 + b^2 = c^2$
      - DO NOT use $\\triangle$ or $\\angle$, write Triangle and Angle in plain text.

      Geometry/Visual Rules:
      - If drawing needed, "geometryType": "svg-code", "geometryData": valid SVG string.
      - If no visual, null.

      General Rules:
      1. NEVER use Markdown (no **, *, -, #).
      2. NEVER write "I made a mistake". Be mathematically perfect.
      3. Options must be exactly 4 items.`;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        // 🔥 AI ko math calculations me strict rakhne ke liye temperature kam kiya gaya hai
        temperature: 0.2, 
        max_tokens: isQuestionGeneration ? 2500 : 1000 
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        return "❌ API Key galat hai! Groq console se sahi key copy karke .env file mein lagayein.";
      } else if (response.status === 429) {
        return "⏳ Rate limit ho gayi! Thoda ruk ke dobara try karein.";
      } else {
        return `❌ API Error ${response.status}: ${errorData?.error?.message || "Unknown error"}`;
      }
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      if (isQuestionGeneration) {
        try {
          const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          return JSON.parse(cleanedContent);
        } catch (e) {
          console.error("Failed to parse AI JSON response:", content);
          return [];
        }
      }
      return cleanMarkdown(content);
    } else {
      return isQuestionGeneration ? [] : "Sorry, kuch response nahi aaya. Dobara try karein!";
    }

  } catch (error) {
    console.error("Groq AI API Error:", error);
    if (error.name === "TypeError") {
      return isQuestionGeneration ? [] : "🌐 Network error! Internet connection check karein.";
    }
    return isQuestionGeneration ? [] : `⚠️ Error: ${error.message}`;
  }
};