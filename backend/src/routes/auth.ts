import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt, { SignOptions } from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../services/database';
import { Request, Response } from 'express';

const router = Router();
const googleClient = new OAuth2Client(process.env['GOOGLE_CLIENT_ID']);

// Register user
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('name').trim().isLength({ min: 2 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { email, name } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists',
        });
      }

      // Create user (passwordless for now)
      const user = await prisma.user.create({
        data: {
          email,
          name: name || null,
          preferences: {},
        },
      });

      // Generate JWT token
      if (!process.env['JWT_SECRET']) throw new Error('JWT_SECRET is not set');
      const signOptions: SignOptions = { expiresIn: 7 * 24 * 60 * 60 }; // 7 days in seconds
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env['JWT_SECRET'] as string,
        signOptions
      );

      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isOnboarded: user.isOnboarded,
          },
          token,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({
        success: false,
        error: 'Registration failed',
      });
    }
  }
);

// Login user (passwordless for now)
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
      }

      const { email } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
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
          error: 'User not found',
        });
      }

      // Generate JWT token
      if (!process.env['JWT_SECRET']) throw new Error('JWT_SECRET is not set');
      const signOptions: SignOptions = { expiresIn: 7 * 24 * 60 * 60 }; // 7 days in seconds
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env['JWT_SECRET'] as string,
        signOptions
      );

      return res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isOnboarded: user.isOnboarded,
          },
          token,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        error: 'Login failed',
      });
    }
  }
);

// Google OAuth
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: 'ID token is required',
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env['GOOGLE_CLIENT_ID'] || '',
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Google token',
      });
    }

    const { email, name, picture } = payload;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: email! },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email!,
          name: name || null,
          avatar: picture || null,
          preferences: {},
        },
      });
    }

    // Generate JWT token
    if (!process.env['JWT_SECRET']) throw new Error('JWT_SECRET is not set');
    const signOptions: SignOptions = { expiresIn: 7 * 24 * 60 * 60 }; // 7 days in seconds
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env['JWT_SECRET'] as string,
      signOptions
    );

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          isOnboarded: user.isOnboarded,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.status(500).json({
      success: false,
      error: 'Google authentication failed',
    });
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        timezone: true,
        preferences: true,
        isOnboarded: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    return res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
    });
  }
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required',
      });
    }

    // Verify refresh token (you might want to store refresh tokens in Redis)
    const decoded = jwt.verify(refreshToken, process.env['JWT_SECRET']!) as any;
    
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
        error: 'Invalid refresh token',
      });
    }

    // Generate new access token
    if (!process.env['JWT_SECRET']) throw new Error('JWT_SECRET is not set');
    const signOptions: SignOptions = { expiresIn: 7 * 24 * 60 * 60 }; // 7 days in seconds
    const newToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env['JWT_SECRET'] as string,
      signOptions
    );

    return res.json({
      success: true,
      data: {
        token: newToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isOnboarded: user.isOnboarded,
        },
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid refresh token',
    });
  }
});

export default router; 