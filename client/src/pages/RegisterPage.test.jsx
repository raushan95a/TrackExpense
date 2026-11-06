import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AUTH_STATUS } from '../context/authReducer.js';
import { renderWithAuth } from '../test/renderWithAuth.jsx';
import RegisterPage from './RegisterPage.jsx';

const signedOut = { status: AUTH_STATUS.UNAUTHENTICATED, user: null, token: null };

const fillForm = async () => {
  await userEvent.type(screen.getByLabelText('Name'), 'Asha Rao');
  await userEvent.type(screen.getByLabelText('Email'), 'asha@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'secret123');
  await userEvent.type(screen.getByLabelText('Confirm password'), 'secret123');
  await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
};

describe('RegisterPage', () => {
  it('shows an inline error and a login link when the email is already registered', async () => {
    const { authValue } = renderWithAuth(<RegisterPage />, { auth: signedOut });
    authValue.register.mockRejectedValue({
      response: { status: 409, data: { success: false, message: 'Email is already registered' } },
    });

    await fillForm();

    expect(await screen.findByText('This email is already registered.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log in instead' })).toHaveAttribute('href', '/login');
  });

  it('submits the form without the confirm field', async () => {
    const { authValue } = renderWithAuth(<RegisterPage />, { auth: signedOut });
    authValue.register.mockResolvedValue({ name: 'Asha Rao' });

    await fillForm();

    expect(authValue.register).toHaveBeenCalledWith({
      name: 'Asha Rao',
      email: 'asha@example.com',
      password: 'secret123',
    });
  });
});
