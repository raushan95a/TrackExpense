export const AUTH_STATUS = Object.freeze({
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
});

export const AUTH_ACTIONS = Object.freeze({
  SESSION_RESTORED: 'SESSION_RESTORED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  USER_UPDATED: 'USER_UPDATED',
  TOKEN_REPLACED: 'TOKEN_REPLACED',
  LOGOUT: 'LOGOUT',
});

/** A stored token means we must verify it (loading) before rendering private pages. */
export const createInitialAuthState = (token) => ({
  user: null,
  token,
  status: token ? AUTH_STATUS.LOADING : AUTH_STATUS.UNAUTHENTICATED,
});

export const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SESSION_RESTORED:
      return { ...state, user: action.user, status: AUTH_STATUS.AUTHENTICATED };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return { user: action.user, token: action.token, status: AUTH_STATUS.AUTHENTICATED };
    case AUTH_ACTIONS.USER_UPDATED:
      return { ...state, user: action.user };
    case AUTH_ACTIONS.TOKEN_REPLACED:
      return { ...state, token: action.token };
    case AUTH_ACTIONS.LOGOUT:
      return createInitialAuthState(null);
    default:
      return state;
  }
};
