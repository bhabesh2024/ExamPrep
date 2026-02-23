import React, { useEffect, useState } from 'react';
import { Target, Brain, Zap, Users, Globe, Award, ChevronRight, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "PrepIQ kya hai aur yeh kiske liye hai?",
      a: "PrepIQ ek AI-powered exam preparation platform hai jo specifically Assam ke government competitive exams jaise ADRE, SSC, aur other state-level exams ke aspirants ke liye bana gaya hai. Yahan aapko full mock tests, chapter-wise practice, aur smart analytics milegi."
    },
    {
      q: "Kya PrepIQ free hai?",
      a: "Haan! PrepIQ ka Basic plan bilkul free hai jisme aap free mock tests, standard subjects, aur basic progress tracking use kar sakte hain. Premium (Pro) plan mein aapko exclusive content, advanced analytics, aur ad-free experience milti hai."
    },
    {
      q: "ADRE exam ke liye PrepIQ kaise help karega?",
      a: "PrepIQ pe aapko ADRE ke exact pattern par based 50+ full mock tests milenge — 150 questions, 180 minutes. Saath hi subject-wise sectional tests bhi hain jisse aap weak areas pe focused practice kar sakte ho."
    },
    {
      q: "Kya mobile par use kar sakte hain?",
      a: "Bilkul! PrepIQ fully mobile-responsive hai. Aap apne phone ya tablet par bhi seamlessly practice kar sakte hain, bilkul ek app jaise experience ke saath."
    },
    {
      q: "Questions Hindi mein available hain?",
      a: "Haan! Practice mode mein har question ke saath ek 'Hindi' button hota hai. Isse aap ek click mein question ko Hindi mein translate kar sakte hain. Yeh ADRE aur state exam aspirants ke liye specially helpful hai."
    },
    {
      q: "Kya mock tests ke baad detailed analysis milti hai?",
      a: "Haan. Har mock test ya practice session ke baad aapko ek detailed result screen milti hai jisme aapka score, accuracy, time analysis, aur question-by-question review hota hai. Isse aap apne weak areas clearly identify kar sakte ho."
    },
    {
      q: "Ask Google AI button kya karta hai?",
      a: "Practice karte time har question par ek 'Ask Google AI' button hota hai. Isse click karne par wo question saari options ke saath Google Gemini AI par automatically load ho jaata hai, jahan aap deeper explanation le sakte ho — bina copy-paste kiye!"
    },
    {
      q: "Kya main apna account delete kar sakta hoon?",
      a: "Haan, account deletion ke liye aap hamare contact page par request kar sakte hain. Hum 7 working days mein aapka data permanently delete kar denge as per our privacy policy."
    }
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Frequently Asked Questions</h2>
        <p className="text-slate-400 text-sm sm:text-base">Aapke common sawalo ke jawab yahan hain.</p>
      </div>
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className="bg-[#1a1d24] border border-[#282e39] rounded-2xl overflow-hidden transition-all duration-300"
          >
            <button 
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#1f2229] transition-colors"
            >
              <span className="text-sm sm:text-base font-semibold text-white leading-snug">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === idx && (
              <div className="px-5 sm:px-6 pb-4 sm:pb-5 text-sm sm:text-base text-slate-400 leading-relaxed border-t border-[#282e39] pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

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

        {/* FAQ SECTION */}
        <FAQSection />

        {/* CTA SECTION */}
        <div className="text-center pb-10 mt-16">
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