const request = require('supertest');
const app = require('../app'); 
const prisma = require('../config/db');

describe('Auth API', () => {
  const testEmail = 'testuser@example.com';

 
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });
  });

  it('should register a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: testEmail,
      password: '12345678',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('email', testEmail);
  });

  it('should login the user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: '12345678',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('email', testEmail);
  });
});
