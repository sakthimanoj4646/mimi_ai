import { MediaClip, ExportSettings, TransitionSetting } from '../types';

export interface ExportProgressCallback {
  (progress: number, statusText: string): void;
}

export class ClientVideoProcessor {
  /**
   * Generates a CSS filter string corresponding to a clip's color adjustments
   */
  static getCSSFilterString(clip: MediaClip): string {
    const brightnessVal = 1 + (clip.brightness || 0);
    const contrastVal = clip.contrast ?? 1;
    const saturationVal = clip.saturation ?? 1;
    const temp = clip.temperature || 0;

    // Build filter sequence
    let filters = `brightness(${brightnessVal}) contrast(${contrastVal}) saturate(${saturationVal})`;

    if (temp > 0) {
      // Warm golden tone: slight sepia + hue rotate
      filters += ` sepia(${temp * 0.35}) hue-rotate(-${temp * 15}deg)`;
    } else if (temp < 0) {
      // Cool cyan tone: hue rotate towards blue
      filters += ` hue-rotate(${Math.abs(temp) * 20}deg)`;
    }

    if (clip.filter === 'cinematic') {
      filters += ' contrast(1.2) saturate(1.15) hue-rotate(-5deg)';
    } else if (clip.filter === 'warm') {
      filters += ' sepia(0.25) saturate(1.2)';
    } else if (clip.filter === 'cool') {
      filters += ' hue-rotate(15deg) contrast(1.1)';
    } else if (clip.filter === 'vintage') {
      filters += ' sepia(0.4) contrast(0.9) brightness(0.95)';
    } else if (clip.filter === 'cyberpunk') {
      filters += ' contrast(1.3) saturate(1.4) hue-rotate(45deg)';
    }

    return filters;
  }

  /**
   * Exports a project (single or multi-clip) into a real playable Video Blob via Canvas + MediaRecorder
   */
  static async exportProjectVideo(
    clips: MediaClip[],
    settings: ExportSettings,
    transition: TransitionSetting = { type: 'dissolve', durationSec: 0.5 },
    onProgress?: ExportProgressCallback
  ): Promise<{ blob: Blob; downloadUrl: string; duration: number }> {
    if (!clips || clips.length === 0) {
      throw new Error('No clips available to export.');
    }

    const width = settings.aspect_ratio === '9:16' ? 720 : settings.aspect_ratio === '1:1' ? 720 : 1280;
    const height = settings.aspect_ratio === '9:16' ? 1280 : settings.aspect_ratio === '1:1' ? 720 : 720;
    const fps = settings.fps || 30;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas 2D context not supported on this device.');
    }

    onProgress?.(5, 'Preparing media elements and video tracks...');

    // Load HTMLVideoElements for each clip
    const videoElements: HTMLVideoElement[] = [];
    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = clip.url;
      video.muted = true;
      video.playsInline = true;
      await new Promise<void>((resolve, reject) => {
        video.onloadeddata = () => resolve();
        video.onerror = () => resolve(); // continue gracefully
      });
      videoElements.push(video);
    }

    onProgress?.(15, 'Configuring stream encoder...');

    const stream = canvas.captureStream(fps);
    const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')
      ? 'video/mp4;codecs=avc1'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const bitRate = settings.quality === 'maximum' ? 6000000 : settings.quality === 'high' ? 4000000 : 2500000;
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: bitRate });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    return new Promise((resolve, reject) => {
      recorder.onstop = () => {
        onProgress?.(100, 'Export complete! Generating download package...');
        const blob = new Blob(chunks, { type: mimeType });
        const downloadUrl = URL.createObjectURL(blob);
        resolve({ blob, downloadUrl, duration: totalProjectDuration });
      };

      recorder.onerror = (e) => {
        reject(e);
      };

      // Calculate total duration
      let totalProjectDuration = 0;
      clips.forEach(c => {
        const clipDur = (c.trimEnd - c.trimStart) / (c.speed || 1);
        totalProjectDuration += Math.max(0.5, clipDur);
      });

      recorder.start();

      let currentClipIndex = 0;
      let clipStartTime = 0;
      const totalFrames = Math.ceil(totalProjectDuration * fps);
      let renderedFrame = 0;

      const renderInterval = setInterval(() => {
        if (currentClipIndex >= clips.length || renderedFrame >= totalFrames) {
          clearInterval(renderInterval);
          onProgress?.(95, 'Finalizing video container...');
          recorder.stop();
          return;
        }

        const currentClip = clips[currentClipIndex];
        const currentVideo = videoElements[currentClipIndex];
        const clipEffectiveDuration = (currentClip.trimEnd - currentClip.trimStart) / (currentClip.speed || 1);

        // Advance video time
        const timeInClip = (renderedFrame / fps) - clipStartTime;
        if (timeInClip >= clipEffectiveDuration) {
          currentClipIndex++;
          clipStartTime = renderedFrame / fps;
          if (currentClipIndex >= clips.length) {
            clearInterval(renderInterval);
            recorder.stop();
            return;
          }
        }

        const activeClip = clips[currentClipIndex];
        const activeVideo = videoElements[currentClipIndex];
        const activeTime = Math.min(activeClip.trimEnd, activeClip.trimStart + ((renderedFrame / fps) - clipStartTime) * (activeClip.speed || 1));

        if (activeVideo.currentTime !== activeTime && isFinite(activeTime)) {
          activeVideo.currentTime = activeTime;
        }

        // Apply filters to canvas context
        ctx.save();
        ctx.filter = ClientVideoProcessor.getCSSFilterString(activeClip);

        // Draw background
        ctx.fillStyle = '#070D1E';
        ctx.fillRect(0, 0, width, height);

        // Draw video scaled with letterboxing/cover
        try {
          if (activeVideo.videoWidth > 0) {
            ctx.drawImage(activeVideo, 0, 0, width, height);
          } else {
            // Fallback gradient scene if video element not ready
            const grad = ctx.createLinearGradient(0, 0, 0, height);
            grad.addColorStop(0, '#101C38');
            grad.addColorStop(1, '#0077B6');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
          }
        } catch (e) {
          // ignore draw errors on unloaded frames
        }
        ctx.restore();

        // Render Text Overlays
        if (activeClip.textOverlays && activeClip.textOverlays.length > 0) {
          activeClip.textOverlays.forEach(overlay => {
            ctx.save();
            ctx.fillStyle = overlay.fontColor || '#FFFFFF';
            ctx.font = `bold ${overlay.fontSize || 32}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            let yPos = height / 2;
            if (overlay.position === 'top') yPos = height * 0.15;
            if (overlay.position === 'bottom') yPos = height * 0.85;

            ctx.fillText(overlay.text, width / 2, yPos);
            ctx.restore();
          });
        }

        // Watermark studio indicator
        ctx.save();
        ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('MIMI AI STUDIO', width - 20, height - 16);
        ctx.restore();

        renderedFrame++;
        const pct = Math.min(92, Math.round((renderedFrame / totalFrames) * 90) + 15);
        if (renderedFrame % 10 === 0) {
          onProgress?.(pct, `Rendering frame ${renderedFrame}/${totalFrames} (${pct}%)...`);
        }
      }, 1000 / fps);
    });
  }
}
