import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export async function getWatchlist(req: AuthRequest, res: Response) {
  const items = await prisma.watchlist.findMany({ where: { userId: req.userId! } });
  res.json(items.map(i => i.coinId));
}

export async function toggleWatchlist(req: AuthRequest, res: Response) {
  const { coinId } = req.body;
  const existing = await prisma.watchlist.findUnique({
    where: { userId_coinId: { userId: req.userId!, coinId } },
  });
  if (existing) {
    await prisma.watchlist.delete({ where: { id: existing.id } });
    return res.json({ action: 'removed' });
  } else {
    await prisma.watchlist.create({ data: { userId: req.userId!, coinId } });
    return res.json({ action: 'added' });
  }
}
