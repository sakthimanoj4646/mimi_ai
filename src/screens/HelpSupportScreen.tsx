import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { 
  HelpCircle, 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Film, 
  FileCheck, 
  Terminal,
  Activity,
  ArrowRight
} from 'lucide-react';

export const HelpSupportScreen: React.FC = () => {
  const { navigate } = useSettings();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Mimi AI understand Tamil and Tanglish?',
      a: 'Mimi has a built-in multilingual conversational parser tuned for South Asian video creator terminology. You can write colloquial Tanglish (e.g. "cinematic look epdi panrathu" or "speed konjam reduce pannu") and Mimi will translate your request into structured editing commands!',
    },
    {
      q: 'Which video formats and sizes are supported?',
      a: 'MIMI AI Studio supports standard MP4, MOV, WEBM, and MKV video files. Maximum file upload size in the local environment is 100MB per clip to ensure smooth client-side decoding and rendering.',
    },
    {
      q: 'How does the video processing engine work?',
      a: 'The studio employs a dual-engine architecture: (1) An in-browser HTML5 Canvas and MediaRecorder engine that allows real-time color grading, trimming, and direct download on any device without external server requirements; and (2) An optional Node.js FFmpeg backend service for high-throughput batch transcoding.',
    },
    {
      q: 'What is Developer Safe Mode (Mock Mode)?',
      a: 'To guarantee that the application functions immediately without requiring paid third-party API keys (like Runway or Replicate), Safe Mode activates deterministic local canvas procedural video generators and offline multilingual reasoning.',
    },
    {
      q: 'How do I export in 1080p or 4K?',
      a: 'Go to the Export Screen from the Studio Workspace, select your desired resolution preset (720p, 1080p, or 4K), set your aspect ratio (16:9 landscape or 9:16 vertical for reels), and click "Start Export Rendering". Once processing reaches 100%, click Download to save the file.',
    },
  ];

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Help & Knowledge Base</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Guides, workflow tutorials, and frequently asked questions for MIMI AI Studio.
        </p>
      </div>

      {/* Interactive Mimi Help Card */}
      <div className="bg-gradient-to-r from-ocean-900 via-ocean-850 to-ocean-900 border border-cyan-500/30 rounded-3xl p-6 shadow-ocean-glow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-neon/20 border border-cyan-neon/40 flex items-center justify-center text-cyan-neon shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Need Live Creative Guidance?</h3>
            <p className="text-xs text-gray-300">
              Mimi can explain color grading, transition pacing, aspect ratios, or generate custom editing plans.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('mimi_chat')}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 text-ocean-950 font-bold text-xs shadow-sm flex items-center space-x-1.5"
        >
          <span>Ask Mimi Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Frequently Asked Questions</h3>

        <div className="space-y-2.5">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="bg-ocean-900 border border-ocean-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-cyan-neon transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-neon shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-gray-300 leading-relaxed border-t border-ocean-850/60 bg-ocean-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* System Diagnostic Health Card */}
      <div className="bg-ocean-900 border border-ocean-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">System Architecture Diagnostics</h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-500 block">Client Engine</span>
            <span className="text-emerald-400 font-bold">HTML5 Canvas OK</span>
          </div>

          <div className="p-2.5 rounded-xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-500 block">Encoder</span>
            <span className="text-cyan-300 font-bold">MediaRecorder Active</span>
          </div>

          <div className="p-2.5 rounded-xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-500 block">Mimi Multilingual</span>
            <span className="text-emerald-400 font-bold">Tanglish/Tamil Ready</span>
          </div>

          <div className="p-2.5 rounded-xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-500 block">Local DB Cache</span>
            <span className="text-emerald-400 font-bold">Storage Synchronized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
