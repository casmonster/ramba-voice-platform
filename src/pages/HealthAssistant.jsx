import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, Send, Volume2, User, Stethoscope, AlertTriangle, AlertCircle, CheckCircle2, Languages } from 'lucide-react';
import axios from 'axios';

const HealthAssistant = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hello! I am Dr. Ramba, your AI health assistant. You can ask me medical questions in English or Kinyarwanda. (Muraho! Ndi Dr. Ramba, umufasha wanyu mu mbaga. Mushobora kumbaza ibibazo mu Cyongereza cyangwa mu Kinyarwanda.)",
      timestamp: new Date().toLocaleTimeString() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = { role: 'user', content: query, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/advice', { query });
      const { advice, language, is_emergency } = response.data;

      const assistantMessage = { 
        role: 'assistant', 
        content: advice, 
        language,
        is_emergency,
        timestamp: new Date().toLocaleTimeString() 
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Auto-speak the first few sentences if it's a short tip
      if (advice.length < 200) {
        speak(advice, language === 'Kinyarwanda' ? 'rw-RW' : 'en-US');
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting to my medical database. Please try again or visit your local health centre.",
        timestamp: new Date().toLocaleTimeString() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const speak = (text, lang) => {
    if (!window.speechSynthesis) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; // rw-RW for Kinyarwanda, en-US for English
    utterance.rate = 0.9;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Stethoscope className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Health Assistant</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Dr. Ramba Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
            <Languages size={14} className="text-teal-400" />
            <span className="text-xs text-slate-300 font-medium">Auto-Detect: EN/RW</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-teal-500' : msg.is_emergency ? 'bg-red-500' : 'bg-slate-700'
              }`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className="space-y-1">
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-teal-600 text-white rounded-tr-none' 
                    : msg.is_emergency 
                      ? 'bg-red-500/10 border border-red-500/30 text-red-100 rounded-tl-none'
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.is_emergency && (
                    <div className="flex items-center gap-2 mb-2 text-red-400 font-bold text-xs uppercase tracking-tighter">
                      <AlertTriangle size={14} />
                      Emergency Pre-Alert
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                <div className={`flex items-center gap-3 px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[10px] text-slate-500 font-medium uppercase">{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button 
                      onClick={() => speak(msg.content, msg.language === 'Kinyarwanda' ? 'rw-RW' : 'en-US')}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                    >
                      <Volume2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <Bot size={16} className="text-slate-500" />
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50 animate-bounce" style={{animationDelay: '0ms'}} />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50 animate-bounce" style={{animationDelay: '150ms'}} />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500/50 animate-bounce" style={{animationDelay: '300ms'}} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-6 bg-slate-900/80 border-t border-white/10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center gap-2">
          <button 
            type="button"
            className="p-3 rounded-xl hover:bg-white/5 text-slate-400 transition-colors group"
          >
            <Mic size={20} className="group-hover:text-teal-400 transition-colors" />
          </button>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            placeholder="Ask Dr. Ramba anything... (ex: Malaria symptoms)"
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-500 text-sm py-3"
          />
          <button 
            type="submit"
            disabled={!query.trim() || isLoading}
            className="p-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 text-white transition-all shadow-lg shadow-teal-500/20"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="mt-3 text-[10px] text-center text-slate-500 uppercase tracking-widest font-medium">
          Evidence-based medical advice powered by Gemini RAG
        </p>
      </form>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default HealthAssistant;
