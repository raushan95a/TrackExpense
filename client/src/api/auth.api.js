import { api, unwrap } from './client.js';

const PUBLIC = { skipAuthRedirect: true };

export const authApi = {
  register: (payload) => api.post('/auth/register', payload, PUBLIC).then(unwrap),
  login: (credentials) => api.post('/auth/login', credentials, PUBLIC).then(unwrap),
  me: () => api.get('/auth/me').then(unwrap),
  updateProfile: (payload) => api.put('/auth/profile', payload).then(unwrap),
  /** Returns a fresh token; older tokens stop working. */
  changePassword: (payload) => api.put('/auth/password', payload).then(unwrap),
};
