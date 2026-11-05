import { api, unwrap } from './client.js';

const BASE = '/transactions';

export const transactionsApi = {
  list: (params) => api.get(BASE, { params }).then(unwrap),
  get: (id) => api.get(`${BASE}/${id}`).then(unwrap),
  create: (payload) => api.post(BASE, payload).then(unwrap),
  update: (id, payload) => api.put(`${BASE}/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`${BASE}/${id}`).then(unwrap),
  /** Returns the CSV file as a Blob. */
  exportCsv: (params) =>
    api.get(`${BASE}/export`, { params, responseType: 'blob' }).then((res) => res.data),
};
