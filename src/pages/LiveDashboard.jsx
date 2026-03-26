import React, { useState, useEffect } from 'react';
import { PhoneIncoming, Siren, Brain, Users, Map, Activity, Clock } from 'lucide-react';
import { MOCK_DB } from '../services/mockData';

const LiveDashboard = () => {
  const [calls, setCalls] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [metrics, setMetrics] = useState({
    totalCalls: 0,
    emergencies: 0,
    avgConfidence: 0,
    activeCHWs: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/status');
        const data = await response.json();
        
        // Merge real data with mock for a full UI
        const mergedCalls = [
          ...data.liveCalls.map(c => ({
            timestamp: c.id,
            duration: Math.floor(Math.random() * 60) + 30,
            aiConfidence: c.confidence,
            outcome: c.status,
            number: c.number
          })),
          ...MOCK_DB.calls
        ];

        setCalls(mergedCalls);
        setEmergencies(MOCK_DB.emergencies);

        const total = mergedCalls.length;
        const conf = Math.floor(mergedCalls.reduce((acc, c) => acc + (c.aiConfidence || 0), 0) / total);

        setMetrics({
          totalCalls: total,
          emergencies: data.emergencyActive ? MOCK_DB.emergencies.length + 1 : MOCK_DB.emergencies.length,
          avgConfidence: conf || 0,
          activeCHWs: 45201
        });
      } catch (error) {
        console.log("Backend not reachable, using mock data only.");
        setCalls(MOCK_DB.calls);
        setEmergencies(MOCK_DB.emergencies);
        setMetrics({
          totalCalls: MOCK_DB.calls.length,
          emergencies: MOCK_DB.emergencies.length,
          avgConfidence: 89,
          activeCHWs: 45201
        });
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="glass-panel p-6 flex items-center justify-between border-t-4" style={{ borderTopColor: color }}>
      <div>
        <h3 className="text-[#94a3b8] text-sm font-bold uppercase tracking-wider mb-2">{title}</h3>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-extrabold text-white">{value}</span>
          {trend && <span className="text-sm font-medium mb-1" style={{ color: trend.startsWith('+') ? '#22c55e' : '#ef4444' }}>{trend}</span>}
        </div>
      </div>
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/30" style={{ color }}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-full p-10 fade-in text-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Live Triage Dashboard</h1>
            <p className="text-[#94a3b8]">Real-time 811# metrics pulling from Firestore & Africa's Talking</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#2dd4bf]/10 border border-[#2dd4bf]/20 rounded-full text-[#2dd4bf] text-sm font-bold">
            <div className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse"></div>
            System Online
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Calls Today" value={metrics.totalCalls} icon={PhoneIncoming} color="#2dd4bf" trend="+12% vs yday" />
          <MetricCard title="Emergencies" value={metrics.emergencies} icon={Siren} color="#ef4444" />
          <MetricCard title="AI Confidence" value={`${metrics.avgConfidence}%`} icon={Brain} color="#818cf8" trend="+2% vs yday" />
          <MetricCard title="Active CHWs" value={metrics.activeCHWs.toLocaleString()} icon={Users} color="#fbbf24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Emergency Table */}
          <div className="glass-panel p-6 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-red-400">
                <Siren size={20} /> Active SAMU Emergencies
              </h2>
              <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded-lg">Last 24h</span>
            </div>
            <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar text-sm">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-[#0f172a] z-10 text-[#94a3b8]">
                  <tr>
                    <th className="pb-3 border-b border-white/10 font-medium">Time</th>
                    <th className="pb-3 border-b border-white/10 font-medium">District</th>
                    <th className="pb-3 border-b border-white/10 font-medium">Condition</th>
                    <th className="pb-3 border-b border-white/10 font-medium text-right">Response</th>
                  </tr>
                </thead>
                <tbody>
                  {emergencies.slice(0, 50).map((emg, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 text-gray-400">{new Date(emg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td className="py-3 font-medium">{emg.district}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md text-xs font-bold border border-red-500/20">{emg.condition}</span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1 text-[#2dd4bf]">
                          <Clock size={14} /> {emg.responseMinutes}m
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Call Logs Table */}
          <div className="glass-panel p-6 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Activity size={20} className="text-[#818cf8]" /> Recent AI Triage Logs
              </h2>
              <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded-lg">Live</span>
            </div>
            <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar text-sm">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-[#0f172a] z-10 text-[#94a3b8]">
                  <tr>
                    <th className="pb-3 border-b border-white/10 font-medium">Time</th>
                    <th className="pb-3 border-b border-white/10 font-medium">Duration</th>
                    <th className="pb-3 border-b border-white/10 font-medium">Confidence</th>
                    <th className="pb-3 border-b border-white/10 font-medium text-right">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {calls.slice(0, 50).map((call, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 text-gray-400">{new Date(call.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td className="py-3">{call.duration}s</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#818cf8]" style={{ width: `${call.aiConfidence}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-400">{call.aiConfidence}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        {call.outcome === 'EMERGENCY' ? (
                           <span className="text-red-400 font-bold text-xs"><Siren size={12} className="inline mr-1" />EMERGENCY</span>
                        ) : call.outcome === 'REFERRAL' ? (
                           <span className="text-[#fbbf24] font-bold text-xs">REFERRAL</span>
                        ) : (
                           <span className="text-[#2dd4bf] font-bold text-xs">RESOLVED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LiveDashboard;
