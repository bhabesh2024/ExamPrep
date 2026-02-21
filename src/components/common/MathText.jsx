// src/components/common/MathText.jsx
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

export default function MathText({ text }) {
  if (!text) return null;

  // Yeh logic text ko $$ (block math) aur $ (inline math) ke basis par todta hai
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

  return (
    <span className="font-sans leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          // Block Math (Alag line me bada formula)
          return <BlockMath key={index} math={part.slice(2, -2)} />;
        } else if (part.startsWith('$') && part.endsWith('$')) {
          // Inline Math (Text ke beech me formula)
          return <InlineMath key={index} math={part.slice(1, -1)} />;
        } else {
          // Normal Text
          return <span key={index}>{part}</span>;
        }
      })}
    </span>
  );
}