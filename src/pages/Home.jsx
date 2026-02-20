import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Activity, Brain, Zap, Languages, GraduationCap, Twitter, Briefcase, Code, Bot, X, Send } from 'lucide-react';
import { fetchAiResponse } from '../services/aiService';

export default function HomePage() {
  const navigate = useNavigate();

  // 👇 AI Chatbot States 👇
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hi! I am PrepIQ AI Assistant. How can I help you with your preparation today?' }
  ]);
  const messagesEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isChatOpen]);

  // Handle AI Chat Submit
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // User ka message
    const userMsg = chatInput;
    const newHistory = [...chatHistory, { role: 'user', text: userMsg }];
    setChatHistory(newHistory);
    setChatInput("");

    // Thinking state dikhayein
    setChatHistory(prev => [...prev, { role: 'ai', text: "Thinking... 🤔" }]);

    // Asli API Call karein
    const context = "You are an AI assistant on the Home Page of PrepIQ. Guide the user about mock tests and exam preparation.";
    const aiResponseText = await fetchAiResponse(userMsg, context);

    // AI ka asli answer set karein
    setChatHistory(prev => {
      const historyWithoutLoading = prev.slice(0, prev.length - 1);
      return [...historyWithoutLoading, { role: 'ai', text: aiResponseText }];
    });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0a0a0a] text-slate-100 font-sans overflow-x-hidden selection:bg-[#0d59f2] selection:text-white">
      
      {/* Custom Styles for Glows and Glassmorphism */}
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
        .chatbot-glow {
            box-shadow: 0 0 30px -5px rgba(139, 92, 246, 0.5); 
            animation: pulse-glow 3s infinite;
        }
        @keyframes pulse-glow {
            0% { box-shadow: 0 0 20px -5px rgba(139, 92, 246, 0.4); }
            50% { box-shadow: 0 0 35px -5px rgba(139, 92, 246, 0.7); }
            100% { box-shadow: 0 0 20px -5px rgba(139, 92, 246, 0.4); }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        /* Chat scrollbar */
        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: #282e39; border-radius: 10px; }
      `}</style>

      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0d59f2]/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px]"></div>
      </div>

      <main className="flex-grow pt-24">
        
        {/* HERO SECTION */}
        <section className="relative pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161616] border border-[#27272a] text-xs font-medium text-[#0d59f2] mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0d59f2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0d59f2]"></span>
              </span>
              New: AI-Powered Performance Analytics v2.0
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
              Master Your Exams <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d59f2] via-blue-400 to-violet-500">with PrepIQ</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              The intelligent, AI-driven platform for serious students. Experience local-first speed and adaptive learning paths.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <button 
                onClick={() => navigate('/practice')} 
                className="cta-glow bg-[#0d59f2] hover:bg-blue-600 text-white text-lg font-bold py-4 px-10 rounded-full transition-all transform hover:-translate-y-1 w-full sm:w-auto"
              >
                Start Practicing
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="glass-card hover:bg-[#161616]/80 text-white text-lg font-medium py-4 px-10 rounded-full transition-all flex items-center justify-center gap-2 border border-[#27272a] w-full sm:w-auto cursor-pointer"
              >
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Premium Mockup Card */}
            <div className="mt-20 relative mx-auto max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0d59f2] to-violet-600 rounded-2xl blur opacity-20"></div>
              <div className="relative rounded-2xl bg-[#161616] border border-[#27272a] overflow-hidden aspect-[16/9] shadow-2xl flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://placeholder.pics/svg/300')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                <div className="w-full h-full p-8 md:p-12 flex flex-col justify-end items-start text-left relative z-10">
                  <div className="glass-card p-6 rounded-2xl max-w-md w-full border border-white/10 backdrop-blur-md mb-4 transform transition-transform hover:scale-105 duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#0d59f2]/20 flex items-center justify-center text-[#0d59f2]">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">Performance Insight</h3>
                        <p className="text-slate-400 text-sm">You're in the top 5% of students today.</p>
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
        <section className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose PrepIQ?</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Our platform is engineered for performance, giving you the edge you need to succeed.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="glass-card p-8 rounded-[2rem] hover:bg-[#161616] transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d59f2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-14 h-14 rounded-2xl bg-[#27272a] flex items-center justify-center text-[#0d59f2] mb-6 group-hover:bg-[#0d59f2] group-hover:text-white transition-colors duration-300">
                  <Brain className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI-Powered Analysis</h3>
                <p className="text-slate-400 leading-relaxed">
                  Get personalized study recommendations based on your performance history. Our AI identifies your weak spots instantly.
                </p>
              </div>

              <div className="glass-card p-8 rounded-[2rem] hover:bg-[#161616] transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-14 h-14 rounded-2xl bg-[#27272a] flex items-center justify-center text-violet-400 mb-6 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Local-First Speed</h3>
                <p className="text-slate-400 leading-relaxed">
                  Experience zero latency with our offline-first architecture. Study anywhere, anytime, without waiting for page loads.
                </p>
              </div>

              <div className="glass-card p-8 rounded-[2rem] hover:bg-[#161616] transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-14 h-14 rounded-2xl bg-[#27272a] flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <Languages className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Multilingual Support</h3>
                <p className="text-slate-400 leading-relaxed">
                  Practice in your preferred language with instant translations. Switch seamlessly between languages while maintaining context.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="py-20 relative z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-[3rem] p-10 md:p-16 text-center border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#0d59f2]/20 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px]"></div>
              
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">Ready to ace your exams?</h2>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">Join thousands of students who are already learning smarter, not harder.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                <button 
                  onClick={() => navigate('/practice')} 
                  className="cta-glow bg-[#0d59f2] hover:bg-blue-600 text-white text-lg font-bold py-4 px-12 rounded-full transition-all transform hover:-translate-y-1 shadow-lg shadow-[#0d59f2]/30 w-full sm:w-auto cursor-pointer"
                >
                  Get Started for Free
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER SECTION */}
      <footer className="border-t border-[#27272a] bg-[#0a0a0a] pt-16 pb-8 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            
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
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button className="hover:text-[#0d59f2] transition-colors cursor-pointer">Features</button></li>
                <li><button onClick={() => navigate('/practice')} className="hover:text-[#0d59f2] transition-colors cursor-pointer">Exam Library</button></li>
                <li><button className="hover:text-[#0d59f2] transition-colors cursor-pointer">Changelog</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => navigate('/about')} className="hover:text-[#0d59f2] transition-colors cursor-pointer">About Us</button></li>
                <li><button className="hover:text-[#0d59f2] transition-colors cursor-pointer">Blog</button></li>
                <li><button className="hover:text-[#0d59f2] transition-colors cursor-pointer">Contact</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button className="hover:text-[#0d59f2] transition-colors cursor-pointer">Privacy Policy</button></li>
                <li><button className="hover:text-[#0d59f2] transition-colors cursor-pointer">Terms of Service</button></li>
                <li><button className="hover:text-[#0d59f2] transition-colors cursor-pointer">Cookie Policy</button></li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-[#27272a] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">© 2026 PrepIQ Inc. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              Systems Operational
            </div>
          </div>
        </div>
      </footer>

      {/* 👇 FIXED: FLOATING AI CHATBOT WINDOW 👇 */}
      {isChatOpen && (
        <div className="fixed bottom-28 right-4 sm:right-8 z-50 w-[90%] sm:w-96 h-[450px] bg-[#161920]/95 backdrop-blur-xl border border-[#282e39] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_20px_rgba(139,92,246,0.15)] flex flex-col overflow-hidden animate-fade-in-up">
          <div className="p-4 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm leading-none">PrepIQ AI Assistant</h3>
                <span className="text-[10px] text-violet-300 font-medium tracking-wide">Online</span>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-slate-600' : 'bg-gradient-to-br from-violet-600 to-indigo-600'}`}>
                  {msg.role === 'user' ? <GraduationCap className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className={`rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-[#0d59f2]/20 border border-[#0d59f2]/30 rounded-tr-none text-blue-100' : 'bg-[#282e39] border border-white/5 rounded-tl-none text-slate-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-[#282e39] bg-[#1a1d24] shrink-0">
            <form onSubmit={handleChatSubmit} className="relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-[#0f1115] text-slate-200 text-sm rounded-full py-2.5 pl-4 pr-12 border border-[#282e39] focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none placeholder:text-slate-500 transition-all" 
                placeholder="Ask anything..." 
              />
              <button type="submit" disabled={!chatInput.trim()} className="absolute right-1.5 top-1.5 p-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all cursor-pointer">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING AI CHATBOT BUTTON */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="chatbot-glow group relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer border-none outline-none"
        >
          {isChatOpen ? <X className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
          
          {!isChatOpen && (
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-[#161616] border border-[#27272a] rounded-xl text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
              Ask AI Assistant
            </div>
          )}
        </button>
      </div>

    </div>
  );
}