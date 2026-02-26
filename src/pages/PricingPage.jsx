import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, X, Zap, Crown, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const navigate = useNavigate();
  // State for plan duration: '3', '6', or '12'
  const [planDuration, setPlanDuration] = useState('12');

  const plans = {
    '3': { price: 499, label: '3 Months', discount: null },
    '6': { price: 899, label: '6 Months', discount: 'Save 10%' },
    '12': { price: 1499, label: 'Yearly', discount: 'Save 20%' }
  };

  const handleUpgrade = (planType) => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    // TODO: Add Payment Gateway Logic Here
    console.log(`Initiating payment for ${planType} plan - ${planDuration} months`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-slate-200 font-sans relative overflow-hidden pt-32 pb-24 transition-colors duration-500">
      
      {/* Dynamic Ambient Backgrounds */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] transition-colors duration-500"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 dark:bg-amber-500/10 blur-[120px] transition-colors duration-500"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 transition-colors shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Simple & Transparent Pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-6 transition-colors duration-500">
            Unlock Your Full <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">Preparation Potential</span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-slate-400 font-medium transition-colors duration-500">
            Choose the perfect plan to accelerate your exam preparation. Get unlimited access to premium mock tests and advanced analytics.
          </p>
        </div>

        {/* 3-Step Billing Toggle */}
        <div className="flex justify-center mb-12 relative z-20">
          <div className="bg-white dark:bg-[#18181b] p-1.5 rounded-2xl inline-flex items-center border border-zinc-200 dark:border-white/5 shadow-sm transition-colors duration-500">
            
            <button 
              onClick={() => setPlanDuration('3')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 tap-effect ${planDuration === '3' ? 'bg-zinc-100 dark:bg-[#27272a] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white'}`}
            >
              3 Months
            </button>
            
            <button 
              onClick={() => setPlanDuration('6')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 tap-effect flex items-center gap-2 ${planDuration === '6' ? 'bg-zinc-100 dark:bg-[#27272a] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white'}`}
            >
              6 Months {planDuration === '6' && <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase tracking-wider">{plans['6'].discount}</span>}
            </button>
            
            <button 
              onClick={() => setPlanDuration('12')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 tap-effect flex items-center gap-2 ${planDuration === '12' ? 'bg-zinc-100 dark:bg-[#27272a] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white'}`}
            >
              Yearly <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] uppercase tracking-wider">{plans['12'].discount}</span>
            </button>

          </div>
        </div>

        {/* Pricing Cards - Items-stretch ensures both cards are equal height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Basic / Free Plan */}
          <div className="h-full flex flex-col bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-8 sm:p-10 shadow-lg hover:shadow-xl transition-all duration-500 relative group">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-[#18181b] flex items-center justify-center text-zinc-600 dark:text-slate-400 mb-6 border border-zinc-200 dark:border-white/5 transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 transition-colors">Basic Plan</h3>
              <p className="text-sm font-medium text-zinc-500 dark:text-slate-400 transition-colors">Perfect for getting started and exploring the platform.</p>
            </div>
            
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-white/5 transition-colors">
              <span className="text-5xl font-black text-zinc-900 dark:text-white transition-colors">Free</span>
              <span className="text-zinc-500 dark:text-slate-400 font-medium"> / forever</span>
            </div>

            {/* flex-grow ensures the button is pushed to the bottom so it aligns with the right card */}
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-sm font-semibold text-zinc-700 dark:text-slate-300 transition-colors"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> 2 Full Length Mock Tests</li>
              <li className="flex items-center gap-3 text-sm font-semibold text-zinc-700 dark:text-slate-300 transition-colors"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> 5 Sectional Tests</li>
              <li className="flex items-center gap-3 text-sm font-semibold text-zinc-700 dark:text-slate-300 transition-colors"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Basic Performance Analytics</li>
              <li className="flex items-center gap-3 text-sm font-semibold text-zinc-400 dark:text-slate-600 transition-colors"><X className="w-5 h-5" /> Ad-free Experience</li>
              <li className="flex items-center gap-3 text-sm font-semibold text-zinc-400 dark:text-slate-600 transition-colors"><X className="w-5 h-5" /> Detailed AI Explanations</li>
            </ul>

            <button onClick={() => navigate('/practice')} className="w-full py-4 mt-auto rounded-xl bg-zinc-100 dark:bg-[#18181b] hover:bg-zinc-200 dark:hover:bg-[#27272a] text-zinc-900 dark:text-white font-black transition-colors tap-effect border border-zinc-200 dark:border-white/5">
              Start for Free
            </button>
          </div>

          {/* Premium / Pro Plan (Same Height as Free Plan) */}
          <div className="h-full flex flex-col relative bg-white dark:bg-[#121214] rounded-[2rem] p-8 sm:p-10 shadow-[0_0_40px_rgba(59,130,246,0.15)] dark:shadow-[0_0_50px_rgba(59,130,246,0.1)] border-2 border-blue-500/50 transition-all duration-500 group overflow-hidden z-10">
            
            {/* Glowing Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none transition-colors"></div>
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-b-xl shadow-md">
              Most Popular
            </div>

            <div className="mb-8 mt-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 border border-blue-200 dark:border-blue-500/20 transition-colors shadow-sm">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-2 transition-colors">PrepIQ Pro</h3>
              <p className="text-sm font-medium text-zinc-500 dark:text-slate-400 transition-colors">Everything you need to guarantee your success in the exams.</p>
            </div>
            
            <div className="mb-8 pb-8 border-b border-zinc-200 dark:border-white/5 transition-colors relative">
              <span className="text-5xl font-black text-zinc-900 dark:text-white transition-colors">
                ₹{plans[planDuration].price}
              </span>
              <span className="text-zinc-500 dark:text-slate-400 font-medium"> / {planDuration === '12' ? 'year' : `${planDuration} months`}</span>
              
              {/* Dynamic Sub-text for savings */}
              {planDuration !== '3' && (
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-2">
                  Best Value ({plans[planDuration].discount})
                </p>
              )}
            </div>

            {/* flex-grow pushes the button down so both buttons line up perfectly */}
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-sm font-bold text-zinc-900 dark:text-slate-200 transition-colors"><CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-500" /> All 50+ Full Mock Tests unlocked</li>
              <li className="flex items-center gap-3 text-sm font-bold text-zinc-900 dark:text-slate-200 transition-colors"><CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-500" /> Unlimited Sectional Tests</li>
              <li className="flex items-center gap-3 text-sm font-bold text-zinc-900 dark:text-slate-200 transition-colors"><CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-500" /> Advanced AI Explanations & Solutions</li>
              <li className="flex items-center gap-3 text-sm font-bold text-zinc-900 dark:text-slate-200 transition-colors"><CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-500" /> 100% Ad-Free Experience</li>
              <li className="flex items-center gap-3 text-sm font-bold text-zinc-900 dark:text-slate-200 transition-colors"><CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-500" /> Priority Email Support</li>
            </ul>

            <button onClick={() => handleUpgrade('pro')} className="w-full py-4 mt-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black transition-all shadow-lg hover:shadow-blue-500/30 tap-effect flex items-center justify-center gap-2 group/btn">
              Upgrade to Pro <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>

        </div>

        {/* Trust Section */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 border-t border-zinc-200 dark:border-white/5 pt-12 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"><ShieldCheck className="w-5 h-5" /></div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Secure Payments</h4>
              <p className="text-xs font-medium text-zinc-500 dark:text-slate-400">256-bit SSL encryption</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"><Zap className="w-5 h-5" /></div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Instant Activation</h4>
              <p className="text-xs font-medium text-zinc-500 dark:text-slate-400">Get Pro features immediately</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}