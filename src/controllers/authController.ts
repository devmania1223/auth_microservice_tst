// src/controllers/authController.ts

import { Request, Response } from 'express';
import { registerUser, loginUser, verifyToken } from '../services/authService';
import { redisClient } from '../utils/redis';

// User Sign Up
export const registerUserController = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  console.log("datas", req.body);
  const result = await registerUser(username, email, password);
  if (result.error) {
    return res.status(400).json({ message: result.error });
  }
  return res.status(201).json(result);
};

// User login
export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);

  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  // Ensure that the token is valid before saving to Redis
  if (result.token) {
    await redisClient.set(result.token, JSON.stringify({ userId: result.token }), { EX: 3600 });
    return res.status(200).json(result);
  } else {
    return res.status(500).json({ message: 'Failed to generate token' });
  }
};

// User token and session controller
export const validateSessionController = async (req: Request, res: Response) => {
  const token = req.params.sessionId;
  const session = await redisClient.get(token);
  if (!session) {
    return res.status(401).json({ message: 'Invalid session' });
  }

  const result = verifyToken(token);
  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  res.status(200).json(result);
};


// logout User Controller
export const logoutUserController = async (req: Request, res: Response) => {
  const token = req.body.token;

  try {
    // Check if token is provided
    if (!token) {
      return res.status(400).json({ message: 'Token is required to log out' });
    }

    // Delete the token from Redis to invalidate the session
    const result = await redisClient.del(token);

    // Check if the token was found and deleted
    if (result === 0) {
      return res.status(400).json({ message: 'Invalid token or already logged out' });
    }

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({ message: 'Error logging out' });
  }
};
