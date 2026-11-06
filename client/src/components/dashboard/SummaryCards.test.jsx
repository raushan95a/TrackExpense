import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SummaryCards from './SummaryCards.jsx';

const summaryState = (overrides) => ({
  data: null,
  error: null,
  isLoading: false,
  reload: vi.fn(),
  ...overrides,
});

describe('SummaryCards', () => {
  it('shows formatted income, expense and balance', () => {
    const data = {
      month: '2026-03',
      income: 5000000,
      expense: 1550000,
      balance: 3450000,
      transactionCount: 4,
    };
    render(<SummaryCards state={summaryState({ data })} currency="INR" />);

    expect(screen.getByText('₹50,000.00')).toBeInTheDocument();
    expect(screen.getByText('₹15,500.00')).toBeInTheDocument();
    expect(screen.getByText('₹34,500.00')).toBeInTheDocument();
    expect(screen.getByText('4 transactions')).toBeInTheDocument();
  });

  it('shows a retryable error state', () => {
    const error = { response: { data: { message: 'Server unavailable' } } };
    render(<SummaryCards state={summaryState({ error })} currency="INR" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Server unavailable');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
