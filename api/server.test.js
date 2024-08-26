// Write your tests here
const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

describe('auth endpoints', () => {
  describe('[POST] /api/auth/register', () => {
    it('registers a new user', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('username', 'testuser');
      expect(res.body).toHaveProperty('password');
    });

    it('fails to register with missing fields', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'testuser' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('username and password required');
    });
  });
  describe('[POST] /api/auth/login', () => {
    it('logs in a user', async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'testuser2', password: 'password' });
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'testuser2', password: 'password' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'welcome, testuser2');
      expect(res.body).toHaveProperty('token');
    });

    it('fails to login with incorrect credentials', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'nonexistentuser', password: 'password' });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('invalid credentials');
    });
  });
});