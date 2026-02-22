// src/config/aiPrompts.js

export const AI_STRICT_RULES = {
  // 1. Translation ke strict rules (Maths aur Digits ko bachane ke liye)
  TRANSLATION: `
  ⚠️ CRITICAL TRANSLATION RULES:
  1. NUMBERS: DO NOT convert standard numerical digits to Hindi numerals. Always use 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 (e.g., write 9600, NOT ९६००).
  2. MATH & VARIABLES: Keep all math variables (a, b, x, y), symbols (div, +, -, =), and English abbreviations completely intact. Do not translate them.
  3. LATEX ESCAPING: You MUST double-escape all LaTeX backslashes because the output is parsed as JSON/Strings! Write \\\\frac instead of \\frac, \\\\sqrt instead of \\sqrt, \\\\pi instead of \\pi.
  4. SCRIPT: Use pure, grammatically correct Hindi in the Devanagari script for the main text.
  `,

  // 2. Naye questions generate karne ke strict JSON rules
  JSON_GENERATION: `
  ⚠️ CRITICAL JSON STRUCTURE RULES:
  1. OUTPUT ONLY VALID JSON. Start directly with { and end with }. No markdown, no introductory text.
  2. Format: object with a "questions" array.
  3. Keys MUST EXACTLY be: "question", "questionHindi", "options", "answer", "explanation", "explanationHindi", "examReference", "geometryType", "geometryData".
  4. OPTIONS: Array of exactly 4 choices IN ENGLISH ONLY.
  5. ANSWER: The "answer" field must exactly match one of the strings in the "options" array.
  `,

  // 3. Admin Panel me question edit/modify karne ke rules
  MODIFICATION: `
  ⚠️ CRITICAL MODIFICATION RULES:
  1. Keep the output strictly as a valid JSON object.
  2. Maintain the exact same keys from the original JSON.
  3. You MUST double-escape all LaTeX backslashes (e.g., \\\\frac).
  4. Follow standard translation rules for Hindi text (No Hindi numerals, keep variables intact).
  `
};