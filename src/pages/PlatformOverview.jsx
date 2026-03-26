import React from 'react';
import { ShieldPlus, Users, LineChart, PhoneCall, ArrowRight } from 'lucide-react';

const PlatformOverview = () => {
  return (
    <div className="w-full min-h-full p-10 fade-in text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-4xl mx-auto mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-health)] opacity-5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full glass-panel mb-8">
          <div className="w-2 h-2 rounded-full bg-[var(--color-health)] animate-pulse"></div>
          <span className="text-xs font-bold tracking-widest text-[#2dd4bf] uppercase">Live in Rwanda</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
          Not just an AI app.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2dd4bf] to-[#818cf8]">
            A Community System.
          </span>
        </h1>
        <p className="text-xl text-[#94a3b8] max-w-2xl leading-relaxed mb-10">
          AI is the engine, but people are the system. A 90-second voice triage on any basic phone that connects patients to emergency SAMU dispatch, creates jobs for youth and women, and feeds live outbreak data to the Ministry of Health.
        </p>
        <div className="flex items-center gap-4">
          <button className="px-8 py-4 bg-[#2dd4bf] hover:bg-[#20c997] text-black font-bold rounded-full transition-colors flex items-center gap-2 card-hover-effect">
            View Live Dashboard
            <ArrowRight size={18} />
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-full transition-colors flex items-center gap-2 card-hover-effect">
            See the Patient Journey
          </button>
        </div>
      </div>

      {/* The Three Pillars */}
      <div className="max-w-6xl mx-auto mb-20 text-center">
        <h2 className="text-sm font-bold tracking-widest text-[#94a3b8] uppercase mb-12">Ramba Voice — Three-Pillar Community Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Health */}
          <div className="glass-panel p-8 text-left border-t-4 border-t-[#2dd4bf] card-hover-effect flex flex-col h-full bg-gradient-to-b from-[#2dd4bf]/[0.05] to-transparent">
            <div className="w-12 h-12 rounded-xl bg-[#2dd4bf]/20 flex items-center justify-center mb-6 text-[#2dd4bf]">
              <ShieldPlus size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Pillar 1 — Health</h3>
            <p className="text-[#94a3b8] text-sm mb-8">AI Voice Triage System</p>
            <ul className="space-y-4 flex-1">
              {[
                'Patient calls toll-free line (Basic phone, no data, Kinyarwanda)',
                'Gemini Live AI Triage (WHO protocol RAG, symptom assessment)',
                'Emergency detected (SMS + GPS -> SAMU ambulance dispatch)',
                'Non-emergency referral (Health centre summary sent ahead)',
                'CHW dashboard updated (DHIS2 / HMIS sync, MoH analytics)'
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-300 items-start">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 2: Employment */}
          <div className="glass-panel p-8 text-left border-t-4 border-t-[#818cf8] card-hover-effect flex flex-col h-full bg-gradient-to-b from-[#818cf8]/[0.05] to-transparent">
            <div className="w-12 h-12 rounded-xl bg-[#818cf8]/20 flex items-center justify-center mb-6 text-[#818cf8]">
              <Users size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Pillar 2 — Employment</h3>
            <p className="text-[#94a3b8] text-sm mb-8">Youth & Women Work Inside System</p>
            <ul className="space-y-4 flex-1">
              {[
                'Voice Agent Operators (Trained youth monitor AI calls, escalate edge cases)',
                'Community Health Navigators (Women trained as Ramba field agents - CHW+)',
                'Data Quality Reviewers (Youth review AI transcripts, flag errors, train model)',
                'Kinyarwanda Linguists (University graduates improve dialect accuracy)',
                'Digital Health Trainers (Train 45K CHWs on Ramba app, earn stipend)'
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-300 items-start">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#818cf8]"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 3: Intelligence */}
          <div className="glass-panel p-8 text-left border-t-4 border-t-[#fbbf24] card-hover-effect flex flex-col h-full bg-gradient-to-b from-[#fbbf24]/[0.05] to-transparent">
            <div className="w-12 h-12 rounded-xl bg-[#fbbf24]/20 flex items-center justify-center mb-6 text-[#fbbf24]">
              <LineChart size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Pillar 3 — Intelligence</h3>
            <p className="text-[#94a3b8] text-sm mb-8">Data for Rwanda's Decision Makers</p>
            <ul className="space-y-4 flex-1">
              {[
                'Disease Surveillance (BigQuery detects outbreak clusters in real time)',
                'MoH Policy Dashboard (Looker Studio - district health officer reports)',
                'Maternal Health Tracking (Pregnancy triage - UNFPA integration - ANC alerts)',
                'Africa CDC Reporting (Anonymised data feeds continental IDSR system)',
                'Research & Impact Reports (Published data unlocks donor funding renewals)'
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-300 items-start">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#fbbf24]"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Unified Bottom Bar */}
        <div className="mt-12 glass-panel p-5 text-center text-sm font-medium text-gray-300 flex items-center justify-center gap-3">
          <PhoneCall size={18} className="text-[#2dd4bf]" />
          All three pillars are one platform — one toll-free number — one community-owned system
        </div>
      </div>
    </div>
  );
};

export default PlatformOverview;
