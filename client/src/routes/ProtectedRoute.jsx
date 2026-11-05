import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader.jsx';
import { ROUTES } from '../constants/routes.js';
import { AUTH_STATUS } from '../context/authReducer.js';
import { useAuth } from '../hooks/useAuth.js';

/** Renders child routes only for signed-in users; remembers where they were headed. */
export default function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === AUTH_STATUS.LOADING) return <Loader fullScreen label="Restoring session" />;
  if (status !== AUTH_STATUS.AUTHENTICATED) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }
  return <Outlet />;
}
