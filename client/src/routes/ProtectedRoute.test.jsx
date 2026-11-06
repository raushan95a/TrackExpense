import { screen } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AUTH_STATUS } from '../context/authReducer.js';
import { renderRoutes } from '../test/renderWithAuth.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

const renderPrivatePage = (status) =>
  renderRoutes(
    <>
      <Route element={<ProtectedRoute />}>
        <Route path="/budgets" element={<p>Private budgets page</p>} />
      </Route>
      <Route path="/login" element={<p>Login page</p>} />
    </>,
    { auth: { status }, initialPath: '/budgets' },
  );

describe('ProtectedRoute', () => {
  it('redirects signed-out users to /login', () => {
    renderPrivatePage(AUTH_STATUS.UNAUTHENTICATED);
    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Private budgets page')).not.toBeInTheDocument();
  });

  it('shows a loader while the session is being restored', () => {
    renderPrivatePage(AUTH_STATUS.LOADING);
    expect(screen.getByRole('status')).toHaveTextContent('Restoring session');
  });

  it('renders the private page for signed-in users', () => {
    renderPrivatePage(AUTH_STATUS.AUTHENTICATED);
    expect(screen.getByText('Private budgets page')).toBeInTheDocument();
  });
});
