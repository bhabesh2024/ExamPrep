import React, { useEffect } from 'react';
import { Target, Brain, Zap, Users, Globe, Award, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      desc: "Our intelligent StudentAI tutor provides contextual hints and explanations to strengthen your core concepts without just spoon-feeding answers.",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      icon: Target,
      title: "Real Exam Simulation",
      desc: "Experience the exact pressure, interface, and environment of real competitive exams with our meticulously designed timed mock tests.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      icon: ShieldCheck,
      title: "High-Quality Content",
      desc: "Get access to thousands of updated questions, curated by subject matter experts, specifically focused on government competitive exams.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      icon: Zap,
      title: "Instant Analytics",
      desc: "Track your progress with real-time performance analytics, identifying your strong areas and topics that need more practice.",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    }
  ];

  const stats = [
    { number: "10K+", label: "Practice Questions" },
    { number: "50+", label: "Full Length Mocks" },
    { number: "24/7", label: "AI Tutor Support" },
    { number: "100%", label: "Syllabus Coverage" }
  ];

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans relative overflow-hidden pt-28 pb-20 selection:bg-[#0d59f2]/30 selection:text-white">
      
      {/* Background Mesh Gradients */}
      <style>{`
        .mesh-bg-about {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;
            background-image: 
                radial-gradient(circle at 20% 30%, rgba(13, 89, 242, 0.05), transparent 40%), 
                radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.05), transparent 40%);
        }
      `}</style>
      <div className="mesh-bg-about"></div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-10 font-medium">
          <button onClick={() => navigate('/')} className="hover:text-[#0d59f2] transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-300">About Us</span>
        </nav>

        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#0d59f2]/20 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1d24] border border-[#282e39] mb-6 shadow-xl">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Empowering Aspirants</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Redefining How You <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d59f2] to-purple-500">
              Prepare for Exams
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
            PrepIQ is a next-generation learning platform designed specifically for aspirants aiming to crack competitive government exams. We combine immersive test simulations with smart AI guidance to ensure you are always exam-ready.
          </p>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-6 text-center shadow-lg hover:border-[#0d59f2]/30 transition-colors">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-1 drop-shadow-[0_0_10px_rgba(13,89,242,0.3)]">{stat.number}</h3>
              <p className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* MISSION & VISION */}
        <div className="bg-gradient-to-br from-[#1a1d24] to-[#111318] border border-[#282e39] rounded-[2rem] p-8 md:p-12 mb-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Target className="w-8 h-8 text-[#0d59f2]" /> Our Mission
              </h2>
              <p className="text-slate-400 leading-relaxed">
                We observed that many students struggle to find a platform that mimics the exact pressure of real examinations while providing quality learning. Our mission is to bridge this gap by offering a seamless, ad-free, and highly intuitive practice zone. 
              </p>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Globe className="w-8 h-8 text-purple-500" /> Our Vision
              </h2>
              <p className="text-slate-400 leading-relaxed">
                To become the most trusted companion for every competitive exam aspirant. We believe that with the right tools, detailed analytics, and a focused environment, anyone can achieve their dream career.
              </p>
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose PrepIQ?</h2>
            <p className="text-slate-400">Everything you need to master your syllabus in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-8 hover:bg-[#1f2229] transition-colors group relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${feat.bg} rounded-full blur-[50px] transition-transform group-hover:scale-150`}></div>
                  <div className="relative z-10 flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-xl ${feat.bg} border ${feat.border} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-7 h-7 ${feat.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                      <p className="text-slate-400 leading-relaxed text-sm md:text-base">{feat.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="text-center pb-10">
          <h2 className="text-2xl font-bold text-white mb-6">Ready to start your preparation?</h2>
          <button 
            onClick={() => navigate('/subjects')}
            className="px-8 py-3.5 rounded-full bg-[#0d59f2] hover:bg-blue-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(13,89,242,0.4)] transition-all hover:scale-105 flex items-center gap-2 mx-auto"
          >
            Explore Syllabus <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </main>
    </div>
  );
}