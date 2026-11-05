import request from 'supertest';
import app from '../src/app.js';
import { Category } from '../src/models/Category.js';
import { Transaction } from '../src/models/Transaction.js';
import { seedDefaultCategories } from '../src/services/category.service.js';
import { createAuthedUser } from './helpers/auth.js';
import { clearTestDB, startTestDB, stopTestDB } from './helpers/db.js';

const ANALYTICS = '/api/v1/analytics';

let alice;
let bob;
let cats;

beforeAll(startTestDB);
beforeEach(async () => {
  await seedDefaultCategories();
  [alice, bob] = await Promise.all([createAuthedUser(), createAuthedUser()]);
  const all = await Category.find({ user: null });
  cats = Object.fromEntries(all.map((c) => [`${c.name}:${c.type}`, c]));

  const tx = (actor, type, name, amount, date) => ({
    user: actor.user._id,
    type,
    category: cats[`${name}:${type}`]._id,
    amount,
    date: new Date(date),
  });

  await Transaction.insertMany([
    tx(alice, 'income', 'Salary', 5000000, '2026-03-01T00:00:00Z'),
    tx(alice, 'expense', 'Food', 30000, '2026-03-05'),
    tx(alice, 'expense', 'Food', 20000, '2026-03-20'),
    tx(alice, 'expense', 'Rent', 1500000, '2026-03-31T23:59:59Z'),
    tx(alice, 'expense', 'Rent', 1500000, '2026-04-01T00:00:00Z'), // next month boundary
    tx(alice, 'expense', 'Transport', 10000, '2026-01-15'),
    tx(alice, 'expense', 'Food', 99999, '2025-12-31T23:59:59Z'), // previous year
    tx(bob, 'expense', 'Food', 777777, '2026-03-10'), // other user
  ]);
});
afterEach(clearTestDB);
afterAll(stopTestDB);

const get = (path) => request(app).get(`${ANALYTICS}${path}`).set(alice.headers);

describe('GET /analytics/summary', () => {
  it('totals one month for the current user only (UTC month boundaries)', async () => {
    const res = await get('/summary?month=2026-03');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      month: '2026-03',
      income: 5000000,
      expense: 1550000,
      balance: 3450000,
      transactionCount: 4,
    });
  });

  it('returns zeros for an empty month', async () => {
    const res = await get('/summary?month=2020-01');
    expect(res.body.data).toMatchObject({ income: 0, expense: 0, balance: 0, transactionCount: 0 });
  });

  it('rejects an invalid month', async () => {
    expect((await get('/summary?month=2026-13')).status).toBe(400);
  });

  it('requires authentication', async () => {
    expect((await request(app).get(`${ANALYTICS}/summary`)).status).toBe(401);
  });
});

describe('GET /analytics/by-category', () => {
  it('groups expenses by category, largest first, with percentages', async () => {
    const res = await get('/by-category?month=2026-03');
    const { total, categories } = res.body.data;

    expect(res.status).toBe(200);
    expect(total).toBe(1550000);
    expect(categories.map((c) => [c.name, c.total, c.count, c.percentage])).toEqual([
      ['Rent', 1500000, 1, 96.8],
      ['Food', 50000, 2, 3.2],
    ]);
    expect(categories[0]).toMatchObject({ icon: expect.any(String), color: expect.any(String) });
  });

  it('supports type=income', async () => {
    const res = await get('/by-category?month=2026-03&type=income');
    expect(res.body.data.categories.map((c) => c.name)).toEqual(['Salary']);
  });
});

describe('GET /analytics/monthly', () => {
  it('returns 12 zero-filled months for the year', async () => {
    const res = await get('/monthly?year=2026');
    const { months, totals } = res.body.data;

    expect(res.status).toBe(200);
    expect(months).toHaveLength(12);
    expect(months[0]).toEqual({ month: '2026-01', income: 0, expense: 10000, balance: -10000 });
    expect(months[1]).toEqual({ month: '2026-02', income: 0, expense: 0, balance: 0 });
    expect(months[2]).toMatchObject({ income: 5000000, expense: 1550000 });
    expect(months[3]).toMatchObject({ expense: 1500000 });
    expect(totals).toEqual({ income: 5000000, expense: 3060000, balance: 1940000 });
  });

  it('rejects an out-of-range year', async () => {
    expect((await get('/monthly?year=1800')).status).toBe(400);
  });
});
