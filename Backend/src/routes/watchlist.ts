import { Router } from 'express';
import { getWatchlist, toggleWatchlist } from '../controllers/watchlistController';
import { requireAuth } from '../middleware/auth';

const watchlistRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Watchlist
 *   description: User cryptocurrency watchlist management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WatchlistCoin:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "bitcoin"
 *         coinId:
 *           type: string
 *           example: "bitcoin"
 *         userId:
 *           type: string
 *           example: "user-uuid-123"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Error message"
 */

// Apply authentication middleware to all watchlist endpoints
watchlistRouter.use(requireAuth);

/**
 * @swagger
 * /watchlist:
 *   get:
 *     summary: Get user's cryptocurrency watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of coins in user's watchlist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["bitcoin", "ethereum", "cardano"]
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
watchlistRouter.get('/', getWatchlist);

/**
 * @swagger
 * /watchlist:
 *   post:
 *     summary: Add or remove a cryptocurrency from user's watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coinId
 *             properties:
 *               coinId:
 *                 type: string
 *                 description: The ID of the cryptocurrency (e.g. from CoinGecko)
 *                 example: "bitcoin"
 *     responses:
 *       200:
 *         description: Coin successfully added or removed from watchlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 action:
 *                   type: string
 *                   enum: [added, removed]
 *                   example: "added"
 *                 coinId:
 *                   type: string
 *                   example: "bitcoin"
 *       400:
 *         description: Bad request - coinId is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
watchlistRouter.post('/', toggleWatchlist);

export default watchlistRouter;