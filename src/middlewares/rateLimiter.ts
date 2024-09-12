import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests per second
  duration: 1,
});

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || '127.0.0.1'; // Fallback to localhost if req.ip is undefined
  
  rateLimiter.consume(ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).json({ message: 'Too many requests' });
    });
};
