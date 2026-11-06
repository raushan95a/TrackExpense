import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AUTH_STATUS } from '../context/authReducer.js';
import { renderWithAuth } from '../test/renderWithAuth.jsx';
import LoginPage from './LoginPage.jsx';

const signedOut = { status: AUTH_STATUS.UNAUTHENTICATED, user: null, token: null };

describe('LoginPage', () => {
  it('shows validation errors and does not call login when fields are empty', async () => {
    const { authValue } = renderWithAuth(<LoginPage />, { auth: signedOut });

    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(authValue.login).not.toHaveBeenCalled();
  });

  it('submits trimmed credentials', async () => {
    const auth = { ...signedOut };
    const { authValue } = renderWithAuth(<LoginPage />, { auth });
    authValue.login.mockResolvedValue({ name: 'Asha' });

    await userEvent.type(screen.getByLabelText('Email'), '  asha@example.com ');
    await userEvent.type(screen.getByLabelText('Password'), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(authValue.login).toHaveBeenCalledWith({
      email: 'asha@example.com',
      password: 'secret123',
    });
  });
});
