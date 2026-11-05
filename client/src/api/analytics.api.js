import { api, unwrap } from './client.js';

const BASE = '/analytics';

export const analyticsApi = {
  summary: (month) => api.get(`${BASE}/summary`, { params: { month } }).then(unwrap),
  byCategory: (month, type) =>
    api.get(`${BASE}/by-category`, { params: { month, type } }).then(unwrap),
  monthly: (year) => api.get(`${BASE}/monthly`, { params: { year } }).then(unwrap),
};
