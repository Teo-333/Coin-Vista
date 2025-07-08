import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import watchlistRouter from './routes/watchlist';
import coinsRouter from './routes/coins';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRouter);
app.use('/watchlist', watchlistRouter);
app.use('/api/coins', coinsRouter);

// Global error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Global error:', err);
  
  if (err.type === 'validation') {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors
    });
    return;
  }
  
  if (err.name === 'ValidationError') {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
    return;
  }
  
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({
    status: 'error',
    message
  });
};

app.use(errorHandler);
