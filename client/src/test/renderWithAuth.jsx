import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthContext } from '../context/authContext.js';
import { AUTH_STATUS } from '../context/authReducer.js';

export const testUser = { _id: 'u1', name: 'Asha Rao', email: 'asha@example.com', currency: 'INR' };

/** Auth context value with spies for every action; override any field. */
export const createAuthValue = (overrides = {}) => ({
  user: testUser,
  token: 'test-token',
  status: AUTH_STATUS.AUTHENTICATED,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  updateUser: vi.fn(),
  replaceToken: vi.fn(),
  ...overrides,
});

/** Renders <Route> elements inside a MemoryRouter and a mocked auth context. */
export function renderRoutes(routes, { auth = {}, initialPath = '/' } = {}) {
  const authValue = createAuthValue(auth);
  const result = render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>{routes}</Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
  return { ...result, authValue };
}

/** Renders a single page/component at "/" with mocked auth. */
export const renderWithAuth = (ui, options) =>
  renderRoutes(<Route path="/" element={ui} />, options);
