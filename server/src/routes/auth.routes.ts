import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbManager } from '../database/db';
import { CONFIG } from '../config';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, display_name } = req.body;

    if (!email || !password || !display_name) {
      return res.status(400).json({ error: 'Display name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    const existing = dbManager.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    dbManager.prepare(
      'INSERT INTO users (id, email, display_name, password_hash, avatar_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(userId, email.toLowerCase(), display_name, password_hash, '', now, now);

    const token = jwt.sign(
      { id: userId, email: email.toLowerCase(), display_name },
      CONFIG.JWT_SECRET,
      { expiresIn: CONFIG.JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: userId,
        email: email.toLowerCase(),
        display_name,
      }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = dbManager.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      // In mock/dev mode, allow creator login gracefully
      if (CONFIG.MOCK_MODE && email === 'creator@mimi-ai.studio') {
        const devToken = jwt.sign(
          { id: 'usr_dev_creator_01', email: 'creator@mimi-ai.studio', display_name: 'Studio Creator' },
          CONFIG.JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({
          token: devToken,
          user: { id: 'usr_dev_creator_01', email, display_name: 'Studio Creator' }
        });
      }
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, display_name: user.display_name },
      CONFIG.JWT_SECRET,
      { expiresIn: CONFIG.JWT_EXPIRES_IN }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        avatar_url: user.avatar_url
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Password recovery
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  // Safe message that doesn't leak user existence
  return res.json({
    message: 'If an account exists with this email, instructions have been sent to reset your password.'
  });
});

// Profile / Current authenticated user
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.user });
});

export default router;
