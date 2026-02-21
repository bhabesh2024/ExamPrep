// src/components/common/GeometryVisualizer.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const COLORS = ['#0d59f2', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function GeometryVisualizer({ type, dataStr }) {
  if (!type || !dataStr) return null;

  try {
    // String ko wapas JSON object me convert karna
    const data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;

    if (type === 'recharts-pie') {
      return (
        <div className="h-64 w-full my-6 bg-[#111318] rounded-xl border border-[#2a2f3a] p-4 flex justify-center items-center shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#181b21', borderColor: '#2a2f3a', color: '#fff', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (type === 'recharts-bar') {
      return (
        <div className="h-64 w-full my-6 bg-[#111318] rounded-xl border border-[#2a2f3a] p-4 flex justify-center items-center shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip cursor={{ fill: '#2a2f3a' }} contentStyle={{ backgroundColor: '#181b21', borderColor: '#2a2f3a', color: '#fff', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="#0d59f2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    // Agar koi normal image/svg ho
    if (type === 'image-url') {
      return <img src={dataStr} alt="Geometry Figure" className="max-h-64 rounded-xl mx-auto my-6 border border-[#2a2f3a]" />;
    }

    return null;
  } catch (error) {
    console.error("Chart parsing error:", error);
    return <div className="text-red-400 text-xs p-4 border border-red-500/20 bg-red-500/10 rounded-xl my-4">Failed to load visual data</div>;
  }
}