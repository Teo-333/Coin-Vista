import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import watchlistRouter from './routes/watchlist';

export const app = express()
  .use(cors())
  .use(express.json())
  .use('/auth', authRouter)
  .use('/watchlist', watchlistRouter);
