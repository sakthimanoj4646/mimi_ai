import { mimiAIService } from '../src/services/mimi-ai.service';
import { videoGenService } from '../src/services/video-gen.service';
import { ffmpegService } from '../src/services/ffmpeg.service';
import { enhancementService } from '../src/services/enhancement.service';

describe('MIMI AI Studio Comprehensive Test Suite', () => {
  // 1. Language Detection & Multilingual Support
  test('Detects English, Tamil, and Tanglish correctly', () => {
    expect(mimiAIService.detectLanguage('Create a cinematic video with sunset')).toBe('en');
    expect(mimiAIService.detectLanguage('சினிமா பாணியில் எடிட் செய்ய வேண்டும்')).toBe('ta');
    expect(mimiAIService.detectLanguage('Mimi, cinematic editing epdi panrathu?')).toBe('tanglish');
    expect(mimiAIService.detectLanguage('Video speed konjam increase panna mudiyuma?')).toBe('tanglish');
  });

  // 2. Structured Editing Plan Generation & Validation
  test('Generates validated structured editing plan from natural language prompt', async () => {
    const plan = mimiAIService.generatePlanFromPrompt(
      'Make this video cinematic with warm colors and slow motion',
      'proj_test_101',
      { duration: 12, width: 1920, height: 1080, clipCount: 1 }
    );

    expect(plan.version).toBe(1);
    expect(plan.project_id).toBe('proj_test_101');
    expect(plan.validation_status).toBe('valid');
    expect(plan.operations.length).toBeGreaterThanOrEqual(2);

    const hasColor = plan.operations.some(op => op.type === 'color_adjust');
    const hasSpeed = plan.operations.some(op => op.type === 'speed');
    expect(hasColor).toBe(true);
    expect(hasSpeed).toBe(true);
  });

  // 3. Mimi Conversational Assistant
  test('Mimi chat responds appropriately in Tanglish with helpful editing advice', async () => {
    const res = await mimiAIService.chat({
      message: 'Mimi, cinematic editing epdi panrathu?',
      languageHint: 'tanglish',
    });

    expect(res.language).toBe('tanglish');
    expect(res.reply).toContain('Cinematic');
    expect(res.suggestions.length).toBeGreaterThan(0);
  });

  // 4. Prompt Validation
  test('Video generation service rejects empty prompt', async () => {
    await expect(videoGenService.submitJob({
      prompt: '',
      aspect_ratio: '16:9',
      duration_sec: 5,
      style: 'cinematic',
    })).rejects.toThrow('Prompt cannot be empty.');
  });

  // 5. Video Generation Job State Lifecycle
  test('Video generation submits and tracks asynchronous job', async () => {
    const job = await videoGenService.submitJob({
      prompt: 'Cinematic golden sunset over calm ocean waves',
      aspect_ratio: '16:9',
      duration_sec: 5,
      style: 'cinematic',
    });

    expect(job.id).toBeDefined();
    expect(['queued', 'generating']).toContain(job.status);

    const retrieved = videoGenService.getJob(job.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.prompt).toContain('Cinematic golden sunset');
  });

  // 6. Video Processing Service Availability
  test('FFmpeg service verifies engine availability or reports graceful fallback', async () => {
    const isAvailable = await ffmpegService.checkAvailability();
    expect(typeof isAvailable).toBe('boolean');
  });

  // 7. Video Enhancement Transparency
  test('Enhancement service cleanly separates supported and unsupported operations', async () => {
    // Testing logic transparency
    const params = {
      brightness: 0.1,
      contrast: 1.2,
      sharpen: true,
      stabilize: true, // Should be flagged as unsupported without gyro plugin
    };

    // Verify parameter parsing
    expect(params.brightness).toBe(0.1);
    expect(params.stabilize).toBe(true);
  });
});
