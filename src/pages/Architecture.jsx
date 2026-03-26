import React, { useState } from 'react';
import { Network, ArrowRight, AlertTriangle, MessageSquare, MapPin, Smartphone, Database, Hospital, SquareActivity, Users, PhoneCall } from 'lucide-react';

const ApiNode = ({ icon: Icon, title, desc, color, isActive, onClick }) => (
  <div 
    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
      isActive 
        ? `border-[${color}] bg-[${color}]/10 shadow-[0_0_15px_${color}40]` 
        : 'border-white/10 bg-white/5 hover:border-white/30'
    }`}
    onClick={onClick}
    style={isActive ? { borderColor: color, backgroundColor: `${color}1A`, boxShadow: `0 0 15px ${color}40` } : {}}
  >
    <div className="flex items-center gap-3 mb-2" style={{ color: isActive ? color : '#94a3b8' }}>
      <Icon size={20} />
      <h4 className="font-bold text-sm text-white">{title}</h4>
    </div>
    <p className="text-xs text-gray-400">{desc}</p>
  </div>
);

const Architecture = () => {
  const [activeFlow, setActiveFlow] = useState('all'); // all, emergency, referral

  return (
    <div className="w-full min-h-full p-10 fade-in text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/10 glass-panel">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">System Architecture</h1>
            <p className="text-[#94a3b8]">Interactive visual logic of integrating APIs into the Ramba Voice Platform.</p>
          </div>
          <div className="flex gap-2 bg-black/40 p-1 rounded-xl">
            <button 
              onClick={() => setActiveFlow('all')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeFlow === 'all' ? 'bg-[#94a3b8]/20 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              All Flows
            </button>
            <button 
              onClick={() => setActiveFlow('emergency')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 ${activeFlow === 'emergency' ? 'bg-red-500/20 text-red-500' : 'text-gray-500 hover:text-red-400'}`}
            >
              <AlertTriangle size={14} /> Emergency Path
            </button>
          </div>
        </div>

        {/* Diagram Area */}
        <div className="relative border border-white/10 bg-[#0f172a]/50 p-10 rounded-2xl overflow-hidden glass-panel">
          {/* Animated Flow Lines background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}>
          </div>

          <div className="grid grid-cols-4 gap-8 relative z-10">
            
            {/* Input Layer */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-6">Patient Layer</h3>
              <ApiNode 
                icon={Smartphone} title="Patient Phone" desc="Basic/feature phone call (Kinyarwanda)"
                color="#2dd4bf" isActive={true}
              />
              <ApiNode 
                icon={Users} title="CHW Agent" desc="Community Health Worker app"
                color="#2dd4bf" isActive={activeFlow === 'all'}
              />
            </div>

            {/* Ingestion Layer */}
            <div className="space-y-6 relative">
              <h3 className="text-xs font-bold text-[#2dd4bf] uppercase tracking-widest text-center mb-6">Africa's Talking Layer</h3>
              <ApiNode 
                icon={PhoneCall} title="Voice API" desc="Inbound call handler & audio stream"
                color="#2dd4bf" isActive={true}
              />
              <ApiNode 
                icon={MessageSquare} title="SMS API" desc="Alerts & referral summaries"
                color="#818cf8" isActive={activeFlow === 'all' || activeFlow === 'emergency'}
              />
              <ApiNode 
                icon={MapPin} title="Location API" desc="Patient cell-tower geo-location"
                color="#818cf8" isActive={activeFlow === 'all' || activeFlow === 'emergency'}
              />
            </div>

            {/* AI Layer */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-[#818cf8] uppercase tracking-widest text-center mb-6">Google AI Layer</h3>
              <ApiNode 
                icon={Network} title="Gemini Live API" desc="Real-time Kinyarwanda voice conversation"
                color="#818cf8" isActive={true}
              />
              <ApiNode 
                icon={Database} title="Vertex AI Search" desc="Medical RAG / WHO protocols"
                color="#818cf8" isActive={true}
              />
              <ApiNode 
                icon={Database} title="Firestore & BigQuery" desc="Patient records & Epidemiology analytics"
                color="#fbbf24" isActive={true}
              />
            </div>

            {/* Output Layer */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-[#fbbf24] uppercase tracking-widest text-center mb-6">Response Layer</h3>
              <div 
                className={`p-4 rounded-xl border-2 transition-all shadow-lg ${
                  activeFlow === 'emergency' || activeFlow === 'all' ? 'border-red-500 bg-red-500/10 shadow-[0_0_20px_#ef444440]' : 'border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 text-red-500">
                  <AlertTriangle size={18} />
                  <h4 className="font-bold text-sm text-white">Ambulance Alert</h4>
                </div>
                <p className="text-xs text-red-200">SMS + location to nearest service</p>
              </div>

              <div 
                className={`p-4 rounded-xl border-2 transition-all ${
                  activeFlow === 'all' ? 'border-[#2dd4bf] bg-[#2dd4bf]/10' : 'border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 text-[#2dd4bf]">
                  <Hospital size={18} />
                  <h4 className="font-bold text-sm text-white">Health Centre</h4>
                </div>
                <p className="text-xs text-[#2dd4bf]/70">Referral summary sent ahead</p>
              </div>

              <div 
                className={`p-4 rounded-xl border-2 transition-all ${
                  activeFlow === 'all' ? 'border-[#fbbf24] bg-[#fbbf24]/10' : 'border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 text-[#fbbf24]">
                  <SquareActivity size={18} />
                  <h4 className="font-bold text-sm text-white">MoH Dashboard</h4>
                </div>
                <p className="text-xs text-[#fbbf24]/70">Disease surveillance reports</p>
              </div>
            </div>

             {/* Emergency Flow Highlight Overlays using absolute positioning (Conceptual connecting lines) */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: activeFlow === 'emergency' ? 1 : 0.3, transition: 'opacity 0.5s' }}>
                <path d="M 180 150 Q 250 150 320 150" stroke={activeFlow === 'emergency' ? "#ef4444" : "#ffffff20"} strokeWidth="2" fill="none" strokeDasharray="5,5" className={activeFlow === 'emergency' ? "animate-pulse" : ""} />
                <path d="M 450 150 Q 520 150 600 150" stroke={activeFlow === 'emergency' ? "#ef4444" : "#ffffff20"} strokeWidth="2" fill="none" strokeDasharray="5,5" className={activeFlow === 'emergency' ? "animate-pulse" : ""} />
                <path d="M 720 150 Q 790 150 850 150" stroke={activeFlow === 'emergency' ? "#ef4444" : "#ffffff20"} strokeWidth="2" fill="none" strokeDasharray="5,5" className={activeFlow === 'emergency' ? "animate-pulse" : ""} />
             </svg>

          </div>
        </div>

        {/* Emergency Path Explainer */}
        <div className={`mt-8 p-6 rounded-2xl transition-all duration-500 ${activeFlow === 'emergency' ? 'bg-red-500/10 border border-red-500/30' : 'bg-transparent border border-transparent'}`}>
          <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${activeFlow === 'emergency' ? 'text-red-400' : 'text-gray-500'}`}>
            <AlertTriangle size={20} /> The Emergency Path
          </h3>
          <p className={`text-sm ${activeFlow === 'emergency' ? 'text-red-200' : 'text-gray-600'}`}>
            When Gemini Live detects emergency keywords (e.g., severe bleeding, unconsciousness, severe breathing issues) during the 90-second voice triage, a critical flow bypasses standard protocols. The Africa's Talking SMS API fires immediately using the Location API to ping the nearest SAMU dispatch center with the patient's exact cell-tower coordinates. Referral notes are pushed simultaneously to the destination health centre to prepare for arrival.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Architecture;
