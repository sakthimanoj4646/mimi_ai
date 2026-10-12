import { Router, Request, Response } from 'express';
import { mimiAIService } from '../services/mimi-ai.service';
import { dbManager } from '../database/db';

const router = Router();

// Mimi Conversational endpoint (accepts English, Tamil, Tanglish)
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, projectId, currentPlan, clipMetadata, languageHint } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const response = await mimiAIService.chat({
      message,
      projectId,
      currentPlan,
      clipMetadata,
      languageHint,
    });

    return res.json(response);
  } catch (err: any) {
    console.error('Mimi Chat Error:', err);
    return res.status(500).json({ error: 'Mimi assistant error: ' + err.message });
  }
});

// Validate structured editing plan
router.post('/plan/validate', (req: Request, res: Response) => {
  const { plan } = req.body;
  if (!plan || !plan.operations || !Array.isArray(plan.operations)) {
    return res.status(400).json({ valid: false, errors: ['Invalid plan schema: operations array required.'] });
  }

  const errors: string[] = [];
  plan.operations.forEach((op: any, idx: number) => {
    if (!op.type) errors.push(`Operation #${idx + 1} missing 'type'`);
    if (!op.label) errors.push(`Operation #${idx + 1} missing 'label'`);
  });

  return res.json({
    valid: errors.length === 0,
    errors,
  });
});

export default router;
