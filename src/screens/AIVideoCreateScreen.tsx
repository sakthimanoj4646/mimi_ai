import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useProject } from '../context/ProjectContext';
import { MockVideoGenerator } from '../services/mockVideoGenerator';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { MediaClip } from '../types';
import { 
  Sparkles, 
  Settings, 
  RotateCcw, 
  Download, 
  FolderPlus, 
  StopCircle, 
  CheckCircle2, 
  AlertTriangle,
  Play
} from 'lucide-react';

export const AIVideoCreateScreen: React.FC = () => {
  const { navigate, addToast, mockMode } = useSettings();
  const { createNewProject, addClip } = useProject();

  const [prompt, setPrompt] = useState('Cinematic ocean sunset with gentle waves and warm golden lighting');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distorted, watermark');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3'>('16:9');
  const [duration, setDuration] = useState<number>(5);
  const [style, setStyle] = useState<'cinematic' | 'realistic' | 'anime' | 'cyberpunk' | 'watercolor'>('cinematic');

  // Generation status state
  const [status, setStatus] = useState<'ready' | 'queued' | 'generating' | 'completed' | 'failed' | 'cancelled'>('ready');
  const [progress, setProgress] = useState<number>(0);
  const [generatedClip, setGeneratedClip] = useState<MediaClip | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const samplePrompts = [
    'Create a cinematic ocean sunset with gentle waves and warm golden lighting.',
    'Create a futuristic city at night with cinematic camera movement.',
    'Create a nature video featuring misty mountains and soft morning light.',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      addToast('Please enter a descriptive prompt.', 'warning');
      return;
    }

    setStatus('queued');
    setProgress(10);
    setErrorMessage(null);
    setGeneratedClip(null);

    // Transition to generating
    setTimeout(() => {
      setStatus('generating');
      setProgress(35);
    }, 1200);

    try {
      // If mock mode is active, generate real procedural cinematic canvas video
      const simulatedDuration = duration;
      const sample = await MockVideoGenerator.createSampleOceanClip(simulatedDuration, prompt.slice(0, 20));

      setProgress(85);
      setTimeout(() => {
        const newClip: MediaClip = {
          id: `clip_gen_${Date.now()}`,
          name: `${style.toUpperCase()} - ${prompt.slice(0, 25)}.mp4`,
          url: sample.url,
          duration: sample.duration,
          width: aspectRatio === '9:16' ? 720 : 1280,
          height: aspectRatio === '9:16' ? 1280 : 720,
          trimStart: 0,
          trimEnd: sample.duration,
          speed: 1,
          volume: 1,
          brightness: 0,
          contrast: 1,
          saturation: 1,
          temperature: 0,
          sharpen: false,
          filter: style === 'cinematic' ? 'cinematic' : style === 'cyberpunk' ? 'cyberpunk' : 'none',
          textOverlays: [],
        };

        setGeneratedClip(newClip);
        setStatus('completed');
        setProgress(100);
        addToast('AI video scene generated successfully!', 'success');
      }, 1500);
    } catch (err: any) {
      setStatus('failed');
      setErrorMessage(err.message || 'Generation failed.');
    }
  };

  const handleCancel = () => {
    setStatus('cancelled');
    setProgress(0);
    addToast('Video generation cancelled.', 'info');
  };

  const handleSaveToProjects = () => {
    if (!generatedClip) return;
    const project = createNewProject(`AI Gen: ${prompt.slice(0, 25)}`, 'ai_generated', aspectRatio === '4:3' ? '16:9' : aspectRatio);
    addClip(generatedClip);
    addToast('Project saved and ready in workspace!', 'success');
    navigate('editing_workspace');
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white tracking-tight">AI Video Creation</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-neon border border-cyan-500/30">
              Text-to-Video
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Describe a visual scene and let the configured AI model generate high-definition video.
          </p>
        </div>

        {mockMode && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-neon" />
            <span>Procedural Canvas Engine Active</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Prompt */}
          <div className="bg-ocean-900 border border-ocean-800 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-200">Creative Scene Prompt</label>
              <span className="text-[10px] text-ocean-300 font-mono">{prompt.length} chars</span>
            </div>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a cinematic ocean sunset with gentle waves and warm golden lighting..."
              className="w-full bg-ocean-950 border border-ocean-800 focus:border-cyan-neon rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
            />

            {/* Prompt presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-semibold text-ocean-300 uppercase">Try Sample Prompts:</span>
              <div className="space-y-1">
                {samplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(p)}
                    className="block w-full text-left text-xs text-gray-400 hover:text-cyan-neon truncate transition-colors"
                  >
                    • {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Negative Prompt */}
          <div className="bg-ocean-900 border border-ocean-800 rounded-2xl p-4 space-y-2 shadow-lg">
            <label className="text-xs font-bold text-gray-200">Negative Prompt (Optional)</label>
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="What to avoid (e.g. blurry, glitch, low resolution)..."
              className="w-full bg-ocean-950 border border-ocean-800 focus:border-cyan-neon rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Settings Grid: Aspect Ratio, Duration, Style */}
          <div className="bg-ocean-900 border border-ocean-800 rounded-2xl p-4 space-y-4 shadow-lg">
            {/* Aspect Ratio */}
            <div>
              <label className="text-xs font-bold text-gray-200 mb-2 block">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-2">
                {(['16:9', '9:16', '1:1', '4:3'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      aspectRatio === ratio
                        ? 'bg-ocean-700 text-cyan-neon border-cyan-neon shadow-sm'
                        : 'bg-ocean-950 text-gray-400 border-ocean-800 hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs font-bold text-gray-200 mb-2 block">Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setDuration(sec)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      duration === sec
                        ? 'bg-ocean-700 text-cyan-neon border-cyan-neon shadow-sm'
                        : 'bg-ocean-950 text-gray-400 border-ocean-800 hover:text-white'
                    }`}
                  >
                    {sec} seconds
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Style */}
            <div>
              <label className="text-xs font-bold text-gray-200 mb-2 block">Visual Style</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(['cinematic', 'realistic', 'anime', 'cyberpunk', 'watercolor'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      style === s
                        ? 'bg-ocean-700 text-cyan-neon border-cyan-neon shadow-sm'
                        : 'bg-ocean-950 text-gray-400 border-ocean-800 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          {status === 'generating' || status === 'queued' ? (
            <button
              onClick={handleCancel}
              className="w-full py-3.5 rounded-2xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <StopCircle className="w-4 h-4" />
              <span>Cancel Generation</span>
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-ocean-500 via-cyan-500 to-lavender-400 hover:opacity-95 text-ocean-950 font-bold text-sm shadow-ocean-glow flex items-center justify-center space-x-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Video Scene</span>
            </button>
          )}
        </div>

        {/* Output & Preview Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-ocean-900 border border-ocean-800 rounded-2xl p-4 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
              Generated Video Result
            </h3>

            {status === 'generating' || status === 'queued' ? (
              <div className="w-full h-80 rounded-xl bg-ocean-950 border border-ocean-800 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-ocean-800 border-t-cyan-neon animate-spin" />
                  <Sparkles className="w-6 h-6 text-cyan-neon absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white capitalize">{status} Generation Job</h4>
                  <p className="text-xs text-gray-400 max-w-xs">
                    Rendering frames at {aspectRatio} with {style} aesthetics...
                  </p>
                </div>
                {/* Progress bar */}
                <div className="w-48 h-2 bg-ocean-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-ocean-500 to-cyan-neon rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            ) : generatedClip ? (
              <div className="space-y-3">
                <VideoPlayer clip={generatedClip} />

                {/* Actions: Save to Project, Regenerate, Export */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={handleSaveToProjects}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 text-ocean-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-ocean-glow"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>Open in Studio Workspace</span>
                  </button>

                  <button
                    onClick={handleGenerate}
                    className="py-2.5 px-3 rounded-xl bg-ocean-800 hover:bg-ocean-750 text-white font-medium text-xs border border-ocean-700 flex items-center justify-center space-x-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-80 rounded-xl bg-ocean-950/60 border border-dashed border-ocean-800 flex flex-col items-center justify-center p-6 text-center text-gray-400 space-y-2">
                <Sparkles className="w-10 h-10 text-ocean-400 opacity-60" />
                <p className="text-sm font-semibold text-white">No Video Generated Yet</p>
                <p className="text-xs text-gray-400 max-w-xs">
                  Fill in your creative prompt and press Generate to view your video here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
