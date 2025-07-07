import { Router } from 'express';
import { getWatchlist, toggleWatchlist } from '../controllers/watchlistController';
import { requireAuth } from '../middleware/auth';

const watchlistRouter = Router();

watchlistRouter.use(requireAuth);
watchlistRouter.get('/', getWatchlist);
watchlistRouter.post('/', toggleWatchlist);

export default watchlistRouter;