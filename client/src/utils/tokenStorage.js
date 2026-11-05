import { TOKEN_STORAGE_KEY } from '../constants/config.js';

/** localStorage wrapper that never throws (private mode, blocked storage). */
export const tokenStorage = {
  get() {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
      // Storage unavailable: the session lasts until the tab is closed.
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Nothing to clear.
    }
  },
};
