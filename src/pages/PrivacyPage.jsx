import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Shield } from 'lucide-react';

export default function PrivacyPage() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly: name, email address, and password when you register. During your use of PrepIQ, we also collect performance data including your quiz scores, time spent per question, subjects practiced, and test completion history. We collect device information such as browser type, IP address, and operating system to ensure proper functionality of the Service."
    },
    {
      title: "2. How We Use Your Information",
      content: "We use your information to: (a) provide and maintain the PrepIQ Service; (b) create and manage your user account; (c) display your performance analytics and progress; (d) show you relevant content and recommendations based on your practice history; (e) process payments for Pro subscriptions; (f) send you service-related communications like password reset emails; (g) improve the quality of our question bank and platform features."
    },
    {
      title: "3. Data Storage and Security",
      content: "Your data is stored securely on our servers. We implement industry-standard security measures including encrypted passwords (bcrypt), HTTPS encryption for all data transmission, and secure token-based authentication (JWT). While we take reasonable steps to protect your information, no internet transmission is completely secure, and we cannot guarantee absolute security."
    },
    {
      title: "4. Cookies and Local Storage",
      content: "PrepIQ uses browser local storage to store your authentication token and basic user preferences (such as theme preference). We do not use tracking cookies for advertising purposes. Our Cookie Policy provides more detailed information about how we use cookies and similar technologies. You can clear your local storage at any time through your browser settings."
    },
    {
      title: "5. Information Sharing",
      content: "We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist in operating our website and services (such as payment processors like Razorpay), subject to confidentiality agreements. We may disclose information when required by law or to protect our rights, safety, or the safety of others."
    },
    {
      title: "6. Your Rights",
      content: "You have the right to: (a) access the personal information we hold about you; (b) correct inaccurate or incomplete information; (c) request deletion of your account and associated data; (d) opt-out of non-essential communications. To exercise these rights, please contact us through our Contact page. We will respond to your request within 7 working days."
    },
    {
      title: "7. Children's Privacy",
      content: "PrepIQ is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected information from a child under 13, please contact us immediately and we will delete such information promptly."
    },
    {
      title: "8. Third-Party Services",
      content: "PrepIQ integrates with Google Gemini AI for the 'Ask Google AI' feature in practice mode. When you click this button, your question is sent to Google's servers and you are redirected to Gemini. This is subject to Google's own Privacy Policy. We also use Razorpay for payment processing, which has its own privacy practices."
    },
    {
      title: "9. Data Retention",
      content: "We retain your account information and practice data for as long as your account is active or as needed to provide services. If you delete your account, we will delete or anonymize your data within 30 days, except where we are required to retain it for legal or legitimate business purposes."
    },
    {
      title: "10. Changes to This Policy",
      content: "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on PrepIQ or sending you an email. Your continued use of the Service after changes become effective constitutes acceptance of the revised Privacy Policy."
    },
    {
      title: "11. Contact Us",
      content: "If you have questions or concerns about this Privacy Policy or our data practices, please contact us through our Contact page. We are committed to resolving any privacy-related concerns promptly and transparently."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans pt-24 sm:pt-28 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium flex-wrap">
          <button onClick={() => navigate('/')} className="hover:text-[#0d59f2] transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-300">Privacy Policy</span>
        </nav>

        <div className="flex items-center gap-4 mb-8 sm:mb-10">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Privacy Policy</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Last updated: February 2026</p>
          </div>
        </div>

        <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-4 sm:p-5 mb-8 sm:mb-10">
          <p className="text-slate-300 text-sm leading-relaxed">
            Your privacy is important to us. This Privacy Policy explains how PrepIQ collects, uses, and protects your personal information when you use our platform. We are committed to being transparent about our data practices.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {sections.map((sec, idx) => (
            <div key={idx} className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-5 sm:p-6 hover:border-violet-500/20 transition-colors">
              <h2 className="text-base sm:text-lg font-bold text-white mb-3">{sec.title}</h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{sec.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-slate-500 text-sm mb-4">Privacy ke baare mein koi sawaal?</p>
          <button 
            onClick={() => navigate('/contact')}
            className="px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all hover:scale-105"
          >
            Contact Us
          </button>
        </div>
      </main>
    </div>
  );
}