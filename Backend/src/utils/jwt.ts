import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET!;

export function signToken(userId: string) {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET) as { sub: string };
}
