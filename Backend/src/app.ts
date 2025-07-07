import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import watchlistRouter from './routes/watchlist';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

export const app = express()
  .use(cors())
  .use(express.json())
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  .use('/auth', authRouter)
  .use('/watchlist', watchlistRouter);
