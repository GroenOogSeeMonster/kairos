import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/database';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token, authorization denied',
      });
    }

    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        isOnboarded: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Token is not valid',
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      ...(user.name ? { name: user.name } : {}),
    };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token is not valid',
    });
  }
}; 