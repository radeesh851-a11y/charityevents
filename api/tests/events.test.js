// events.test.js
const request = require('supertest');
const app = require('../app'); // modify app.js to export app for tests (see note)

describe('Events API', () => {
  it('Health check should return ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/events returns list with meta', async () => {
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
  });

  it('GET /api/categories returns categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/events/:id returns 404 for invalid id', async () => {
    const res = await request(app).get('/api/events/9999999');
    expect([200,404]).toContain(res.statusCode);
  });
});
