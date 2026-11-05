import { ROUTES } from './routes.js';

/** Sidebar links; `icon` is a key of the Icon component. */
export const NAV_ITEMS = Object.freeze([
  { label: 'Dashboard', to: ROUTES.HOME, icon: 'home' },
  { label: 'Transactions', to: ROUTES.TRANSACTIONS, icon: 'list' },
  { label: 'Budgets', to: ROUTES.BUDGETS, icon: 'target' },
  { label: 'Categories', to: ROUTES.CATEGORIES, icon: 'tag' },
  { label: 'Profile', to: ROUTES.PROFILE, icon: 'user' },
]);
