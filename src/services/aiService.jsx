// src/services/aiService.jsx

const API_URL = import.meta.env.DEV 
  ? "/api/groq/openai/v1/chat/completions"
  : "https://api.groq.com/openai/v1/chat/completions";

const cleanMarkdown = (text) => {
  if (typeof text !== 'string') return text;

  let preCleaned = text
    .replace(/\\triangle\s*/g, 'Triangle ')
    .replace(/\\angle\s*/g, 'Angle ');

  const latexBlocks = [];

  const save = (match) => {
    const idx = latexBlocks.length;
    latexBlocks.push(match);
    return `@@LATEX${idx}@@`;
  };

  let clean = preCleaned
    .replace(/\$\$[\s\S]+?\$\$/g, save)   
    .replace(/\$[^$\n]+?\$/g, save);       

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
    1. OUTPUT PLAIN TEXT ONLY. No Markdown. No ** bold. No * italic. No # headings. No emojis.
    2. NEVER SHOW YOUR THOUGHT PROCESS. Calculate silently and ONLY output the final, accurate solution.
    3. MATH & REASONING — STRICT LATEX MANDATE:
       - You MUST wrap ALL numbers, equations, formulas, and operators in $...$. DO NOT use plain text for math.
       - Multiplication: ALWAYS use $\\times$ (NEVER use * or x).
       - Exponents/Powers: ALWAYS use $x^2$ or $r^2$ (NEVER use ^ outside of $).
       - Pi: ALWAYS use $\\pi$ (NEVER use plain π).
       - Fractions: ALWAYS use $\\frac{a}{b}$ (NEVER use a/b).
       - Correct Example: $\\pi r^2 = \\frac{22}{7} \\times 7^2$
       - Wrong Example: πr^2 = (22/7) * 7^2
    4. USE WORDS FOR SHAPES: Write "Triangle BDE" instead of "$\\triangle BDE$".
    5. BE MATHEMATICALLY ACCURATE. Do not fake calculations.
    6. For steps, use simple numbers "1." "2." "3." only.`;

    if (isQuestionGeneration) {
      systemPrompt = `You are an expert exam question generator for Indian competitive exams. 
      You MUST return ONLY a valid JSON array. Do not include markdown like \`\`\`json.
      
      Strictly follow this JSON format for EACH question:
      [
        {
          "question": "Question text. Use $...$ for math. Use words for shapes.",
          "questionHindi": "Accurate Hindi translation.",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "answer": "Exact matching string from options",
          "explanation": "Step-by-step plain text. Use 1. 2. 3. for steps. Use LaTeX for math. No markdown. NO MISTAKES.",
          "explanationHindi": "Step-by-step explanation in Hindi.",
          "geometryType": null, 
          "geometryData": null  
        }
      ]
      
      LaTeX Rules (MANDATORY):
      - Fractions: $\\frac{num}{den}$
      - Multiplication: $\\times$ (No *)
      - Exponents: $a^2$ (No plain ^)
      - DO NOT use $\\triangle$ or $\\angle$, write Triangle and Angle in plain text.

      Geometry/Visual Rules:
      - If drawing needed, "geometryType": "svg-code", "geometryData": valid SVG string.
      - If no visual, null.

      General Rules:
      1. NEVER use Markdown or emojis.
      2. Options must be exactly 4 items.`;
    }

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
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      if (isQuestionGeneration) {
        try {
          const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          return JSON.parse(cleanedContent);
        } catch (e) {
          return [];
        }
      }
      return cleanMarkdown(content);
    } else {
      return isQuestionGeneration ? [] : "Sorry, no response. Try again!";
    }

  } catch (error) {
    return isQuestionGeneration ? [] : `⚠️ Error: ${error.message}`;
  }
};