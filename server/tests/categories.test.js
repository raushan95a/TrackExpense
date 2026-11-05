import request from 'supertest';
import app from '../src/app.js';
import { DEFAULT_CATEGORIES } from '../src/constants/category.js';
import { Category } from '../src/models/Category.js';
import { Transaction } from '../src/models/Transaction.js';
import { seedDefaultCategories } from '../src/services/category.service.js';
import { createAuthedUser } from './helpers/auth.js';
import { clearTestDB, startTestDB, stopTestDB } from './helpers/db.js';

const CATEGORIES = '/api/v1/categories';
const custom = { name: 'Gym', type: 'expense', icon: '🏋️', color: '#123abc' };

let alice;
let bob;

beforeAll(startTestDB);
beforeEach(async () => {
  await seedDefaultCategories();
  alice = await createAuthedUser();
  bob = await createAuthedUser();
});
afterEach(clearTestDB);
afterAll(stopTestDB);

const createAs = (actor, body = custom) =>
  request(app).post(CATEGORIES).set(actor.headers).send(body);

describe('seeding', () => {
  it('is idempotent', async () => {
    await seedDefaultCategories();
    expect(await Category.countDocuments({ user: null })).toBe(DEFAULT_CATEGORIES.length);
  });
});

describe('GET /categories', () => {
  it('requires authentication', async () => {
    expect((await request(app).get(CATEGORIES)).status).toBe(401);
  });

  it('returns defaults plus only the user’s own categories', async () => {
    await createAs(alice);
    await createAs(bob, { ...custom, name: 'Bob Only' });

    const res = await request(app).get(CATEGORIES).set(alice.headers);
    const names = res.body.data.categories.map((c) => c.name);

    expect(res.status).toBe(200);
    expect(res.body.data.categories).toHaveLength(DEFAULT_CATEGORIES.length + 1);
    expect(names).toContain('Gym');
    expect(names).not.toContain('Bob Only');
    expect(res.body.data.categories.find((c) => c.name === 'Food').isDefault).toBe(true);
  });

  it('filters by type', async () => {
    const res = await request(app).get(`${CATEGORIES}?type=income`).set(alice.headers);

    expect(res.body.data.categories.every((c) => c.type === 'income')).toBe(true);
  });

  it('rejects an invalid type filter', async () => {
    const res = await request(app).get(`${CATEGORIES}?type=bogus`).set(alice.headers);
    expect(res.status).toBe(400);
  });
});

describe('POST /categories', () => {
  it('creates a custom category', async () => {
    const res = await createAs(alice);

    expect(res.status).toBe(201);
    expect(res.body.data.category).toMatchObject({ ...custom, isDefault: false });
  });

  it.each([
    ['an existing default (case-insensitive)', { name: 'food', type: 'expense' }],
    ['the user’s own category', { name: 'GYM', type: 'expense' }],
  ])('rejects a duplicate of %s', async (_label, body) => {
    await createAs(alice);
    const res = await createAs(alice, body);

    expect(res.status).toBe(409);
  });

  it('allows the same name for a different type or a different user', async () => {
    await createAs(alice);
    expect((await createAs(alice, { ...custom, type: 'income' })).status).toBe(201);
    expect((await createAs(bob)).status).toBe(201);
  });

  it('validates input', async () => {
    const res = await createAs(alice, { name: '', type: 'nope', color: 'red' });

    expect(res.status).toBe(400);
    expect(res.body.errors.map((e) => e.field).sort()).toEqual(['color', 'name', 'type']);
  });
});

describe('PUT /categories/:id', () => {
  it('updates the user’s own category', async () => {
    const { _id } = (await createAs(alice)).body.data.category;
    const res = await request(app)
      .put(`${CATEGORIES}/${_id}`)
      .set(alice.headers)
      .send({ name: 'Fitness' });

    expect(res.status).toBe(200);
    expect(res.body.data.category.name).toBe('Fitness');
  });

  it('forbids editing a default category', async () => {
    const food = await Category.findOne({ user: null, name: 'Food' });
    const res = await request(app)
      .put(`${CATEGORIES}/${food.id}`)
      .set(alice.headers)
      .send({ name: 'Snacks' });

    expect(res.status).toBe(403);
  });

  it('returns 404 for another user’s category', async () => {
    const { _id } = (await createAs(bob)).body.data.category;
    const res = await request(app)
      .put(`${CATEGORIES}/${_id}`)
      .set(alice.headers)
      .send({ name: 'Hacked' });

    expect(res.status).toBe(404);
  });

  it('blocks changing type while the category is in use', async () => {
    const { _id } = (await createAs(alice)).body.data.category;
    await Transaction.create({ user: alice.user._id, type: 'expense', amount: 500, category: _id });

    const res = await request(app)
      .put(`${CATEGORIES}/${_id}`)
      .set(alice.headers)
      .send({ type: 'income' });

    expect(res.status).toBe(409);
  });

  it('rejects an invalid id', async () => {
    const res = await request(app)
      .put(`${CATEGORIES}/not-an-id`)
      .set(alice.headers)
      .send({ name: 'X' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /categories/:id', () => {
  it('deletes an unused category', async () => {
    const { _id } = (await createAs(alice)).body.data.category;
    const res = await request(app).delete(`${CATEGORIES}/${_id}`).set(alice.headers);

    expect(res.status).toBe(200);
    expect(await Category.exists({ _id })).toBeNull();
  });

  it('blocks deletion when transactions use the category', async () => {
    const { _id } = (await createAs(alice)).body.data.category;
    await Transaction.create({ user: alice.user._id, type: 'expense', amount: 500, category: _id });

    const res = await request(app).delete(`${CATEGORIES}/${_id}`).set(alice.headers);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Category is used by existing transactions');
  });

  it('forbids deleting a default category', async () => {
    const food = await Category.findOne({ user: null, name: 'Food' });
    const res = await request(app).delete(`${CATEGORIES}/${food.id}`).set(alice.headers);

    expect(res.status).toBe(403);
  });

  it('does not let another user delete it', async () => {
    const { _id } = (await createAs(alice)).body.data.category;
    const res = await request(app).delete(`${CATEGORIES}/${_id}`).set(bob.headers);

    expect(res.status).toBe(404);
    expect(await Category.exists({ _id })).not.toBeNull();
  });
});
