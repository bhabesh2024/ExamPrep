import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Timer, Play } from 'lucide-react';
import { subjectsData } from '../data/syllabusData';

export default function SectionalTestList() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Safe search logic taaki error na aaye
  const cleanSubjectId = subjectId ? subjectId.replace(/[{}$]/g, '') : '';
  const subject = subjectsData.find(s => s.id.toLowerCase() === cleanSubjectId.toLowerCase());
  
  if (!subject) {
    return (
      <div className="min-h-screen bg-[#0f1115] pt-32 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-4">Subject Not Found</h1>
        <p className="text-slate-400 mb-6">Looks like the link is broken.</p>
        <button onClick={() => navigate('/practice')} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Go Back</button>
      </div>
    );
  }

  // Generate 20 Sectional Mocks
  const tests = Array.from({ length: 20 }, (_, i) => ({
    id: subject.id + '-' + (i + 1),
    title: subject.title + ' Mock Test ' + (i + 1),
    questions: 50,
    time: "60 Mins",
    marks: 50
  }));

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate('/practice')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Zone
        </button>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{subject.title} Sectional Mocks</h1>
          <p className="text-slate-400">Complete all 20 tests to master this subject. Each test has a strict 60-minute timer.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test.id} className="bg-[#181b21] border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 transition-all group">
              <h3 className="text-lg font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">{test.title}</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 text-xs text-slate-400"><Target className="w-4 h-4" /> {test.questions} Qs</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400"><Timer className="w-4 h-4" /> {test.time}</div>
              </div>

              <button 
                onClick={() => navigate('/practice/start/sectional/' + test.id)}
                className="w-full py-3 rounded-xl bg-[#282e39] group-hover:bg-blue-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                View Details <Play className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}