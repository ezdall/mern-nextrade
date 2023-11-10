import { useLocation, Navigate, Outlet } from 'react-router-dom';

import auth from './auth-helper';

export default function RequireAuth() {
  const location = useLocation();
  const authUser = auth.isAuthenticated().user;

  // console.log('auth:',auth)
  console.log('loc:', location);

  return authUser ? (
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
