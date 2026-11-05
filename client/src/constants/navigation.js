import { ROUTES } from './routes.js';

/** Sidebar links; `icon` is a key of the Icon component. */
export const NAV_ITEMS = Object.freeze([
  { label: 'Dashboard', to: ROUTES.HOME, icon: 'home' },
  { label: 'Transactions', to: ROUTES.TRANSACTIONS, icon: 'list' },
]);
