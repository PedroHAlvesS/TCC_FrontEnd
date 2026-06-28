import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

export default function RequireAuth({ redirectTo = '/' }) {
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
