import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { authApi } from '../api/auth.api.js';
import { setUnauthorizedHandler } from '../api/client.js';
import { tokenStorage } from '../utils/tokenStorage.js';
import { AuthContext } from './authContext.js';
import { AUTH_ACTIONS, authReducer, createInitialAuthState } from './authReducer.js';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, tokenStorage.get(), createInitialAuthState);

  const logout = useCallback(() => {
    tokenStorage.clear();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  const authenticate = useCallback(({ user, token }) => {
    tokenStorage.set(token);
    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, user, token });
    return user;
  }, []);

  const login = useCallback(
    async (credentials) => authenticate(await authApi.login(credentials)),
    [authenticate],
  );

  const register = useCallback(
    async (payload) => authenticate(await authApi.register(payload)),
    [authenticate],
  );

  /** Updates the cached user after a profile change. */
  const updateUser = useCallback((user) => dispatch({ type: AUTH_ACTIONS.USER_UPDATED, user }), []);

  /** Stores the new token issued after a password change. */
  const replaceToken = useCallback((token) => {
    tokenStorage.set(token);
    dispatch({ type: AUTH_ACTIONS.TOKEN_REPLACED, token });
  }, []);

  // Any 401 from the API ends the session; ProtectedRoute then redirects to login.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  // Restore the session from a stored token on first load.
  useEffect(() => {
    if (!state.token || state.user) return undefined;
    let cancelled = false;

    authApi
      .me()
      .then(({ user }) => !cancelled && dispatch({ type: AUTH_ACTIONS.SESSION_RESTORED, user }))
      .catch(() => !cancelled && logout());

    return () => {
      cancelled = true;
    };
  }, [state.token, state.user, logout]);

  const value = useMemo(
    () => ({ ...state, login, register, logout, updateUser, replaceToken }),
    [state, login, register, logout, updateUser, replaceToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
