// src/services/aiService.js

// Groq ka API endpoint
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const fetchAiResponse = async (userMessage, context = "") => {
  try {
    // AI ka character aur context setup
    const systemPrompt = `You are an expert AI Tutor for competitive exams named "PrepIQ AI". Be helpful, concise, and friendly. Do not give the direct answer immediately if it's a practice question, but provide a solid hint to guide the student.
    Context: ${context}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // .env file se automatically Groq ki API key uthayega
        "Authorization": `Bearer ${import.meta.env.VITE_AI_API_KEY}` 
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Groq ka superfast model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7, // Thoda creative aur natural response ke liye
        max_tokens: 500   // Response ki length control karne ke liye
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Groq ke response me se text nikalna
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    } else {
      return "Sorry, I couldn't process that. Try again!";
    }
  } catch (error) {
    console.error("Groq AI API Error:", error);
    return "Oops! Network error or API key issue. Make sure your Groq API key is correct in the .env file.";
  }
};