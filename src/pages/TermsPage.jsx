import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, FileText } from 'lucide-react';

export default function TermsPage() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using PrepIQ (\"Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. These terms apply to all visitors, users, and others who access the Service. We may update these terms at any time; continued use of PrepIQ constitutes acceptance of any changes."
    },
    {
      title: "2. Description of Service",
      content: "PrepIQ is an online exam preparation platform designed to help students prepare for competitive government examinations, including ADRE, SSC, and other state-level exams. Our platform provides practice tests, mock exams, AI-assisted study tools, and performance analytics. The Service is provided on an 'as is' and 'as available' basis."
    },
    {
      title: "3. User Accounts",
      content: "To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating an account. You must be at least 13 years of age to create an account. PrepIQ reserves the right to suspend or terminate accounts that violate these terms."
    },
    {
      title: "4. User Conduct",
      content: "You agree not to: (a) use the Service for any unlawful purpose; (b) share your account credentials with others; (c) attempt to gain unauthorized access to any part of the Service; (d) copy, distribute, or disclose any part of the Service; (e) use automated systems or bots to access the Service; (f) upload or transmit viruses or malicious code; (g) interfere with the proper working of the Service."
    },
    {
      title: "5. Intellectual Property",
      content: "All content on PrepIQ — including questions, explanations, UI design, logos, and software — is the intellectual property of PrepIQ and is protected by applicable copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without explicit written permission. Personal, non-commercial use for exam preparation is permitted."
    },
    {
      title: "6. Pricing and Payments",
      content: "PrepIQ offers both free and paid (Pro) plans. Paid subscriptions are billed in advance and are non-refundable except where required by law. All prices are in Indian Rupees (INR) and are inclusive of applicable taxes. PrepIQ reserves the right to change pricing at any time with prior notice. Payments are processed securely through Razorpay."
    },
    {
      title: "7. Disclaimer of Warranties",
      content: "PrepIQ does not guarantee that the Service will be uninterrupted, error-free, or that the results obtained from use of the Service will be accurate or reliable. We make no guarantees about exam success or score improvement. The Service is provided without any warranty of any kind, either express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose."
    },
    {
      title: "8. Limitation of Liability",
      content: "To the maximum extent permitted by law, PrepIQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from your use of or inability to use the Service. Our total liability to you shall not exceed the amount paid by you in the last 3 months, if any."
    },
    {
      title: "9. Termination",
      content: "PrepIQ may terminate or suspend your account at any time, without prior notice or liability, for any reason, including violation of these Terms. Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive."
    },
    {
      title: "10. Governing Law",
      content: "These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of courts located in Guwahati, Assam."
    },
    {
      title: "11. Contact Us",
      content: "If you have any questions about these Terms of Service, please contact us through our Contact page or write to us at: PrepIQ, Guwahati, Assam, India."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans pt-24 sm:pt-28 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0d59f2]/10 blur-[100px] rounded-full pointer-events-none"></div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium flex-wrap">
          <button onClick={() => navigate('/')} className="hover:text-[#0d59f2] transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-300">Terms of Service</span>
        </nav>

        <div className="flex items-center gap-4 mb-8 sm:mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#0d59f2]/10 border border-[#0d59f2]/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#0d59f2]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Terms of Service</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Last updated: February 2026</p>
          </div>
        </div>

        <div className="bg-[#0d59f2]/5 border border-[#0d59f2]/20 rounded-2xl p-4 sm:p-5 mb-8 sm:mb-10">
          <p className="text-slate-300 text-sm leading-relaxed">
            Please read these Terms of Service carefully before using the PrepIQ platform. These terms govern your access to and use of our services, including all content, features, and functionality available on our website.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {sections.map((sec, idx) => (
            <div key={idx} className="bg-[#1a1d24] border border-[#282e39] rounded-2xl p-5 sm:p-6 hover:border-[#0d59f2]/20 transition-colors">
              <h2 className="text-base sm:text-lg font-bold text-white mb-3">{sec.title}</h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{sec.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-slate-500 text-sm mb-4">Have questions about our Terms?</p>
          <button 
            onClick={() => navigate('/contact')}
            className="px-6 py-3 rounded-full bg-[#0d59f2] hover:bg-blue-600 text-white font-bold text-sm transition-all hover:scale-105"
          >
            Contact Us
          </button>
        </div>
      </main>
    </div>
  );
}