import { api, unwrap } from './client.js';

const BASE = '/categories';

export const categoriesApi = {
  list: (params) => api.get(BASE, { params }).then(unwrap),
  create: (payload) => api.post(BASE, payload).then(unwrap),
  update: (id, payload) => api.put(`${BASE}/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`${BASE}/${id}`).then(unwrap),
};
