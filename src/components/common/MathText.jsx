import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

export default function MathText({ text }) {
  if (!text) return null;

  const textStr = String(text);

  // Yeh logic text ko $$...$$ aur $...$ ke basis par todta hai.
  // Regex split se matched formulas hamesha ODD (1,3,5...) index par aate hain.
  const parts = textStr.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

  return (
    <span className="font-sans leading-relaxed whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (!part) return null; // Empty strings ignore karo

        // Agar ODD index hai, matlab yeh confirm ek mathematical formula hai
        if (index % 2 === 1) {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            return <BlockMath key={index} math={part.slice(2, -2)} />;
          } else if (part.startsWith('$') && part.endsWith('$')) {
            return <InlineMath key={index} math={part.slice(1, -1)} />;
          }
        } 
        
        // EVEN index wale normal text hain (jaise ki akela '$' option)
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}