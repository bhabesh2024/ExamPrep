import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Cookie } from 'lucide-react';

export default function CookiePolicyPage() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans pt-24 sm:pt-28 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium flex-wrap">
          <button onClick={() => navigate('/')} className="hover:text-[#0d59f2] transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-300">Cookie Policy</span>
        </nav>

        <div className="flex items-center gap-4 mb-8 sm:mb-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Cookie className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Cookie Policy</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Last updated: February 2026</p>
          </div>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 sm:p-5 mb-8 sm:mb-10">
          <p className="text-slate-300 text-sm leading-relaxed">
            This Cookie Policy explains how PrepIQ uses cookies and similar local storage technologies when you visit our platform. We believe in being transparent about our data practices.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          
          <div className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3">1. What Are Cookies?</h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Cookies are small text files stored on your device by websites. However, PrepIQ primarily uses <strong className="text-slate-300">browser Local Storage</strong> rather than traditional cookies. Local Storage is a similar technology that allows websites to store data directly in your browser. Unlike cookies, local storage data is not automatically sent to the server with each request.
            </p>
          </div>

          <div className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-white mb-4">2. What We Store and Why</h2>
            <div className="space-y-4">
              {[
                { name: "auth_token", purpose: "Authentication", desc: "Stores your login session token so you stay logged in when you return to PrepIQ. This is essential for the Service to function.", required: true },
                { name: "user", purpose: "User Profile", desc: "Stores basic user profile information (name, email, premium status) to display your account details without repeated server requests.", required: true },
                { name: "theme", purpose: "Theme Preference", desc: "Remembers whether you prefer Dark Mode or Light Mode, so your preference is preserved across sessions.", required: false },
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${item.required ? 'bg-[#0d59f2]/5 border-[#0d59f2]/20' : 'bg-[#282e39]/50 border-[#282e39]'}`}>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-[#282e39] px-2 py-0.5 rounded text-amber-400 font-mono">{item.name}</code>
                      <span className="text-xs font-semibold text-slate-300">{item.purpose}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${item.required ? 'bg-[#0d59f2]/20 text-[#0d59f2]' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {item.required ? 'Essential' : 'Preference'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3">3. What We Do NOT Use</h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-4">
              PrepIQ does <strong className="text-slate-300">not</strong> use:
            </p>
            <ul className="space-y-2 text-slate-400 text-sm">
              {[
                "Advertising or tracking cookies",
                "Third-party analytics cookies (like Google Analytics)",
                "Cross-site tracking technologies",
                "Fingerprinting or behavioral tracking",
                "Cookies to build advertising profiles"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3">4. Third-Party Storage</h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              When you use the "Ask Google AI" button in practice mode, you are redirected to Google Gemini's website. Google may use their own cookies and tracking technologies as per their Privacy Policy. PrepIQ does not control these technologies. Similarly, Razorpay (our payment processor) may use cookies during the payment flow, governed by their own policies.
            </p>
          </div>

          <div className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3">5. How to Clear Your Data</h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-4">
              You can clear all PrepIQ-stored data (which logs you out) by clearing your browser's local storage. Here's how:
            </p>
            <div className="space-y-3">
              {[
                { browser: "Chrome / Edge", steps: "Settings → Privacy and Security → Clear browsing data → Advanced → Cookies and site data" },
                { browser: "Firefox", steps: "Settings → Privacy & Security → Cookies and Site Data → Clear Data" },
                { browser: "Safari", steps: "Settings → Safari → Clear History and Website Data" },
                { browser: "Mobile (All Browsers)", steps: "Browser Settings → Clear Cache / Clear Storage Data" },
              ].map((b, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="text-[#0d59f2] font-semibold text-sm shrink-0">{b.browser}:</span>
                  <span className="text-slate-400 text-sm">{b.steps}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3">6. Policy Updates</h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              We may update this Cookie Policy to reflect changes in our practices or legal requirements. We will post the updated policy on this page with a new "Last Updated" date. Your continued use of PrepIQ after any changes constitutes your acceptance of the updated policy.
            </p>
          </div>

        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-slate-500 text-sm mb-4">Cookie Policy ke baare mein sawaal?</p>
          <button 
            onClick={() => navigate('/contact')}
            className="px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition-all hover:scale-105"
          >
            Contact Us
          </button>
        </div>
      </main>
    </div>
  );
}