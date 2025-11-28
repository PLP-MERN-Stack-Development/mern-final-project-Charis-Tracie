const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../server');
const User = require('../models/User');

// Test database connection
beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow-test');
  }
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe('Auth Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('email', testUser.email);
      expect(res.body).toHaveProperty('token');
    });

    it('should not register user with existing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should not register user with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'invalid-email',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should not register user with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test',
          email: 'test2@example.com',
          password: '123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      token = res.body.token;
    });

    it('should get current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('email', testUser.email);
    });

    it('should not get user without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should not get user with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});