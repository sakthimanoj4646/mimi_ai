import React, { useState } from 'react';
import { MediaClip } from '../../types';
import { useProject } from '../../context/ProjectContext';
import { 
  Scissors, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Undo2, 
  Redo2, 
  Music, 
  Type, 
  Video, 
  ChevronLeft, 
  ChevronRight,
  Layers
} from 'lucide-react';

interface TimelineProps {
  activeClipIndex: number;
  onSelectClip: (index: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  activeClipIndex,
  onSelectClip,
}) => {
  const { clips, updateClip, removeClip, reorderClips, undo, redo, canUndo, canRedo } = useProject();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeTrack, setActiveTrack] = useState<'video' | 'audio' | 'text'>('video');

  const selectedClip = clips[activeClipIndex];

  const handleTrimStartChange = (val: number) => {
    if (!selectedClip) return;
    const cleanVal = Math.max(0, Math.min(val, selectedClip.trimEnd - 0.5));
    updateClip(selectedClip.id, { trimStart: cleanVal });
  };

  const handleTrimEndChange = (val: number) => {
    if (!selectedClip) return;
    const cleanVal = Math.min(selectedClip.duration, Math.max(val, selectedClip.trimStart + 0.5));
    updateClip(selectedClip.id, { trimEnd: cleanVal });
  };

  const handleSplitClip = () => {
    if (!selectedClip) return;
    // Perform split at midpoint of trimmed range
    const midPoint = selectedClip.trimStart + ((selectedClip.trimEnd - selectedClip.trimStart) / 2);
    updateClip(selectedClip.id, { trimEnd: midPoint });
  };

  return (
    <div className="bg-ocean-900 border border-ocean-800 rounded-2xl p-4 flex flex-col space-y-3 shadow-xl">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-ocean-800">
        {/* Track switchers */}
        <div className="flex items-center space-x-1 bg-ocean-850 p-1 rounded-xl border border-ocean-750">
          <button
            onClick={() => setActiveTrack('video')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeTrack === 'video' ? 'bg-ocean-700 text-cyan-neon shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Clips ({clips.length})</span>
          </button>
          <button
            onClick={() => setActiveTrack('audio')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeTrack === 'audio' ? 'bg-ocean-700 text-cyan-neon shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Audio</span>
          </button>
          <button
            onClick={() => setActiveTrack('text')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeTrack === 'text' ? 'bg-ocean-700 text-cyan-neon shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Captions</span>
          </button>
        </div>

        {/* Editing Tools: Split, Delete, Reorder, Undo, Redo, Zoom */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded-lg border transition-colors ${
              canUndo
                ? 'border-ocean-700 text-gray-200 hover:bg-ocean-800 hover:text-white'
                : 'border-ocean-850 text-gray-600 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded-lg border transition-colors ${
              canRedo
                ? 'border-ocean-700 text-gray-200 hover:bg-ocean-800 hover:text-white'
                : 'border-ocean-850 text-gray-600 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-ocean-800 mx-1" />

          <button
            onClick={handleSplitClip}
            disabled={!selectedClip}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-ocean-800 hover:bg-ocean-750 text-gray-300 hover:text-white border border-ocean-700 text-xs transition-colors disabled:opacity-50"
            title="Split Clip at Midpoint"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>

          {selectedClip && (
            <button
              onClick={() => removeClip(selectedClip.id)}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/30 border border-rose-900/40 text-xs transition-colors"
              title="Delete Selected Clip"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="h-4 w-[1px] bg-ocean-800 mx-1" />

          {/* Zoom controls */}
          <button
            onClick={() => setZoomLevel(Math.max(0.7, zoomLevel - 0.2))}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-ocean-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-gray-400 font-mono">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel(Math.min(2.0, zoomLevel + 0.2))}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-ocean-800"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Multi-Track Timeline View */}
      <div className="overflow-x-auto py-2">
        {clips.length === 0 ? (
          <div className="p-8 border border-dashed border-ocean-750 rounded-xl text-center text-gray-400">
            <Layers className="w-8 h-8 mx-auto mb-2 text-ocean-400 opacity-60" />
            <p className="text-sm font-medium">Timeline Empty</p>
            <p className="text-xs text-gray-500 mt-0.5">Upload a video clip or combine multiple scenes to edit.</p>
          </div>
        ) : (
          <div
            style={{ transform: `scaleX(${zoomLevel})`, transformOrigin: 'left' }}
            className="flex items-center space-x-2 min-w-full pb-2 transition-transform duration-150"
          >
            {clips.map((c, idx) => {
              const isSelected = idx === activeClipIndex;
              const durationSec = (c.trimEnd - c.trimStart) / (c.speed || 1);

              return (
                <div
                  key={c.id}
                  onClick={() => onSelectClip(idx)}
                  className={`relative shrink-0 rounded-xl p-2.5 cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-ocean-800/90 border-cyan-neon shadow-ocean-glow'
                      : 'bg-ocean-850/80 border-ocean-750 hover:border-ocean-600'
                  }`}
                  style={{ width: `${Math.max(160, durationSec * 25)}px` }}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white truncate max-w-[100px]">{c.name}</span>
                    <span className="font-mono text-[10px] text-cyan-300">{durationSec.toFixed(1)}s</span>
                  </div>

                  {/* Clip waveform / thumbnail bar */}
                  <div className="w-full h-10 rounded-lg bg-ocean-950/80 border border-ocean-800 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-ocean-500/20 via-cyan-500/20 to-lavender-500/20" />
                    <span className="text-[10px] font-mono text-gray-400 z-10">
                      {c.speed !== 1 ? `${c.speed}x speed • ` : ''}
                      {c.filter !== 'none' ? `${c.filter} • ` : ''}
                      {c.trimStart > 0 ? `trim: ${c.trimStart.toFixed(1)}s` : 'full'}
                    </span>
                  </div>

                  {/* Reordering Controls */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-ocean-750/50">
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
                    <span className="text-[10px] text-ocean-300 font-bold">Clip #{idx + 1}</span>
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
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Clip Trimming Controls */}
      {selectedClip && (
        <div className="pt-2 border-t border-ocean-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 font-medium">Trim In Point:</span>
            <input
              type="number"
              min={0}
              max={selectedClip.duration}
              step={0.1}
              value={selectedClip.trimStart}
              onChange={(e) => handleTrimStartChange(parseFloat(e.target.value))}
              className="w-16 bg-ocean-800 border border-ocean-700 rounded px-2 py-1 text-white font-mono"
            />
            <span className="text-gray-500">sec</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-400 font-medium">Trim Out Point:</span>
            <input
              type="number"
              min={0}
              max={selectedClip.duration}
              step={0.1}
              value={selectedClip.trimEnd}
              onChange={(e) => handleTrimEndChange(parseFloat(e.target.value))}
              className="w-16 bg-ocean-800 border border-ocean-700 rounded px-2 py-1 text-white font-mono"
            />
            <span className="text-gray-500">sec</span>
          </div>

          <div className="text-ocean-300 text-[11px]">
            Active Clip Duration: <span className="font-bold text-white">{((selectedClip.trimEnd - selectedClip.trimStart) / (selectedClip.speed || 1)).toFixed(1)}s</span>
          </div>
        </div>
      )}
    </div>
  );
};
