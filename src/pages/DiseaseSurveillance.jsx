import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, TrendingUp, Filter, Database } from 'lucide-react';
import { MOCK_DB } from '../services/mockData';

const DiseaseSurveillance = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(MOCK_DB.diseaseTrends);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f172a] border border-white/10 p-4 rounded-xl shadow-xl">
          <p className="font-bold mb-2">Rwanda Week {label.replace('W', '')}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm flex items-center gap-2 mb-1" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              {entry.name}: {entry.value} cases
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full min-h-full p-10 fade-in text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with DHIS2 DB sync info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Disease Surveillance</h1>
            <p className="text-[#94a3b8]">Epidemiology early-warning system powered by AI triage transcripts.</p>
          </div>
          
          <div className="flex flex-col items-end">
             <div className="glass-panel px-4 py-2 flex items-center gap-3 border-[#2dd4bf]/20">
               <Database size={16} className="text-[#2dd4bf]" />
               <div>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Data Source Backend</p>
                 <p className="text-sm font-bold text-[#2dd4bf]">MoH / DHIS2 Synchronized</p>
               </div>
             </div>
             <p className="text-xs text-gray-500 mt-2 max-w-xs text-right hidden lg:block">
               Data altered in real-time by CHW (Community Health Worker) assessments written directly to the Rwanda Ministry of Health HMIS infrastructure.
             </p>
          </div>
        </div>

        {/* Global Alert Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded-2xl border border-red-500/30 bg-red-500/10 flex items-start gap-4">
            <div className="bg-red-500/20 p-2 rounded-lg text-red-500"><AlertTriangle size={24} /></div>
            <div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Critical Alert</span>
              <h3 className="font-bold text-lg mt-1 text-white">Malaria Spike</h3>
              <p className="text-sm text-red-200 mt-1">Bugesera District (+45% over baseline). Rapid response team dispatched.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border-orange-500/30 bg-orange-500/10 flex items-start gap-4">
            <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500"><TrendingUp size={24} /></div>
            <div>
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">Warning</span>
              <h3 className="font-bold text-lg mt-1 text-white">Respiratory Clusters</h3>
              <p className="text-sm text-orange-200 mt-1">Musanze high schools showing early symptoms. Testing deployed.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border-yellow-500/30 bg-yellow-500/10 flex items-start gap-4">
             <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-500"><AlertTriangle size={24} /></div>
            <div>
              <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Watch</span>
              <h3 className="font-bold text-lg mt-1 text-white">Maternal Complications</h3>
              <p className="text-sm text-yellow-200 mt-1">Slight elevation in late-night SAMU requests from Nyagatare region.</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="glass-panel p-6 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold">8-Week Epidemiological Trends</h2>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition">
              <Filter size={14} /> Filter by District
            </button>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMalaria" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRespiratory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMaternal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" datakey="malaria" name="Malaria" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorMalaria)" />
                <Area type="monotone" dataKey="respiratory" name="Respiratory" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorRespiratory)" />
                <Area type="monotone" dataKey="maternal" name="Maternal Triage" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorMaternal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Breakdown Table */}
        <div className="glass-panel p-6">
           <h2 className="text-lg font-bold mb-6">District Heatmap Breakdown</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {['Gasabo', 'Kicukiro', 'Nyarugenge', 'Bugesera', 'Musanze', 'Rubavu', 'Huye', 'Kayonza'].map((district, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center group hover:bg-white/10 transition-colors cursor-pointer">
                   <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{district}</span>
                   <div className="flex gap-1">
                      <div className={`w-2 h-6 rounded-sm ${i === 3 || i === 5 ? 'bg-red-500' : 'bg-green-500/50'}`}></div>
                      <div className={`w-2 h-6 rounded-sm ${i === 4 ? 'bg-orange-500' : 'bg-green-500/50'}`}></div>
                      <div className={`w-2 h-6 rounded-sm ${i === 7 ? 'bg-yellow-500' : 'bg-green-500/50'}`}></div>
                   </div>
                </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default DiseaseSurveillance;
