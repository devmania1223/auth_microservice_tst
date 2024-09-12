import express from 'express';
import { json } from 'body-parser';
import helmet from 'helmet';
import { rateLimiterMiddleware } from './middlewares/rateLimiter';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(rateLimiterMiddleware);

// Register auth routes
app.use('/api/auth', authRoutes);

export default app;
