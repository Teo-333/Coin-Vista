import { Router } from 'express';
import { getWatchlist, toggleWatchlist } from '../controllers/watchlistController';
import { requireAuth } from '../middleware/auth';

const router = Router();
router.use(requireAuth);
router.get('/', getWatchlist);
router.post('/', toggleWatchlist);

export default router;
