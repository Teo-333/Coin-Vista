import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }
  const token = tokenHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}