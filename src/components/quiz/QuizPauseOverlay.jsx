import React from 'react';
import { Pause, Play } from 'lucide-react';

export default function QuizPauseOverlay({ isPaused, setIsPaused }) {
  if (!isPaused) return null;
  return (
    <div className="absolute inset-0 z-50 bg-[#0f1115]/80 backdrop-blur-md flex flex-col items-center justify-center">
      <div className="bg-[#1a1d24] p-8 rounded-2xl border border-[#282e39] text-center shadow-2xl">
        <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Pause className="w-8 h-8 text-yellow-500 fill-current" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Test Paused</h2>
        <p className="text-slate-400 mb-6">Time has stopped. Click resume to continue.</p>
        <button onClick={() => setIsPaused(false)} className="px-8 py-3 rounded-full bg-[#0d59f2] hover:bg-blue-600 text-white font-bold flex items-center gap-2 mx-auto transition-all cursor-pointer">
          <Play className="w-5 h-5 fill-current" /> Resume Test
        </button>
      </div>
    </div>
  );
}