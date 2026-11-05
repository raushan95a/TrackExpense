import request from 'supertest';
import app from '../src/app.js';
import { Category } from '../src/models/Category.js';
import { Transaction } from '../src/models/Transaction.js';
import { seedDefaultCategories } from '../src/services/category.service.js';
import { createAuthedUser } from './helpers/auth.js';
import { clearTestDB, startTestDB, stopTestDB } from './helpers/db.js';

const TX = '/api/v1/transactions';

let alice;
let bob;
let food;
let salary;

beforeAll(startTestDB);
beforeEach(async () => {
  await seedDefaultCategories();
  [alice, bob] = await Promise.all([createAuthedUser(), createAuthedUser()]);
  [food, salary] = await Promise.all([
    Category.findOne({ user: null, name: 'Food' }),
    Category.findOne({ user: null, name: 'Salary' }),
  ]);
});
afterEach(clearTestDB);
afterAll(stopTestDB);

const expenseBody = (overrides = {}) => ({
  type: 'expense',
  amount: 25050,
  category: food.id,
  date: '2026-03-15',
  note: 'Lunch with team',
  ...overrides,
});

const createAs = (actor, body = expenseBody()) =>
  request(app).post(TX).set(actor.headers).send(body);

/** Inserts transactions for a user directly (faster than the API). */
const seedTransactions = (actor, items) =>
  Transaction.insertMany(
    items.map((item) => ({
      user: actor.user._id,
      type: 'expense',
      amount: 1000,
      category: food._id,
      date: new Date('2026-03-01'),
      ...item,
    })),
  );

