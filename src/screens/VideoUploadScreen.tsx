import React, { useState, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useProject } from '../context/ProjectContext';
import { MockVideoGenerator } from '../services/mockVideoGenerator';
import { MediaClip } from '../types';
import { 
  UploadCloud, 
  Film, 
  Trash2, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Play
} from 'lucide-react';

export const VideoUploadScreen: React.FC = () => {
  const { navigate, addToast } = useSettings();
  const { currentProject, createNewProject, addClip, clips } = useProject();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stagedClips, setStagedClips] = useState<MediaClip[]>([]);
  const [error, setError] = useState<string | null>(null);

  const allowedFormats = ['.mp4', '.mov', '.webm', '.avi', '.mkv'];

  const processFile = async (file: File) => {
    // Validate format
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedFormats.includes(ext) && !file.type.startsWith('video/')) {
      setError(`Unsupported format (${ext}). Supported formats: MP4, MOV, WEBM, MKV.`);
      return;
    }

    // Validate size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError(`File size exceeds 100MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    const url = URL.createObjectURL(file);

    // Read metadata via temporary video element
    const tempVideo = document.createElement('video');
    tempVideo.src = url;

    await new Promise<void>((resolve) => {
      tempVideo.onloadedmetadata = () => {
        const newClip: MediaClip = {
          id: `clip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          url,
          file,
          duration: tempVideo.duration || 10,
          width: tempVideo.videoWidth || 1920,
          height: tempVideo.videoHeight || 1080,
          trimStart: 0,
          trimEnd: tempVideo.duration || 10,
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
        setStagedClips(prev => [...prev, newClip]);
        resolve();
      };
      tempVideo.onerror = () => {
        setError('Could not decode video metadata.');
        resolve();
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!e.target.files) return;
    setUploading(true);
    setUploadProgress(20);

    for (let i = 0; i < e.target.files.length; i++) {
      await processFile(e.target.files[i]);
    }

    setUploadProgress(100);
    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
      addToast('Video clips uploaded successfully!', 'success');
    }, 400);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploading(true);
      setUploadProgress(30);

      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        await processFile(e.dataTransfer.files[i]);
      }

      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        addToast('Video clips dropped and parsed!', 'success');
      }, 400);
    }
  };

  const handleAddSampleClip = async () => {
    try {
      const sample = await MockVideoGenerator.createSampleOceanClip(5, "Ocean Sunset");
      const sampleClip: MediaClip = {
        id: `clip_sample_${Date.now()}`,
        name: 'Ocean AI Demo Footage.mp4',
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
      setStagedClips(prev => [...prev, sampleClip]);
      addToast('Loaded Ocean AI sample footage!', 'info');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleProceedToWorkspace = () => {
    if (stagedClips.length === 0) {
      addToast('Please upload or stage at least one video clip.', 'warning');
      return;
    }

    if (!currentProject) {
      createNewProject('Studio Edit - ' + stagedClips[0].name.slice(0, 20), 'video_edit');
    }

    stagedClips.forEach(c => addClip(c));
    addToast('Entering Video Studio Workspace...', 'success');
    navigate('editing_workspace');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Upload Video Clips</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Select or drop videos from your device. Supported formats: MP4, MOV, WEBM, MKV (up to 100MB).
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center space-x-2 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 ${
          dragOver
            ? 'border-cyan-neon bg-cyan-950/20 shadow-ocean-glow'
            : 'border-ocean-750 hover:border-cyan-500/50 bg-ocean-900/60 hover:bg-ocean-900'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*,.mp4,.mov,.webm,.mkv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-ocean-800 border border-ocean-700 flex items-center justify-center text-cyan-neon shadow-sm">
          <UploadCloud className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">
            Drag and drop video files here, or <span className="text-cyan-neon underline">browse</span>
          </h3>
          <p className="text-xs text-gray-400">
            Supports MP4, MOV, WEBM • Up to 100MB per file
          </p>
        </div>

        {uploading && (
          <div className="w-48 h-2 bg-ocean-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${uploadProgress}%` }}
              className="h-full bg-cyan-neon rounded-full transition-all"
            />
          </div>
        )}
      </div>

      {/* Quick Test with Sample Clip */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-ocean-900 border border-ocean-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-ocean-800 flex items-center justify-center text-cyan-neon">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Don't have a video file ready?</h4>
            <p className="text-[11px] text-gray-400">Load a procedural 1080p Ocean AI sample clip instantly.</p>
          </div>
        </div>

        <button
          onClick={handleAddSampleClip}
          className="px-3.5 py-1.5 rounded-xl bg-ocean-800 hover:bg-ocean-750 text-cyan-300 border border-ocean-700 text-xs font-semibold transition-colors"
        >
          Load Ocean Sample
        </button>
      </div>

      {/* Staged Clips Grid */}
      {stagedClips.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center justify-between">
            <span>Selected Clips ({stagedClips.length})</span>
            <button
              onClick={() => setStagedClips([])}
              className="text-xs text-rose-400 hover:underline"
            >
              Clear All
            </button>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stagedClips.map((clip, index) => (
              <div
                key={clip.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-ocean-900 border border-ocean-800"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-12 h-12 rounded-xl bg-ocean-950 flex items-center justify-center text-cyan-neon shrink-0 border border-ocean-750">
                    <Film className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">{clip.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {clip.duration.toFixed(1)}s • {clip.width}x{clip.height}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setStagedClips(prev => prev.filter(c => c.id !== clip.id))}
                  className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg transition-colors"
                  title="Remove clip"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleProceedToWorkspace}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-ocean-950 font-bold text-sm shadow-ocean-glow flex items-center justify-center space-x-2 transition-all mt-4"
          >
            <span>Proceed to Studio Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
