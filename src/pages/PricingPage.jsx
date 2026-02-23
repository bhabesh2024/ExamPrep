import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check, X, Zap, Crown, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';

export default function PricingPage() {
  const navigate = useNavigate();
  
  // Nayi State: '3months', '6months', ya 'yearly'
  const [planDuration, setPlanDuration] = useState('yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  // User checking logic
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};
  const isPremium = user.isPremium;

  // Price Calculation Logic
  const getPrice = () => {
    if (planDuration === '3months') return '499';
    if (planDuration === '6months') return '899';
    return '1499';
  };

  const getDurationText = () => {
    if (planDuration === '3months') return '3 months';
    if (planDuration === '6months') return '6 months';
    return 'year';
  };

  // Razorpay Load Script Function
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgradeClick = async () => {
    if (!user.email) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Razorpay SDK load nahi hua. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }

      const amountToPay = getPrice();
      const orderResponse = await axios.post('/api/create-order', { amount: amountToPay });
      const orderData = orderResponse.data;

      const options = {
        key: 'rzp_test_SJZF5HPMUW1jwi', // Test Key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'PrepIQ Premium',
        description: `Upgrade to Pro (${getDurationText()})`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            await axios.post('/api/verify-payment', {
              ...response,
              userId: user.id
            });
            
            // Success: Update Local Storage to show premium instantly
            const updatedUser = { ...user, isPremium: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            alert("Payment Successful! Welcome to PrepIQ Premium! 🎉");
            navigate('/profile'); 
          } catch (verifyErr) {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: '9999999999'
        },
        theme: {
          color: '#2525f4' // Match with your exact design color
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      // Agar user popup band kar de toh loading hatane ke liye event
      paymentObject.on('payment.failed', function (response){
          alert("Payment Failed or Cancelled.");
      });

      paymentObject.open();

    } catch (error) {
      console.error("Payment init error:", error);
      alert('Kuch galat ho gaya payment initiate karne mein.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 pt-28 pb-24 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2525f4]/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2525f4]/10 border border-[#2525f4]/30 text-[#2525f4] text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" /> PrepIQ Pro
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            Unlock Your True <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Potential</span>
          </h1>
          <p className="text-lg text-slate-400">
            Choose the perfect plan to accelerate your exam preparation. Join thousands of top-ranking students today.
          </p>

          {/* NAYA 3-WAY TOGGLE SWITCH */}
          <div className="flex justify-center mt-10">
            <div className="bg-[#161616] border border-[#27272a] rounded-full p-1.5 flex gap-1 shadow-lg overflow-x-auto max-w-full">
              <button 
                onClick={() => setPlanDuration('3months')}
                className={`px-5 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${planDuration === '3months' ? 'bg-[#2525f4] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                3 Months
              </button>
              <button 
                onClick={() => setPlanDuration('6months')}
                className={`px-5 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${planDuration === '6months' ? 'bg-[#2525f4] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                6 Months
              </button>
              <button 
                onClick={() => setPlanDuration('yearly')}
                className={`px-5 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${planDuration === 'yearly' ? 'bg-[#2525f4] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Yearly 
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${planDuration === 'yearly' ? 'bg-white/20 text-white border-white/30' : 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'}`}>
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* FREE PLAN CARD */}
          <div className="bg-[#111118] border border-[#27272a] rounded-3xl p-8 flex flex-col w-full">
            <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
            <p className="text-slate-400 text-sm mb-6">Essential features for casual practice.</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-white">₹0</span>
              <span className="text-slate-500 font-medium">/forever</span>
            </div>
            
            <button 
              disabled={!isPremium}
              onClick={() => navigate('/practice')}
              className={`w-full py-3.5 rounded-xl font-bold transition-all mb-8 ${!isPremium ? 'bg-white/10 text-white cursor-not-allowed border border-white/20' : 'bg-transparent text-white border border-[#27272a] hover:bg-white/5'}`}
            >
              {!isPremium ? 'Your Current Plan' : 'Downgrade to Free'}
            </button>

            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /><span className="text-slate-300 text-sm">Access to Free Mock Tests</span></div>
              <div className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /><span className="text-slate-300 text-sm">Basic Progress Tracking</span></div>
              <div className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /><span className="text-slate-300 text-sm">Standard Subjects</span></div>
              
              <div className="flex items-center gap-3 opacity-50"><X className="w-5 h-5 text-slate-600 shrink-0" /><span className="text-slate-500 text-sm line-through">Global Leaderboard Ranking</span></div>
              <div className="flex items-center gap-3 opacity-50"><X className="w-5 h-5 text-slate-600 shrink-0" /><span className="text-slate-500 text-sm line-through">Advanced Performance Analytics</span></div>
            </div>
          </div>

          {/* PRO PLAN CARD - Alignment Fixed */}
          <div className="bg-gradient-to-b from-[#1a1ab8]/20 to-[#111118] border border-[#2525f4]/50 rounded-3xl p-8 flex flex-col relative shadow-[0_0_40px_rgba(37,37,244,0.15)] w-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              Most Popular
            </div>
            
            <div className="flex justify-between items-start mb-2 mt-2">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2"><Crown className="w-6 h-6 text-yellow-400" /> Pro</h3>
            </div>
            <p className="text-blue-200/70 text-sm mb-6">Everything you need to top the exams.</p>
            
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-5xl font-black text-white transition-all duration-300">₹{getPrice()}</span>
              <span className="text-slate-400 font-medium">/{getDurationText()}</span>
            </div>
            
            <button 
              onClick={handleUpgradeClick}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl font-bold transition-all mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(37,37,244,0.4)] hover:shadow-[0_0_30px_rgba(37,37,244,0.6)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isProcessing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                isPremium ? 'Manage Subscription' : 'Upgrade to Pro'
              )}
            </button>

            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3"><Check className="w-5 h-5 text-[#2525f4] shrink-0" /><span className="text-white font-medium text-sm">Everything in Basic</span></div>
              
              <div className="flex items-center gap-3"><Crown className="w-5 h-5 text-yellow-400 shrink-0" /><span className="text-slate-200 text-sm">Unlock <span className="font-bold text-yellow-400">Global Leaderboard</span></span></div>
              <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" /><span className="text-slate-200 text-sm">Advanced Performance Analytics</span></div>
              <div className="flex items-center gap-3"><Zap className="w-5 h-5 text-amber-400 shrink-0" /><span className="text-slate-200 text-sm">Ad-free smooth experience</span></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}