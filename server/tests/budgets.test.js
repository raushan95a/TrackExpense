import request from 'supertest';
import app from '../src/app.js';
import { Budget } from '../src/models/Budget.js';
import { Category } from '../src/models/Category.js';
import { Transaction } from '../src/models/Transaction.js';
import { seedDefaultCategories } from '../src/services/category.service.js';
import { createAuthedUser } from './helpers/auth.js';
import { clearTestDB, startTestDB, stopTestDB } from './helpers/db.js';

const BUDGETS = '/api/v1/budgets';
const MONTH = '2026-03';

let alice;
let bob;
let food;
let rent;
let salary;

beforeAll(startTestDB);
beforeEach(async () => {
  await seedDefaultCategories();
  [alice, bob] = await Promise.all([createAuthedUser(), createAuthedUser()]);
  [food, rent, salary] = await Promise.all(
    ['Food', 'Rent', 'Salary'].map((name) => Category.findOne({ user: null, name })),
  );
});
afterEach(clearTestDB);
afterAll(stopTestDB);

const upsert = (actor, body) => request(app).post(BUDGETS).set(actor.headers).send(body);

const spend = (actor, category, amount, date = '2026-03-10') =>
  Transaction.create({ user: actor.user._id, type: 'expense', category, amount, date });

describe('POST /budgets (upsert)', () => {
  it('creates then updates the same budget', async () => {
    const created = await upsert(alice, { category: food.id, month: MONTH, limit: 500000 });
    expect(created.status).toBe(201);
    expect(created.body.data.budget).toMatchObject({
      limit: 500000,
      spent: 0,
      isExceeded: false,
      category: { name: 'Food' },
    });

    const updated = await upsert(alice, { category: food.id, month: MONTH, limit: 800000 });
    expect(updated.status).toBe(200);
    expect(updated.body.data.budget.limit).toBe(800000);
    expect(await Budget.countDocuments()).toBe(1);
  });

  it('rejects income categories', async () => {
    const res = await upsert(alice, { category: salary.id, month: MONTH, limit: 1000 });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('category');
  });

  it('rejects another user’s category', async () => {
    const bobs = await Category.create({ user: bob.user._id, name: 'Bob', type: 'expense' });
    const res = await upsert(alice, { category: bobs.id, month: MONTH, limit: 1000 });

    expect(res.status).toBe(400);
  });

  it('validates input', async () => {
    const res = await upsert(alice, { category: 'x', month: '2026-3', limit: 0 });

    expect(res.status).toBe(400);
    expect(res.body.errors.map((e) => e.field).sort()).toEqual(['category', 'limit', 'month']);
  });
});

describe('GET /budgets', () => {
  it('includes spent amounts for that month only and flags overspending', async () => {
    await upsert(alice, { category: food.id, month: MONTH, limit: 100000 });
    await upsert(alice, { category: rent.id, month: MONTH, limit: 2000000 });
    await spend(alice, food._id, 70000);
    await spend(alice, food._id, 50000);
    await spend(alice, food._id, 99999, '2026-04-01'); // other month
    await spend(alice, rent._id, 1500000);
    await spend(bob, food._id, 999999); // other user

    const res = await request(app).get(`${BUDGETS}?month=${MONTH}`).set(alice.headers);
    const [foodBudget, rentBudget] = res.body.data.budgets;

    expect(res.status).toBe(200);
    expect(foodBudget).toMatchObject({
      category: { name: 'Food' },
      limit: 100000,
      spent: 120000,
      remaining: -20000,
      percentUsed: 120,
      isExceeded: true,
    });
    expect(rentBudget).toMatchObject({ spent: 1500000, percentUsed: 75, isExceeded: false });
    expect(res.body.data.totals).toEqual({ limit: 2100000, spent: 1620000, remaining: 480000 });
  });

  it('returns an empty list for another user', async () => {
    await upsert(alice, { category: food.id, month: MONTH, limit: 100000 });
    const res = await request(app).get(`${BUDGETS}?month=${MONTH}`).set(bob.headers);

    expect(res.body.data.budgets).toEqual([]);
  });
});

describe('DELETE /budgets/:id', () => {
  it('deletes own budget and 404s for others', async () => {
    const { _id } = (await upsert(alice, { category: food.id, month: MONTH, limit: 1000 })).body
      .data.budget;

    expect((await request(app).delete(`${BUDGETS}/${_id}`).set(bob.headers)).status).toBe(404);
    expect((await request(app).delete(`${BUDGETS}/${_id}`).set(alice.headers)).status).toBe(200);
    expect(await Budget.exists({ _id })).toBeNull();
  });
});

describe('category interactions', () => {
  it('deleting a category removes its budgets', async () => {
    const custom = await Category.create({ user: alice.user._id, name: 'Gym', type: 'expense' });
    await upsert(alice, { category: custom.id, month: MONTH, limit: 1000 });

    const res = await request(app).delete(`/api/v1/categories/${custom.id}`).set(alice.headers);

    expect(res.status).toBe(200);
    expect(await Budget.countDocuments()).toBe(0);
  });

  it('blocks changing a category type while it has budgets', async () => {
    const custom = await Category.create({ user: alice.user._id, name: 'Gym', type: 'expense' });
    await upsert(alice, { category: custom.id, month: MONTH, limit: 1000 });

    const res = await request(app)
      .put(`/api/v1/categories/${custom.id}`)
      .set(alice.headers)
      .send({ type: 'income' });

    expect(res.status).toBe(409);
  });
});
