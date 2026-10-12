import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useProject } from '../context/ProjectContext';
import { ClientVideoProcessor } from '../services/videoProcessor';
import { ExportSettings } from '../types';
import { 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowLeft, 
  Film, 
  Sparkles,
  Share2,
  FolderPlus,
  Play
} from 'lucide-react';

export const ExportScreen: React.FC = () => {
  const { navigate, addToast } = useSettings();
  const { currentProject, clips, saveProject } = useProject();

  const [settings, setSettings] = useState<ExportSettings>({
    resolution: '1080p',
    aspect_ratio: (currentProject?.aspect_ratio as any) || '16:9',
    format: 'mp4',
    fps: 30,
    quality: 'high',
    includeAudio: true,
  });

  const [status, setStatus] = useState<'idle' | 'rendering' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);

  const handleStartExport = async () => {
    if (clips.length === 0) {
      addToast('No clips available in this project to export.', 'warning');
      return;
    }

    setStatus('rendering');
    setProgress(5);
    setStatusText('Initializing video rendering engine...');

    try {
      const result = await ClientVideoProcessor.exportProjectVideo(
        clips,
        settings,
        { type: 'dissolve', durationSec: 0.5 },
        (pct, text) => {
          setProgress(pct);
          setStatusText(text);
        }
      );

      setExportedVideoUrl(result.downloadUrl);
      setExportedBlob(result.blob);
      setStatus('completed');
      setProgress(100);
      setStatusText('Video render complete!');
      addToast('Video exported successfully and ready for download!', 'success');

      // Update project metadata
      if (currentProject) {
        currentProject.output_video_url = result.downloadUrl;
        currentProject.status = 'completed';
        saveProject(currentProject);
      }
    } catch (err: any) {
      setStatus('failed');
      setStatusText(err.message || 'Export render failed.');
      addToast('Export failed: ' + err.message, 'error');
    }
  };

  const handleDownload = () => {
    if (!exportedVideoUrl) return;
    const a = document.createElement('a');
    a.href = exportedVideoUrl;
    a.download = `MIMI_AI_${currentProject?.title?.replace(/\s+/g, '_') || 'Studio_Video'}.${settings.format === 'mp4' ? 'mp4' : 'webm'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast('Video download initiated!', 'success');
  };

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

        <span className="text-xs font-mono text-cyan-300">
          Clips to export: <strong className="text-white">{clips.length}</strong>
        </span>
      </div>

      <div className="bg-ocean-900 border border-ocean-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Export Video Studio</h2>
          <p className="text-xs text-gray-400 mt-1">
            Configure output format, resolution, and encoding quality. The video processor will render all color grades, trims, and overlays.
          </p>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Resolution */}
          <div className="bg-ocean-950 border border-ocean-850 rounded-2xl p-4 space-y-2">
            <label className="text-xs font-bold text-gray-200">Resolution</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['720p', '1080p', '4k'] as const).map(res => (
                <button
                  key={res}
                  onClick={() => setSettings({ ...settings, resolution: res })}
                  className={`py-2 rounded-xl text-xs font-bold font-mono border transition-all ${
                    settings.resolution === res
                      ? 'bg-ocean-700 text-cyan-neon border-cyan-neon'
                      : 'bg-ocean-900 text-gray-400 border-ocean-800'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="bg-ocean-950 border border-ocean-850 rounded-2xl p-4 space-y-2">
            <label className="text-xs font-bold text-gray-200">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['16:9', '9:16', '1:1'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setSettings({ ...settings, aspect_ratio: r })}
                  className={`py-2 rounded-xl text-xs font-bold font-mono border transition-all ${
                    settings.aspect_ratio === r
                      ? 'bg-ocean-700 text-cyan-neon border-cyan-neon'
                      : 'bg-ocean-900 text-gray-400 border-ocean-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Frame Rate */}
          <div className="bg-ocean-950 border border-ocean-850 rounded-2xl p-4 space-y-2">
            <label className="text-xs font-bold text-gray-200">Frame Rate</label>
            <div className="grid grid-cols-3 gap-1.5">
              {([24, 30, 60] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setSettings({ ...settings, fps: f })}
                  className={`py-2 rounded-xl text-xs font-bold font-mono border transition-all ${
                    settings.fps === f
                      ? 'bg-ocean-700 text-cyan-neon border-cyan-neon'
                      : 'bg-ocean-900 text-gray-400 border-ocean-800'
                  }`}
                >
                  {f} fps
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Encoding Quality */}
        <div className="bg-ocean-950 border border-ocean-850 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <label className="text-xs font-bold text-gray-200">Video Encoding Bitrate</label>
            <p className="text-[11px] text-gray-400">Higher quality generates sharper detail with larger file size.</p>
          </div>

          <div className="flex items-center space-x-2">
            {(['standard', 'high', 'maximum'] as const).map(q => (
              <button
                key={q}
                onClick={() => setSettings({ ...settings, quality: q })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                  settings.quality === q
                    ? 'bg-ocean-700 text-cyan-neon border-cyan-neon'
                    : 'bg-ocean-900 text-gray-400 border-ocean-800'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Render Status / Progress Box */}
        {status === 'rendering' && (
          <div className="p-6 rounded-2xl bg-ocean-950 border border-cyan-500/40 text-center space-y-4 shadow-ocean-glow">
            <div className="w-12 h-12 rounded-full border-4 border-ocean-800 border-t-cyan-neon animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Rendering Video Package</h4>
              <p className="text-xs text-cyan-300 font-mono">{statusText}</p>
            </div>
            <div className="w-full max-w-md mx-auto h-2.5 bg-ocean-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-ocean-500 to-cyan-neon rounded-full transition-all duration-200"
              />
            </div>
          </div>
        )}

        {status === 'completed' && exportedVideoUrl && (
          <div className="p-6 rounded-2xl bg-ocean-950 border border-emerald-500/40 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Video Rendered Successfully!</h4>
              <p className="text-xs text-gray-300">
                Your video is ready to download. All trims, color grades, and text overlays were applied.
              </p>
            </div>

            {/* Completed Video Player */}
            <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-ocean-800 bg-black">
              <video src={exportedVideoUrl} controls className="w-full max-h-64 object-contain" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold text-xs shadow-ocean-glow flex items-center justify-center space-x-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Video File ({settings.format.toUpperCase()})</span>
              </button>

              <button
                onClick={() => navigate('projects')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-ocean-800 hover:bg-ocean-750 text-white font-semibold text-xs border border-ocean-700 transition-colors"
              >
                View in My Projects
              </button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-xs text-rose-300 font-semibold">{statusText}</p>
            <button
              onClick={handleStartExport}
              className="px-4 py-2 rounded-xl bg-ocean-800 text-white text-xs font-bold border border-ocean-700"
            >
              Retry Export
            </button>
          </div>
        )}

        {status === 'idle' && (
          <button
            onClick={handleStartExport}
            disabled={clips.length === 0}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-ocean-500 via-cyan-500 to-lavender-400 hover:opacity-95 text-ocean-950 font-bold text-sm shadow-ocean-glow flex items-center justify-center space-x-2 transition-all disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Export Rendering</span>
          </button>
        )}
      </div>
    </div>
  );
};
