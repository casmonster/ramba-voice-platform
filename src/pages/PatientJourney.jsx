import React, { useState, useEffect } from 'react';
import { Phone, BrainCircuit, Activity, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

const PatientJourney = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      icon: Phone,
      title: "Step 1: Patient Dials 811#",
      duration: "0:00 - 0:05",
      desc: "A patient in a rural district uses a basic feature phone to call the toll-free Ramba Voice line. No data plan required.",
      color: "#2dd4bf"
    },
    {
      id: 2,
      icon: BrainCircuit,
      title: "Step 2: AI Voice Triage",
      duration: "0:05 - 1:20",
      desc: "Gemini Live converses in native Kinyarwanda. It assesses symptoms using WHO protocols pulled via Vertex AI RAG. (Silent human operator hand-off triggered if AI confidence drops < 75%)",
      color: "#818cf8"
    },
    {
      id: 3,
      icon: Activity,
      title: "Step 3: Outcome & Routing",
      duration: "1:20 - 1:30",
      desc: "Emergency: Immediate SAMU ambulance dispatch via GPS. \nNon-Emergency: Digital referral sent to the nearest Health Centre with a booked appointment.",
      color: "#ef4444" 
    },
    {
      id: 4,
      icon: HeartHandshake,
      title: "Step 4: CHW Follow-up",
      duration: "Post-Triage",
      desc: "Community Health Worker receives the case file. Visits patient home, provides care, and updates the MoH DHIS2 registry with the outcome.",
      color: "#fbbf24"
    }
  ];

  // Auto-advance simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4000); // 4 seconds per step for demo purposes
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="w-full min-h-full p-10 fade-in text-white relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Patient Journey</h1>
          <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">
            The 90-second triage flow. From a basic phone call to an emergency dispatch or health centre referral.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10 z-0 hidden md:block"></div>

          <div className="space-y-8 relative z-10">
            {steps.map((step, index) => {
              const isPast = index < activeStep;
              const isActive = index === activeStep;
              
              return (
                <div 
                  key={step.id} 
                  className={`flex flex-col md:flex-row gap-6 transition-all duration-700 cursor-pointer ${
                    isActive ? 'scale-100 opacity-100' : isPast ? 'scale-95 opacity-60' : 'scale-95 opacity-30 grayscale'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full border-4 bg-[#0f172a] shadow-lg relative z-10" 
                    style={{ borderColor: isActive || isPast ? step.color : '#334155', boxShadow: isActive ? `0 0 20px ${step.color}60` : 'none' }}
                  >
                    <step.icon size={24} style={{ color: isActive || isPast ? step.color : '#64748b' }} />
                  </div>

                  <div 
                    className={`flex-1 glass-panel p-6 border-l-4 transition-all duration-300 ${isActive ? 'translate-x-2' : ''}`}
                    style={{ borderLeftColor: isActive ? step.color : 'transparent' }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold" style={{ color: isActive ? step.color : 'white' }}>{step.title}</h3>
                      <span className="text-xs font-mono px-2 py-1 rounded bg-black/40 text-gray-400 border border-white/5">{step.duration}</span>
                    </div>
                    
                    <p className="text-[#94a3b8] whitespace-pre-line leading-relaxed">{step.desc}</p>
                    
                    {isActive && index === 1 && (
                      <div className="mt-4 p-3 rounded-lg bg-[#818cf8]/10 border border-[#818cf8]/20 flex items-center gap-3 fade-in text-sm text-[#818cf8]">
                        <div className="flex h-3 items-center gap-1">
                          <div className="w-1 h-2 bg-[#818cf8] animate-bounce"></div>
                          <div className="w-1 h-3 bg-[#818cf8] animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1.5 bg-[#818cf8] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        Synthesizing voice to Kinyarwanda...
                      </div>
                    )}
                    
                    {isActive && index === 2 && (
                      <div className="mt-4 w-full h-2 bg-gray-800 rounded-full overflow-hidden fade-in">
                        <div className="h-full bg-red-500 animate-[Pulse_1s_ease-in-out_infinite]" style={{ width: '100%', transition: 'width 2s ease' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <button 
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 font-bold text-sm text-[#94a3b8]"
            onClick={() => setActiveStep(0)}
          >
            Restart Journey <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default PatientJourney;
