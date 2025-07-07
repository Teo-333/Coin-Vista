import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { signToken } from '../utils/jwt';

const prisma = new PrismaClient();

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash } });
  const token = signToken(user.id);
  res.json({ token });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  const isValid = user ? await bcrypt.compare(password, user.password) : false;
  if (!isValid || !user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const token = signToken(user.id);
  res.json({ token });
}