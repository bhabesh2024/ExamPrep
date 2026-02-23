import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Mail, MessageSquare, Send, CheckCircle, MapPin, Clock, HelpCircle } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const subjects = [
    "General Inquiry",
    "Technical Support",
    "Payment / Billing Issue",
    "Report a Bug",
    "Account Deletion Request",
    "Content / Question Issue",
    "Partnership Inquiry",
    "Other"
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans pt-24 sm:pt-28 pb-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Message Sent!</h2>
          <p className="text-slate-400 mb-8 leading-relaxed text-sm sm:text-base">
            Shukriya aapka! Aapka message humein mil gaya hai. Hum usually <strong className="text-slate-300">24-48 hours</strong> mein jawab dete hain.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
              className="px-6 py-3 rounded-full border border-[#282e39] text-slate-300 hover:bg-[#282e39] text-sm font-semibold transition-all"
            >
              Send Another
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-full bg-[#0d59f2] hover:bg-blue-600 text-white text-sm font-semibold transition-all hover:scale-105"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans pt-24 sm:pt-28 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/8 blur-[100px] rounded-full pointer-events-none"></div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium flex-wrap">
          <button onClick={() => navigate('/')} className="hover:text-[#0d59f2] transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-300">Contact Us</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1d24] border border-[#282e39] mb-5">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Get In Touch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">We'd Love to Hear From You</h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Koi sawaal, problem, ya suggestion ho toh humse zaroor contact karein. Hum yahan aapki madad ke liye hain.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0d59f2]/10 border border-[#0d59f2]/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#0d59f2]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Email Us</h3>
                <p className="text-slate-400 text-xs sm:text-sm">support@prepiq.in</p>
                <p className="text-slate-500 text-xs mt-1">For all general inquiries</p>
              </div>
            </div>

            <div className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Response Time</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Within 24–48 hours</p>
                <p className="text-slate-500 text-xs mt-1">Mon–Sat, 10am–6pm IST</p>
              </div>
            </div>

            <div className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Location</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Guwahati, Assam</p>
                <p className="text-slate-500 text-xs mt-1">India – 781001</p>
              </div>
            </div>

            <div className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">FAQ</h3>
                <p className="text-slate-400 text-xs sm:text-sm">Common questions answered</p>
                <button 
                  onClick={() => navigate('/about')} 
                  className="text-[#0d59f2] text-xs hover:underline mt-1 block"
                >
                  Visit FAQ →
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1d24] border border-[#282e39] rounded-2xl sm:rounded-3xl p-5 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Your Name *</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange} required
                      className="w-full bg-[#0f1115] border border-[#282e39] rounded-xl px-4 py-3 text-slate-200 text-sm placeholder-slate-500 outline-none focus:border-[#0d59f2] transition-colors"
                      placeholder="Rahul Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="w-full bg-[#0f1115] border border-[#282e39] rounded-xl px-4 py-3 text-slate-200 text-sm placeholder-slate-500 outline-none focus:border-[#0d59f2] transition-colors"
                      placeholder="rahul@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Subject</label>
                  <select
                    name="subject" value={formData.subject} onChange={handleChange}
                    className="w-full bg-[#0f1115] border border-[#282e39] rounded-xl px-4 py-3 text-slate-200 text-sm outline-none focus:border-[#0d59f2] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select a subject...</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Message *</label>
                  <textarea
                    name="message" value={formData.message} onChange={handleChange} required rows={5}
                    className="w-full bg-[#0f1115] border border-[#282e39] rounded-xl px-4 py-3 text-slate-200 text-sm placeholder-slate-500 outline-none focus:border-[#0d59f2] transition-colors resize-none"
                    placeholder="Aapka message yahan likhein..."
                  />
                </div>

                <button
                  type="submit" disabled={isLoading || !formData.name || !formData.email || !formData.message}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0d59f2] hover:bg-blue-600 text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}