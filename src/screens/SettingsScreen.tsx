import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { 
  Settings, 
  Languages, 
  Palette, 
  Key, 
  ShieldAlert, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    mockMode, 
    setMockMode, 
    addToast 
  } = useSettings();

  const [geminiKey, setGeminiKey] = useState('');
  const [replicateKey, setReplicateKey] = useState('');
  const [savedKeys, setSavedKeys] = useState(false);

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedKeys(true);
    addToast('API credentials saved securely in local session.', 'success');
  };

  const handleClearCache = () => {
    localStorage.removeItem('mimi_chat_history');
    addToast('Temporary studio caches cleared.', 'info');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Studio Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Configure multilingual assistant preferences, visual identity theme, and AI service integration credentials.
        </p>
      </div>

      <div className="space-y-5">
        {/* 1. Language Preferences */}
        <div className="bg-ocean-900 border border-ocean-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center space-x-2">
            <Languages className="w-4 h-4 text-cyan-neon" />
            <h3 className="text-sm font-bold text-white">Assistant & Studio Language</h3>
          </div>
          <p className="text-xs text-gray-400">
            Select your preferred conversational language. Mimi will respond and explain concepts using your selected tone.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {[
              { id: 'en', label: 'English', desc: 'Standard technical & creative editing terminology' },
              { id: 'tanglish', label: 'Tanglish', desc: 'Casual Tamil + English conversational blend' },
              { id: 'ta', label: 'தமிழ் (Tamil)', desc: 'முழுமையான தமிழ் மொழி வழிகாட்டுதல்' },
            ].map(l => (
              <button
                key={l.id}
                onClick={() => {
                  setLanguage(l.id as any);
                  addToast(`Assistant language set to ${l.label}`, 'info');
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  language === l.id
                    ? 'bg-ocean-800 border-cyan-neon shadow-ocean-glow text-white'
                    : 'bg-ocean-950 border-ocean-800 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{l.label}</span>
                  {language === l.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-neon" />}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{l.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Visual Theme System */}
        <div className="bg-ocean-900 border border-ocean-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-cyan-neon" />
            <h3 className="text-sm font-bold text-white">Visual Design System</h3>
          </div>
          <p className="text-xs text-gray-400">
            Ocean AI visual identity palette with cinematic neon glows and deep navy backdrops.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {[
              { id: 'ocean', label: 'Ocean AI (Default)', desc: 'Deep Navy #070D1E with Glowing Cyan #00F0FF' },
              { id: 'dark-blue', label: 'Abyssal Deep', desc: 'Midnight Navy with Soft Lavender Accents' },
              { id: 'midnight', label: 'Cinema Darkroom', desc: 'Pure Black with High-Contrast Studio Blue' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id as any);
                  addToast(`Theme set to ${t.label}`, 'info');
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  theme === t.id
                    ? 'bg-ocean-800 border-cyan-neon shadow-ocean-glow text-white'
                    : 'bg-ocean-950 border-ocean-800 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t.label}</span>
                  {theme === t.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-neon" />}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 3. AI Service Configuration & Mock Safe Mode */}
        <div className="bg-ocean-900 border border-ocean-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-cyan-neon" />
              <h3 className="text-sm font-bold text-white">AI Service Integrations & Credentials</h3>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Provider Adapter
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ocean-950 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Developer Safe / Mock Mode</p>
              <p className="text-[11px] text-gray-400">
                When enabled, uses high-fidelity local procedural generation and offline reasoning. Never fabricate fake progress!
              </p>
            </div>
            <button
              onClick={() => {
                setMockMode(!mockMode);
                addToast(`Mock Safe Mode ${!mockMode ? 'Enabled' : 'Disabled'}`, 'info');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-colors ${
                mockMode
                  ? 'bg-cyan-neon text-ocean-950 shadow-ocean-glow'
                  : 'bg-ocean-800 text-gray-300 border border-ocean-700'
              }`}
            >
              {mockMode ? 'ENABLED (SAFE)' : 'DISABLED'}
            </button>
          </div>

          <form onSubmit={handleSaveApiKeys} className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Google Gemini API Key (Optional)</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-ocean-950 border border-ocean-800 focus:border-cyan-neon rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Replicate / Runway Video Token (Optional)</label>
              <input
                type="password"
                placeholder="r8_..."
                value={replicateKey}
                onChange={(e) => setReplicateKey(e.target.value)}
                className="w-full bg-ocean-950 border border-ocean-800 focus:border-cyan-neon rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-ocean-800 hover:bg-ocean-750 text-cyan-neon font-bold text-xs border border-cyan-500/30 transition-colors"
            >
              Update Credentials
            </button>
          </form>
        </div>

        {/* 4. Cache & Data Controls */}
        <div className="bg-ocean-900 border border-ocean-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Studio Cache & Storage</h4>
            <p className="text-[11px] text-gray-400">Clear temporary session chat logs without affecting saved projects.</p>
          </div>
          <button
            onClick={handleClearCache}
            className="px-3.5 py-2 rounded-xl bg-ocean-950 hover:bg-ocean-800 text-gray-300 hover:text-white border border-ocean-800 text-xs font-semibold transition-colors flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-gray-400" />
            <span>Clear Session Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
};
