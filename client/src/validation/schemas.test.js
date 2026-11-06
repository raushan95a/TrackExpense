import { describe, expect, it } from 'vitest';
import { changePasswordSchema, registerSchema } from './auth.schemas.js';
import { transactionSchema } from './transaction.schema.js';

const validTransaction = {
  type: 'expense',
  amount: '250.50',
  category: 'abc123',
  date: '2026-03-15',
  note: '',
};

const firstError = (result) => result.error?.issues[0]?.message;

describe('transactionSchema', () => {
  it('accepts a valid transaction', () => {
    expect(transactionSchema.safeParse(validTransaction).success).toBe(true);
  });

  it.each([
    ['', 'Amount is required'],
    ['0', 'Amount must be greater than 0'],
    ['1.234', 'Enter a valid amount (max 2 decimals)'],
    ['-5', 'Enter a valid amount (max 2 decimals)'],
    ['abc', 'Enter a valid amount (max 2 decimals)'],
    ['2000000000', 'Amount is too large'],
  ])('rejects amount %j', (amount, message) => {
    expect(firstError(transactionSchema.safeParse({ ...validTransaction, amount }))).toBe(message);
  });

  it('requires a category', () => {
    const result = transactionSchema.safeParse({ ...validTransaction, category: '' });
    expect(firstError(result)).toBe('Choose a category');
  });
});

describe('registerSchema', () => {
  const valid = {
    name: 'Asha',
    email: 'asha@example.com',
    password: 'secret123',
    confirmPassword: 'secret123',
  };

  it('accepts valid input', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('requires a letter and a number in the password', () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: 'abcdefgh',
      confirmPassword: 'abcdefgh',
    });
    expect(firstError(result)).toBe('Include at least one letter and one number');
  });

  it('requires matching passwords', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'secret124' });
    expect(firstError(result)).toBe('Passwords do not match');
  });
});

describe('changePasswordSchema', () => {
  it('rejects reusing the current password', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'secret123',
      newPassword: 'secret123',
      confirmPassword: 'secret123',
    });
    expect(firstError(result)).toBe('New password must differ from the current one');
  });
});
