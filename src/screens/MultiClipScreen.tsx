import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useProject } from '../context/ProjectContext';
import { useMimi } from '../context/MimiContext';
import { MockVideoGenerator } from '../services/mockVideoGenerator';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { MediaClip, TransitionSetting } from '../types';
import { 
  Layers, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Music, 
  Sparkles, 
  Film, 
  ArrowRight,
  Sliders,
  Check
} from 'lucide-react';

export const MultiClipScreen: React.FC = () => {
  const { navigate, addToast } = useSettings();
  const { clips, addClip, removeClip, reorderClips, createNewProject, currentProject } = useProject();
  const { sendMessage } = useMimi();

  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [transition, setTransition] = useState<TransitionSetting>({ type: 'dissolve', durationSec: 0.6 });
  const [bgMusic, setBgMusic] = useState<string>('ocean_ambient_calm.mp3');
  const [aiPrompt, setAiPrompt] = useState<string>('Combine these clips into a cinematic travel reel with smooth transitions');
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);

  const handleAddSampleClip = async () => {
    try {
      const num = clips.length + 1;
      const sample = await MockVideoGenerator.createSampleOceanClip(4, `Scene #${num}`);
      const newClip: MediaClip = {
        id: `clip_seq_${Date.now()}`,
        name: `Travel Scene 0${num}.mp4`,
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
      addClip(newClip);
      addToast(`Added Scene #${num} to sequence!`, 'success');
    } catch (e: any) {
      addToast('Error generating clip: ' + e.message, 'error');
    }
  };

  const handleAiArrange = async () => {
    if (clips.length < 2) {
      addToast('Please have at least 2 clips in the sequence to combine.', 'warning');
      return;
    }
    await sendMessage(aiPrompt);
    addToast('Mimi generated sequence plan! Check plan card in chat or apply directly.', 'info');
    navigate('mimi_chat');
  };

  const totalDuration = clips.reduce((acc, c) => acc + (c.trimEnd - c.trimStart) / (c.speed || 1), 0);

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Combine Multiple Clips</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ocean-500/20 text-cyan-neon border border-cyan-500/30">
              Multi-Clip Studio
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Arrange sequential scenes, select cinematic transitions, and synchronize background audio.
          </p>
        </div>

        <button
          onClick={handleAddSampleClip}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-ocean-800 hover:bg-ocean-750 text-cyan-300 border border-ocean-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Sample Scene</span>
        </button>
      </div>

      {/* AI Assistance Prompt Box */}
      <div className="bg-gradient-to-r from-ocean-900 via-ocean-850 to-ocean-900 border border-cyan-500/30 rounded-2xl p-4 shadow-ocean-glow flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-cyan-neon/20 border border-cyan-neon/40 flex items-center justify-center text-cyan-neon shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="w-full">
            <p className="text-xs font-bold text-white">AI Sequencing Assistance</p>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Combine these clips into a cinematic travel reel..."
              className="w-full bg-transparent text-xs text-cyan-200 placeholder-gray-500 focus:outline-none border-b border-ocean-700 focus:border-cyan-neon py-0.5 mt-0.5"
            />
          </div>
        </div>

        <button
          onClick={handleAiArrange}
          className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 text-ocean-950 font-bold text-xs shadow-sm hover:opacity-95 transition-all"
        >
          Ask Mimi to Arrange
        </button>
      </div>

      {/* Sequence Timeline & Clip Cards */}
      <div className="bg-ocean-900 border border-ocean-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-ocean-800">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-neon" />
            <h3 className="text-sm font-bold text-white">
              Sequence Track ({clips.length} {clips.length === 1 ? 'clip' : 'clips'})
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-300">
            Total Sequence Time: <strong className="text-white">{totalDuration.toFixed(1)}s</strong>
          </span>
        </div>

        {clips.length === 0 ? (
          <div className="p-8 border border-dashed border-ocean-800 rounded-2xl text-center text-gray-400 space-y-3">
            <Film className="w-10 h-10 mx-auto text-ocean-400 opacity-60" />
            <p className="text-sm font-medium text-white">No clips in sequence track</p>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Add at least 2 clips to merge into a single cinematic reel.
            </p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => navigate('video_upload')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 text-ocean-950 font-bold text-xs"
              >
                Upload Video Files
              </button>
              <button
                onClick={handleAddSampleClip}
                className="px-4 py-2 rounded-xl bg-ocean-800 text-cyan-300 border border-ocean-700 text-xs font-semibold"
              >
                Add Demo Scene Clip
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {clips.map((clip, idx) => (
              <div
                key={clip.id}
                onClick={() => setActivePreviewIndex(idx)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  activePreviewIndex === idx
                    ? 'bg-ocean-800/90 border-cyan-neon shadow-ocean-glow'
                    : 'bg-ocean-850/80 border-ocean-750 hover:border-ocean-600'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-white truncate max-w-[120px]">{clip.name}</span>
                  <span className="text-[10px] font-mono text-cyan-300">
                    {((clip.trimEnd - clip.trimStart) / (clip.speed || 1)).toFixed(1)}s
                  </span>
                </div>

                <div className="w-full h-24 rounded-xl bg-ocean-950 border border-ocean-800 overflow-hidden relative flex items-center justify-center">
                  <video src={clip.url} className="w-full h-full object-cover pointer-events-none" />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-ocean-900/80 text-white">
                    #{idx + 1}
                  </span>
                </div>

                {/* Move & Delete controls */}
                <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-ocean-750/60">
                  <div className="flex items-center space-x-1">
                    <button
                      disabled={idx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        reorderClips(idx, idx - 1);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-20"
                      title="Move Left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === clips.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        reorderClips(idx, idx + 1);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-20"
                      title="Move Right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeClip(clip.id);
                    }}
                    className="p-1 text-gray-400 hover:text-rose-400"
                    title="Remove from sequence"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assembly Settings: Transitions, Music, Aspect Ratio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Aspect Ratio */}
        <div className="bg-ocean-900 border border-ocean-800 rounded-2xl p-4 space-y-2">
          <label className="text-xs font-bold text-gray-200">Output Aspect Ratio</label>
          <div className="grid grid-cols-3 gap-2">
            {(['16:9', '9:16', '1:1'] as const).map(r => (
              <button
                key={r}
                onClick={() => setAspectRatio(r)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  aspectRatio === r
                    ? 'bg-ocean-700 text-cyan-neon border-cyan-neon'
                    : 'bg-ocean-950 text-gray-400 border-ocean-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Transition */}
        <div className="bg-ocean-900 border border-ocean-800 rounded-2xl p-4 space-y-2">
          <label className="text-xs font-bold text-gray-200">Inter-Clip Transition</label>
          <select
            value={transition.type}
            onChange={(e) => setTransition({ ...transition, type: e.target.value as any })}
            className="w-full bg-ocean-950 border border-ocean-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-neon"
          >
            <option value="dissolve">Cross Dissolve (0.6s)</option>
            <option value="fade">Fade to Black (0.5s)</option>
            <option value="wipe">Directional Wipe (0.5s)</option>
            <option value="slide">Smooth Slide (0.4s)</option>
            <option value="zoom">Dynamic Zoom Cut (0.3s)</option>
            <option value="none">Hard Cut (No Transition)</option>
          </select>
        </div>

        {/* Background Audio */}
        <div className="bg-ocean-900 border border-ocean-800 rounded-2xl p-4 space-y-2">
          <label className="text-xs font-bold text-gray-200">Audio Track</label>
          <div className="flex items-center space-x-2 bg-ocean-950 border border-ocean-800 rounded-xl p-2 text-xs text-gray-300">
            <Music className="w-4 h-4 text-cyan-neon shrink-0" />
            <span className="truncate">Ocean Cinematic Mood (Stereo 48kHz)</span>
          </div>
        </div>
      </div>

      {/* Preview Active Clip in Sequence */}
      {clips.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Active Clip Preview ({clips[activePreviewIndex]?.name})
          </h3>
          <VideoPlayer clip={clips[activePreviewIndex]} />
        </div>
      )}

      {/* Proceed to Export / Edit */}
      {clips.length >= 2 && (
        <button
          onClick={() => {
            addToast('Sequence assembled! Entering video export workspace...', 'success');
            navigate('export');
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-ocean-500 via-cyan-500 to-lavender-400 text-ocean-950 font-bold text-sm shadow-ocean-glow flex items-center justify-center space-x-2 transition-all"
        >
          <span>Render & Export Combined Video</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
