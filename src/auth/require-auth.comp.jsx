import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function RequireAuth() {
  // get current location (only private route), redirect to login, then get back to current location
  const location = useLocation();

  const { user } = useSelector(state => state.auth);

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

// auth.role?.find(r => allowedRoles.includes(r))
//  ? <Outlet />
//  : auth?.user
//    ? <Navigate to="/unauthorized" state={{ from: location }} replace />
//    : <Navigate to="/login" state={{ from: location }} replace />
