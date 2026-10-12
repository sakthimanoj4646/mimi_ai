import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { useProject } from '../context/ProjectContext';
import { ArrowLeft, Film, Clock, Download, Edit3, Layers, CheckCircle2 } from 'lucide-react';

export const ProjectDetailsScreen: React.FC = () => {
  const { navigate } = useSettings();
  const { currentProject, clips } = useProject();

  if (!currentProject) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <Film className="w-12 h-12 mx-auto text-ocean-400 opacity-60" />
        <h3 className="text-base font-bold text-white">No Project Selected</h3>
        <button
          onClick={() => navigate('projects')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 text-ocean-950 font-bold text-xs"
        >
          View Projects Library
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('projects')}
          className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <button
          onClick={() => navigate('editing_workspace')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 text-ocean-950 font-bold text-xs shadow-ocean-glow flex items-center space-x-1.5"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Open in Studio Editor</span>
        </button>
      </div>

      <div className="bg-ocean-900 border border-ocean-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-ocean-800 text-cyan-300 border border-ocean-700">
            {currentProject.project_type.replace('_', ' ')}
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-2">{currentProject.title}</h2>
          <p className="text-xs text-gray-400 font-mono mt-1">Project ID: {currentProject.id}</p>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-400 block">Aspect Ratio</span>
            <span className="text-xs font-bold text-cyan-300 font-mono">{currentProject.aspect_ratio}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-400 block">Status</span>
            <span className="text-xs font-bold text-emerald-400 font-mono capitalize">{currentProject.status}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-400 block">Clips Track</span>
            <span className="text-xs font-bold text-white font-mono">{clips.length} clip(s)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-ocean-950 border border-ocean-850">
            <span className="text-[10px] text-gray-400 block">Last Modified</span>
            <span className="text-xs font-bold text-gray-300 font-mono">
              {new Date(currentProject.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Media Assets List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Project Media Assets ({clips.length})
          </h3>

          <div className="space-y-2">
            {clips.map((clip, idx) => (
              <div
                key={clip.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-ocean-950 border border-ocean-850 text-xs"
              >
                <div className="flex items-center space-x-3 truncate">
                  <span className="font-mono text-ocean-300 font-bold">#{idx + 1}</span>
                  <div className="truncate">
                    <p className="font-bold text-white truncate">{clip.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      Duration: {clip.duration.toFixed(1)}s • Speed: {clip.speed}x • Filter: {clip.filter}
                    </p>
                  </div>
                </div>

                <span className="text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                  Ready
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
