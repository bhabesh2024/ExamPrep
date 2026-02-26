import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Activity, Brain, Zap, Languages, GraduationCap, Twitter, Briefcase, Code, Star } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: 'Ananya Sharma',
      handle: '@ananya_s',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      text: "PrepIQ's mock tests are a game-changer. The realistic exam simulation helped me manage my time effectively and reduced my anxiety on the actual test day. The detailed performance analytics are pure gold!",
    },
    {
      name: 'Rohan Verma',
      handle: '@rohan_v',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: "The chapter-wise practice questions are incredibly helpful. I can focus on my weak areas and track my progress. The 'local-first' speed means no frustrating loading times. It just works!",
    },
    {
      name: 'Priya Singh',
      handle: '@priya_singh',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: 'The multilingual support is what sets PrepIQ apart. Being able to switch to Hindi for complex reasoning questions has been a lifesaver. It feels like this platform was built just for me.',
    },
    {
        name: 'Sameer Khan',
        handle: '@sameer_k',
        avatar: 'https://randomuser.me/api/portraits/men/81.jpg',
        text: 'From the intuitive UI to the vast question bank, everything about PrepIQ is top-notch. It has become an indispensable part of my daily study routine. I’ve recommended it to all my friends!',
    },
    {
        name: 'Isha Gupta',
        handle: '@isha_g',
        avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
        text: 'The instant results and detailed explanations for each question are fantastic. It helps me understand my mistakes immediately and learn from them. PrepIQ is just brilliant!',
    },
    {
        name: 'Vikram Rathore',
        handle: '@vikram_r',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
        text: 'As someone preparing for multiple state exams, the variety of tests on PrepIQ is a blessing. The platform is super reliable and has boosted my confidence immensely. Two thumbs up!',
    }
  ];

  return (
    // Hardcoded bg hatakar transparent rakha hai taaki App.jsx ka background apply ho
    <div className="relative flex flex-col min-h-screen bg-transparent font-sans overflow-x-hidden transition-colors duration-500">
      
      <style>{`
        .cta-glow:hover { box-shadow: 0 0 25px -5px rgba(13, 89, 242, 0.6); }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
        .animate-scroll {
            animation: scroll 60s linear infinite;
        }
      `}</style>

      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-[#0d59f2]/10 blur-[120px] transition-colors duration-500"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 dark:bg-violet-600/10 blur-[120px] transition-colors duration-500"></div>
      </div>

      <main className="flex-grow pt-24 pb-24 md:pb-0">
        
        {/* HERO SECTION */}
        <section className="relative pb-20 sm:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#161616] border border-zinc-200 dark:border-[#27272a] text-xs font-medium text-blue-600 dark:text-[#0d59f2] mb-8 animate-fade-in-up shadow-sm transition-colors duration-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-[#0d59f2]"></span>
              </span>
              50+ Mock Tests · ADRE · SSC · State Exams
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.1] animate-fade-in-up transition-colors duration-500" style={{ animationDelay: '0.1s', opacity: 0 }}>
              Master Your Exams <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-violet-500 dark:from-[#0d59f2] dark:via-blue-400 dark:to-violet-500">with PrepIQ</span>
            </h1>

            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-zinc-600 dark:text-slate-400 leading-relaxed animate-fade-in-up transition-colors duration-500" style={{ animationDelay: '0.2s', opacity: 0 }}>
              The smart exam preparation platform for ADRE, SSC & state competitive exams. Practice with real exam patterns, Hindi translations, and instant results.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <button onClick={() => navigate('/practice')} className="cta-glow bg-blue-600 dark:bg-[#0d59f2] hover:bg-blue-700 dark:hover:bg-blue-600 text-white text-base sm:text-lg font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-full transition-all transform hover:-translate-y-1 w-full sm:w-auto tap-effect">
                Start Practicing
              </button>
              <button onClick={() => navigate('/about')} className="bg-white/80 dark:bg-[#161616]/80 hover:bg-zinc-50 dark:hover:bg-[#161616] text-zinc-900 dark:text-white text-base sm:text-lg font-medium py-3.5 sm:py-4 px-8 sm:px-10 rounded-full transition-all flex items-center justify-center gap-2 border border-zinc-200 dark:border-[#27272a] shadow-sm w-full sm:w-auto cursor-pointer tap-effect">
                <PlayCircle className="w-5 h-5" />
                Learn More
              </button>
            </div>

            <div className="mt-16 sm:mt-20 relative mx-auto max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl blur opacity-20"></div>
              <div className="relative rounded-2xl bg-white dark:bg-[#161616] border border-zinc-200 dark:border-[#27272a] overflow-hidden aspect-[16/9] shadow-2xl flex items-center justify-center transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-100 dark:from-[#0a0a0a] via-transparent to-transparent transition-colors duration-500"></div>
                <div className="w-full h-full p-6 sm:p-8 md:p-12 flex flex-col justify-end items-start text-left relative z-10">
                  <div className="glass-card p-4 sm:p-6 rounded-2xl max-w-xs sm:max-w-md w-full mb-4 transform transition-transform hover:scale-105 duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-[#0d59f2]/20 flex items-center justify-center text-blue-600 dark:text-[#0d59f2]">
                        <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h3 className="text-zinc-900 dark:text-white font-bold text-sm sm:text-base">Performance Insight</h3>
                        <p className="text-zinc-500 dark:text-slate-400 text-xs sm:text-sm">You're in the top 5% of students today.</p>
                      </div>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-[#27272a] rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500 dark:text-slate-500 font-medium">
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4 transition-colors duration-500">Why Choose PrepIQ?</h2>
              <p className="text-zinc-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">Our platform is engineered for performance, giving you the edge you need to succeed.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              
              <div className="glass-card p-6 sm:p-8 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-100 dark:bg-[#27272a] flex items-center justify-center text-blue-600 dark:text-[#0d59f2] mb-5 sm:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Brain className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-3 transition-colors duration-500">Real Exam Simulation</h3>
                <p className="text-zinc-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">50+ full-length mock tests modelled on ADRE, SSC & state exam patterns. Timed, scored, and analyzed.</p>
              </div>

              <div className="glass-card p-6 sm:p-8 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-100 dark:bg-[#27272a] flex items-center justify-center text-violet-600 dark:text-violet-400 mb-5 sm:mb-6 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-3 transition-colors duration-500">Local-First Speed</h3>
                <p className="text-zinc-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">Experience zero latency with our offline-first architecture. Study anywhere, anytime, without waiting.</p>
              </div>

              <div className="glass-card p-6 sm:p-8 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden sm:col-span-2 md:col-span-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-100 dark:bg-[#27272a] flex items-center justify-center text-blue-500 dark:text-blue-400 mb-5 sm:mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <Languages className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-3 transition-colors duration-500">Multilingual Support</h3>
                <p className="text-zinc-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">Practice in your preferred language with instant translations. Switch seamlessly between languages.</p>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* =========================================
      🔥 WHAT OUR STUDENTS SAY (WALL OF LOVE)
      ========================================= */}
      <div className="py-24 bg-white dark:bg-[#09090b] transition-colors relative overflow-hidden border-t border-zinc-200 dark:border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-500 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-current" /> Wall of Love
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
            Loved by thousands of <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">serious aspirants</span>
          </h2>
        </div>

        <div className="relative [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                    <div key={index} className="w-[380px] flex-shrink-0 mx-4">
                        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 h-full flex flex-col justify-between shadow-lg transition-all duration-300 hover:border-amber-400/50 hover:shadow-amber-500/10">
                          <div>
                            <div className="flex items-center gap-4 mb-4">
                                <img className="w-12 h-12 rounded-full object-cover" src={testimonial.avatar} alt={testimonial.name} />
                                <div>
                                    <h4 className="font-bold text-zinc-800 dark:text-white">{testimonial.name}</h4>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{testimonial.handle}</p>
                                </div>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">{testimonial.text}</p>
                          </div>
                          <div className="flex mt-4">
                              {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                              ))}
                          </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      {/* Spacer for mobile bottom nav */}
      <div className="h-20 md:hidden"></div>
      {/* FOOTER SECTION */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/50 bg-zinc-50 dark:bg-[#0a0a0a] pt-12 sm:pt-16 pb-24 md:pb-8 relative z-10 mt-auto transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 mb-10 sm:mb-12">
            
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-blue-600 dark:bg-[#0d59f2] flex items-center justify-center text-white">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">PrepIQ</span>
              </div>
              <p className="text-zinc-500 dark:text-slate-400 text-sm max-w-xs mb-6">
                Empowering students worldwide with intelligent, adaptive learning tools designed for the modern age.
              </p>
              <div className="flex gap-4">
                <button className="text-zinc-400 hover:text-zinc-900 dark:text-slate-500 dark:hover:text-white transition-colors cursor-pointer tap-effect"><Twitter className="w-5 h-5" /></button>
                <button className="text-zinc-400 hover:text-zinc-900 dark:text-slate-500 dark:hover:text-white transition-colors cursor-pointer tap-effect"><Briefcase className="w-5 h-5" /></button>
                <button className="text-zinc-400 hover:text-zinc-900 dark:text-slate-500 dark:hover:text-white transition-colors cursor-pointer tap-effect"><Code className="w-5 h-5" /></button>
              </div>
            </div>
            
            <div>
              <h4 className="text-zinc-900 dark:text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-500 dark:text-slate-400">
                <li><button onClick={() => navigate('/practice')} className="hover:text-blue-600 dark:hover:text-[#0d59f2] transition-colors cursor-pointer text-left tap-effect">Exam Library</button></li>
                <li><button onClick={() => navigate('/pricing')} className="hover:text-blue-600 dark:hover:text-[#0d59f2] transition-colors cursor-pointer text-left tap-effect">Pricing</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-blue-600 dark:hover:text-[#0d59f2] transition-colors cursor-pointer text-left tap-effect">About Us</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-zinc-900 dark:text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-2 text-sm text-zinc-500 dark:text-slate-400">
                <li><button onClick={() => navigate('/contact')} className="hover:text-blue-600 dark:hover:text-[#0d59f2] transition-colors cursor-pointer text-left tap-effect">Contact Us</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-blue-600 dark:hover:text-[#0d59f2] transition-colors cursor-pointer text-left tap-effect">FAQ</button></li>
              </ul>
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-zinc-900 dark:text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-500 dark:text-slate-400">
                <li><button onClick={() => navigate('/privacy')} className="hover:text-blue-600 dark:hover:text-[#0d59f2] transition-colors cursor-pointer text-left tap-effect">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/terms')} className="hover:text-blue-600 dark:hover:text-[#0d59f2] transition-colors cursor-pointer text-left tap-effect">Terms of Service</button></li>
                <li><button onClick={() => navigate('/cookie-policy')} className="hover:text-blue-600 dark:hover:text-[#0d59f2] transition-colors cursor-pointer text-left tap-effect">Cookie Policy</button></li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-zinc-200 dark:border-[#27272a] pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 dark:text-slate-500 text-xs sm:text-sm">© 2026 PrepIQ Inc. All rights reserved.</p>
            <div className="flex items-center gap-2 text-zinc-500 dark:text-slate-500 text-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              Systems Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
