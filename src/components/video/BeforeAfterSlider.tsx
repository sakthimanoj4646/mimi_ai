import React, { useState, useRef } from 'react';
import { MediaClip } from '../../types';
import { ClientVideoProcessor } from '../../services/videoProcessor';

interface BeforeAfterSliderProps {
  clip: MediaClip;
  enhancedFilterStyle?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  clip,
  enhancedFilterStyle,
  className = '',
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = (x / rect.width) * 100;
    setSliderPos(pct);
  };

  const enhancedFilter = enhancedFilterStyle || ClientVideoProcessor.getCSSFilterString(clip);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
      className={`relative select-none overflow-hidden rounded-2xl border border-ocean-800 bg-black cursor-ew-resize max-h-[480px] flex items-center justify-center ${className}`}
    >
      {/* 1. Enhanced / Processed Layer (Full Background) */}
      <div className="w-full h-full flex items-center justify-center">
        <video
          src={clip.url}
          style={{ filter: enhancedFilter }}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-contain pointer-events-none"
        />
        <div className="absolute top-4 right-4 bg-ocean-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-neon/40 text-[11px] font-bold text-cyan-neon shadow-ocean-glow">
          ENHANCED AI
        </div>
      </div>

      {/* 2. Original Layer (Clipped to slider position) */}
      <div
        style={{ width: `${sliderPos}%` }}
        className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-cyan-neon shadow-2xl"
      >
        <div style={{ width: containerRef.current?.offsetWidth || '100%' }} className="h-full flex items-center justify-center bg-black">
          <video
            src={clip.url}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>
        <div className="absolute top-4 left-4 bg-ocean-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-ocean-700 text-[11px] font-bold text-gray-300">
          ORIGINAL
        </div>
      </div>

      {/* 3. Interactive Split Handle Slider */}
      <div
        style={{ left: `${sliderPos}%` }}
        className="absolute inset-y-0 -ml-4 w-8 flex items-center justify-center pointer-events-none"
      >
        <div className="w-8 h-8 rounded-full bg-cyan-neon text-ocean-950 flex items-center justify-center font-bold text-xs shadow-ocean-glow">
          ⇄
        </div>
      </div>
    </div>
  );
};
