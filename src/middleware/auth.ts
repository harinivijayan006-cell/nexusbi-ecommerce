import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthUser {
  id: number;
  uid: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split('Bearer ')[1].trim();
  try {
    // 1. Check if token is a demo/app session token (format: demo_<uid> or user_<id>)
    if (token.startsWith('session_')) {
      const tokenUid = token.replace('session_', '');
      const matched = await db.select().from(users).where(eq(users.uid, tokenUid)).limit(1);
      if (matched.length > 0) {
        req.user = matched[0];
        return next();
      }
    }

    // 2. Try Firebase ID Token verification
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      let matched = await db.select().from(users).where(eq(users.uid, decoded.uid)).limit(1);
      if (matched.length === 0) {
        // Upsert user into database
        const created = await db.insert(users).values({
          uid: decoded.uid,
          name: decoded.name || decoded.email?.split('@')[0] || 'Customer',
          email: decoded.email || `${decoded.uid}@nexusbi.com`,
          avatarUrl: decoded.picture || null,
          role: 'customer',
        }).returning();
        req.user = created[0];
      } else {
        req.user = matched[0];
      }
      return next();
    } catch {
      // If Firebase token fails, check if token directly matches a user uid or email
      const matched = await db.select().from(users).where(eq(users.uid, token)).limit(1);
      if (matched.length > 0) {
        req.user = matched[0];
      }
      return next();
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return next();
  }
};

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  await optionalAuth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Please sign in to continue.',
      });
    }
    next();
  });
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  await optionalAuth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Please log in as an administrator.',
      });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Administrator privileges required.',
      });
    }
    next();
  });
};
