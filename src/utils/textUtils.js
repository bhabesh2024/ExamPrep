// src/utils/textUtils.js

// 🔥 SUPER CLEANER FOR AI TAGS
export const cleanAITags = (text) => {
  if (typeof text !== 'string') return text;
  return text
    .replace(/:\s*contentReference\[.*?\]\{.*?\}/gi, '') // Catches :contentReference[oaicite:X]{index=X}
    .replace(/【.*?†source】/gi, '') // Catches 【17†source】
    .replace(/【.*?】/g, '') // Catches other GPT brackets
    .trim();
};

export const applyStrictMathFilter = (text) => {
  if (typeof text !== 'string') return text;
  let processed = text;
  // 1. Hindi Numerals to English
  const hindiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  processed = processed.replace(/[०-९]/g, (match) => hindiDigits.indexOf(match));
  // 2. "\frac" parsing bug fix
  processed = processed.replace(/\x0C/g, '\\f');
  processed = processed.replace(/\frac/g, '\\frac');
  processed = processed.replace(/\\\\frac/g, '\\frac');
  // 3. Fix naked geometry commands
  processed = processed.replace(/\\triangle\s*/g, 'Triangle ').replace(/\\angle\s*/g, 'Angle ');
  // 4. MISSING DOLLAR FIX
  if ((processed.includes('\\frac') || processed.includes('\\times')) && !processed.includes('$')) {
    processed = processed.replace(/(\\frac{[^}]+}{[^}]+}(?:\s*\\times\s*\\frac{[^}]+}{[^}]+})*)/g, '$$$1$$');
  }
  // 5. HTML tag cleanup
  processed = processed.replace(/<\/?br\s*\/?>/gi, '\n');
  processed = processed.replace(/<\/?(b|i|strong|em|u|p|span|div)[^>]*>/gi, '');
  return processed;
};

export const cleanMarkdown = (text) => {
  if (typeof text !== 'string') return text;
  const latexBlocks = [];
  const save = (match) => {
    const idx = latexBlocks.length;
    latexBlocks.push(match);
    return `@@LATEX${idx}@@`;
  };
  let clean = text.replace(/\$\$[\s\S]+?\$\$/g, save).replace(/\$[^$\n]+?\$/g, save);
  clean = clean.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*\n]+)\*/g, '$1').replace(/^#{1,6}\s+/gm, '').replace(/^[ \t]*[-–]\s+/gm, '').replace(/^[ \t]*\*\s+/gm, '').replace(/`([^`]+)`/g, '$1').replace(/__([^_]+)__/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
  latexBlocks.forEach((block, i) => { clean = clean.replace(`@@LATEX${i}@@`, block); });
  return clean;
};

export const safeFormat = (text) => {
  if (!text) return "";
  return cleanMarkdown(applyStrictMathFilter(cleanAITags(text)));
};