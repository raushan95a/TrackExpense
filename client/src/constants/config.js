import { normalizeApiUrl } from '../utils/apiUrl.js';

const DEFAULT_API_URL = 'http://localhost:5000/api/v1';

export const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL, DEFAULT_API_URL);

export const API_TIMEOUT_MS = 15000;

export const TOKEN_STORAGE_KEY = 'expense-tracker.token';

export const APP_NAME = 'Expense Tracker';
