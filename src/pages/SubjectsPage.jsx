import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calculator, Atom, Landmark, TerminalSquare, FlaskConical, Dna, ArrowRight, Play } from 'lucide-react';

export default function SubjectsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans relative overflow-hidden pt-28 pb-20 selection:bg-blue-500/30 selection:text-white">
      
      {/* Background and Custom Styles */}
      <style>{`
        .mesh-gradient-bg {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08), transparent 25%), 
                radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 25%);
        }
        .glass-card-subject {
            background: rgba(24, 27, 33, 0.4);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
        }
        .glass-card-subject:hover {
            border-color: rgba(59, 130, 246, 0.4);
            background: rgba(24, 27, 33, 0.6);
            box-shadow: 0 0 20px -5px rgba(59, 130, 246, 0.15);
            transform: translateY(-4px);
        }
        .neon-btn {
            background: #3b82f6;
            transition: all 0.3s ease;
            box-shadow: 0 0 15px -3px rgba(59, 130, 246, 0.4);
        }
        .neon-btn:hover {
            background: #2563eb;
            box-shadow: 0 0 25px -5px rgba(59, 130, 246, 0.6);
            transform: scale(1.02);
        }
        .neon-text-glow {
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
        }
      `}</style>

      <div className="mesh-gradient-bg"></div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header Section */}
        <div className="mb-10 relative">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-[80px] -z-10"></div>
          
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
            <button onClick={() => navigate('/')} className="hover:text-blue-500 transition-colors">Home</button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => navigate('/practice')} className="hover:text-blue-500 transition-colors">Practice</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-300">Syllabus</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2 neon-text-glow">
                Choose a Subject
              </h1>
              <p className="text-slate-400 max-w-2xl">Select a module to continue your progress or start a new learning path.</p>
            </div>
            
            {/* Filter Buttons */}
            <div className="inline-flex bg-[#181b21]/50 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
              <button className="px-4 py-1.5 rounded-lg bg-blue-500/20 text-blue-500 text-sm font-medium border border-blue-500/20 shadow-sm">All</button>
              <button className="px-4 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">Science</button>
              <button className="px-4 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">Arts</button>
              <button className="px-4 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">Tech</button>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Mathematics */}
          <div className="glass-card-subject rounded-2xl overflow-hidden group flex flex-col h-full relative">
            <div className="h-40 relative overflow-hidden bg-slate-800">
              <div className="absolute inset-0 bg-gradient-to-t from-[#181b21] via-transparent to-transparent z-10"></div>
              {/* Replace URL with actual image or use solid colors for now */}
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-800 transition-transform duration-700 group-hover:scale-110 flex items-center justify-center opacity-80">
                  <Calculator className="w-20 h-20 text-blue-500/20" />
              </div>
              <div className="absolute top-3 right-3 z-20">
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-blue-400">Core</span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-500 transition-colors mb-1">Mathematics</h3>
                  <p className="text-xs text-slate-400">Calculus & Linear Algebra</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <Calculator className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-blue-400">85%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[85%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-lg neon-btn text-white font-medium flex items-center justify-center gap-2 text-sm group/btn cursor-pointer">
                  Continue Learning <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Physics */}
          <div className="glass-card-subject !hover:border-purple-500/40 rounded-2xl overflow-hidden group flex flex-col h-full relative">
            <div className="h-40 relative overflow-hidden bg-slate-800">
              <div className="absolute inset-0 bg-gradient-to-t from-[#181b21] via-transparent to-transparent z-10"></div>
              <div className="w-full h-full bg-gradient-to-br from-purple-900 to-slate-800 transition-transform duration-700 group-hover:scale-110 flex items-center justify-center opacity-80">
                  <Atom className="w-20 h-20 text-purple-500/20" />
              </div>
              <div className="absolute top-3 right-3 z-20">
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-purple-400">Adv</span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors mb-1">Physics</h3>
                  <p className="text-xs text-slate-400">Quantum Mechanics</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <Atom className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-purple-400">42%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[42%] rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-lg bg-[#181b21] border border-white/10 hover:border-purple-500/50 hover:text-white text-slate-300 font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm group/btn hover:shadow-[0_0_15px_-5px_rgba(168,85,247,0.4)] cursor-pointer">
                  Continue <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: History */}
          <div className="glass-card-subject !hover:border-yellow-500/40 rounded-2xl overflow-hidden group flex flex-col h-full relative">
            <div className="h-40 relative overflow-hidden bg-slate-800">
              <div className="absolute inset-0 bg-gradient-to-t from-[#181b21] via-transparent to-transparent z-10"></div>
              <div className="w-full h-full bg-gradient-to-br from-yellow-900 to-slate-800 transition-transform duration-700 group-hover:scale-110 flex items-center justify-center opacity-80">
                  <Landmark className="w-20 h-20 text-yellow-500/20" />
              </div>
              <div className="absolute top-3 right-3 z-20">
                <span className="px-2.5 py-1 rounded-md bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 text-xs font-bold text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]">New</span>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors mb-1">History</h3>
                  <p className="text-xs text-slate-400">Modern Civilization</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/20">
                  <Landmark className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-400">Status</span>
                    <span className="text-slate-500">Not Started</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#27272a] w-full rounded-full"></div>
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-lg bg-[#181b21] border border-white/10 hover:border-yellow-500/50 hover:text-white text-slate-300 font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm group/btn hover:shadow-[0_0_15px_-5px_rgba(234,179,8,0.4)] cursor-pointer">
                  Start Learning <Play className="w-4 h-4 fill-current transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Add more cards for Tech, Chemistry, etc., using similar markup structure based on your design */}

        </div>
      </main>

      {/* Floating AI Assistant Button from design */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="relative group w-14 h-14 rounded-full bg-gradient-to-br from-[#3b82f6] to-blue-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-110 transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer border-none">
          <Brain className="w-7 h-7 z-10" />
          <div className="absolute inset-0 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full border-2 border-[#0f1115] shadow-sm animate-bounce">1</div>
      </div>
    </div>
  );
}