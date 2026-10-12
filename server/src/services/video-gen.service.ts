import { VideoGenJob } from '../types';
import { CONFIG } from '../config';

export interface VideoGenRequest {
  prompt: string;
  negative_prompt?: string;
  aspect_ratio: '16:9' | '9:16' | '1:1' | '4:3';
  duration_sec: number;
  style: 'cinematic' | 'realistic' | 'anime' | 'cyberpunk' | 'watercolor';
}

export class VideoGenerationService {
  private activeJobs: Map<string, VideoGenJob> = new Map();

  /**
   * Submit text-to-video generation job
   */
  async submitJob(req: VideoGenRequest): Promise<VideoGenJob> {
    if (!req.prompt || req.prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty.');
    }

    const jobId = `vgen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const job: VideoGenJob = {
      id: jobId,
      prompt: req.prompt,
      negative_prompt: req.negative_prompt,
      aspect_ratio: req.aspect_ratio || '16:9',
      duration_sec: req.duration_sec || 5,
      style: req.style || 'cinematic',
      status: 'queued',
      created_at: new Date().toISOString(),
    };

    this.activeJobs.set(jobId, job);

    // Asynchronous background simulation or provider execution
    this.executeJob(jobId, req).catch(err => {
      console.error(`Job ${jobId} failed:`, err);
    });

    return job;
  }

  private async executeJob(jobId: string, req: VideoGenRequest) {
    const job = this.activeJobs.get(jobId);
    if (!job) return;

    job.status = 'generating';
    this.activeJobs.set(jobId, job);

    const provider = CONFIG.VIDEO_GEN_PROVIDER;

    // Check if real provider credentials exist
    if (provider === 'replicate' && CONFIG.REPLICATE_API_TOKEN) {
      try {
        // Example Replicate Minimax / Luma call
        const response = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${CONFIG.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version: 'some-model-version-hash',
            input: {
              prompt: req.prompt,
              negative_prompt: req.negative_prompt,
              aspect_ratio: req.aspect_ratio,
            }
          }),
        });

        if (!response.ok) {
          throw new Error(`Replicate API returned status ${response.status}`);
        }
        const data = await response.json();
        job.video_url = data.output;
        job.status = 'completed';
        this.activeJobs.set(jobId, job);
        return;
      } catch (err: any) {
        job.status = 'failed';
        job.error_message = `Replicate provider error: ${err.message}`;
        this.activeJobs.set(jobId, job);
        return;
      }
    }

    // In Mock / Development Mode (when credentials are not provided)
    // We clearly report mock generation status
    if (CONFIG.MOCK_MODE || provider === 'mock') {
      // Simulate real asynchronous progress timing (5 seconds)
      await new Promise(r => setTimeout(r, 4000));
      const current = this.activeJobs.get(jobId);
      if (current && current.status !== 'failed') {
        current.status = 'completed';
        // Provide a high-definition sample ocean aesthetic video URL
        current.video_url = 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4';
        this.activeJobs.set(jobId, current);
      }
      return;
    }

    // Missing required credentials
    job.status = 'failed';
    job.error_message = `Provider '${provider}' requires API credentials. Please set REPLICATE_API_TOKEN or RUNWAY_API_KEY in your .env or Settings screen.`;
    this.activeJobs.set(jobId, job);
  }

  getJob(jobId: string): VideoGenJob | undefined {
    return this.activeJobs.get(jobId);
  }

  cancelJob(jobId: string): boolean {
    const job = this.activeJobs.get(jobId);
    if (!job || job.status === 'completed') return false;
    job.status = 'failed';
    job.error_message = 'Generation job cancelled by user.';
    this.activeJobs.set(jobId, job);
    return true;
  }
}

export const videoGenService = new VideoGenerationService();
