import { api, unwrap } from './client.js';

const BASE = '/budgets';

export const budgetsApi = {
  list: (month) => api.get(BASE, { params: { month } }).then(unwrap),
  /** Creates or updates the budget for (category, month). */
  upsert: (payload) => api.post(BASE, payload).then(unwrap),
  remove: (id) => api.delete(`${BASE}/${id}`).then(unwrap),
};
