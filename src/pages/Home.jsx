import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Activity, Brain, Zap, Languages, GraduationCap, Twitter, Briefcase, Code } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0a0a0a] text-slate-100 font-sans overflow-x-hidden selection:bg-[#0d59f2] selection:text-white">
      
      <style>{`
        .glass-card {
            background: rgba(22, 22, 22, 0.6);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .cta-glow:hover {
            box-shadow: 0 0 25px -5px rgba(13, 89, 242, 0.6);
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>

      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0d59f2]/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px]"></div>
      </div>

      <main className="flex-grow pt-24">
        
        {/* HERO SECTION */}
        <section className="relative pb-20 sm:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161616] border border-[#27272a] text-xs font-medium text-[#0d59f2] mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0d59f2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0d59f2]"></span>
              </span>
              50+ Mock Tests · ADRE · SSC · State Exams
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
              Master Your Exams <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d59f2] via-blue-400 to-violet-500">with PrepIQ</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              The smart exam preparation platform for ADRE, SSC & state competitive exams. Practice with real exam patterns, Hindi translations, and instant results.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <button 
                onClick={() => navigate('/practice')} 
                className="cta-glow bg-[#0d59f2] hover:bg-blue-600 text-white text-base sm:text-lg font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-full transition-all transform hover:-translate-y-1 w-full sm:w-auto"
              >
                Start Practicing
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="glass-card hover:bg-[#161616]/80 text-white text-base sm:text-lg font-medium py-3.5 sm:py-4 px-8 sm:px-10 rounded-full transition-all flex items-center justify-center gap-2 border border-[#27272a] w-full sm:w-auto cursor-pointer"
              >
                <PlayCircle className="w-5 h-5" />
                Learn More
              </button>
            </div>

            {/* Premium Mockup Card */}
            <div className="mt-16 sm:mt-20 relative mx-auto max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0d59f2] to-violet-600 rounded-2xl blur opacity-20"></div>
              <div className="relative rounded-2xl bg-[#161616] border border-[#27272a] overflow-hidden aspect-[16/9] shadow-2xl flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                <div className="w-full h-full p-6 sm:p-8 md:p-12 flex flex-col justify-end items-start text-left relative z-10">
                  <div className="glass-card p-4 sm:p-6 rounded-2xl max-w-xs sm:max-w-md w-full border border-white/10 backdrop-blur-md mb-4 transform transition-transform hover:scale-105 duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0d59f2]/20 flex items-center justify-center text-[#0d59f2]">
                        <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm sm:text-base">Performance Insight</h3>
                        <p className="text-slate-400 text-xs sm:text-sm">You're in the top 5% of students today.</p>
                      </div>
                    </div>
                    <div className="w-full bg-[#27272a] rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-[#0d59f2] to-violet-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Progress</span>
                      <span>85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-16 sm:py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Why Choose PrepIQ?</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">Our platform is engineered for performance, giving you the edge you need to succeed.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              
              <div className="glass-card p-6 sm:p-8 rounded-[2rem] hover:bg-[#161616] transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d59f2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#27272a] flex items-center justify-center text-[#0d59f2] mb-5 sm:mb-6 group-hover:bg-[#0d59f2] group-hover:text-white transition-colors duration-300">
                  <Brain className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Real Exam Simulation</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                  50+ full-length mock tests modelled on ADRE, SSC & state exam patterns. Timed, scored, and analyzed — just like the real thing.
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-[2rem] hover:bg-[#161616] transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#27272a] flex items-center justify-center text-violet-400 mb-5 sm:mb-6 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Local-First Speed</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                  Experience zero latency with our offline-first architecture. Study anywhere, anytime, without waiting for page loads.
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-[2rem] hover:bg-[#161616] transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden sm:col-span-2 md:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#27272a] flex items-center justify-center text-blue-400 mb-5 sm:mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <Languages className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Multilingual Support</h3>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                  Practice in your preferred language with instant translations. Switch seamlessly between languages while maintaining context.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="py-16 sm:py-20 relative z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 md:p-16 text-center border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#0d59f2]/20 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px]"></div>
              
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 sm:mb-6 relative z-10">Ready to ace your exams?</h2>
              <p className="text-base sm:text-lg text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto relative z-10">Join thousands of students who are already learning smarter, not harder.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                <button 
                  onClick={() => navigate('/practice')} 
                  className="cta-glow bg-[#0d59f2] hover:bg-blue-600 text-white text-base sm:text-lg font-bold py-4 px-10 sm:px-12 rounded-full transition-all transform hover:-translate-y-1 shadow-lg shadow-[#0d59f2]/30 w-full sm:w-auto cursor-pointer"
                >
                  Get Started for Free
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER SECTION */}
      <footer className="border-t border-[#27272a] bg-[#0a0a0a] pt-12 sm:pt-16 pb-8 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 mb-10 sm:mb-12">
            
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-[#0d59f2] flex items-center justify-center text-white">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">PrepIQ</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs mb-6">
                Empowering students worldwide with intelligent, adaptive learning tools designed for the modern age.
              </p>
              <div className="flex gap-4">
                <button className="text-slate-400 hover:text-white transition-colors cursor-pointer"><Twitter className="w-5 h-5" /></button>
                <button className="text-slate-400 hover:text-white transition-colors cursor-pointer"><Briefcase className="w-5 h-5" /></button>
                <button className="text-slate-400 hover:text-white transition-colors cursor-pointer"><Code className="w-5 h-5" /></button>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => navigate('/practice')} className="hover:text-[#0d59f2] transition-colors cursor-pointer text-left">Exam Library</button></li>
                <li><button onClick={() => navigate('/pricing')} className="hover:text-[#0d59f2] transition-colors cursor-pointer text-left">Pricing</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-[#0d59f2] transition-colors cursor-pointer text-left">About Us</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => navigate('/contact')} className="hover:text-[#0d59f2] transition-colors cursor-pointer text-left">Contact Us</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-[#0d59f2] transition-colors cursor-pointer text-left">FAQ</button></li>
              </ul>
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => navigate('/privacy')} className="hover:text-[#0d59f2] transition-colors cursor-pointer text-left">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/terms')} className="hover:text-[#0d59f2] transition-colors cursor-pointer text-left">Terms of Service</button></li>
                <li><button onClick={() => navigate('/cookie-policy')} className="hover:text-[#0d59f2] transition-colors cursor-pointer text-left">Cookie Policy</button></li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-[#27272a] pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-xs sm:text-sm">© 2026 PrepIQ Inc. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              Systems Operational
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}