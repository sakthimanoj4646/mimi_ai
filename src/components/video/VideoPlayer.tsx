import React, { useRef, useState, useEffect } from 'react';
import { MediaClip } from '../../types';
import { ClientVideoProcessor } from '../../services/videoProcessor';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  FastForward,
  Sparkles
} from 'lucide-react';

interface VideoPlayerProps {
  clip?: MediaClip;
  clips?: MediaClip[];
  activeClipIndex?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  clip,
  clips,
  activeClipIndex = 0,
  onTimeUpdate,
  className = '',
}) => {
  const activeClip = clip || (clips && clips[activeClipIndex]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    if (activeClip && videoRef.current) {
      videoRef.current.playbackRate = activeClip.speed || 1;
      setSpeed(activeClip.speed || 1);
    }
  }, [activeClip]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);
    onTimeUpdate?.(curr, videoRef.current.duration || 0);

    // Enforce trimming bounds if specified
    if (activeClip && activeClip.trimEnd > 0 && curr >= activeClip.trimEnd) {
      videoRef.current.currentTime = activeClip.trimStart || 0;
      if (!videoRef.current.loop) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration;
    setDuration(dur);
    if (activeClip && activeClip.trimStart > 0) {
      videoRef.current.currentTime = activeClip.trimStart;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    setCurrentTime(target);
    if (videoRef.current) {
      videoRef.current.currentTime = target;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeSpeed = () => {
    const nextSpeed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : speed === 2 ? 0.5 : 1;
    setSpeed(nextSpeed);
    if (videoRef.current) videoRef.current.playbackRate = nextSpeed;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const cssFilter = activeClip ? ClientVideoProcessor.getCSSFilterString(activeClip) : 'none';

  return (
    <div
      ref={containerRef}
      className={`relative group bg-ocean-950 rounded-2xl overflow-hidden border border-ocean-800 shadow-2xl flex flex-col justify-center items-center ${className}`}
    >
      {activeClip?.url ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
          <video
            ref={videoRef}
            src={activeClip.url}
            style={{ filter: cssFilter }}
            className="w-full h-full max-h-[520px] object-contain transition-all duration-300"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            playsInline
          />

          {/* Text Overlays rendering */}
          {activeClip.textOverlays && activeClip.textOverlays.length > 0 && (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
              {activeClip.textOverlays.map(text => {
                const isVisible = currentTime >= text.startTime && currentTime <= (text.endTime || duration || 100);
                if (!isVisible) return null;

                return (
                  <div
                    key={text.id}
                    className={`w-full text-center ${
                      text.position === 'top' ? 'self-start' : text.position === 'center' ? 'self-center my-auto' : 'self-end'
                    }`}
                  >
                    <span
                      style={{ fontSize: `${text.fontSize}px`, color: text.fontColor }}
                      className="font-bold tracking-wider drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] bg-black/40 px-4 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs"
                    >
                      {text.text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Center Play Button Overlay on Pause */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-ocean-500/80 hover:bg-ocean-400 text-white flex items-center justify-center backdrop-blur-md shadow-ocean-glow transition-transform hover:scale-110 z-20"
              aria-label="Play Video"
            >
              <Play className="w-8 h-8 ml-1 fill-white" />
            </button>
          )}

          {/* Active Color Filter Indicator badge */}
          {activeClip.filter !== 'none' && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded bg-ocean-900/80 backdrop-blur-sm border border-cyan-500/40 text-[10px] text-cyan-300 font-medium flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-cyan-neon" />
              <span className="capitalize">{activeClip.filter} Grade</span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-64 md:h-96 flex flex-col items-center justify-center p-6 text-center text-gray-400 bg-ocean-900/50">
          <div className="w-16 h-16 rounded-2xl bg-ocean-800 flex items-center justify-center text-ocean-400 mb-3 border border-ocean-700">
            <Play className="w-8 h-8" />
          </div>
          <p className="text-sm font-semibold text-white">No Video Clip Loaded</p>
          <p className="text-xs text-gray-400 max-w-xs mt-1">
            Upload clips, generate a scene with AI, or use a sample Ocean AI clip to start editing.
          </p>
        </div>
      )}

      {/* Control Bar */}
      {activeClip?.url && (
        <div className="w-full bg-ocean-900/95 backdrop-blur-md border-t border-ocean-800 p-3 flex flex-col space-y-2 z-30">
          {/* Progress Seek Bar */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-gray-300 w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 10}
              step={0.05}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-ocean-750 rounded-lg appearance-none cursor-pointer accent-cyan-neon"
            />
            <span className="text-[11px] font-mono text-gray-400 w-10">{formatTime(duration)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-lg text-white hover:bg-ocean-750 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={() => {
                  if (videoRef.current) videoRef.current.currentTime = 0;
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-ocean-750 transition-colors"
                title="Rewind to Start"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-1 pl-2 border-l border-ocean-750">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-ocean-750 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={changeSpeed}
                className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-ocean-800 text-cyan-300 border border-ocean-700 hover:border-cyan-500/50 transition-colors"
                title="Playback Speed"
              >
                {speed}x
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-ocean-750 transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
