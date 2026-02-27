import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // 1. IMPORT useSearchParams
import axios from 'axios';

// Components
import GuestView from '../components/profile/GuestView';
import HubView from '../components/profile/HubView';
import PerformanceView from '../components/profile/PerformanceView';
import SupportView from '../components/profile/SupportView';
import SettingsView from '../components/profile/SettingsView';
import OrdersView from '../components/profile/OrdersView';
import CommunityView from '../components/profile/CommunityView';
import SavedQuestionsView from '../components/profile/SavedQuestionsView'; 

export default function ProfilePage() {
  const navigate = useNavigate();
  
  // 2. USE SEARCH PARAMS INSTEAD OF LOCAL STATE FOR ACTIVE VIEW
  const [searchParams, setSearchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'hub'; // Default 'hub' rahega agar URL me kuch nahi hai
  
  const setActiveView = (viewName) => {
    setSearchParams({ view: viewName }); // Jab bhi view change hoga, URL update ho jayega
  };

  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [tickets, setTickets] = useState([]);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedData, setFeedData] = useState([]);
  const [savedPosts, setSavedPosts] = useState(() => JSON.parse(localStorage.getItem('savedPosts')) || []);
  const [likedPosts, setLikedPosts] = useState(() => JSON.parse(localStorage.getItem('likedPosts')) || []);
  const [viewedPosts, setViewedPosts] = useState(() => JSON.parse(localStorage.getItem('viewedPosts')) || []);

  useEffect(() => {
    const fetchUserDataAndResults = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser || storedUser === 'undefined') { setIsLoading(false); return; }
      
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      try {
        const [resResponse, ticketsResponse, feedResponse] = await Promise.all([
          axios.get(`/api/results/${parsedUser.id}`),
          axios.get(`/api/support?userId=${parsedUser.id}`),
          axios.get('/api/community/posts') 
        ]);
        setResults(Array.isArray(resResponse.data) ? resResponse.data : []);
        setTickets(Array.isArray(ticketsResponse.data) ? ticketsResponse.data : []);
        
        const formattedFeed = (feedResponse.data || []).map(post => ({
          ...post,
          time: new Date(post.createdAt).toLocaleDateString('en-GB')
        }));
        setFeedData(formattedFeed);

      } catch (error) {} finally { setIsLoading(false); }
    };
    fetchUserDataAndResults();
  }, [navigate]);

  const handleToggleLike = async (postId) => {
    const isLiking = !likedPosts.includes(postId);
    setLikedPosts(prev => {
      const newLikes = isLiking ? [...prev, postId] : prev.filter(id => id !== postId);
      localStorage.setItem('likedPosts', JSON.stringify(newLikes));
      return newLikes;
    });
    try { await axios.post(`/api/community/posts/${postId}/like`, { action: isLiking ? 'like' : 'unlike' }); } catch(e){}
  };

  const handleToggleSave = (postId) => {
    setSavedPosts(prev => {
      const newSaves = prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId];
      localStorage.setItem('savedPosts', JSON.stringify(newSaves));
      return newSaves;
    });
  };

  const handleMarkViewed = async (postId) => {
    if (!viewedPosts.includes(postId)) {
      setViewedPosts(prev => {
        const newViews = [...prev, postId];
        localStorage.setItem('viewedPosts', JSON.stringify(newViews));
        return newViews;
      });
      try { await axios.post(`/api/community/posts/${postId}/view`); } catch(e){}
    }
  };

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); navigate('/login'); };
  
  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMessage.trim()) return;
    setIsSubmitting(true);
    try {
      await axios.post('/api/support', { userId: user.id, subject: supportSubject, message: supportMessage });
      setSupportSubject(''); setSupportMessage('');
      const ticketsResponse = await axios.get(`/api/support?userId=${user.id}`);
      setTickets(ticketsResponse.data);
      alert("Your query has been sent to the Admin!");
    } catch (error) { alert("Failed to send query. Please try again."); } finally { setIsSubmitting(false); }
  };

  const handleReview = (result) => {
    if (result.subject === 'Mock Test') {
      const testId = result.topic.toLowerCase().replace(/\s+/g, '-');
      navigate(`/practice/run/full/${testId}`);
    } else {
      navigate(`/quiz/${result.subject}/${result.topic}`);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex items-center justify-center transition-colors"><div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div></div>;
  if (!user) return <GuestView navigate={navigate} />;

  const totalTests = results.length;
  const totalQuestionsAttempted = results.reduce((acc, curr) => acc + curr.total, 0);
  const totalCorrectAnswers = results.reduce((acc, curr) => acc + curr.score, 0);
  const overallAccuracy = totalQuestionsAttempted > 0 ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100) : 0;
  const userXP = totalCorrectAnswers * 10;
  const level = Math.floor(userXP / 1000) + 1;
  const xpForNextLevel = level * 1000;
  const xpProgressPercent = (userXP % 1000) / 10; 
  const avgScorePercentage = totalTests > 0 ? Math.round(results.reduce((acc, curr) => acc + (curr.score / curr.total * 100), 0) / totalTests) : 0;

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-slate-100 font-sans min-h-screen flex flex-col pt-20 sm:pt-24 pb-20 md:pb-10 transition-colors duration-500 relative overflow-hidden">
      <style>{`
        @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-slide-in { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] transition-colors duration-500"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[120px] transition-colors duration-500"></div>
      </div>

      <main className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl mx-auto">
        {activeView === 'hub' && <HubView user={user} level={level} userXP={userXP} xpForNextLevel={xpForNextLevel} xpProgressPercent={xpProgressPercent} setActiveView={setActiveView} navigate={navigate} handleLogout={handleLogout} />}
        {activeView === 'performance' && <PerformanceView results={results} totalTests={totalTests} totalQuestionsAttempted={totalQuestionsAttempted} overallAccuracy={overallAccuracy} avgScorePercentage={avgScorePercentage} setActiveView={setActiveView} handleReview={handleReview} />}
        {activeView === 'support' && <SupportView setActiveView={setActiveView} supportSubject={supportSubject} setSupportSubject={setSupportSubject} supportMessage={supportMessage} setSupportMessage={setSupportMessage} handleSupportSubmit={handleSupportSubmit} isSubmitting={isSubmitting} tickets={tickets} />}
        {activeView === 'orders' && <OrdersView user={user} setActiveView={setActiveView} navigate={navigate} />}
        {activeView === 'settings' && <SettingsView setActiveView={setActiveView} handleLogout={handleLogout} navigate={navigate} />}
        {activeView === 'community' && <CommunityView setActiveView={setActiveView} feedData={feedData} savedPosts={savedPosts} likedPosts={likedPosts} viewedPosts={viewedPosts} handleToggleLike={handleToggleLike} handleToggleSave={handleToggleSave} handleMarkViewed={handleMarkViewed} />}
        {activeView === 'saved' && <SavedQuestionsView setActiveView={setActiveView} feedData={feedData} savedPosts={savedPosts} likedPosts={likedPosts} viewedPosts={viewedPosts} handleToggleLike={handleToggleLike} handleToggleSave={handleToggleSave} handleMarkViewed={handleMarkViewed} />}
      </main>
    </div>
  );
}