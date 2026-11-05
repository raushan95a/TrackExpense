import request from 'supertest';
import app from '../src/app.js';

const API = '/api/v1';

describe('App bootstrap', () => {
  it('GET /health returns the success envelope', async () => {
    const res = await request(app).get(`${API}/health`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({ status: 'ok', database: expect.any(String) });
  });

  it('unknown routes return 404 in the error envelope', async () => {
    const res = await request(app).get(`${API}/does-not-exist`);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ success: false, errors: [] });
  });

  it('malformed JSON returns 400', async () => {
    const res = await request(app)
      .post(`${API}/health`)
      .set('Content-Type', 'application/json')
      .send('{"bad":');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('blocks origins outside the CORS allow-list', async () => {
    const res = await request(app).get(`${API}/health`).set('Origin', 'http://evil.example');

    expect(res.status).toBe(403);
  });

  it('sets security headers via helmet', async () => {
    const res = await request(app).get(`${API}/health`);

    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});
