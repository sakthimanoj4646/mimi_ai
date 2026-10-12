import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { useProject } from '../context/ProjectContext';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { ArrowLeft, Download, Sliders, Film, Sparkles } from 'lucide-react';

export const VideoPreviewScreen: React.FC = () => {
  const { navigate } = useSettings();
  const { currentProject, clips } = useProject();

  const totalDuration = clips.reduce((acc, c) => acc + (c.trimEnd - c.trimStart) / (c.speed || 1), 0);

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('editing_workspace')}
          className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('export')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold text-xs shadow-ocean-glow flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Proceed to Export</span>
          </button>
        </div>
      </div>

      {/* Main Video Preview */}
      <div className="bg-ocean-900 border border-ocean-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Full Video Preview</h2>
            <p className="text-xs text-gray-400">
              Project: <span className="text-cyan-300">{currentProject?.title || 'Active Project'}</span>
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-ocean-800 text-ocean-300 border border-ocean-700">
            {currentProject?.aspect_ratio || '16:9'}
          </span>
        </div>

        {clips.length > 0 ? (
          <VideoPlayer clips={clips} className="w-full" />
        ) : (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Film className="w-12 h-12 mx-auto text-ocean-400 opacity-60" />
            <p className="text-sm font-semibold text-white">No clips in current project</p>
          </div>
        )}

        {/* Breakdown Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-400 block">Total Runtime</span>
            <span className="text-xs font-bold text-white font-mono">{totalDuration.toFixed(1)}s</span>
          </div>

          <div className="p-3 rounded-2xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-400 block">Clips Count</span>
            <span className="text-xs font-bold text-cyan-300 font-mono">{clips.length}</span>
          </div>

          <div className="p-3 rounded-2xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-400 block">Grade State</span>
            <span className="text-xs font-bold text-lavender-400 font-mono">
              {clips.some(c => c.filter !== 'none' || c.brightness !== 0) ? 'Graded' : 'Natural'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-400 block">Audio Status</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
