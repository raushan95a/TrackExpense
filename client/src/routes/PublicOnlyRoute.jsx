import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader.jsx';
import { ROUTES } from '../constants/routes.js';
import { AUTH_STATUS } from '../context/authReducer.js';
import { useAuth } from '../hooks/useAuth.js';

/** Login/register pages: signed-in users are sent back to where they came from. */
export default function PublicOnlyRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === AUTH_STATUS.LOADING) return <Loader fullScreen />;
  if (status === AUTH_STATUS.AUTHENTICATED) {
    return <Navigate to={location.state?.from?.pathname ?? ROUTES.HOME} replace />;
  }
  return <Outlet />;
}
