/**
 * MIMI AI - Procedural Sample Video Generator
 * Generates an actual, playable video Blob of a cinematic ocean scene using HTML5 Canvas & MediaRecorder.
 * Allows immediate testing of video trimming, color grading, text overlay, and export.
 */
export class MockVideoGenerator {
  static async createSampleOceanClip(durationSec = 5, title = "Cinematic Ocean"): Promise<{ url: string; duration: number; blob: Blob }> {
    return new Promise((resolve, reject) => {
      try {
        const width = 1280;
        const height = 720;
        const fps = 30;
        const totalFrames = durationSec * fps;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 2D context unavailable.');
        }

        const stream = canvas.captureStream(fps);
        const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')
          ? 'video/mp4;codecs=avc1'
          : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm';

        const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3000000 });
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          resolve({ url, duration: durationSec, blob });
        };

        recorder.start();

        let frame = 0;
        const interval = setInterval(() => {
          if (frame >= totalFrames) {
            clearInterval(interval);
            recorder.stop();
            return;
          }

          const progress = frame / totalFrames;
          const time = frame / fps;

          // Draw cinematic gradient sky and ocean
          const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
          skyGrad.addColorStop(0, '#070D1E'); // Deep navy
          skyGrad.addColorStop(0.4, '#101C38');
          skyGrad.addColorStop(0.65, '#0077B6'); // Ocean blue
          skyGrad.addColorStop(1, '#00F0FF'); // Glowing cyan horizon

          ctx.fillStyle = skyGrad;
          ctx.fillRect(0, 0, width, height);

          // Animated ocean waves
          ctx.fillStyle = 'rgba(11, 19, 43, 0.7)';
          ctx.beginPath();
          ctx.moveTo(0, height * 0.65);
          for (let x = 0; x <= width; x += 20) {
            const waveY = height * 0.65 + Math.sin((x * 0.01) + (time * 3)) * 18 + Math.cos((x * 0.02) - (time * 2)) * 10;
            ctx.lineTo(x, waveY);
          }
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fill();

          // Second foreground wave
          ctx.fillStyle = 'rgba(7, 13, 30, 0.9)';
          ctx.beginPath();
          ctx.moveTo(0, height * 0.75);
          for (let x = 0; x <= width; x += 15) {
            const waveY = height * 0.75 + Math.sin((x * 0.015) - (time * 4)) * 14;
            ctx.lineTo(x, waveY);
          }
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fill();

          // Sun glow on horizon
          const sunX = width * 0.5 + Math.sin(time * 0.5) * 50;
          const sunY = height * 0.55;
          const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 200);
          sunGrad.addColorStop(0, 'rgba(255, 230, 180, 0.8)');
          sunGrad.addColorStop(0.3, 'rgba(0, 240, 255, 0.4)');
          sunGrad.addColorStop(1, 'rgba(0, 119, 182, 0)');
          ctx.fillStyle = sunGrad;
          ctx.beginPath();
          ctx.arc(sunX, sunY, 200, 0, Math.PI * 2);
          ctx.fill();

          // Dynamic floating particle sparks
          for (let i = 0; i < 20; i++) {
            const px = (width * 0.2 + (i * 45) + Math.sin(time + i) * 60) % width;
            const py = (height * 0.4 + (i * 20) + Math.cos(time * 2 + i) * 40);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Studio Watermark / Title Text
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = 'bold 36px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`MIMI AI — ${title.toUpperCase()}`, width / 2, height * 0.88);

          ctx.font = '18px Inter, sans-serif';
          ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
          ctx.fillText(`Scene Time: ${time.toFixed(1)}s / ${durationSec}s • 1080p Ocean AI Canvas`, width / 2, height * 0.93);

          frame++;
        }, 1000 / fps);
      } catch (err) {
        reject(err);
      }
    });
  }
}
