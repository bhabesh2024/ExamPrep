import React, { useState } from 'react';
import axios from 'axios';

const BulkUpload = () => {
  const [jsonData, setJsonData] = useState('');
  const [topicId, setTopicId] = useState(''); // Example: "algebra-01"
  const [subject, setSubject] = useState(''); // 🔥 NAYA STATE: Subject ke liye (e.g., "maths", "gk")
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    try {
      setLoading(true);
      const parsedData = JSON.parse(jsonData); // JSON text ko array mein badlega

      // Hum loop chalayenge taki har question save ho jaye
      for (const q of parsedData) {
        await axios.post('http://localhost:5000/api/questions', {
          subject: q.subject || subject || 'misc', // 🔥 ADDED: Subject DB me bhejne ke liye
          chapterId: topicId,
          question: q.question,
          questionHindi: q.questionHindi || q.questionHindi, // Hindi support
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
          explanationHindi: q.explanationHindi,
          geometryType: q.geometryType || null,
          geometryData: q.geometryData || null
        });
      }

      alert("Saare sawal safaltapurvak save ho gaye! 🎉");
      setJsonData('');
    } catch (err) {
      console.error(err);
      alert("Error: JSON format check karein ya server check karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Bulk Question Uploader (PostgreSQL)</h2>
      
      {/* 🔥 NAYA INPUT FIELD: Subject type karne ke liye */}
      <input 
        type="text" 
        placeholder="Subject (e.g. maths, gk, english)" 
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <input 
        type="text" 
        placeholder="Chapter ID (e.g. algebra-101)" 
        value={topicId}
        onChange={(e) => setTopicId(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <textarea 
        rows="15" 
        placeholder="Apna JSON yahan paste karein..." 
        value={jsonData}
        onChange={(e) => setJsonData(e.target.value)}
        style={{ width: '100%', padding: '10px', fontFamily: 'monospace' }}
      />

      <button 
        onClick={handleUpload} 
        disabled={loading || !jsonData || !topicId || !subject} // Subject bhi mandatory kar diya
        style={{ 
          marginTop: '10px', 
          padding: '10px 20px', 
          backgroundColor: (loading || !jsonData || !topicId || !subject) ? '#ccc' : '#4CAF50', 
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {loading ? "Uploading..." : "Upload to Database"}
      </button>
    </div>
  );
};

export default BulkUpload;