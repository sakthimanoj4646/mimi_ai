import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useProject } from '../context/ProjectContext';
import { useMimi } from '../context/MimiContext';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { Timeline } from '../components/video/Timeline';
import { PlanReviewCard } from '../components/mimi/PlanReviewCard';
import { MockVideoGenerator } from '../services/mockVideoGenerator';
import { MediaClip, TextOverlay } from '../types';
import { 
  Sliders, 
  Sparkles, 
  Type, 
  Layers, 
  Scissors, 
  Volume2, 
  RotateCcw, 
  Download, 
  Bot, 
  Send, 
  Maximize2,
  Plus,
  Play
} from 'lucide-react';

export const VideoEditingWorkspace: React.FC = () => {
  const { navigate, addToast } = useSettings();
  const { currentProject, clips, updateClip, addClip, saveProject } = useProject();
  const { activePlan, sendMessage, isTyping } = useMimi();

  const [activeClipIndex, setActiveClipIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'color' | 'text' | 'speed' | 'audio' | 'ai'>('color');
  const [chatPrompt, setChatPrompt] = useState('');
  const [newOverlayText, setNewOverlayText] = useState('');

  const activeClip = clips[activeClipIndex];

  // If no clips exist, provide instant loader
  const handleLoadSample = async () => {
    try {
      const sample = await MockVideoGenerator.createSampleOceanClip(6, "Ocean Sunset");
      const sampleClip: MediaClip = {
        id: `clip_${Date.now()}`,
        name: 'Ocean Sunset Studio.mp4',
        url: sample.url,
        duration: sample.duration,
        width: 1280,
        height: 720,
        trimStart: 0,
        trimEnd: sample.duration,
        speed: 1,
        volume: 1,
        brightness: 0,
        contrast: 1,
        saturation: 1,
        temperature: 0,
        sharpen: false,
        filter: 'none',
        textOverlays: [],
      };
      addClip(sampleClip);
      addToast('Sample video loaded into studio!', 'success');
    } catch (e: any) {
      addToast('Error loading sample: ' + e.message, 'error');
    }
  };

  const handleAddTextOverlay = () => {
    if (!newOverlayText.trim() || !activeClip) return;
    const overlay: TextOverlay = {
      id: `txt_${Date.now()}`,
      text: newOverlayText.trim(),
      position: 'bottom',
      fontSize: 32,
      fontColor: '#FFFFFF',
      startTime: 0,
      endTime: activeClip.duration,
    };
    updateClip(activeClip.id, {
      textOverlays: [...(activeClip.textOverlays || []), overlay],
    });
    setNewOverlayText('');
    addToast('Text overlay added!', 'success');
  };

  const handleSendToMimi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim()) return;
    const p = chatPrompt;
    setChatPrompt('');
    await sendMessage(p);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Top Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white tracking-tight">AI Video Studio</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ocean-800 text-cyan-300 border border-ocean-700">
              Workspace
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time color grading, multi-clip timeline trimming, dynamic text overlays, and AI editing plans.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {clips.length === 0 && (
            <button
              onClick={handleLoadSample}
              className="px-3.5 py-1.5 rounded-xl bg-ocean-800 hover:bg-ocean-750 text-cyan-300 border border-ocean-700 text-xs font-semibold flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-neon" />
              <span>Load Ocean Demo</span>
            </button>
          )}

          <button
            onClick={() => navigate('export')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold text-xs shadow-ocean-glow flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Video</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport (Player & Tool Controls) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Preview Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <VideoPlayer
            clips={clips}
            activeClipIndex={activeClipIndex}
            className="w-full"
          />

          {/* Active Editing Plan Card if generated */}
          {activePlan && (
            <div className="animate-in fade-in duration-300">
              <PlanReviewCard plan={activePlan} />
            </div>
          )}
        </div>

        {/* Right Column: Editing Tools & AI Drawer (5 cols) */}
        <div className="lg:col-span-5 bg-ocean-900 border border-ocean-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Tool Tabs */}
            <div className="flex items-center justify-between bg-ocean-850 p-1 rounded-2xl border border-ocean-750">
              {[
                { id: 'color', label: 'Color Grade', icon: Sliders },
                { id: 'text', label: 'Text', icon: Type },
                { id: 'speed', label: 'Speed', icon: Scissors },
                { id: 'ai', label: 'Ask Mimi', icon: Bot, isMimi: true },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? tab.isMimi
                          ? 'bg-cyan-neon text-ocean-950 shadow-ocean-glow'
                          : 'bg-ocean-700 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tool Panel Content */}
            {activeClip ? (
              <div className="space-y-4">
                {/* 1. Color Grading Sliders */}
                {activeTab === 'color' && (
                  <div className="space-y-3.5">
                    {/* Preset Mood Badges */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-ocean-300 uppercase">Preset Grades</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['none', 'cinematic', 'warm', 'cool', 'vintage', 'cyberpunk'] as const).map(f => (
                          <button
                            key={f}
                            onClick={() => updateClip(activeClip.id, { filter: f })}
                            className={`py-1.5 rounded-xl text-xs font-medium capitalize border transition-all ${
                              activeClip.filter === f
                                ? 'bg-ocean-700 text-cyan-neon border-cyan-neon'
                                : 'bg-ocean-950 text-gray-400 border-ocean-800 hover:text-white'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Brightness */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Brightness</span>
                        <span className="font-mono text-cyan-300">
                          {Math.round((activeClip.brightness || 0) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-0.8}
                        max={0.8}
                        step={0.02}
                        value={activeClip.brightness || 0}
                        onChange={(e) => updateClip(activeClip.id, { brightness: parseFloat(e.target.value) })}
                        className="w-full h-1.5 bg-ocean-800 rounded-lg appearance-none cursor-pointer accent-cyan-neon"
                      />
                    </div>

                    {/* Contrast */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Contrast</span>
                        <span className="font-mono text-cyan-300">
                          {Math.round(((activeClip.contrast ?? 1) - 1) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={1.8}
                        step={0.05}
                        value={activeClip.contrast ?? 1}
                        onChange={(e) => updateClip(activeClip.id, { contrast: parseFloat(e.target.value) })}
                        className="w-full h-1.5 bg-ocean-800 rounded-lg appearance-none cursor-pointer accent-cyan-neon"
                      />
                    </div>

                    {/* Saturation */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Saturation / Vibrancy</span>
                        <span className="font-mono text-cyan-300">
                          {Math.round(((activeClip.saturation ?? 1) - 1) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={2.0}
                        step={0.05}
                        value={activeClip.saturation ?? 1}
                        onChange={(e) => updateClip(activeClip.id, { saturation: parseFloat(e.target.value) })}
                        className="w-full h-1.5 bg-ocean-800 rounded-lg appearance-none cursor-pointer accent-cyan-neon"
                      />
                    </div>

                    {/* Temperature */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Color Temperature</span>
                        <span className="font-mono text-cyan-300">
                          {(activeClip.temperature || 0) > 0 ? 'Warm' : (activeClip.temperature || 0) < 0 ? 'Cool' : 'Neutral'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-0.8}
                        max={0.8}
                        step={0.05}
                        value={activeClip.temperature || 0}
                        onChange={(e) => updateClip(activeClip.id, { temperature: parseFloat(e.target.value) })}
                        className="w-full h-1.5 bg-ocean-800 rounded-lg appearance-none cursor-pointer accent-cyan-neon"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Text Overlays */}
                {activeTab === 'text' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-300">Add Title or Caption</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter caption text..."
                          value={newOverlayText}
                          onChange={(e) => setNewOverlayText(e.target.value)}
                          className="flex-1 bg-ocean-950 border border-ocean-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-neon"
                        />
                        <button
                          onClick={handleAddTextOverlay}
                          className="px-3 py-2 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 text-ocean-950 font-bold text-xs"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-bold text-ocean-300 uppercase">Active Overlays</span>
                      {(!activeClip.textOverlays || activeClip.textOverlays.length === 0) ? (
                        <p className="text-xs text-gray-500">No captions on this clip yet.</p>
                      ) : (
                        activeClip.textOverlays.map(txt => (
                          <div key={txt.id} className="flex items-center justify-between p-2 rounded-xl bg-ocean-950 border border-ocean-850 text-xs">
                            <span className="text-white font-medium truncate">{txt.text}</span>
                            <button
                              onClick={() => {
                                updateClip(activeClip.id, {
                                  textOverlays: activeClip.textOverlays.filter(t => t.id !== txt.id),
                                });
                              }}
                              className="text-gray-400 hover:text-rose-400 ml-2"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Speed Adjustment */}
                {activeTab === 'speed' && (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-gray-300">Playback Speed Multiplier</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0.5, 1.0, 1.5, 2.0].map(s => (
                        <button
                          key={s}
                          onClick={() => updateClip(activeClip.id, { speed: s })}
                          className={`py-2 rounded-xl text-xs font-bold font-mono border transition-all ${
                            activeClip.speed === s
                              ? 'bg-ocean-700 text-cyan-neon border-cyan-neon shadow-sm'
                              : 'bg-ocean-950 text-gray-400 border-ocean-800'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
                      Slow down footage (0.5x) for cinematic, emotional reveals, or speed up (1.5x - 2x) for energetic vlogs.
                    </p>
                  </div>
                )}

                {/* 4. Mimi Conversational Assistant Drawer */}
                {activeTab === 'ai' && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Instruct Mimi in English, Tamil, or Tanglish to edit this clip.
                    </p>
                    <form onSubmit={handleSendToMimi} className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Make it warmer and slow motion..."
                        value={chatPrompt}
                        onChange={(e) => setChatPrompt(e.target.value)}
                        className="w-full bg-ocean-950 border border-ocean-800 focus:border-cyan-neon rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={isTyping || !chatPrompt.trim()}
                        className="absolute right-2 top-2 p-1.5 rounded-lg bg-cyan-neon text-ocean-950 disabled:opacity-40"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                    <div className="space-y-1 text-[11px] text-cyan-300">
                      <p>Try saying:</p>
                      <p className="text-gray-400 italic">"Cinematic look kaga saturation konjam increase pannu"</p>
                      <p className="text-gray-400 italic">"Make playback 0.5x slower"</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 space-y-2">
                <p className="text-xs">No clip selected. Upload a clip to activate tools.</p>
                <button
                  onClick={handleLoadSample}
                  className="px-3 py-1.5 rounded-xl bg-ocean-800 text-cyan-300 text-xs font-semibold"
                >
                  Load Demo Clip
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-ocean-800 flex items-center justify-between text-xs text-gray-400">
            <span>Clip #{activeClipIndex + 1} of {clips.length}</span>
            <button
              onClick={() => {
                saveProject();
                addToast('Project draft saved!', 'success');
              }}
              className="text-cyan-neon hover:underline"
            >
              Save Draft
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Multi-Track Timeline */}
      <Timeline
        activeClipIndex={activeClipIndex}
        onSelectClip={(idx) => setActiveClipIndex(idx)}
      />
    </div>
  );
};
