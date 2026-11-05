import axios from 'axios';
import { API_TIMEOUT_MS, API_URL } from '../constants/config.js';
import { tokenStorage } from '../utils/tokenStorage.js';

const HTTP_UNAUTHORIZED = 401;

let unauthorizedHandler = null;

/** Registers the callback run when the API rejects the session (set by AuthProvider). */
export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

export const api = axios.create({ baseURL: API_URL, timeout: API_TIMEOUT_MS });

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Login/register 401s mean bad credentials, not an expired session.
    if (error.response?.status === HTTP_UNAUTHORIZED && !error.config?.skipAuthRedirect) {
      tokenStorage.clear();
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

/** Returns the `data` field of the standard { success, data, message } envelope. */
export const unwrap = (response) => response.data.data;
