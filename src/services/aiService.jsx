// src/services/aiService.js

// ✅ FIX: Direct Groq URL ki jagah Vite proxy use karo (CORS fix)
// Development mein: /api/groq → proxy → https://api.groq.com
// Production mein: Direct Groq URL
const API_URL = import.meta.env.DEV 
  ? "/api/groq/openai/v1/chat/completions"
  : "https://api.groq.com/openai/v1/chat/completions";

export const fetchAiResponse = async (userMessage, context = "") => {
  const apiKey = import.meta.env.VITE_AI_API_KEY;

  // API key check
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_groq_api_key_here") {
    return "⚠️ API Key nahi mili! .env file mein VITE_AI_API_KEY set karein aur server restart karein (npm run dev).";
  }

  try {
    const systemPrompt = `You are an expert AI Tutor for competitive exams named "PrepIQ AI". Be helpful, concise, and friendly. Do not give the direct answer immediately if it's a practice question, but provide a solid hint to guide the student.
    Context: ${context}`;

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
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        return "❌ API Key galat hai! Groq console (console.groq.com) se sahi key copy karke .env file mein lagayein aur server restart karein.";
      } else if (response.status === 429) {
        return "⏳ Rate limit ho gayi! Thoda ruk ke dobara try karein.";
      } else {
        return `❌ API Error ${response.status}: ${errorData?.error?.message || "Unknown error"}`;
      }
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    } else {
      return "Sorry, kuch response nahi aaya. Dobara try karein!";
    }

  } catch (error) {
    console.error("Groq AI API Error:", error);
    if (error.name === "TypeError") {
      return "🌐 Network error! Internet connection check karein ya server restart karein (npm run dev).";
    }
    return `⚠️ Error: ${error.message}`;
  }
};