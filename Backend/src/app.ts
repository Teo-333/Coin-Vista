import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import watchlistRoutes from './routes/watchlist';
import dotenv from 'dotenv';

dotenv.config();

export const app = express()
  .use(cors())
  .use(express.json())
  .use('/auth', authRoutes)
  .use('/watchlist', watchlistRoutes);
