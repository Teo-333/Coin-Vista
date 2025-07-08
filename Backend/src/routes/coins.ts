import { Router } from 'express';
const { query, param, validationResult } = require('express-validator');
import type { Request, Response, NextFunction } from 'express';
import { getCoins, getCoinHistory, getCoinOHLC, getBatchHistory } from '../controllers/coinsController';

const coinsRouter = Router();

const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * @swagger
 * tags:
 *   name: Coins
 *   description: Cryptocurrency data proxy endpoints
 */

/**
 * @swagger
 * /api/coins:
 *   get:
 *     summary: Get cryptocurrency market data
 *     tags: [Coins]
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema:
 *           type: string
 *         description: Comma-separated list of coin IDs
 *         example: bitcoin,ethereum,cardano
 *       - in: query
 *         name: vs_currency
 *         schema:
 *           type: string
 *         description: Target currency
 *         example: usd
 *       - in: query
 *         name: price_change_percentage
 *         schema:
 *           type: string
 *         description: Price change percentage timeframes
 *         example: 1h,24h,7d
 *     responses:
 *       200:
 *         description: Cryptocurrency market data
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
coinsRouter.get('/', [
  query('ids').optional().isString().withMessage('ids must be a string'),
  query('vs_currency').optional().isString().isLength({ min: 2, max: 10 }).withMessage('vs_currency must be a valid currency code'),
  query('price_change_percentage').optional().isString().withMessage('price_change_percentage must be a string'),
  validationMiddleware
], getCoins);

/**
 * @swagger
 * /api/coins/{id}/history:
 *   get:
 *     summary: Get historical market chart data for a cryptocurrency
 *     tags: [Coins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coin ID
 *         example: bitcoin
 *       - in: query
 *         name: days
 *         schema:
 *           type: string
 *         description: Number of days of data
 *         example: 7
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *         description: Data interval
 *         example: daily
 *     responses:
 *       200:
 *         description: Historical market chart data
 *       400:
 *         description: Invalid parameters
 *       404:
 *         description: Coin not found
 *       500:
 *         description: Server error
 */
coinsRouter.get('/:id/history', [
  param('id').isString().isLength({ min: 1 }).withMessage('id is required and must be a valid string'),
  query('days').optional().isString().withMessage('days must be a string'),
  query('interval').optional().isString().withMessage('interval must be a string'),
  validationMiddleware
], getCoinHistory);

/**
 * @swagger
 * /api/coins/{id}/ohlc:
 *   get:
 *     summary: Get OHLC (Open, High, Low, Close) data for a cryptocurrency
 *     tags: [Coins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coin ID
 *         example: bitcoin
 *       - in: query
 *         name: vs_currency
 *         schema:
 *           type: string
 *         description: Target currency
 *         example: usd
 *       - in: query
 *         name: days
 *         schema:
 *           type: string
 *         description: Number of days of data
 *         example: 7
 *     responses:
 *       200:
 *         description: OHLC data
 *       400:
 *         description: Invalid parameters
 *       404:
 *         description: Coin not found
 *       500:
 *         description: Server error
 */
coinsRouter.get('/:id/ohlc', [
  param('id').isString().isLength({ min: 1 }).withMessage('id is required and must be a valid string'),
  query('vs_currency').optional().isString().isLength({ min: 2, max: 10 }).withMessage('vs_currency must be a valid currency code'),
  query('days').optional().isString().withMessage('days must be a string'),
  validationMiddleware
], getCoinOHLC);

/**
 * @swagger
 * /api/coins/history:
 *   get:
 *     summary: Get batch historical data for multiple cryptocurrencies
 *     tags: [Coins]
 *     parameters:
 *       - in: query
 *         name: ids
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of coin IDs
 *         example: bitcoin,ethereum,cardano
 *       - in: query
 *         name: days
 *         schema:
 *           type: string
 *         description: Number of days of data
 *         example: 7
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *         description: Data interval
 *         example: daily
 *     responses:
 *       200:
 *         description: Batch historical data
 *       400:
 *         description: Invalid parameters or missing required ids
 *       500:
 *         description: Server error
 */
coinsRouter.get('/history', [
  query('ids').notEmpty().isString().withMessage('ids parameter is required and must be a string'),
  query('days').optional().isString().withMessage('days must be a string'),
  query('interval').optional().isString().withMessage('interval must be a string'),
  validationMiddleware
], getBatchHistory);

export default coinsRouter; 