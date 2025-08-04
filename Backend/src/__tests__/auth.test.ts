import request from 'supertest';

jest.mock('@prisma/client', () => {
  const mPrismaClient = jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
  }));
  return { PrismaClient: mPrismaClient };
});

const { app } = require('../app');

describe('Auth validation', () => {
  it('rejects invalid email on login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'not-an-email', password: 'secret' });
    expect(res.status).toBe(400);
  });
});
