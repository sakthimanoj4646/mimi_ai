import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    display_name: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Safe dev mode fallback if running with demo token
    if (CONFIG.MOCK_MODE && req.headers['x-mimi-dev-user']) {
      req.user = {
        id: 'usr_dev_creator_01',
        email: 'creator@mimi-ai.studio',
        display_name: 'Studio Creator'
      };
      return next();
    }
    return res.status(401).json({ error: 'Authentication required. Missing bearer token.' });
  }

  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      display_name: decoded.display_name
    };
    next();
  } catch (err: any) {
    return res.status(403).json({ error: 'Invalid or expired session token. Please log in again.' });
  }
};
