import { api, unwrap } from './client.js';

const BASE = '/categories';

export const categoriesApi = {
  list: (params) => api.get(BASE, { params }).then(unwrap),
};
