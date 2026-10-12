import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useProject } from '../context/ProjectContext';
import { useMimi } from '../context/MimiContext';
import { PlanReviewCard } from '../components/mimi/PlanReviewCard';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  Languages, 
  Film, 
  Sliders, 
  ArrowRight,
  HelpCircle,
  Video
} from 'lucide-react';

export const MimiChatScreen: React.FC = () => {
  const { navigate, addToast } = useSettings();
  const { currentProject, clips } = useProject();
  const { messages, isTyping, sendMessage, clearChat } = useMimi();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickActions = [
    { label: 'Editing Tips', prompt: 'Can you give me 3 beginner editing tips?' },
    { label: 'Cinematic Editing', prompt: 'Mimi, cinematic editing epdi panrathu?' },
    { label: 'Colour Grading', prompt: 'How do I balance teal and orange colors for video?' },
    { label: 'Transitions', prompt: 'What transitions work best for travel reels?' },
    { label: 'Music Ideas', prompt: 'What music pacing should I use for a fast vlog?' },
    { label: 'Captions', prompt: 'How can I add engaging captions to a 9:16 reel?' },
    { label: 'Troubleshoot Video', prompt: 'En video blur-ah irukku. Enna panrathu?' },
  ];

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  const handleActionClick = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] max-w-4xl mx-auto select-none">
      {/* Mimi Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-ocean-800 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-neon to-ocean-500 p-[2px] shadow-ocean-glow">
              <div className="w-full h-full bg-ocean-900 rounded-[14px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-neon" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-ocean-950" />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-base font-bold text-white tracking-tight">Mimi AI</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ocean-800 text-cyan-300 border border-ocean-700">
                Creative Buddy
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Online • Multilingual Assistant (English / Tamil தமிழ் / Tanglish)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {currentProject && (
            <button
              onClick={() => navigate('editing_workspace')}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-ocean-800 hover:bg-ocean-750 text-xs text-gray-200 border border-ocean-700 transition-colors"
            >
              <Video className="w-3.5 h-3.5 text-ocean-400" />
              <span>Workspace ({clips.length} clips)</span>
            </button>
          )}

          <button
            onClick={clearChat}
            className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-ocean-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Action Chips Bar */}
      <div className="py-2.5 overflow-x-auto shrink-0 flex items-center space-x-2 scrollbar-none">
        {quickActions.map((act, i) => (
          <button
            key={i}
            onClick={() => handleActionClick(act.prompt)}
            className="shrink-0 px-3 py-1 rounded-xl bg-ocean-900 hover:bg-ocean-800 border border-ocean-800 hover:border-cyan-500/40 text-xs text-gray-300 hover:text-cyan-neon transition-colors"
          >
            {act.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => {
          const isMimi = msg.sender === 'mimi';
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {isMimi && (
                <div className="w-8 h-8 rounded-xl bg-ocean-800 border border-cyan-500/40 flex items-center justify-center text-cyan-neon shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-ocean-500 to-ocean-600 text-white rounded-tr-none shadow-md'
                    : 'bg-ocean-900 border border-ocean-800 text-gray-200 rounded-tl-none shadow-lg'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Display structured editing plan card if attached to message */}
                {msg.editingPlan && (
                  <div className="mt-3">
                    <PlanReviewCard plan={msg.editingPlan} />
                  </div>
                )}

                <div
                  className={`mt-1.5 text-[10px] font-mono ${
                    isUser ? 'text-ocean-200 text-right' : 'text-gray-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-ocean-800 border border-cyan-500/40 flex items-center justify-center text-cyan-neon shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-ocean-900 border border-ocean-800 text-xs text-gray-400 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-neon animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-neon animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-neon animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px] text-cyan-300">Mimi is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <form onSubmit={handleSend} className="pt-2 shrink-0 relative">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask Mimi anything or request edits in English, Tamil, or Tanglish..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-ocean-900 border border-ocean-800 focus:border-cyan-neon rounded-2xl pl-4 pr-12 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors shadow-lg"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2.5 p-2 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold shadow-ocean-glow transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
