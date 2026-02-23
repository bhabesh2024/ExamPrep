import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Target, Timer, Play, Database } from 'lucide-react';
import { subjectsData } from '../data/syllabusData';

export default function SectionalTestList() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
  const [mockQuestionCount, setMockQuestionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const cleanSubjectId = subjectId ? subjectId.replace(/[{}$]/g, '') : '';
  const subject = subjectsData.find(s => s.id.toLowerCase() === cleanSubjectId.toLowerCase());

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchSubjectQuestionsCount = async () => {
      try {
        const res = await axios.get('/api/questions');
        // 🔥 BUG FIX: ID ('maths') ki jagah Asli Title ('Mathematics') se match kiya
        if (subject) {
          const subjectQs = res.data.filter(q => q.subject.toLowerCase() === subject.title.toLowerCase());
          setMockQuestionCount(subjectQs.length >= 50 ? 50 : subjectQs.length);
        }
      } catch (err) {
        console.error("Failed to fetch count:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (subject) fetchSubjectQuestionsCount();
  }, [subject]); // cleanSubjectId hata kar subject use kiya
  
  if (!subject) {
    return (
      <div className="min-h-screen bg-[#0f1115] pt-32 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-4">Subject Not Found</h1>
        <button onClick={() => navigate('/practice')} className="px-6 py-2 bg-[#0d59f2] hover:bg-blue-600 text-white rounded-lg cursor-pointer">Go Back</button>
      </div>
    );
  }

  // Generate 20 Sectional Mocks
  const tests = Array.from({ length: 20 }, (_, i) => ({
    id: subject.id + '-' + (i + 1),
    title: subject.title + ' Mock Test ' + (i + 1),
    questions: mockQuestionCount,
    time: mockQuestionCount > 0 ? "60 Mins" : "0 Mins",
  }));

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/practice')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Zone
        </button>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{subject.title} Sectional Mocks</h1>
          <p className="text-slate-400">Complete all 20 tests to master this subject. Each test has a strict 60-minute timer.</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-10 h-10 border-4 border-[#0d59f2]/30 border-t-[#0d59f2] rounded-full animate-spin mb-4"></div>
             <p className="text-slate-400 font-medium">Checking Live Database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div key={test.id} className="bg-[#181b21] border border-white/5 hover:border-[#0d59f2]/30 rounded-2xl p-6 transition-all group relative overflow-hidden">
                
                {mockQuestionCount > 0 && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold bg-[#00d26a]/15 text-[#00d26a] border border-[#00d26a]/30 shadow-[0_0_10px_rgba(0,210,106,0.2)] animate-pulse uppercase tracking-widest">
                    Live Now
                  </div>
                )}

                <h3 className="text-lg font-bold text-white mb-4 group-hover:text-[#0d59f2] transition-colors">{test.title}</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${mockQuestionCount > 0 ? 'text-[#00d26a]' : 'text-slate-500'}`}>
                    <Target className="w-4 h-4" /> {test.questions} Qs
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Timer className="w-4 h-4" /> {test.time}
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/practice/start/sectional/' + test.id)}
                  disabled={mockQuestionCount === 0}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 
                    ${mockQuestionCount > 0 
                      ? 'bg-[#282e39] group-hover:bg-[#0d59f2] text-white cursor-pointer' 
                      : 'bg-[#1a1d24] text-slate-600 cursor-not-allowed border border-[#282e39]'}`}
                >
                  {mockQuestionCount > 0 ? <><Play className="w-4 h-4" /> Start Test</> : <><Database className="w-4 h-4"/> Add Qs from Admin</>}
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}