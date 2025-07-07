import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import type { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export async function getWatchlist(req: AuthRequest, res: Response): Promise<void> {
  const items = await prisma.watchlist.findMany({ where: { userId: req.userId! } });
  const coinIds = items.map(i => i.coinId);
  res.json(coinIds);
}

export async function toggleWatchlist(req: AuthRequest, res: Response): Promise<void> {
  const { coinId } = req.body;
  const existing = await prisma.watchlist.findUnique({
    where: { userId_coinId: { userId: req.userId!, coinId } },
  });
  if (existing) {
    await prisma.watchlist.delete({ where: { id: existing.id } });
    res.json({ action: 'removed' });
  } else {
    await prisma.watchlist.create({ data: { userId: req.userId!, coinId } });
    res.json({ action: 'added' });
  }
}