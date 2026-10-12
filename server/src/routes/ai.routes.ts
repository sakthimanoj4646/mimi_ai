import { Router, Request, Response } from 'express';
import { videoGenService } from '../services/video-gen.service';
import { CONFIG } from '../config';

const router = Router();

// Submit text-to-video prompt
router.post('/text-to-video', async (req: Request, res: Response) => {
  try {
    const { prompt, negative_prompt, aspect_ratio, duration_sec, style } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Text prompt is required.' });
    }

    const job = await videoGenService.submitJob({
      prompt,
      negative_prompt,
      aspect_ratio: aspect_ratio || '16:9',
      duration_sec: duration_sec || 5,
      style: style || 'cinematic',
    });

    return res.status(202).json({
      message: 'Video generation job queued.',
      job,
      provider: CONFIG.VIDEO_GEN_PROVIDER,
      isMock: CONFIG.MOCK_MODE,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to submit generation job.' });
  }
});

// Check status of text-to-video job
router.get('/text-to-video/:jobId', (req: Request, res: Response) => {
  const job = videoGenService.getJob(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: 'Generation job not found.' });
  }
  return res.json({ job });
});

// Cancel generation job
router.post('/text-to-video/:jobId/cancel', (req: Request, res: Response) => {
  const success = videoGenService.cancelJob(req.params.jobId);
  if (!success) {
    return res.status(400).json({ error: 'Cannot cancel job or job already completed.' });
  }
  return res.json({ message: 'Job cancelled.' });
});

export default router;
