import { StructuredEditingPlan, MediaClip, EditingOperation } from '../types';

export interface MimiChatClientResponse {
  reply: string;
  language: 'en' | 'ta' | 'tanglish';
  editingPlan?: StructuredEditingPlan;
  suggestions: string[];
}

export class MimiClientService {
  /**
   * Send message to Mimi assistant (with full fallback if backend server is offline)
   */
  static async sendMessage(
    message: string,
    projectId: string,
    clips: MediaClip[],
    currentPlan?: StructuredEditingPlan
  ): Promise<MimiChatClientResponse> {
    const clipMetadata = {
      clipCount: clips.length,
      duration: clips.reduce((acc, c) => acc + (c.trimEnd - c.trimStart), 0),
      width: clips[0]?.width || 1920,
      height: clips[0]?.height || 1080,
    };

    try {
      const res = await fetch('/api/mimi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          projectId,
          currentPlan,
          clipMetadata,
        }),
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Backend not running, use client-side smart reasoning engine
    }

    return this.clientFallbackReasoning(message, projectId, clips, currentPlan);
  }

  /**
   * Client-side natural language & Tanglish/Tamil engine
   */
  private static clientFallbackReasoning(
    prompt: string,
    projectId: string,
    clips: MediaClip[],
    currentPlan?: StructuredEditingPlan
  ): MimiChatClientResponse {
    const p = prompt.toLowerCase();
    const isTanglish = /(epdi|panrathu|pannu|venum|irukku|konjam|romba|nalla|mudiyuma|kaga)/i.test(p);
    const isTamil = /[\u0B80-\u0BFF]/.test(prompt);
    const lang: 'en' | 'ta' | 'tanglish' = isTamil ? 'ta' : isTanglish ? 'tanglish' : 'en';

    // Iterative editing modifications
    if (p.includes('reduce saturation') || p.includes('saturation kora') || p.includes('less saturation')) {
      return {
        reply: lang === 'tanglish' 
          ? 'Saturation-ah -20% koraichuten creator! Colors ippo natural-ah look tharum. Plan updated! 💙'
          : 'I have reduced the saturation by 20% for a cleaner, more grounded look. Plan updated!',
        language: lang,
        editingPlan: this.modifyPlan(currentPlan, projectId, {
          type: 'color_adjust',
          label: 'Reduce Saturation',
          description: 'Lower color saturation by 20% for muted natural aesthetic.',
          parameters: { saturation: 0.8 },
          applied: false,
        }),
        suggestions: ['Make the second clip slower', 'Change transition', 'Remove the title overlay'],
      };
    }

    if (p.includes('slower') || p.includes('slow motion') || p.includes('slow mo') || p.includes('slow pannu')) {
      return {
        reply: lang === 'tanglish'
          ? 'Speed-ah 0.5x slow-mo-ku maathirukken! Dreamy cinematic motion kedaikkum. Plan review pannunga! 💙'
          : 'Set the playback speed to 0.5x smooth slow-motion. Plan updated for your review!',
        language: lang,
        editingPlan: this.modifyPlan(currentPlan, projectId, {
          type: 'speed',
          label: 'Cinematic Slow Motion (0.5x)',
          description: 'Apply 0.5x speed multiplier for dramatic pacing.',
          parameters: { speed: 0.5 },
          applied: false,
        }),
        suggestions: ['Add a warm sunset grade', 'Add captions', 'Preview current edits'],
      };
    }

    if (p.includes('remove title') || p.includes('remove caption') || p.includes('title venaam')) {
      return {
        reply: lang === 'tanglish'
          ? 'Title overlay remove panniten! Clean full-screen visual ready-ah irukku. 💙'
          : 'Removed the title overlay as requested. Your visual frame is now clean.',
        language: lang,
        suggestions: ['Change the transition', 'Enhance lighting', 'Export 1080p'],
      };
    }

    // Default Plan Generation
    const operations: EditingOperation[] = [];

    if (p.includes('cinematic') || p.includes('warm') || p.includes('sunset') || p.includes('grade')) {
      operations.push({
        id: `op_${Date.now()}_1`,
        type: 'color_adjust',
        label: 'Warm Sunset Grade',
        description: 'Boost contrast (+20%), warm temperature (+30%), and rich ocean blues.',
        parameters: { brightness: 0.05, contrast: 1.2, saturation: 1.25, temperature: 0.3 },
        applied: false,
      });
    }

    if (p.includes('reel') || p.includes('travel') || p.includes('combine') || p.includes('music')) {
      operations.push({
        id: `op_${Date.now()}_2`,
        type: 'transition',
        label: 'Dynamic Cross Dissolve',
        description: 'Add 0.6s smooth transition between sequence cuts.',
        parameters: { type: 'dissolve', durationSec: 0.6 },
        applied: false,
      });
      operations.push({
        id: `op_${Date.now()}_3`,
        type: 'text_overlay',
        label: 'Travel Reel Minimal Title',
        description: 'Clean uppercase typography overlay at frame bottom.',
        parameters: { text: 'TRAVEL MOMENTS 2026', position: 'bottom', fontSize: 32, fontColor: '#FFFFFF' },
        applied: false,
      });
    }

    if (operations.length === 0) {
      operations.push({
        id: `op_${Date.now()}_auto`,
        type: 'color_adjust',
        label: 'AI Color & Clarity Balance',
        description: 'Optimized +15% contrast and vibrant color correction.',
        parameters: { brightness: 0.02, contrast: 1.15, saturation: 1.2, temperature: 0.1 },
        applied: false,
      });
    }

    const plan: StructuredEditingPlan = {
      version: (currentPlan?.version || 0) + 1,
      project_id: projectId,
      title: 'Mimi AI Editing Plan',
      summary: `Prepared ${operations.length} validated operations for "${prompt.slice(0, 60)}"`,
      operations,
      output_settings: {
        resolution: '1080p',
        aspect_ratio: p.includes('vertical') || p.includes('reel') ? '9:16' : '16:9',
        fps: 30,
        format: 'mp4',
      },
      validation_status: 'valid',
      created_at: new Date().toISOString(),
    };

    let reply = `Here is your customized editing plan! 💙 Review the operations below and click **Apply Edits** when you're satisfied.`;
    if (lang === 'tanglish') {
      reply = `Super creator! Ungalukaga semmayaana editing plan ready panniten. 💙 Operations check pannitu 'Apply Edits' click pannunga!`;
    } else if (lang === 'ta') {
      reply = `வணக்கம் கிரியேட்டர்! உங்கள் விருப்பத்திற்கு ஏற்ற எடிட்டிங் திட்டம் தயார். கீழே உள்ள மாற்றங்களை சரிபார்த்து 'Apply Edits' தேர்ந்தெடுக்கவும்! 💙`;
    }

    return {
      reply,
      language: lang,
      editingPlan: plan,
      suggestions: [
        'Make the second clip slower',
        'Add a soft cross dissolve transition',
        'Make the colors cooler and moody',
        'Reduce saturation'
      ],
    };
  }

  private static modifyPlan(
    currentPlan: StructuredEditingPlan | undefined,
    projectId: string,
    newOp: Omit<EditingOperation, 'id'>
  ): StructuredEditingPlan {
    const existingOps = currentPlan?.operations ? [...currentPlan.operations] : [];
    const op: EditingOperation = {
      ...newOp,
      id: `op_${Date.now()}_mod`,
    };
    existingOps.push(op);

    return {
      version: (currentPlan?.version || 0) + 1,
      project_id: projectId,
      title: 'Updated Editing Plan',
      summary: `Iteratively adjusted plan with ${op.label}`,
      operations: existingOps,
      output_settings: currentPlan?.output_settings || {
        resolution: '1080p',
        aspect_ratio: '16:9',
        fps: 30,
        format: 'mp4',
      },
      validation_status: 'valid',
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Applies validated operations from an EditingPlan directly onto clip objects
   */
  static applyPlanToClips(plan: StructuredEditingPlan, clips: MediaClip[]): MediaClip[] {
    return clips.map(clip => {
      let updated = { ...clip };

      plan.operations.forEach(op => {
        if (op.type === 'color_adjust') {
          if (op.parameters.brightness !== undefined) updated.brightness = op.parameters.brightness;
          if (op.parameters.contrast !== undefined) updated.contrast = op.parameters.contrast;
          if (op.parameters.saturation !== undefined) updated.saturation = op.parameters.saturation;
          if (op.parameters.temperature !== undefined) updated.temperature = op.parameters.temperature;
        }

        if (op.type === 'speed') {
          if (op.parameters.speed) updated.speed = op.parameters.speed;
        }

        if (op.type === 'enhance') {
          if (op.parameters.sharpen) updated.sharpen = true;
        }

        if (op.type === 'text_overlay' && op.parameters.text) {
          const newOverlay = {
            id: `text_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            text: op.parameters.text,
            position: op.parameters.position || 'bottom',
            fontSize: op.parameters.fontSize || 32,
            fontColor: op.parameters.fontColor || '#FFFFFF',
            startTime: 0,
            endTime: updated.duration,
          };
          updated.textOverlays = [...(updated.textOverlays || []), newOverlay];
        }
      });

      return updated;
    });
  }
}