describe('POST /transactions', () => {
  it('creates a transaction with a populated category', async () => {
    const res = await createAs(alice);

    expect(res.status).toBe(201);
    expect(res.body.data.transaction).toMatchObject({
      type: 'expense',
      amount: 25050,
      note: 'Lunch with team',
      category: { name: 'Food', type: 'expense' },
    });
  });

  it('defaults date to now', async () => {
    const { date, ...body } = expenseBody();
    const res = await createAs(alice, body);

    expect(date).toBeDefined();
    expect(Date.now() - new Date(res.body.data.transaction.date).getTime()).toBeLessThan(5000);
  });

  it.each([
    ['zero amount', { amount: 0 }],
    ['negative amount', { amount: -5 }],
    ['fractional amount', { amount: 10.5 }],
    ['invalid type', { type: 'gift' }],
    ['invalid category id', { category: 'abc' }],
    ['note too long', { note: 'x'.repeat(201) }],
    ['invalid date', { date: 'yesterday' }],
  ])('rejects %s', async (_label, overrides) => {
    const res = await createAs(alice, expenseBody(overrides));

    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('rejects a category whose type does not match', async () => {
    const res = await createAs(alice, expenseBody({ category: salary.id }));

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('category');
  });

  it('rejects another user’s custom category', async () => {
    const bobsCategory = await Category.create({
      user: bob.user._id,
      name: 'Bob',
      type: 'expense',
    });
    const res = await createAs(alice, expenseBody({ category: bobsCategory.id }));

    expect(res.status).toBe(400);
  });
});

describe('GET /transactions', () => {
  it('paginates newest first and reports totals', async () => {
    await seedTransactions(
      alice,
      Array.from({ length: 12 }, (_, i) => ({ date: new Date(2026, 0, i + 1), amount: i + 1 })),
    );

    const res = await request(app).get(`${TX}?page=2&limit=5`).set(alice.headers);

    expect(res.status).toBe(200);
    expect(res.body.data.pagination).toEqual({ page: 2, limit: 5, total: 12, totalPages: 3 });
    expect(res.body.data.transactions.map((t) => t.amount)).toEqual([7, 6, 5, 4, 3]);
  });

  it('never returns another user’s transactions', async () => {
    await seedTransactions(bob, [{}, {}]);
    const res = await request(app).get(TX).set(alice.headers);

    expect(res.body.data.pagination.total).toBe(0);
    expect(res.body.data.transactions).toEqual([]);
  });

  describe('filters', () => {
    beforeEach(() =>
      seedTransactions(alice, [
        { date: new Date('2026-02-28T10:00:00Z'), note: 'Groceries' },
        { date: new Date('2026-03-31T23:30:00Z'), note: 'Pizza (large)' },
        { date: new Date('2026-04-01T00:00:00Z'), note: 'Taxi' },
        { type: 'income', category: salary._id, date: new Date('2026-03-10'), note: 'March pay' },
      ]),
    );

    const list = (qs) => request(app).get(`${TX}?${qs}`).set(alice.headers);
    const notes = (res) => res.body.data.transactions.map((t) => t.note).sort();

    it('by inclusive date range', async () => {
      expect(notes(await list('from=2026-03-01&to=2026-03-31'))).toEqual([
        'March pay',
        'Pizza (large)',
      ]);
    });

    it('by type', async () => {
      expect(notes(await list('type=income'))).toEqual(['March pay']);
    });

    it('by category', async () => {
      expect(notes(await list(`category=${salary.id}`))).toEqual(['March pay']);
    });

    it('by case-insensitive note search with regex characters escaped', async () => {
      expect(notes(await list('q=pizza (LARGE'))).toEqual(['Pizza (large)']);
      expect(notes(await list('q=.*'))).toEqual([]);
    });

    it('rejects to before from', async () => {
      expect((await list('from=2026-03-10&to=2026-03-01')).status).toBe(400);
    });

    it('rejects limit above the max', async () => {
      expect((await list('limit=1000')).status).toBe(400);
    });
  });
});

describe('GET/PUT/DELETE /transactions/:id', () => {
  let txId;
  beforeEach(async () => {
    txId = (await createAs(alice)).body.data.transaction._id;
  });

  it('gets the user’s own transaction', async () => {
    const res = await request(app).get(`${TX}/${txId}`).set(alice.headers);

    expect(res.status).toBe(200);
    expect(res.body.data.transaction._id).toBe(txId);
  });

  it.each(['get', 'put', 'delete'])('%s returns 404 for another user', async (method) => {
    const res = await request(app)[method](`${TX}/${txId}`).set(bob.headers).send({ amount: 1 });

    expect(res.status).toBe(404);
  });

  it('updates fields', async () => {
    const res = await request(app)
      .put(`${TX}/${txId}`)
      .set(alice.headers)
      .send({ amount: 99900, note: 'Dinner' });

    expect(res.status).toBe(200);
    expect(res.body.data.transaction).toMatchObject({ amount: 99900, note: 'Dinner' });
  });

  it('rejects changing type without a matching category', async () => {
    const res = await request(app).put(`${TX}/${txId}`).set(alice.headers).send({ type: 'income' });

    expect(res.status).toBe(400);
  });

  it('allows changing type together with a matching category', async () => {
    const res = await request(app)
      .put(`${TX}/${txId}`)
      .set(alice.headers)
      .send({ type: 'income', category: salary.id });

    expect(res.status).toBe(200);
    expect(res.body.data.transaction.category.name).toBe('Salary');
  });

  it('deletes', async () => {
    const res = await request(app).delete(`${TX}/${txId}`).set(alice.headers);

    expect(res.status).toBe(200);
    expect(await Transaction.exists({ _id: txId })).toBeNull();
  });
});

describe('GET /transactions/export', () => {
  it('downloads the user’s filtered transactions as CSV', async () => {
    await seedTransactions(alice, [
      { amount: 12345, note: 'Coffee, "large"', date: new Date('2026-03-05') },
      { amount: 500, note: '=HYPERLINK("x")', date: new Date('2026-03-04') },
      { amount: 700, note: 'Old', date: new Date('2025-01-01') },
    ]);
    await seedTransactions(bob, [{ note: 'Bob secret' }]);

    const res = await request(app).get(`${TX}/export?from=2026-01-01`).set(alice.headers);
    const lines = res.text.split('\r\n');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/csv/);
    expect(res.headers['content-disposition']).toMatch(/attachment; filename="transactions-/);
    expect(lines).toEqual([
      'Date,Type,Category,Amount,Note',
      '2026-03-05,expense,Food,123.45,"Coffee, ""large"""',
      `2026-03-04,expense,Food,5.00,"'=HYPERLINK(""x"")"`,
    ]);
  });

  it('requires authentication', async () => {
    expect((await request(app).get(`${TX}/export`)).status).toBe(401);
  });
});
