import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from './components/common/Loader.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import { ROUTES } from './constants/routes.js';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import PublicOnlyRoute from './routes/PublicOnlyRoute.jsx';

// Route-level code splitting keeps the initial bundle small.
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage.jsx'));
const TransactionFormPage = lazy(() => import('./pages/TransactionFormPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

export default function App() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.HOME} element={<DashboardPage />} />
            <Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
            <Route path={ROUTES.NEW_TRANSACTION} element={<TransactionFormPage />} />
            <Route path={ROUTES.EDIT_TRANSACTION} element={<TransactionFormPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
