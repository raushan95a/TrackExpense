import request from 'supertest';
import app from '../src/app.js';
import { clearTestDB, startTestDB, stopTestDB } from './helpers/db.js';

const AUTH = '/api/v1/auth';
const validUser = { name: 'Asha', email: 'Asha@Example.com', password: 'secret123' };

const registerUser = (overrides = {}) =>
  request(app)
    .post(`${AUTH}/register`)
    .send({ ...validUser, ...overrides });

const bearer = (token) => ({ Authorization: `Bearer ${token}` });

beforeAll(startTestDB);
afterEach(clearTestDB);
afterAll(stopTestDB);

describe('POST /auth/register', () => {
  it('creates a user, lowercases email and never returns the password', async () => {
    const res = await registerUser();

    expect(res.status).toBe(201);
    expect(res.body.data.token).toEqual(expect.any(String));
    expect(res.body.data.user).toMatchObject({ email: 'asha@example.com', currency: 'INR' });
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('rejects a duplicate email with 409', async () => {
    await registerUser();
    const res = await registerUser({ email: 'asha@example.com' });

    expect(res.status).toBe(409);
    expect(res.body.errors[0].field).toBe('email');
  });

  it('returns field errors for invalid input', async () => {
    const res = await registerUser({ name: '', email: 'nope', password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body.errors.map((e) => e.field).sort()).toEqual(['email', 'name', 'password']);
  });

  it('ignores fields outside the allow-list', async () => {
    const res = await registerUser({ currency: 'USD', isAdmin: true });

    expect(res.body.data.user.currency).toBe('INR');
    expect(res.body.data.user.isAdmin).toBeUndefined();
  });
});

describe('POST /auth/login', () => {
  beforeEach(() => registerUser());

  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post(`${AUTH}/login`)
      .send({ email: 'asha@example.com', password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toEqual(expect.any(String));
  });

  it.each([
    ['wrong password', { email: 'asha@example.com', password: 'wrongpass1' }],
    ['unknown email', { email: 'ghost@example.com', password: 'secret123' }],
  ])('rejects %s with a generic 401', async (_label, body) => {
    const res = await request(app).post(`${AUTH}/login`).send(body);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('blocks NoSQL operator injection', async () => {
    const res = await request(app)
      .post(`${AUTH}/login`)
      .send({ email: { $gt: '' }, password: { $gt: '' } });

    expect(res.status).toBe(400);
  });
});

describe('Protected routes', () => {
  let token;
  beforeEach(async () => {
    token = (await registerUser()).body.data.token;
  });

  it('GET /me returns the current user', async () => {
    const res = await request(app).get(`${AUTH}/me`).set(bearer(token));

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('asha@example.com');
  });

  it.each([
    ['no token', {}],
    ['malformed token', bearer('not.a.jwt')],
  ])('GET /me rejects %s with 401', async (_label, headers) => {
    const res = await request(app).get(`${AUTH}/me`).set(headers);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('PUT /profile updates name and currency', async () => {
    const res = await request(app)
      .put(`${AUTH}/profile`)
      .set(bearer(token))
      .send({ name: 'Asha K', currency: 'usd' });

    expect(res.status).toBe(200);
    expect(res.body.data.user).toMatchObject({ name: 'Asha K', currency: 'USD' });
  });

  it('PUT /profile rejects an unsupported currency', async () => {
    const res = await request(app)
      .put(`${AUTH}/profile`)
      .set(bearer(token))
      .send({ currency: 'XYZ' });

    expect(res.status).toBe(400);
  });

  it('PUT /password changes the password and revokes old tokens', async () => {
    // JWT iat has 1s precision; make sure the change happens in a later second.
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const res = await request(app)
      .put(`${AUTH}/password`)
      .set(bearer(token))
      .send({ currentPassword: validUser.password, newPassword: 'newsecret456' });

    expect(res.status).toBe(200);
    const newToken = res.body.data.token;

    expect((await request(app).get(`${AUTH}/me`).set(bearer(token))).status).toBe(401);
    expect((await request(app).get(`${AUTH}/me`).set(bearer(newToken))).status).toBe(200);

    const login = await request(app)
      .post(`${AUTH}/login`)
      .send({ email: 'asha@example.com', password: 'newsecret456' });
    expect(login.status).toBe(200);
  });

  it('PUT /password rejects a wrong current password', async () => {
    const res = await request(app)
      .put(`${AUTH}/password`)
      .set(bearer(token))
      .send({ currentPassword: 'wrongpass1', newPassword: 'newsecret456' });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('currentPassword');
  });
});
