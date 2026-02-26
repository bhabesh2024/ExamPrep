import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Zap, Shield, Users, Globe, Sparkles, GraduationCap, ArrowRight, Activity, BookOpen } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-slate-200 font-sans relative overflow-hidden pt-32 pb-24 transition-colors duration-500">
      
      {/* 🌟 Dynamic Ambient Backgrounds */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] transition-colors duration-500"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[120px] transition-colors duration-500"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 transition-colors shadow-sm">
            <GraduationCap className="w-3.5 h-3.5" /> Welcome to PrepIQ
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-6 transition-colors duration-500 leading-tight">
            Democratizing <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">Exam Preparation</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-slate-400 font-medium transition-colors duration-500 leading-relaxed">
            We are building the smartest, fastest, and most reliable platform for ADRE, SSC, and State Competitive Exams. Our goal is to help every aspirant achieve their dream job through data-driven practice.
          </p>
        </div>

        {/* MISSION & VISION (Glass Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-8 sm:p-10 shadow-lg hover:shadow-xl transition-all duration-500 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 border border-blue-200 dark:border-blue-500/20 transition-colors shadow-sm group-hover:scale-110 duration-300">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 transition-colors">Our Mission</h3>
            <p className="text-zinc-600 dark:text-slate-400 font-medium leading-relaxed transition-colors">
              To provide high-quality, exam-oriented mock tests that perfectly simulate the real exam environment. We want to eliminate the fear of competitive exams by giving students the exact tools they need to practice and perfect their speed and accuracy.
            </p>
          </div>

          <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-8 sm:p-10 shadow-lg hover:shadow-xl transition-all duration-500 group">
            <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6 border border-violet-200 dark:border-violet-500/20 transition-colors shadow-sm group-hover:scale-110 duration-300">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 transition-colors">Our Vision</h3>
            <p className="text-zinc-600 dark:text-slate-400 font-medium leading-relaxed transition-colors">
              To become the most trusted educational companion for millions of aspirants across India. We envision a future where top-tier exam preparation is accessible, affordable, and powered by intelligent analytics for everyone, regardless of their location.
            </p>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="bg-zinc-900 dark:bg-[#18181b] rounded-[2rem] p-10 md:p-16 mb-20 relative overflow-hidden shadow-2xl border border-zinc-800 dark:border-white/5 transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">50+</p>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Full Mock Tests</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">10k+</p>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Questions Bank</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">0ms</p>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Latency Focus</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">24/7</p>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Platform Access</p>
            </div>
          </div>
        </div>

        {/* CORE VALUES */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4 transition-colors">Our Core Values</h2>
            <p className="text-zinc-500 dark:text-slate-400 font-medium">The principles that drive our platform and our commitment to students.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 transition-colors">Quality First</h4>
              <p className="text-sm text-zinc-600 dark:text-slate-400 font-medium transition-colors">Every question is handpicked and verified by experts to match real exam patterns.</p>
            </div>

            <div className="glass-card p-6 rounded-2xl group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 transition-colors">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 transition-colors">Lightning Fast</h4>
              <p className="text-sm text-zinc-600 dark:text-slate-400 font-medium transition-colors">Built on modern tech stack to ensure zero lag during your crucial mock tests.</p>
            </div>

            <div className="glass-card p-6 rounded-2xl group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4 transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 transition-colors">Student Centric</h4>
              <p className="text-sm text-zinc-600 dark:text-slate-400 font-medium transition-colors">Everything we build, from detailed analytics to UI, is designed to help you succeed.</p>
            </div>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="text-center bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-10 md:p-16 shadow-xl relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-blue-500/5 to-violet-500/5 pointer-events-none"></div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4 relative z-10 transition-colors">Ready to crack your next exam?</h2>
          <p className="text-zinc-600 dark:text-slate-400 font-medium mb-8 max-w-2xl mx-auto relative z-10 transition-colors">Join thousands of serious aspirants who are already practicing and improving their scores daily on PrepIQ.</p>
          <button onClick={() => navigate('/practice')} className="relative z-10 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 mx-auto group tap-effect">
            Start Practicing Now <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </main>
    </div>
  );
}