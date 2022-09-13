import { NextFunction, Request, Response } from 'express';
import { decodeToken, verifyToken } from '../db/token';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(403).end();

  try {
    const ok = verifyToken(token);
    if (!ok) {
      return res.status(403).end();
    }
  } catch (e) {
    return res.status(500).end();
  }

  const decodedToken = await decodeToken(token);
  res.locals.username = decodedToken?.username;
  next();
};
